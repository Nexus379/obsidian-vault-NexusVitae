async function generateWorkoutLog(app, dv, moment) {
    let logDateStr = dv.current().cal_date;
    
    // Wenn manuell aus dem Fitness Hub gestartet, frage nach dem Datum!
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let userInput = await tp.system.prompt("📅 Für welches Datum soll das Workout-Log sein? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
        if (!userInput) return null; // Abgebrochen
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
    
    // Finde heutige Übungen
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
                    let schema = parts.slice(1).join(" ") || "3 sets";
                    
                    let nameStr = baseKey;
                    if (engine && engine.all && engine.all[baseKey]) {
                        nameStr = `${engine.all[baseKey].icon} **${engine.all[baseKey].label}**`;
                    } else if (baseKey === "custom") {
                        nameStr = `❓ **${parts.slice(1).join(" ")}**`;
                        schema = "Custom";
                    }
                    
                    workoutBlocks.push(`#### ${nameStr}`);
                    workoutBlocks.push(`| Target | Set 1 | Set 2 | Set 3 | Set 4 | Set 5 |`);
                    workoutBlocks.push(`|:---:|:---:|:---:|:---:|:---:|:---:|`);
                    workoutBlocks.push(`| \`${schema}\` |  |  |  |  |  |`);
                    workoutBlocks.push(``); // Leerzeile
                });
            }
        }
    });
    
    if (!hasExercises) return null; // Rest Day -> return null
    
    // Cycle berechnen
    const w = fitPlan.training_week || 1;
    const cycleWeek = ((w - 1) % 4) + 1;
    let phase = "";
    let intensity = "";
    
    if (cycleWeek === 1) { phase = "🌱 Foundation Phase"; intensity = "70% (RIR: 3)"; }
    else if (cycleWeek === 2) { phase = "⚙️ Volume Phase"; intensity = "80% (RIR: 2)"; }
    else if (cycleWeek === 3) { phase = "🔥 Overreach Phase"; intensity = "90% (RIR: 1)"; }
    else if (cycleWeek === 4) { phase = "🔋 Deload Phase"; intensity = "60% (RIR: 4)"; }
    
    // Markdown zusammenbauen
    const fileName = `Workout_${logDate.format("YYYY-MM-DD")}`;
    const folderPath = "0_Calendar/4_Projectlogs/Workouts";
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

> [!info] 📈 **Progressive Overload Tracker**
> **Phase:** ${phase}  
> **Intensity:** ${intensity}  
> *RIR = Reps in Reserve (Wie viele Wiederholungen hättest du noch geschafft?)*

---

${workoutBlocks.join("\n")}

---
[[${fitPlan.file.path.replace(".md", "")}|➡️ Back to Fitness Plan]]
`;

    // Datei speichern
    const abstractFolder = app.vault.getAbstractFileByPath(folderPath);
    if (!abstractFolder) {
        await app.vault.createFolder(folderPath);
    }
    
    const existingFile = app.vault.getAbstractFileByPath(filePath);
    if (!existingFile) {
        await app.vault.create(filePath, content);
    } else {
        // Falls die Datei schon existiert, nicht überschreiben (sonst gehen Actuals verloren)
        // Aber trotzdem den Link zurückgeben
    }
    
    return `[[${fileName}]]`;
}

module.exports = generateWorkoutLog;
