<%-*
const targetTitle = tp.file.title;
const overviewFolderName = "2_Areas";
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
    tp.variables.areaName = targetTitle;
    const tmplFile = app.vault.getAbstractFileByPath("zData/1tmpl/0_overview/overview-area.md");
    if (tmplFile) {
        const rendered = await tp.file.include(tmplFile);
        await app.vault.create(destPath, rendered);
        new Notice(`🚀 Area Cockpit created: ${targetTitle}_Overview.md`);
    } else {
        new Notice("🔥 Template overview-area.md not found!");
    }
} else {
    new Notice(`ℹ️ Cockpit already exists: ${targetTitle}_Overview.md`);
}
-%>
