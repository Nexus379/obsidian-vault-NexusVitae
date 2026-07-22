<%-*
/**
 * NEXUS SNAPSHOT WEEK (Inpra)
 * Creates an editable weekly instrumental-practice plan from the master plan.
 * The master remains untouched; only inpra_* planning fields are copied forward.
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
            planYear: values.year,
            planKw: values.kw,
            displayTitle: `${values.year}-W${values.kw}_inpra`
        };

        for (const [key, value] of Object.entries(replacements)) {
            out = out.replace(new RegExp(`<%-\\s*${key}\\s*%>`, "g"), String(value));
        }

        return out;
    };

    let probe = moment().add(1, "week");
    for (let i = 0; i < 60; i++) {
        const py = probe.format("YYYY"), pm = probe.format("MM"), pk = probe.format("WW");
        if (!app.vault.getAbstractFileByPath(`0_Calendar/7_Plan/${py}/${pm}/${py}-W${pk}_inpra.md`)) break;
        probe.add(1, "week");
    }

    const defaultDate = probe.format("YYYY-MM-DD");
    const input = await tp.system.prompt("Snapshot Inpra for which week? (YYYY-MM-DD)", defaultDate);
    if (input === null) return;
    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");

    const year = target.format("YYYY");
    const month = target.format("MM");
    const kw = target.format("WW");

    const masterFile = app.vault.getAbstractFileByPath("2_Areas/5_Creativity/Plan/Instrument_Mastery.md");
    if (!masterFile) { new Notice("Master Instrument_Mastery not found!"); return; }
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    const folder = `0_Calendar/7_Plan/${year}/${month}`;
    const finalDest = `${folder}/${year}-W${kw}_inpra.md`;
    if (app.vault.getAbstractFileByPath(finalDest)) {
        new Notice(`Inpra week W${kw} already exists; not overwritten.`);
        return;
    }

    let cp = "";
    for (const seg of folder.split("/")) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    const shapeFile = app.vault.getAbstractFileByPath("zData/1tmpl/0calendar/weekplan_inpra.md");
    if (!shapeFile) { new Notice("Shape file weekplan_inpra missing!"); return; }
    let body = await app.vault.read(shapeFile);
    body = renderWeekplan(body, {
        dateStr: target.format("YYYY-MM-DD"),
        energy: "3",
        year,
        kw
    });

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150));

    const newFile = app.vault.getAbstractFileByPath(finalDest);
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (k.startsWith("inpra_")) {
                fm[k] = masterFm[k];
            }
        }
    });

    new Notice(`Inpra snapshot created: ${year}-W${kw}_inpra`);
    await app.workspace.getLeaf(true).openFile(newFile);

} catch(e) {
    new Notice("Snapshot error: " + e.message, 10000);
}
-%>
