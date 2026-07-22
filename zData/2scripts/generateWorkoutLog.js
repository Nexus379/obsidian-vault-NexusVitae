async function generateWorkoutLog(app, dv, moment) {
    // dv.current() only exists on the inline dataviewjs API; from a Templater button
    // dv is the top-level API (no current()) -> guard, then fall back to a date prompt.
    const cur = (dv && typeof dv.current === "function") ? dv.current() : null;
    let logDateStr = cur ? cur.cal_date : null;

    // If started manually (e.g. from the Fitness Hub), ask for the date.
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let userInput = await tp.system.prompt("📅 Which date is the workout log for? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
        if (!userInput) return null; // cancelled
        logDateStr = userInput;
    }
    
    const logDate = moment(logDateStr, "YYYY-MM-DD");
    if (!logDate.isValid()) return null;
    
    const dayMap = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
    const dayStr = dayMap[logDate.day()];
    
    const year = logDate.format("YYYY");
    const month = logDate.format("MM");
    const kw = logDate.format("WW");
    const weeklyPath = `0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_fitness.md`;
    
    let fitPlan = dv.page(weeklyPath);
    if (!fitPlan) {
        fitPlan = dv.page("2_Areas/6_Activity/Plan/Fitness_Routine.md");
    }
    if (!fitPlan) throw new Error("Kein Wochenplan und keine Fitness_Routine.md gefunden!");
    
    // Engine laden
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
    try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
    const engine = require(enginePath)();
    
    const regions = [
        {l: "🤸 Warmup", v: "mobility"},
        {l: "💪 Upper Body", v: "upper"},
        {l: "🦵 Lower Body", v: "lower"},
        {l: "🪨 Core", v: "core"},
        {l: "🔥 Cardio", v: "cardio"}
    ];
    
    // Cycle berechnen
    const w = fitPlan.training_week || 1;
    const cycleWeek = ((w - 1) % 4) + 1;
    let phase = "";
    let intensity = "";
    let targetMultiplier = "";
    
    if (cycleWeek === 1) { phase = "🌱 Foundation Phase"; intensity = "70% (RIR: 3)"; targetMultiplier = "Baseline Target (3 Sets)"; }
    else if (cycleWeek === 2) { phase = "⚙️ Volume Phase"; intensity = "80% (RIR: 2)"; targetMultiplier = "+15% Volume Target (4 Sets)"; }
    else if (cycleWeek === 3) { phase = "🔥 Bruce Lee Overreach (Peak)"; intensity = "90% (RIR: 1)"; targetMultiplier = "🔥 MAX OVERLOAD (4 Sets Max Density)"; }
    else if (cycleWeek === 4) { phase = "🔋 Deload Phase"; intensity = "60% (RIR: 4)"; targetMultiplier = "🔋 Active Recovery (-40% Volume)"; }

    // Finde heutige Übungen & berechne dynamische Soll-Werte (Targets)
    let hasExercises = false;
    let workoutBlocks = [];
    
    regions.forEach(r => {
        let exKey = fitPlan[`fit_${dayStr}_${r.v}`];
        if (exKey && exKey !== "free") {
            let arr = Array.isArray(exKey) ? exKey : [exKey];
            if (arr.length > 0) {
                hasExercises = true;
                workoutBlocks.push(`### ${r.l}`);
                
                arr.forEach(k => {
                    let parts = String(k).split("|");
                    let baseKey = parts[0];
                    let exData = (engine && engine.all) ? engine.all[baseKey] : null;
                    let fitFamily = exData ? exData.fit_family : "";
                    
                    // 🎯 DYNAMISCHE ZIEL-BERECHNUNG (SOLL-WERTE nach Cycle-Woche)
                    let targetGoal = "";
                    if (fitFamily && (fitFamily.includes("static") || fitFamily.includes("bruce_lee") || fitFamily.includes("stretching"))) {
                        // Isometrische / Halte-Übungen (in Sekunden)
                        targetGoal = cycleWeek === 1 ? "3 × 30s hold" : cycleWeek === 2 ? "4 × 45s hold" : cycleWeek === 3 ? "4 × 60s hold 🔥" : "2 × 20s hold 🔋";
                    } else if (r.v === "cardio") {
                        // Ausdauer / Cardio (in Minuten)
                        targetGoal = cycleWeek === 1 ? "15 min (Pace 5:30)" : cycleWeek === 2 ? "20 min (Pace 5:15)" : cycleWeek === 3 ? "25 min (Pace 4:45 🔥)" : "10 min Easy 🔋";
                    } else {
                        // Standard Kraft / Calisthenics (Sätze × Reps)
                        targetGoal = cycleWeek === 1 ? "3 × 10 reps" : cycleWeek === 2 ? "4 × 12 reps" : cycleWeek === 3 ? "4 × 15 reps 🔥" : "2 × 8 reps 🔋";
                    }
                    
                    let nameStr = baseKey;
                    if (exData) {
                        nameStr = `${exData.icon} **${exData.label}**`;
                    } else if (baseKey === "custom") {
                        nameStr = `❓ **${parts.slice(1).join(" ")}**`;
                    }
                    
                    workoutBlocks.push(`#### ${nameStr}`);
                    workoutBlocks.push(`> 🎯 **Target Goal (Woche ${cycleWeek}):** \`${targetGoal}\``);
                    workoutBlocks.push(`| Set | Target | Actual Reps / Weight | RIR (0-4) | Status |`);
                    workoutBlocks.push(`|:---:|:---:|:---:|:---:|:---:|`);
                    if (cycleWeek === 4) {
                        workoutBlocks.push(`| Set 1 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 2 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                    } else if (cycleWeek === 1) {
                        workoutBlocks.push(`| Set 1 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 2 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 3 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                    } else {
                        workoutBlocks.push(`| Set 1 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 2 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 3 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🟢 |`);
                        workoutBlocks.push(`| Set 4 | \`${targetGoal.split(" ")[2]} reps\` |  |  | 🔥 |`);
                    }
                    workoutBlocks.push(``); // Leerzeile
                });
            }
        }
    });
    
    // Markdown zusammenbauen
    const fileName = `Workout_${logDate.format("YYYY-MM-DD")}`;
    const folderPath = `0_Calendar/4_Projectlogs/Routine/${year}/${month}`;
    const filePath = `${folderPath}/${fileName}.md`;
    
    let content = `---
arch: ["#4task"]
archtype: ["#4task/workout"]
status: 1active
date: ${logDate.format("YYYY-MM-DD")}
cycle_week: ${cycleWeek}
cssclasses: ["dashboard-no-border"]
---

# 🏋️ Workout Log: ${logDate.format("dddd, MMM Do YYYY")}

> [!info] 📈 **Progressive Overload Tracker & Logging Guide**
> **Phase:** ${phase} | **Intensity:** ${intensity}  
> **Duration Target:** Standard 15 min session (automatically synced to Daily PLM).  
> 
> 💡 **How to Enter Sets in Table:**
> - **Strength / Weights:** \`12 × 15kg\` or \`15 reps\`
> - **Calisthenics (Bodyweight):** \`15 reps (BW)\`
> - **Isometric / Holds:** \`45s hold\`
> - **Running / Cycling / Swimming:** \`5.0 km (25 min)\` or \`Pace 5:00\`
> - **Dancing / Free Flow:** \`20 min Flow\`
> 
> *RIR = Reps in Reserve (Wie viele Wiederholungen hättest du noch geschafft?)*

---

${workoutBlocks.join("\n")}

---
[[${fitPlan.file.path.replace(".md", "")}|➡️ Back to Fitness Plan]]
`;

    // Datei speichern
    // Verschachtelte Ordner sicher anlegen (Routine/YYYY/MM)
    let cPath = "";
    for (const seg of folderPath.split('/')) {
        cPath = cPath === "" ? seg : `${cPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
    }
    
    const existingFile = app.vault.getAbstractFileByPath(filePath);
    if (!existingFile) {
        await app.vault.create(filePath, content);
    }
    // Existing files are NOT overwritten (would wipe your actuals) — but still open + link them.
    const logFile = app.vault.getAbstractFileByPath(filePath);
    if (logFile) await app.workspace.getLeaf('split').openFile(logFile);

    return `[[${fileName}]]`;
}

module.exports = generateWorkoutLog;
