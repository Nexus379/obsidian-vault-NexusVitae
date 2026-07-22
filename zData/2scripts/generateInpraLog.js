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

    const instr = plan.inpra_active || "Instrument";
    const book = plan.inpra_book || "";

    // Log-Blöcke: pro Stück eine Bewertungs-Tabelle (Haltung/Rhythmus/Melodie/Gefühl)
    let blocks = [];
    pieces.forEach(p => {
        const prefix = `inpra_${dayStr}_${p.slot}`;
        const durationText = p.minutes ? `${p.minutes} min` : "open duration";
        const ratingVals = `const c = dv.current(); const vals = [c["${prefix}_posture"], c["${prefix}_rhythm"], c["${prefix}_melody"], c["${prefix}_feeling"]].map(Number).filter(n => n > 0);`;
        
        blocks.push(`### Piece ${p.slot}: ${p.exercise}`);
        blocks.push(`> **Planned time:** ${durationText}`);
        blocks.push(`| Posture (1-5) | Rhythm (1-5) | Melody (1-5) | Feeling (1-5) | Avg Rating | Status |`);
        blocks.push(`|:---:|:---:|:---:|:---:|:---:|:---:|`);
        blocks.push(`| \`INPUT[slider:${prefix}_posture]\` | \`INPUT[slider:${prefix}_rhythm]\` | \`INPUT[slider:${prefix}_melody]\` | \`INPUT[slider:${prefix}_feeling]\` | \`$= ${ratingVals} vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "-"\` | \`$= ${ratingVals} vals.length && (vals.reduce((a,b)=>a+b,0)/vals.length) >= 4 ? "ready" : "practice"\` |`);
        blocks.push(``);
        blocks.push(`> [!note]- Note & Focus for next session`);
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
inpra_active: "${instr}"
duration: 15
cssclasses: ["dashboard-no-border"]
---

# 🎼 Inpra Log: ${logDate.format("dddd, MMM Do YYYY")}

> [!info] 🎸 **${instr}**${book ? "  ·  " + book : ""}
> **Practice Duration Target:** Standard 15–20 min session (automatically synced to Daily PLM).  
> 
> 💡 **Practice Rating Scale (1-5):**  
> - **1-2:** Clean finger placement & steady metronome pulse.  
> - **3-4:** Solid tempo with natural dynamics & minimal pauses.  
> - **5 (Mastery):** Flawless performance with full emotional expression.  
> *(Avg Rating ≥ 4 → Ready to advance manually.)*

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
