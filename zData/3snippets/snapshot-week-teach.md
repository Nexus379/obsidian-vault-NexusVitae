<%-*
/**
 * 📸 NEXUS SNAPSHOT WEEK (Teaching)
 * Kopiert den Master-Teaching-Plan als editierbare Wochen-Datei nach vorn (nur teach_*-Felder).
 */
try {
    const renderWeekplan = (raw, values) => {
        let out = raw
            .replace(/^<%-?\*[\s\S]*?-%>\s*/, "")
            .replace(/^<%-?\*[\s\S]*?%>\s*/, "");
        const replacements = {
            dateStr: values.dateStr,
            energy: values.energy,
            year: values.year,
            kw: values.kw,
            displayTitle: `${values.year}-W${values.kw}_teach`
        };
        for (const [key, value] of Object.entries(replacements)) {
            out = out.replace(new RegExp(`<%-\s*${key}\s*%>`, "g"), String(value));
        }
        return out;
    };

    // 1. Ziel-Woche wählen (default: erste FREIE Woche ab nächster)
    let probe = moment().add(1, 'week');
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_teach.md`)) break;
        probe.add(1, 'week');
    }
    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("📸 Snapshot Teaching for which week? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year  = target.format("YYYY");
    const month = target.format("MM");
    const kw    = target.format("WW");

    // 2. Master lesen (nur teach_* wird kopiert)
    const masterFile = app.vault.getAbstractFileByPath("2_Areas/5_Expression/Plan/Teaching_Plan.md");
    if (!masterFile) { new Notice("❌ Master Teaching plan not found!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    // 3. Zielpfad + Kollisionsschutz
    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_teach.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`⚠️ Teaching-Week W${kw} already exists — not overwritten.`);
        return;
    }
    let cp = "";
    for (const seg of folder.split('/')) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 4. Shape laden + Platzhalter füllen
    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/weekplan_teach.md");
    if (!shapeFile) { new Notice("❌ Shape file weekplan_teach missing!"); return; }
    let body = await app.vault.read(shapeFile);
    body = renderWeekplan(body, { dateStr: target.format("YYYY-MM-DD"), energy: "3", year, kw });

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    // 5. Snapshot: teach_* vom Master kopieren
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (k.startsWith("teach_")) fm[k] = masterFm[k];
        }
    });

    new Notice(`📸 Teaching snapshot: ${year}-W${kw}_teach`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("🔥 Snapshot error: " + e.message, 10000);
}
-%>
