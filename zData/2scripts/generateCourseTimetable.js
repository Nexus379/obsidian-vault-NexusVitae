// zData/2scripts/generateCourseTimetable.js
// 🗓️ Creates a WEEKLY timetable from the master — for weeks that run differently
// (Feiertag, Blockwoche, Prüfungsphase, Vertretung).
//
// Rolle im System:
//   planPaths.tt has behavior "fallback" — as long as no weekly file exists,
//   dailypkm and syncTimetable read the master. Once this script has created a
//   week, the week wins and the master stays untouched.
//
// Deliberately blunt: a plain master copy. Deviations come afterwards
// by hand via BUTTON[edit-timetable] and BUTTON[reset-schedule].
// An existing week is NEVER overwritten.

async function generateCourseTimetable(app, dv, moment) {
    const tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;

    // 🔱 1. PLAN MODULE (single source of truth instead of hardcoded paths)
    const planPath = app.vault.adapter.basePath + "/zData/2scripts/planPaths.js";
    try { delete require.cache[require.resolve(planPath)]; } catch (e) {}
    const plans = require(planPath)();

    const masterPath = plans.get("tt") + ".md";
    const shapeName = plans.weekplanTemplate("tt");

    // 🔱 2. TARGET WEEK — default: the first still FREE week from next week on
    let probe = moment().add(1, "week");
    for (let i = 0; i < 60; i++) {
        if (!app.vault.getAbstractFileByPath(plans.weeklyPath(moment, "tt", probe.format("YYYY-MM-DD")))) break;
        probe.add(1, "week");
    }
    const defaultDate = probe.format("YYYY-MM-DD");

    const input = await tp.system.prompt(
        "🗓️ Timetable for which week? (YYYY-MM-DD — any day of that week)",
        defaultDate
    );
    if (input === null) return null; // ESC → nichts anlegen

    const target = moment(/^\d{4}-\d{2}-\d{2}$/.test(input) ? input : defaultDate, "YYYY-MM-DD");
    if (!target.isValid()) throw new Error("Invalid date: " + input);

    const year = target.format("YYYY");
    const month = target.format("MM");
    const kw = target.format("WW");

    // 🔱 3. MASTER LESEN
    const masterFile = app.vault.getAbstractFileByPath(masterPath);
    if (!masterFile) throw new Error("Master not found: " + masterPath);
    const masterFm = app.metadataCache.getFileCache(masterFile)?.frontmatter || {};

    // 🔱 4. COLLISION GUARD — a planned week is handwork that must not die
    const finalDest = plans.weeklyPath(moment, "tt", target.format("YYYY-MM-DD"));
    const existing = app.vault.getAbstractFileByPath(finalDest);
    if (existing) {
        new Notice(`⚠️ W${kw} already exists - not overwritten.`);
        await app.workspace.getLeaf("tab").openFile(existing);
        return `[[${existing.basename}]]`;
    }

    // 🔱 5. ENSURE THE FOLDER SEGMENT BY SEGMENT
    const folder = finalDest.substring(0, finalDest.lastIndexOf("/"));
    let cp = "";
    for (const seg of folder.split("/")) {
        cp = cp === "" ? seg : `${cp}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cp)) await app.vault.createFolder(cp);
    }

    // 🔱 6. LOAD SHAPE + FILL PLACEHOLDERS (the Templater header is stripped)
    const shapeFile = app.vault.getAbstractFileByPath(`zData/1tmpl/0calendar/${shapeName}.md`);
    if (!shapeFile) throw new Error(`Shape missing: zData/1tmpl/0calendar/${shapeName}.md`);

    let body = (await app.vault.read(shapeFile))
        .replace(/^<%-?\*[\s\S]*?-%>\s*/, "")
        .replace(/^<%-?\*[\s\S]*?%>\s*/, "");

    const replacements = {
        dateStr: target.format("YYYY-MM-DD"),
        energy: "3",
        year: year,
        kw: kw,
        planYear: year,
        planKw: kw,
        displayTitle: `${year}-W${kw}_timetable`
    };
    for (const [key, value] of Object.entries(replacements)) {
        body = body.replace(new RegExp(`<%-\\s*${key}\\s*%>`, "g"), String(value));
    }

    await app.vault.create(finalDest, body);
    await new Promise(r => setTimeout(r, 150)); // brief wait until Obsidian knows the file

    // 🔱 7. THE ACTUAL SNAPSHOT: every tt_* from the master into the week
    //     (inkl. Raster tt_start / tt_duration / tt_periods / tt_breaks)
    const newFile = app.vault.getAbstractFileByPath(finalDest);
    let copied = 0;
    await app.fileManager.processFrontMatter(newFile, (fm) => {
        for (const k of Object.keys(masterFm)) {
            if (!k.startsWith("tt_")) continue;
            fm[k] = masterFm[k];
            if (/^tt_(mon|tue|wed|thu|fri|sat|sun)_/.test(k)) copied++;
        }
    });

    new Notice(`🗓️ ${year}-W${kw}_timetable created — ${copied} blocks copied (master untouched).`);
    await app.workspace.getLeaf("tab").openFile(newFile);

    return `[[${year}-W${kw}_timetable]]`;
}

module.exports = generateCourseTimetable;
