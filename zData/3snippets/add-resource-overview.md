<%-*
const dv = app.plugins.plugins.dataview?.api;
const cur = dv ? dv.current() : null;

let resType = (cur && cur.archtype) ? String(cur.archtype[0]).replace(/#6resource\//i, "") : tp.file.title;
resType = resType.charAt(0).toUpperCase() + resType.slice(1);

const targetFolder = `0_Atlas/0_Overview/6_Resources/${resType}`;

// 1. Ordner automatisch erstellen
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) {
        await app.vault.createFolder(currentPath);
    }
}

const destPath = `${targetFolder}/${resType}_Overview.md`;
let existing = app.vault.getAbstractFileByPath(destPath);

if (!existing) {
    tp.variables.resType = resType;
    const tmplFile = app.vault.getAbstractFileByPath("zData/1tmpl/0_overview/overview-resource.md");
    if (tmplFile) {
        const rendered = await tp.file.include(tmplFile);
        const created = await app.vault.create(destPath, rendered);
        new Notice(`🔖 Resource Cockpit created: ${resType}_Overview.md in 6_Resources/${resType}`);
        const leaf = app.workspace.getLeaf(false);
        await leaf.openFile(created);
        app.commands.executeCommandById("file-explorer:reveal-active-file");
    }
} else {
    new Notice(`ℹ️ Cockpit already exists: ${resType}_Overview.md. Opening & revealing...`);
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(existing);
    app.commands.executeCommandById("file-explorer:reveal-active-file");
}
-%>
