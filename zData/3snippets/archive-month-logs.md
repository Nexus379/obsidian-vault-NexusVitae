<%-*
const currentFile = tp.file.find_tfile(tp.file.path);
let dateMatch = currentFile.basename.match(/(\d{4}-\d{2})/);
let year = "";
let month = "";

if (dateMatch) {
    [year, month] = dateMatch[1].split("-");
} else if (tp.frontmatter && tp.frontmatter.cal_date) {
    const d = String(tp.frontmatter.cal_date);
    const m = d.match(/(\d{4})-(\d{2})/);
    if (m) { year = m[1]; month = m[2]; }
}

if (!year || !month) {
    const parentFolder = currentFile.parent ? currentFile.parent.name : "";
    const grandParent = currentFile.parent && currentFile.parent.parent ? currentFile.parent.parent.name : "";
    if (/\d{2}/.test(parentFolder) && /\d{4}/.test(grandParent)) {
        month = parentFolder;
        year = grandParent;
    } else {
        year = tp.date.now("YYYY");
        month = tp.date.now("MM");
    }
}

const targetMonthStr = `${year}-${month}`;
const confirmArchive = await tp.system.prompt(`📦 Archive ALL calendar logs for month ${targetMonthStr}? Type "YES" to confirm`, "");

if (confirmArchive && confirmArchive.trim().toUpperCase() === "YES") {
    const baseArchiveFolder = `yArchive/0_Calendar/${year}/${month}`;
    
    // Ensure archive folder exists
    let curr = "";
    for (const seg of baseArchiveFolder.split('/')) {
        curr = curr === "" ? seg : `${curr}/${seg}`;
        if (!app.vault.getAbstractFileByPath(curr)) {
            await app.vault.createFolder(curr);
        }
    }
    
    const allCalFiles = app.vault.getMarkdownFiles().filter(f => {
        return f.path.includes("0_Calendar") && (f.basename.includes(targetMonthStr) || f.path.includes(`/${year}/${month}/`));
    });
    
    let archivedCount = 0;
    for (const f of allCalFiles) {
        const destPath = `${baseArchiveFolder}/${f.name}`;
        if (f.path !== destPath && !app.vault.getAbstractFileByPath(destPath)) {
            await app.fileManager.processFrontMatter(f, (fm) => {
                fm["status"] = "archived";
            });
            await app.fileManager.renameFile(f, destPath);
            archivedCount++;
        }
    }
    new Notice(`📦 Archive Complete: ${archivedCount} files for ${targetMonthStr} moved to yArchive!`);
} else {
    new Notice("ℹ️ Monthly Archive cancelled.");
}
-%>
