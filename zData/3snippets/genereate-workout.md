<%-*
/**
 * 🎲 NEXUS SMART COACH (Hybrid Athlete & Functional Focus)
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // 1. CHOOSE SCOPE
    const scopes = [
        {l: "🎯 Single Workout", v: "single"},
        {l: "🧩 Fill Empty Days (Keep existing)", v: "fill"},
        {l: "🧬 Generate Full Week (Overwrite)", v: "overwrite"}
    ];
    const scope = await tp.system.suggester(scopes.map(s => s.l), scopes, false, "🤖 Nexus Coach: Select scope:");
    if(!scope) return;

    // Load Engine
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
    try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
    const engine = require(enginePath)();

    const currentFm = app.metadataCache.getFileCache(file)?.frontmatter || {};
    const tWeek = currentFm.training_week || 1;

    // 🧠 SMART HELPER: Exercise logic (Sets vs Seconds) & PROGRESSIVE OVERLOAD
    const workoutFiles = app.vault.getFiles().filter(f => f.path.startsWith("0_Calendar/4_Projectlogs/Workouts/Workout_")).sort((a,b) => b.name.localeCompare(a.name));

    const getWorkout = async (region, volume, defaultSets) => {
        let available = engine.getByRegion(region);
        let shuffled = available.sort(() => 0.5 - Math.random());
        
        let results = [];
        for (let ex of shuffled.slice(0, volume)) {
            let metric = defaultSets; 
            if (ex.baseTime) {
                let extraTime = (tWeek - 1) * 2; // Steigerung: 2 Min pro Woche
                metric = `${ex.baseTime + extraTime} Min.`;
            } else if (region === "mobility") {
                metric = "Dynamic Warmup";
            } else if (ex.key.includes("plank") || ex.key.includes("hold") || ex.key.includes("isometric") || ex.key.includes("stance")) {
                metric = "3x45s Hold";
            } else {
                // HISTORY PARSING FOR PROGRESSIVE OVERLOAD
                let targetReps = 0;
                let isAmrap = metric.includes("AMRAP");
                if (!isAmrap) {
                    let cleanMetric = metric.replace(/\D+$/, "").trim(); // remove trailing text like "(Explosive)"
                    if (cleanMetric.includes("x")) {
                        let parts = cleanMetric.split("x");
                        if (parts.length === 2 && !isNaN(parseInt(parts[0])) && !isNaN(parseInt(parts[1]))) {
                            targetReps = parseInt(parts[0]) * parseInt(parts[1]);
                        }
                    } else if (!isNaN(parseInt(cleanMetric))) {
                        targetReps = parseInt(cleanMetric);
                    }
                }
                
                let overloadStatus = "";
                if (targetReps > 0 || isAmrap) {
                    for (let i = 0; i < Math.min(5, workoutFiles.length); i++) {
                        let wContent = await app.vault.read(workoutFiles[i]);
                        if (wContent.includes(ex.key)) {
                            let lines = wContent.split("\n");
                            let inEx = false;
                            let totalAchieved = 0;
                            let hasEntry = false;
                            for (let l of lines) {
                                if (l.startsWith("####") && l.includes(ex.key)) { inEx = true; continue; }
                                if (l.startsWith("####") && inEx) break;
                                if (inEx && l.startsWith("|") && !l.includes("Target") && !l.includes(":---:")) {
                                    let cells = l.split("|").slice(2, -1);
                                    for (let c of cells) {
                                        let reps = parseInt(c.trim());
                                        if (!isNaN(reps)) {
                                            totalAchieved += reps;
                                            hasEntry = true;
                                        }
                                    }
                                }
                            }
                            if (hasEntry) {
                                if (isAmrap) {
                                    if (totalAchieved >= 50) overloadStatus = " (⬆️ LvlUp!)";
                                    else overloadStatus = " (✅ Solid)";
                                } else {
                                    if (totalAchieved > targetReps) overloadStatus = " (⬆️ LvlUp!)";
                                    else if (totalAchieved === targetReps) overloadStatus = " (✅ Target Reached)";
                                    else overloadStatus = " (⚠️ Keep Working)";
                                }
                            }
                            break;
                        }
                    }
                }
                if (overloadStatus !== "") metric += overloadStatus;
            }
            results.push(`${ex.key}|${metric}`);
        }
        return results;
    };

    // ==========================================
    // PATH A: SINGLE WORKOUT
    // ==========================================
    if (scope.v === "single") {
        const days = [{l: "Mon", v: "mon"}, {l: "Tue", v: "tue"}, {l: "Wed", v: "wed"}, {l: "Thu", v: "thu"}, {l: "Fri", v: "fri"}, {l: "Sat", v: "sat"}, {l: "Sun", v: "sun"}];
        const day = await tp.system.suggester(days.map(d => d.l), days, false, "🗓️ Choose day:");
        if(!day) return;

        const regions = [{l: "💪 Upper Body", v: "upper"}, {l: "🦵 Lower Body", v: "lower"}, {l: "🪨 Core", v: "core"}, {l: "🔥 Cardio", v: "cardio"}, {l: "🤸 Mobility", v: "mobility"}];
        const region = await tp.system.suggester(regions.map(r => r.l), regions, false, "🎯 Target Region:");
        if(!region) return;

        // HYBRID FOCUS GOALS
        const goals = [
            {l: "🧱 Max Strength (CNS Power, 5x5)", sets: "5x5"},
            {l: "🏃 Endurance & Conditioning (3x15)", sets: "3x15"},
            {l: "⚡ Explosive Power (Speed, 3x8)", sets: "3x8"},
            {l: "⏱️ Time-Based (Flow/Holds)", sets: "60s"},
            {l: "🏋️ Functional Hypertrophy (Optional, 3x10)", sets: "3x10"}
        ];
        const goal = await tp.system.suggester(goals.map(g => g.l), goals, false, "🔬 Select Functional Focus:");
        if(!goal) return;

        const volChoice = await tp.system.suggester(["2 (Quick)", "3 (Standard)", "4 (Advanced)", "5 (Full Volume)"], [2, 3, 4, 5], false, "🔢 Exercises amount?");
        if(!volChoice) return;

        let finalRoutine = await getWorkout(region.v, volChoice, goal.sets);
        let finalWarmup = null;
        if (region.v !== "mobility") {
            finalWarmup = await getWorkout("mobility", 2, "Warmup");
        }
        
        await app.fileManager.processFrontMatter(file, (fm) => {
            fm[`fit_${day.v}_${region.v}`] = finalRoutine; 
            // Auto-Warmup injection for single day
            if (finalWarmup) {
                fm[`fit_${day.v}_mobility`] = finalWarmup;
            }
        });
        new Notice(`🎲 Generated functional workout + Warmup for ${day.l}!`, 4000);
        return;
    }

    // ==========================================
    // PATH B: WEEKLY SPLITS
    // ==========================================
    const splits = [
        {l: "⚔️ The Hybrid Athlete (Strength + Endless Stamina)", v: "hybrid"},
        {l: "🐉 Bruce Lee Flow (Core, Martial Arts, Explosive Power)", v: "bruce_lee"},
        {l: "⚖️ Upper/Lower (Functional Baseline Strength)", v: "upper_lower"},
        {l: "🦍 Functional Hypertrophy (Optional Mass Focus)", v: "hypertrophy"}
    ];
    const splitChoice = await tp.system.suggester(splits.map(s => s.l), splits, false, "🧬 Select Weekly Plan:");
    if(!splitChoice) return;

    const regionsAll = ["mobility", "upper", "lower", "core", "cardio"];
    const isDayOccupied = (d) => regionsAll.some(r => currentFm[`fit_${d}_${r}`] && currentFm[`fit_${d}_${r}`] !== "free" && currentFm[`fit_${d}_${r}`].length > 0);

    let newFmValues = {};
    const applyDay = async (d, planFn) => {
        if (scope.v === "fill" && isDayOccupied(d)) return; 
        
        regionsAll.forEach(r => newFmValues[`fit_${d}_${r}`] = null);
        
        await planFn(newFmValues, d);
        
        if (newFmValues[`fit_${d}_upper`] || newFmValues[`fit_${d}_lower`] || newFmValues[`fit_${d}_cardio`]) {
            newFmValues[`fit_${d}_mobility`] = await getWorkout("mobility", 2, "Warmup");
        }
    };

    // 1. THE HYBRID ATHLETE (Default)
    if (splitChoice.v === "hybrid") {
        await applyDay("mon", async (f) => { f["fit_mon_upper"] = await getWorkout("upper", 3, "5x5"); f["fit_mon_cardio"] = await getWorkout("cardio", 2, "HIIT"); });
        await applyDay("tue", async (f) => { f["fit_tue_lower"] = await getWorkout("lower", 4, "3x15"); f["fit_tue_core"] = await getWorkout("core", 2, "3x15"); });
        await applyDay("wed", async (f) => { f["fit_wed_mobility"] = await getWorkout("mobility", 4, "Flow & Recovery"); });
        await applyDay("thu", async (f) => { f["fit_thu_lower"] = await getWorkout("lower", 3, "5x5"); }); 
        await applyDay("fri", async (f) => { f["fit_fri_upper"] = await getWorkout("upper", 3, "3x15"); f["fit_fri_cardio"] = await getWorkout("cardio", 3, "Endurance"); });
        await applyDay("sat", async (f) => { f["fit_sat_core"] = await getWorkout("core", 3, "Explosive"); f["fit_sat_mobility"] = await getWorkout("mobility", 2, "Flow"); });
        await applyDay("sun", async (f) => {}); 
    }
    // 2. BRUCE LEE FLOW
    else if (splitChoice.v === "bruce_lee") {
        await applyDay("mon", async (f) => { f["fit_mon_core"] = await getWorkout("core", 3, "AMRAP 60s"); f["fit_mon_cardio"] = await getWorkout("cardio", 2, "Sprint/HIIT"); });
        await applyDay("tue", async (f) => { f["fit_tue_upper"] = await getWorkout("upper", 3, "AMRAP 60s (Explosive)"); });
        await applyDay("wed", async (f) => { f["fit_wed_lower"] = await getWorkout("lower", 3, "3x15"); f["fit_wed_core"] = await getWorkout("core", 2, "Isometric"); });
        await applyDay("thu", async (f) => { f["fit_thu_mobility"] = await getWorkout("mobility", 4, "Tai Chi Flow"); });
        await applyDay("fri", async (f) => { f["fit_fri_upper"] = await getWorkout("upper", 2, "3x10"); f["fit_fri_cardio"] = await getWorkout("cardio", 2, "Endurance"); });
        await applyDay("sat", async (f) => { f["fit_sat_core"] = await getWorkout("core", 3, "Max Hold"); f["fit_sat_lower"] = await getWorkout("lower", 2, "Kicks"); });
        await applyDay("sun", async (f) => {});
    }
    // 3. UPPER/LOWER (Functional)
    else if (splitChoice.v === "upper_lower") {
        await applyDay("mon", async (f) => { f["fit_mon_upper"] = await getWorkout("upper", 4, "5x5"); });
        await applyDay("tue", async (f) => { f["fit_tue_lower"] = await getWorkout("lower", 4, "5x5"); });
        await applyDay("wed", async (f) => { f["fit_wed_mobility"] = await getWorkout("mobility", 4, "Active Rest"); });
        await applyDay("thu", async (f) => { f["fit_thu_upper"] = await getWorkout("upper", 4, "3x8 (Explosive)"); });
        await applyDay("fri", async (f) => { f["fit_fri_lower"] = await getWorkout("lower", 4, "3x8 (Explosive)"); });
        await applyDay("sat", async (f) => { f["fit_sat_core"] = await getWorkout("core", 2, "3x15"); f["fit_sat_cardio"] = await getWorkout("cardio", 2, "LISS"); });
        await applyDay("sun", async (f) => {}); 
    }
    // 4. FUNCTIONAL HYPERTROPHY
    else if (splitChoice.v === "hypertrophy") {
        await applyDay("mon", async (f) => { f["fit_mon_upper"] = await getWorkout("upper", 4, "4x8"); }); 
        await applyDay("tue", async (f) => { f["fit_tue_lower"] = await getWorkout("lower", 4, "4x8"); }); 
        await applyDay("wed", async (f) => { f["fit_wed_mobility"] = await getWorkout("mobility", 3, "Flow"); }); 
        await applyDay("thu", async (f) => { f["fit_thu_upper"] = await getWorkout("upper", 4, "3x12"); }); 
        await applyDay("fri", async (f) => { f["fit_fri_lower"] = await getWorkout("lower", 4, "3x12"); }); 
        await applyDay("sat", async (f) => { f["fit_sat_core"] = await getWorkout("core", 3, "3x15"); }); 
        await applyDay("sun", async (f) => {}); 
    }

    // Apply frontmatter safely
    await app.fileManager.processFrontMatter(file, (fm) => {
        for (let key in newFmValues) {
            if (newFmValues[key] === null) {
                delete fm[key];
            } else {
                fm[key] = newFmValues[key];
            }
        }
    });

    new Notice("🧬 Hybrid Coach Schedule Updated (with Auto-Warmup)!", 5000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>