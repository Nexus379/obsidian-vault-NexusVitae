<%-*
const dv = app.plugins.plugins.dataview?.api;
const cur = dv ? dv.current() : null;

let sciName = (cur && cur.sci) ? (Array.isArray(cur.sci) ? cur.sci[0] : cur.sci).replace(/#sci\//i, "") : "Science";
let discName = (cur && cur.discipline) ? String(cur.discipline).replace(/#disc\//i, "") : tp.file.title;

// Formatting
sciName = sciName.charAt(0).toUpperCase() + sciName.slice(1);
discName = discName.charAt(0).toUpperCase() + discName.slice(1);

const targetFolder = `0_Atlas/0_Overview/5_Notes/${sciName}/${discName}`;

// 1. Ordnerhierarchie automatisch erstellen
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) {
        await app.vault.createFolder(currentPath);
    }
}

const destPath = `${targetFolder}/${discName}_Overview.md`;
let existing = app.vault.getAbstractFileByPath(destPath);

if (!existing) {
    tp.variables.sciName = sciName;
    tp.variables.discName = discName;
    const tmplFile = app.vault.getAbstractFileByPath("zData/1tmpl/0_overview/overview-note.md");
    if (tmplFile) {
        const rendered = await tp.file.include(tmplFile);
        const created = await app.vault.create(destPath, rendered);
        new Notice(`📚 Knowledge Cockpit created: ${discName}_Overview.md in 5_Notes/${sciName}/${discName}`);
        const leaf = app.workspace.getLeaf(false);
        await leaf.openFile(created);
        app.commands.executeCommandById("file-explorer:reveal-active-file");
    }
} else {
    new Notice(`ℹ️ Cockpit already exists: ${discName}_Overview.md. Opening & revealing...`);
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(existing);
    app.commands.executeCommandById("file-explorer:reveal-active-file");
}
-%>
