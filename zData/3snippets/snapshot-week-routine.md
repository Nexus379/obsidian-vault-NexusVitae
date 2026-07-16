<%-*
/**
 * 📸 NEXUS SNAPSHOT WEEK (Routine)
 * Kopiert die Master-Routine als EDITIERBARE Wochen-Datei nach vorn (Vorausplanung).
 * Gegenstück zum Archive-Button (rückwärts, eingefroren) — hier: vorwärts, frozen:false.
 */
try {
    // 1. Ziel-Woche wählen (default: erste FREIE Woche ab nächster — überspringt schon geplante)
    let probe = moment().add(1, 'week');
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_routine.md`)) break;
        probe.add(1, 'week');
    }
    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("📸 Snapshot Routine für welche Woche? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year  = target.format("YYYY");
    const month = target.format("MM");
    const kw    = target.format("WW");

    // 2. Master lesen
    const masterFile = app.vault.getAbstractFileByPath("2_Areas/4_Organize/Plan/Routine_Timeblocking.md");
    if (!masterFile) { new Notice("❌ Master Routine_Timeblocking nicht gefunden!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    // 3. Zielpfad + Kollisionsschutz (eine schon geplante Woche NICHT überschreiben)
    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_routine.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`⚠️ Woche W${kw} existiert schon — nicht überschrieben.`);
        return;
    }
    let cp = "";
    for (const seg of folder.split('/')) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 4. Shape (Wochen-File-Form) laden + Platzhalter füllen
    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/_snapshot_shape_routine.md");
    if (!shapeFile) { new Notice("❌ Shape-Datei _snapshot_shape_routine fehlt!"); return; }
    let body = await app.vault.read(shapeFile);
    body = body.replace(/\{\{YEAR\}\}/g, year).replace(/\{\{KW\}\}/g, kw);

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    // 5. Der eigentliche Snapshot: alle rt_* vom Master in die neue Woche kopieren
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (k.startsWith("rt_")) fm[k] = masterFm[k];
        }
    });

    new Notice(`📸 Snapshot erstellt: ${year}-W${kw}_routine (editierbar, Master unberührt)`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("🔥 Snapshot-Fehler: " + e.message, 10000);
}
-%>
