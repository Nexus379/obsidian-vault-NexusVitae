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

    // Weekly plan first, then the master (fallback)
    const weeklyPath = `0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_inpra.md`;
    let plan = dv.page(weeklyPath);
    if (!plan) plan = dv.page("2_Areas/2_Creativity/Plan/Instrument_Mastery.md");
    if (!plan) throw new Error("No Inpra weekly plan and no Instrument_Mastery.md found!");

    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/inpraEngine.js";
    try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
    const engine = require(enginePath)();

    const pieces = engine.getPractice(plan, dayStr);
    if (pieces.length === 0) return null; // no practice planned

    const instr = plan.inpra_active || "Instrument";
    const book = plan.inpra_book || "";

    // Log blocks: one rating table per piece (posture / rhythm / melody / feel)
    let blocks = [];
    pieces.forEach(p => {
        const prefix = `inpra_${dayStr}_${p.slot}`;
        const durationText = p.minutes ? `${p.minutes} min` : "open duration";
        const ratingVals = `const c = dv.current(); const vals = [c["${prefix}_posture"], c["${prefix}_rhythm"], c["${prefix}_melody"], c["${prefix}_feeling"]].map(Number).filter(n => n > 0);`;
        
        blocks.push(`### Piece ${p.slot}: ${p.exercise}`);
        blocks.push(`> **Planned:** ${durationText} · ⏱️ **Practiced:** \`INPUT[number:inpra_min_${p.slot}]\` min`);
        blocks.push(`| Posture (1-5) | Rhythm (1-5) | Melody (1-5) | Feeling (1-5) | Avg Rating | Status |`);
        blocks.push(`|:---:|:---:|:---:|:---:|:---:|:---:|`);
        blocks.push(`| \`INPUT[slider:${prefix}_posture]\` | \`INPUT[slider:${prefix}_rhythm]\` | \`INPUT[slider:${prefix}_melody]\` | \`INPUT[slider:${prefix}_feeling]\` | \`$= ${ratingVals} vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "-"\` | \`$= ${ratingVals} vals.length && (vals.reduce((a,b)=>a+b,0)/vals.length) >= 4 ? "ready" : "practice"\` |`);
        blocks.push(``);
        blocks.push(`> [!note]- Note & Focus for next session`);
        blocks.push(`> `);
        blocks.push(``);
    });

    // Live total = sum of the per-piece inpra_min_N inputs (single source of truth for the minutes).
    // Built as single-quoted lines so inner backticks / ${} stay literal inside the content template.
    const totalBlock = [
        '> [!success] 🎼 **Session Total** <small>· sum of the minutes above — mirrored into today\'s PLM</small>',
        '> ```dataviewjs',
        '> const engine = require(app.vault.adapter.basePath + "/zData/2scripts/inpraEngine.js")();',
        '> const total = engine.parseInpraMinutes(dv.current());',
        '> dv.paragraph(`⏱️ **${total} min** practiced today`);',
        '> ```'
    ].join("\n");

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

${totalBlock}

---

${blocks.join("\n")}

---
[[${plan.file.path.replace(".md", "")}|➡️ Back to Practice Plan]]
`;

    // Create nested folders safely (Routine/YYYY/MM)
    let cPath = "";
    for (const seg of folderPath.split('/')) {
        cPath = cPath === "" ? seg : `${cPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
    }

    const existing = app.vault.getAbstractFileByPath(filePath);
    if (!existing) {
        await app.vault.create(filePath, content);
    }
    // Already exists -> do not overwrite (ratings stay intact)

    return `[[${fileName}]]`;
}

module.exports = generateInpraLog;
