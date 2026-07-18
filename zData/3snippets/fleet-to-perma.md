<%*
// 🌱 FLEETING → ZETTELKASTEN — promote into the network (Atomic / Permanent / Evergreen)
// Keeps the Luhmann ID + all links; moves to the right 5_Notes folder.
try {
    const file = app.workspace.getActiveFile();
    if (!file) { new Notice("❌ No active note."); return; }

    const fm0 = app.metadataCache.getFileCache(file)?.frontmatter || {};

    // Guard: meant for fleeting notes — ask before promoting anything else
    if (!String(fm0.archtype || "").includes("1fleeting")) {
        const go = await tp.system.suggester(
            ["✅ Yes, promote anyway", "❌ Cancel"], [true, false], false,
            "This isn't a Fleeting note. Promote anyway?"
        );
        if (!go) return;
    }

    // Where to? (Atomic = one idea · Permanent = developed thought · Evergreen = synthesis)
    const TYPES = {
        atomic:    { archtype: "#5note/3atomic",    folder: "5_Notes/3_Atomic",    icon: "🗃️", label: "Atomic" },
        permanent: { archtype: "#5note/4permanent", folder: "5_Notes/4_Permanent", icon: "📜", label: "Permanent" },
        evergreen: { archtype: "#5note/5evergreen", folder: "5_Notes/5_Evergreen", icon: "🌳", label: "Evergreen" }
    };
    const pick = await tp.system.suggester(
        ["🗃️ Atomic (one idea)", "📜 Permanent (developed thought)", "🌳 Evergreen (synthesis)"],
        ["atomic", "permanent", "evergreen"], false, "🌱 Promote this Fleeting note to…?"
    );
    if (!pick) return;
    const t = TYPES[pick];

    // Luhmann ID: existing LID field, else the filename's leading token (e.g. "12a Some thought" -> "12a")
    const lidMatch = file.basename.match(/^([a-zA-Z0-9.]+)(?=\s)/);
    const lid = fm0.LID || (lidMatch ? lidMatch[1] : "");

    // Promote frontmatter — everything else (parent/sibling/child, science, discipline, area2 …) stays intact
    await app.fileManager.processFrontMatter(file, (fm) => {
        fm.archtype = [t.archtype];
        fm.banner_icon = t.icon;
        if (lid) fm.LID = lid;
    });

    // Move into the chosen folder — renameFile updates ALL backlinks so links keep working
    let cur = "";
    for (const seg of t.folder.split("/")) {
        cur = cur ? cur + "/" + seg : seg;
        if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur);
    }
    const dest = `${t.folder}/${file.name}`;
    if (file.path !== dest) {
        if (app.vault.getAbstractFileByPath(dest)) { new Notice("⚠️ A note with this name already exists there — not moved."); return; }
        await app.fileManager.renameFile(file, dest);
    }

    new Notice(`${t.icon} Promoted to ${t.label}` + (lid ? ` · LID ${lid}` : ""));
} catch (e) {
    console.error("fleet-to-perma error", e);
    new Notice("🔥 Error: " + e.message);
}
-%>
