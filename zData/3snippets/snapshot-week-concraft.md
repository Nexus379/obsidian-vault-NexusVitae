<%-*
/**
 * 📸 NEXUS SNAPSHOT WEEK (Content)
 * Copies the master content plan forward as an editable weekly file (concraft_ fields only).
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
            displayTitle: `${values.year}-W${values.kw}_concraft`
        };
        for (const [key, value] of Object.entries(replacements)) {
            out = out.replace(new RegExp(`<%-\s*${key}\s*%>`, "g"), String(value));
        }
        return out;
    };

// 1. Pick the target week (default: the first FREE week from next — skips planned ones)
    let probe = moment().add(1, 'week');
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_concraft.md`)) break;
        probe.add(1, 'week');
    }
    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("📸 Snapshot Content for which week? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year  = target.format("YYYY");
    const month = target.format("MM");
    const kw    = target.format("WW");

// 2. Read the master (only concraft_* is copied)
    const masterFile = app.vault.getAbstractFileByPath("2_Areas/5_Expression/Plan/Content_Plan.md");
    if (!masterFile) { new Notice("❌ Master Content plan not found!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

// 3. Target path + collision guard (never overwrite an already planned week)
    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_concraft.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`⚠️ Content-Week W${kw} already exists — not overwritten.`);
        return;
    }
    let cp = "";
    for (const seg of folder.split('/')) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 4. Shape laden + Platzhalter füllen
    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/weekplan_concraft.md");
    if (!shapeFile) { new Notice("❌ Shape file weekplan_concraft missing!"); return; }
    let body = await app.vault.read(shapeFile);
    body = renderWeekplan(body, { dateStr: target.format("YYYY-MM-DD"), energy: "3", year, kw });

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    // 5. Snapshot: copy concraft_ fields from the master
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (k.startsWith("concraft_")) fm[k] = masterFm[k];
        }
    });

    new Notice(`📸 Content snapshot: ${year}-W${kw}_concraft`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("🔥 Snapshot error: " + e.message, 10000);
}
-%>
