<%-*
/**
 * 📸 NEXUS SNAPSHOT WEEK (Fitness)
 * Kopiert die Master-Fitness-Routine als editierbare Wochen-Datei nach vorn.
 * training_week wird NICHT kopiert, sondern auto-erkannt (letzte _fitness-Woche + 1) — wie das Original.
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
            displayTitle: `${values.year}-W${values.kw}_fitness`,
            currentWeek: values.currentWeek
        };

        for (const [key, value] of Object.entries(replacements)) {
            out = out.replace(new RegExp(`<%-\\s*${key}\\s*%>`, "g"), String(value));
        }

        return out;
    };

    // 1. Ziel-Woche wählen (default: erste FREIE Woche ab nächster — überspringt schon geplante)
    let probe = moment().add(1, 'week');
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_fitness.md`)) break;
        probe.add(1, 'week');
    }
    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("📸 Snapshot Fitness for which week? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year  = target.format("YYYY");
    const month = target.format("MM");
    const kw    = target.format("WW");

    // 2. Master lesen (nur fit_* wird kopiert)
    const masterFile = app.vault.getAbstractFileByPath("2_Areas/6_Activity/Plan/Fitness_Routine.md");
    if (!masterFile) { new Notice("❌ Master Fitness_Routine not found!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    // 3. training_week auto-erkennen: letzte _fitness-Woche + 1 (Fallback 1)
    let currentWeek = 1;
    const allFit = app.vault.getMarkdownFiles().filter(f => f.name.includes("_fitness"));
    if (allFit.length > 0) {
        allFit.sort((a, b) => b.name.localeCompare(a.name));
        const lastFm = app.metadataCache.getFileCache(allFit[0])?.frontmatter;
        if (lastFm && lastFm.training_week) currentWeek = Number(lastFm.training_week) + 1;
    }

    // 4. Zielpfad + Kollisionsschutz
    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_fitness.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`⚠️ Fitness-Week W${kw} already exists — not overwritten.`);
        return;
    }
    let cp = "";
    for (const seg of folder.split('/')) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 5. Shape laden + Platzhalter füllen
    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/weekplan_fitness.md");
    if (!shapeFile) { new Notice("❌ Shape file weekplan_fitness missing!"); return; }
    let body = await app.vault.read(shapeFile);
    body = renderWeekplan(body, {
        dateStr: target.format("YYYY-MM-DD"),
        energy: "3",
        year,
        kw,
        currentWeek
    });

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    // 6. Snapshot: fit_* vom Master kopieren, training_week = auto-erkannt
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (k.startsWith("fit_")) fm[k] = masterFm[k];
        }
        fm.training_week = currentWeek;
    });

    new Notice(`📸 Fitness snapshot: ${year}-W${kw}_fitness (training week ${currentWeek})`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("🔥 Snapshot error: " + e.message, 10000);
}
-%>
