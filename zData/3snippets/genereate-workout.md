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
    const engine = require(enginePath)();

    const currentFm = app.metadataCache.getFileCache(file)?.frontmatter || {};
    const tWeek = currentFm.training_week || 1;

    // 🧠 SMART HELPER: Exercise logic (Sets vs Seconds)
    const getWorkout = (region, volume, defaultSets) => {
        let available = engine.getByRegion(region);
        let shuffled = available.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, volume).map(ex => {
            let metric = defaultSets; 
            if (region === "mobility") metric = "Dynamic Warmup";
            else if (ex.key.includes("plank") || ex.key.includes("hold") || ex.key.includes("isometric") || ex.key.includes("stance")) {
                metric = "3x45s Hold";
            } else if (ex.baseTime) {
                let extraTime = (tWeek - 1) * 2; // Steigerung: 2 Min pro Woche
                metric = `${ex.baseTime + extraTime} Min.`;
            }
            return `${ex.key}|${metric}`;
        });
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

        let finalRoutine = getWorkout(region.v, volChoice, goal.sets);
        
        await app.fileManager.processFrontMatter(file, (fm) => {
            fm[`fit_${day.v}_${region.v}`] = finalRoutine; 
            // Auto-Warmup injection for single day
            if (region.v !== "mobility") {
                fm[`fit_${day.v}_mobility`] = getWorkout("mobility", 2, "Warmup");
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

    await app.fileManager.processFrontMatter(file, (fm) => {
        const regionsAll = ["mobility", "upper", "lower", "core", "cardio"];
        const isDayOccupied = (d) => regionsAll.some(r => fm[`fit_${d}_${r}`] && fm[`fit_${d}_${r}`] !== "free" && fm[`fit_${d}_${r}`].length > 0);

        const applyDay = (d, planFn) => {
            if (scope.v === "fill" && isDayOccupied(d)) return; 
            regionsAll.forEach(r => delete fm[`fit_${d}_${r}`]);
            
            planFn(fm, d);
            
            if (fm[`fit_${d}_upper`] || fm[`fit_${d}_lower`] || fm[`fit_${d}_cardio`]) {
                fm[`fit_${d}_mobility`] = getWorkout("mobility", 2, "Warmup");
            }
        };

        // 1. THE HYBRID ATHLETE (Default)
        if (splitChoice.v === "hybrid") {
            applyDay("mon", (f) => { f["fit_mon_upper"] = getWorkout("upper", 3, "5x5"); f["fit_mon_cardio"] = getWorkout("cardio", 2, "HIIT"); });
            applyDay("tue", (f) => { f["fit_tue_lower"] = getWorkout("lower", 4, "3x15"); f["fit_tue_core"] = getWorkout("core", 2, "3x15"); });
            applyDay("wed", (f) => f["fit_wed_mobility"] = getWorkout("mobility", 4, "Flow & Recovery"));
            applyDay("thu", (f) => f["fit_thu_lower"] = getWorkout("lower", 3, "5x5")); 
            applyDay("fri", (f) => { f["fit_fri_upper"] = getWorkout("upper", 3, "3x15"); f["fit_fri_cardio"] = getWorkout("cardio", 3, "Endurance"); });
            applyDay("sat", (f) => { f["fit_sat_core"] = getWorkout("core", 3, "Explosive"); f["fit_sat_mobility"] = getWorkout("mobility", 2, "Flow"); });
            applyDay("sun", (f) => {}); 
        }
        // 2. BRUCE LEE FLOW
        else if (splitChoice.v === "bruce_lee") {
            applyDay("mon", (f) => { f["fit_mon_core"] = getWorkout("core", 3, "3x15"); f["fit_mon_cardio"] = getWorkout("cardio", 2, "Sprint/HIIT"); });
            applyDay("tue", (f) => { f["fit_tue_upper"] = getWorkout("upper", 3, "Explosive"); });
            applyDay("wed", (f) => { f["fit_wed_lower"] = getWorkout("lower", 3, "3x15"); f["fit_wed_core"] = getWorkout("core", 2, "Isometric"); });
            applyDay("thu", (f) => f["fit_thu_mobility"] = getWorkout("mobility", 4, "Tai Chi Flow"));
            applyDay("fri", (f) => { f["fit_fri_upper"] = getWorkout("upper", 2, "3x10"); f["fit_fri_cardio"] = getWorkout("cardio", 2, "Endurance"); });
            applyDay("sat", (f) => { f["fit_sat_core"] = getWorkout("core", 3, "Max Hold"); f["fit_sat_lower"] = getWorkout("lower", 2, "Kicks"); });
            applyDay("sun", (f) => {});
        }
        // 3. UPPER/LOWER (Functional)
        else if (splitChoice.v === "upper_lower") {
            applyDay("mon", (f) => f["fit_mon_upper"] = getWorkout("upper", 4, "5x5"));
            applyDay("tue", (f) => f["fit_tue_lower"] = getWorkout("lower", 4, "5x5"));
            applyDay("wed", (f) => f["fit_wed_mobility"] = getWorkout("mobility", 4, "Active Rest"));
            applyDay("thu", (f) => f["fit_thu_upper"] = getWorkout("upper", 4, "3x8 (Explosive)"));
            applyDay("fri", (f) => f["fit_fri_lower"] = getWorkout("lower", 4, "3x8 (Explosive)"));
            applyDay("sat", (f) => { f["fit_sat_core"] = getWorkout("core", 2, "3x15"); f["fit_sat_cardio"] = getWorkout("cardio", 2, "LISS"); });
            applyDay("sun", (f) => {}); 
        }
        // 4. FUNCTIONAL HYPERTROPHY
        else if (splitChoice.v === "hypertrophy") {
            applyDay("mon", (f) => f["fit_mon_upper"] = getWorkout("upper", 4, "4x8")); 
            applyDay("tue", (f) => f["fit_tue_lower"] = getWorkout("lower", 4, "4x8")); 
            applyDay("wed", (f) => f["fit_wed_mobility"] = getWorkout("mobility", 3, "Flow")); 
            applyDay("thu", (f) => f["fit_thu_upper"] = getWorkout("upper", 4, "3x12")); 
            applyDay("fri", (f) => f["fit_fri_lower"] = getWorkout("lower", 4, "3x12")); 
            applyDay("sat", (f) => f["fit_sat_core"] = getWorkout("core", 3, "3x15")); 
            applyDay("sun", (f) => {}); 
        }
    });

    new Notice("🧬 Hybrid Coach Schedule Updated (with Auto-Warmup)!", 5000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>