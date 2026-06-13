<%-*
/**
 * 🏋️ NEXUS FITNESS EDITOR (Smart Prompts: Reps vs. Time)
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // 1. Choose Day
    const days = [
        {l: "Monday", v: "mon"}, {l: "Tuesday", v: "tue"}, {l: "Wednesday", v: "wed"}, 
        {l: "Thursday", v: "thu"}, {l: "Friday", v: "fri"}, {l: "Saturday", v: "sat"}, {l: "Sunday", v: "sun"}
    ];
    const day = await tp.system.suggester(days.map(d => d.l), days, false, "🗓️ Choose a day:");
    if(!day) return;

    // 2. Choose Target Region
    const regions = [
        {l: "🤸 Warmup & Mobility", v: "mobility"},
        {l: "💪 Upper Body", v: "upper"},
        {l: "🦵 Lower Body", v: "lower"},
        {l: "🪨 Core & Abs", v: "core"},
        {l: "🔥 Cardio & Flow", v: "cardio"}
    ];
    const region = await tp.system.suggester(regions.map(r => r.l), regions, false, "🎯 Select Target Region:");
    if(!region) return;

    // 3. Load Engine & Filter Exercises
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
    const engine = require(enginePath)();
    const availableExercises = engine.getByRegion(region.v);

    const options = availableExercises.map(ex => ({
        label: `${ex.icon} ${ex.label} (${ex.persona})`,
        value: ex.key
    }));

    options.unshift({label: "❌ Clear Slot (Rest)", value: "free"});
    options.push({label: "✍️ Enter Custom Exercise", value: "custom"});

    const choice = await tp.system.suggester(options.map(o => o.label), options, false, `🏋️ Select ${region.l} workout:`);
    if(!choice) return;

    let finalValue = choice.value;

    // 4. SMART INPUT: Detect if exercise is time-based
    if (finalValue !== "free" && finalValue !== "custom") {
        const isTimeBased = region.v === "mobility" || finalValue.includes("plank") || finalValue.includes("hold") || finalValue.includes("isometric") || finalValue.includes("stance");
        
        let metric, weight;
        if (isTimeBased) {
            metric = await tp.system.prompt("⏱️ Duration / Sets x Time (e.g. 60s, 3x45s):");
            weight = await tp.system.prompt("⚖️ Additional weight? (Leave blank if bodyweight):");
        } else {
            metric = await tp.system.prompt("🔄 Sets x Reps (e.g. 3x10, 5x5):");
            weight = await tp.system.prompt("⚖️ Weight in kg (e.g. 20, 50 or leave blank):");
        }
        
        let details = [];
        if (metric) details.push(metric);
        if (weight) details.push(weight.endsWith("kg") ? weight : weight + "kg");
        
        if (details.length > 0) {
            finalValue = `${finalValue}|${details.join("|")}`;
        }
    } else if (finalValue === "custom") {
        const customEx = await tp.system.prompt("Custom exercise (e.g. 'Yoga Flow 30m'):");
        if (!customEx) return;
        finalValue = `custom|${customEx}`;
    }

    // 5. Save to YAML (Allows stacking multiple exercises)
    await app.fileManager.processFrontMatter(file, (fm) => {
        const key = `fit_${day.v}_${region.v}`;
        if (choice.value === "free") {
            delete fm[key];
        } else {
            if (!fm[key]) {
                fm[key] = [finalValue];
            } else {
                let current = Array.isArray(fm[key]) ? fm[key] : [fm[key]];
                current.push(finalValue);
                fm[key] = current;
            }
        }
    });

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>