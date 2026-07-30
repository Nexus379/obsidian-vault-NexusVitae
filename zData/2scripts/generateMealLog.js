async function generateMealLog(app, dv, moment) {
    // dv.current() only exists on the inline dataviewjs API; from a Templater button
    // dv is the top-level API (no current()) -> guard, then fall back to a date prompt.
    const cur = (dv && typeof dv.current === "function") ? dv.current() : null;
    let logDateStr = cur ? cur.cal_date : null;
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let userInput = await tp.system.prompt("📅 Which date is the meal log for? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
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

    // Weekly plan first, master fallback (same pattern as workout/inpra).
    const weeklyPath = `0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_meal.md`;
    let plan = dv.page(weeklyPath);
    let planPath = weeklyPath;
    if (!plan) { planPath = "2_Areas/1_Selfcare/Plan/Meal_Plan.md"; plan = dv.page(planPath); }
    if (!plan) throw new Error("No meal weekly plan and no Meal_Plan.md found!");

    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/mealEngine.js";
    try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
    const engine = require(enginePath)();

    const planned = engine.getPlannedMeals(plan, dayStr);

    // Frontmatter fields + body blocks per planned meal.
    let fmLines = [];
    let blocks = [];
    planned.forEach((m, idx) => {
        const i = idx + 1;
        fmLines.push(`ml_${i}_slot: "${m.slot}"`);
        fmLines.push(`ml_${i}_link: "${m.path}"`);
        fmLines.push(`ml_${i}_cooked: 0`);
        fmLines.push(`ml_${i}_me: 0`);
        fmLines.push(`ml_${i}_others: 0`);

        blocks.push(`### ${m.slotLabel}: [[${m.path}|${m.title}]]`);
        blocks.push(`> 🍳 **Cooked:** \`INPUT[number:ml_${i}_cooked]\` portions · 🙋 **Me:** \`INPUT[number:ml_${i}_me]\` · 👥 **Others / guests:** \`INPUT[number:ml_${i}_others]\``);
        blocks.push(`> <small>Leftover = cooked − me − others → goes to the fridge stock (valid ~${engine.LEFTOVER_DAYS} days).</small>`);
        blocks.push(``);
    });
    if (planned.length === 0) {
        blocks.push(`_No meals planned for this day — add spontaneous meals via the buttons in today's PLM._`);
        blocks.push(``);
    }

    // Live totals block (single-quoted lines so inner backticks / ${} stay literal).
    const liveBlock = [
        '> [!success] 🍱 **Day Total** <small>· live — mirrored into today\'s PLM (until freeze)</small>',
        '> ```dataviewjs',
        '> const engine = require(app.vault.adapter.basePath + "/zData/2scripts/mealEngine.js")();',
        '> const r = engine.parseMealActuals(dv.current(), dv);',
        '> const t = r.totals;',
        '> dv.paragraph(`🔥 **${Math.round(t.kcal || 0)}** kcal · 💪 **${(t.protein_g || 0).toFixed(1)}**g Pro · 🥑 **${(t.fat_total_g || 0).toFixed(1)}**g Fat`);',
        '> if (r.leftovers.length) dv.paragraph("🧊 **Fridge stock:** " + r.leftovers.map(l => `${l.title} ×${l.leftover}`).join(" · "));',
        '> else dv.paragraph("<small>_No leftovers yet._</small>");',
        '> ```'
    ].join("\n");

    const fileName = `Meal_${logDate.format("YYYY-MM-DD")}`;
    const folderPath = `0_Calendar/4_Projectlogs/Routine/${year}/${month}`;
    const filePath = `${folderPath}/${fileName}.md`;

    let content = `---
arch: ["#0cal"]
archtype: ["#0cal/4projectlog"]
status: 1active
date: ${logDate.format("YYYY-MM-DD")}
cssclasses: ["dashboard-no-border"]
${fmLines.join("\n")}
---

# 🍱 Meal Log: ${logDate.format("dddd, MMM Do YYYY")}

> [!info] 🍽️ **Cooked vs. Eaten Tracker**
> Enter per meal how many portions you **cooked**, how many **you** ate (→ your nutrients) and how many **others/guests** ate.
> The leftover count feeds the fridge stock so the Shopping Hub knows what's already covered.

${liveBlock}

---

${blocks.join("\n")}

---
[[${planPath.replace(".md", "")}|➡️ Back to Meal Plan]]
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
    // Existing files are NOT overwritten (your entered portions stay safe) — but still open + link them.
    const logFile = app.vault.getAbstractFileByPath(filePath);
    if (logFile) await app.workspace.getLeaf('split').openFile(logFile);

    return `[[${fileName}]]`;
}
module.exports = generateMealLog;
