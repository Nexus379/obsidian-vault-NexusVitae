async function generateInpraLog(app, dv, moment) {
    // dv.current() only exists on the inline dataviewjs API; from a Templater button
    // dv is the top-level API (no current()) -> guard, then fall back to a date prompt.
    const cur = (dv && typeof dv.current === "function") ? dv.current() : null;
    let logDateStr = cur ? cur.cal_date : null;
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let userInput = await tp.system.prompt("📅 Which date is the inpra log for? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
        if (!userInput) return null;
        logDateStr = userInput;
    }

    const logDate = moment(logDateStr, "YYYY-MM-DD");
    if (!logDate.isValid()) return null;

    const dayMap = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
    const dayStr = dayMap[logDate.day()];
    const year = logDate.format("YYYY");
    const month = logDate.format("MM");
    const kw = logDate.format("WW");

    // Wochenplan zuerst, dann Master (Fallback)
    const weeklyPath = `0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_inpra.md`;
    let plan = dv.page(weeklyPath);
    if (!plan) plan = dv.page("2_Areas/5_Creativity/Plan/Instrument_Mastery.md");
    if (!plan) throw new Error("Kein Inpra-Wochenplan und keine Instrument_Mastery.md gefunden!");

    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/inpraEngine.js";
    try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
    const engine = require(enginePath)();

    const pieces = engine.getPractice(plan, dayStr);
    if (pieces.length === 0) return null; // kein Üben geplant

    const instr = plan.instr_active || "Instrument";
    const book = plan.instr_book || "";

    // Log-Blöcke: pro Stück eine Bewertungs-Tabelle (Haltung/Rhythmus/Melodie/Gefühl)
    let blocks = [];
    pieces.forEach(p => {
        blocks.push(`### 🎵 ${p.exercise}`);
        blocks.push(`| 🧍 Posture | 🥁 Rhythm | 🎵 Melody | 💗 Feeling |`);
        blocks.push(`|:---:|:---:|:---:|:---:|`);
        blocks.push(`|  |  |  |  |`);
        blocks.push(``);
        blocks.push(`> [!note]- Note for next time`);
        blocks.push(`> `);
        blocks.push(``);
    });

    const fileName = `Inpra_${logDate.format("YYYY-MM-DD")}`;
    const folderPath = `0_Calendar/4_Projectlogs/Routine/${year}/${month}`;
    const filePath = `${folderPath}/${fileName}.md`;

    let content = `---
arch: ["#0cal"]
archtype: ["#0cal/4projectlog"]
status: 1active
date: ${logDate.format("YYYY-MM-DD")}
instr_active: "${instr}"
cssclasses: ["dashboard-no-border"]
---

# 🎼 Inpra Log: ${logDate.format("dddd, MMM Do YYYY")}

> [!info] 🎸 **${instr}**${book ? "  ·  " + book : ""}
> Rate each piece (1-5): **Posture · Rhythm · Melody · Feeling**.
> Avg ≥ 4 → ready for the next piece/level.

---

${blocks.join("\n")}

---
[[${plan.file.path.replace(".md", "")}|➡️ Back to Practice Plan]]
`;

    // Verschachtelte Ordner sicher anlegen (Routine/YYYY/MM)
    let cPath = "";
    for (const seg of folderPath.split('/')) {
        cPath = cPath === "" ? seg : `${cPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
    }

    const existing = app.vault.getAbstractFileByPath(filePath);
    if (!existing) {
        await app.vault.create(filePath, content);
    }
    // Existiert schon → nicht überschreiben (Bewertungen bleiben erhalten)

    return `[[${fileName}]]`;
}

module.exports = generateInpraLog;
