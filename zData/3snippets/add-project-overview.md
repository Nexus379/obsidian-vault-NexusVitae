<%-*
const targetTitle = tp.file.title;
const overviewFolderName = "3_Projects";
const targetFolder = `0_Atlas/0_Overview/${overviewFolderName}`;

// 1. Ordner automatisch erstellen falls nicht vorhanden
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) {
        await app.vault.createFolder(currentPath);
    }
}

const destPath = `${targetFolder}/${targetTitle}_Overview.md`;
let existing = app.vault.getAbstractFileByPath(destPath);

if (!existing) {
    tp.variables.projName = targetTitle;
    const tmplFile = app.vault.getAbstractFileByPath("zData/1tmpl/0_overview/overview-proj.md");
    if (tmplFile) {
        const rendered = await tp.file.include(tmplFile);
        await app.vault.create(destPath, rendered);
        new Notice(`🚀 Project Cockpit created: ${targetTitle}_Overview.md`);
    } else {
        new Notice("🔥 Template overview-proj.md not found!");
    }
} else {
    new Notice(`ℹ️ Cockpit already exists: ${targetTitle}_Overview.md`);
}
-%>
