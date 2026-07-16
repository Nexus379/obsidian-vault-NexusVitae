<%-*
/**
 * 📸 NEXUS SNAPSHOT WEEK (Meal)
 * Kopiert den Master-Meal-Plan als editierbare Wochen-Datei nach vorn.
 * Copy-Regel: alle ${day}_* Felder (Slots brk/ben/lun/snk/eve + add/rem).
 * Berechnete Nährwerte (${day}_kcal etc.) werden vom Diagnostics-Block der Woche neu gerechnet.
 */
try {
    const dayPrefix = /^(mon|tue|wed|thu|fri|sat|sun)_/;

    // 1. Ziel-Woche wählen (default: erste FREIE Woche ab nächster — überspringt schon geplante)
    let probe = moment().add(1, 'week');
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_meal.md`)) break;
        probe.add(1, 'week');
    }
    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("📸 Snapshot Meal-Plan für welche Woche? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year  = target.format("YYYY");
    const month = target.format("MM");
    const kw    = target.format("WW");

    // 2. Master lesen
    const masterFile = app.vault.getAbstractFileByPath("2_Areas/1_Selfcare/Plan/Meal_Plan.md");
    if (!masterFile) { new Notice("❌ Master Meal_Plan nicht gefunden!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    // 3. Zielpfad + Kollisionsschutz
    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_meal.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`⚠️ Meal-Woche W${kw} existiert schon — nicht überschrieben.`);
        return;
    }
    let cp = "";
    for (const seg of folder.split('/')) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 4. Shape laden + Platzhalter füllen
    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/_snapshot_shape_meal.md");
    if (!shapeFile) { new Notice("❌ Shape-Datei _snapshot_shape_meal fehlt!"); return; }
    let body = await app.vault.read(shapeFile);
    body = body.replace(/\{\{YEAR\}\}/g, year).replace(/\{\{KW\}\}/g, kw);

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    // 5. Snapshot: alle ${day}_* vom Master in die neue Woche kopieren
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (dayPrefix.test(k)) fm[k] = masterFm[k];
        }
    });

    new Notice(`📸 Meal-Snapshot: ${year}-W${kw}_meal (Master unberührt)`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("🔥 Snapshot-Fehler: " + e.message, 10000);
}
-%>
