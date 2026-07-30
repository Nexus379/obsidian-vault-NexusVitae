<%-*
/**
 * 🚀 PROJECT COCKPIT
 *
 * Creates a cockpit next to the project note that gathers everything belonging to
 * this project — tasks to tick off, logs, notes, resources.
 *
 * WHY NEXT TO THE NOTE AND NOT IN 0_Overview:
 * Logs and protocols are time things and stay in the calendar — that is GTD-clean.
 * So that a place still exists where everything about one project comes together,
 * the cockpit moves to the project rather than the other way round. The project
 * folder then shows the project note plus its cockpit; everything else stays put.
 *
 * The guard below matters: this works on the ACTIVE file, so run from anywhere else
 * it would create a cockpit for that page instead — the button used to sit in
 * 3-Projects_Overview.md, where clicking it produced exactly that.
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) { new Notice("❌ No active file."); return; }

    // Only ever operate on a project note.
    const inProjects = file.path.startsWith("3_Projects/");
    const isProject = inProjects
        || String(app.metadataCache.getFileCache(file)?.frontmatter?.arch ?? "").includes("#3project");
    if (!isProject) {
        new Notice("❌ Open a project note first — a cockpit only belongs to a project.");
        return;
    }

    const targetTitle = file.basename;

// Target folder = the folder of the project note itself. If the note still sits loose
// in 3_Projects/, a subfolder of the same name is created so note and cockpit stay
// together. 3_Projects is flat — no status segment in the path.
    const parent = file.parent ? file.parent.path : "3_Projects";
    const ownFolder = parent.endsWith(`/${targetTitle}`);
    const targetFolder = ownFolder ? parent : `${parent}/${targetTitle}`;

    let cur = "";
    for (const seg of targetFolder.split("/")) {
        cur = cur === "" ? seg : `${cur}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur);
    }

// Move the project note into its own folder if it is still sitting beside it.
    if (!ownFolder) {
        const moved = `${targetFolder}/${file.name}`;
        if (!app.vault.getAbstractFileByPath(moved)) {
            await app.fileManager.renameFile(file, moved);
            await new Promise(r => setTimeout(r, 150));
        }
    }

    const destPath = `${targetFolder}/${targetTitle}_Cockpit.md`;
    if (app.vault.getAbstractFileByPath(destPath)) {
        new Notice(`ℹ️ Cockpit already exists: ${targetTitle}_Cockpit.md`);
        const existing = app.vault.getAbstractFileByPath(destPath);
        if (existing) await app.workspace.getLeaf("tab").openFile(existing);
        return;
    }

    tp.variables.projName = targetTitle;
    const tmplFile = app.vault.getAbstractFileByPath("zData/1tmpl/0_overview/overview-proj.md");
    if (!tmplFile) { new Notice("🔥 Template overview-proj.md not found!"); return; }

    const rendered = await tp.file.include(tmplFile);
    await app.vault.create(destPath, rendered);
    new Notice(`🚀 Project Cockpit created: ${targetTitle}_Cockpit.md`);

    const made = app.vault.getAbstractFileByPath(destPath);
    if (made) await app.workspace.getLeaf("tab").openFile(made);

} catch (e) {
    console.error(e);
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>
