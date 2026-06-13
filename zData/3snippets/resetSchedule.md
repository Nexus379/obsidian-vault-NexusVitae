<%-*
/**
 * 🧹 NEXUS SCHEDULE RESET (Smart Master Clear v3)
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};
    let prefix = "";
    let planType = "";

    // 1. Auto-detect which plan we are in
    if (fm.hasOwnProperty("tt_start") || Object.keys(fm).some(k => k.startsWith("tt_"))) {
        prefix = "tt_"; planType = "Timetable";
    } else if (fm.hasOwnProperty("rt_start") || Object.keys(fm).some(k => k.startsWith("rt_"))) {
        prefix = "rt_"; planType = "RoutinePlan";
    } else if (Object.keys(fm).some(k => k.startsWith("fit_")) || file.name.includes("Fitness")) {
        prefix = "fit_"; planType = "FitnessPlan";
    } else if (fm.hasOwnProperty("mon_brk") || file.name.includes("Meal")) {
        prefix = ""; planType = "MealPlan"; // Meal Plan uses direct days (mon_brk)
    } else {
        new Notice("❌ This is not a recognized Nexus Plan.");
        return;
    }

    // 2. Selection menu
    const options = [
        { label: "🚨 CLEAR ENTIRE WEEK", value: "all" },
        { label: "Clear Monday", value: "mon" },
        { label: "Clear Tuesday", value: "tue" },
        { label: "Clear Wednesday", value: "wed" },
        { label: "Clear Thursday", value: "thu" },
        { label: "Clear Friday", value: "fri" },
        { label: "Clear Saturday", value: "sat" },
        { label: "Clear Sunday", value: "sun" }
    ];

    const choice = await tp.system.suggester(options.map(o => o.label), options, false, `🧹 Clear entries in ${planType}?`);
    if (!choice) return;

    // 3. Safety check for "Clear All"
    if (choice.value === "all") {
        const confirm = await tp.system.prompt(`Are you sure you want to clear ALL entries in ${planType}? (Yes/No)`, "No");
        if (confirm === null || confirm.toLowerCase() !== "yes") {
            new Notice("Reset cancelled.");
            return;
        }
    }

    // 4. Safely process the YAML based on Plan Type
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        const daysRegex = choice.value === "all" ? "(mon|tue|wed|thu|fri|sat|sun)" : choice.value;
        const targetPattern = new RegExp(`^${prefix}${daysRegex}_`);
        
        // Slots that need to be reset to [] in the Meal Plan
        const mealListKeys = ["brk", "ben", "lun", "snk", "eve", "add", "rem"];

        for (let key in frontmatter) {
            if (targetPattern.test(key)) {
                
                if (planType === "MealPlan") {
                    // Meal plans need arrays for slots, delete the rest (macros)
                    if (mealListKeys.some(slot => key.endsWith(`_${slot}`))) {
                        frontmatter[key] = [];
                    } else {
                        delete frontmatter[key];
                    }
                } else {
                    // For Timetable, Routine, Fitness: just delete the key entirely
                    delete frontmatter[key];
                }
                
            }
        }
    });

    const dayStr = choice.value === "all" ? "Entire week" : choice.value.charAt(0).toUpperCase() + choice.value.slice(1);
    new Notice(`✅ ${planType}: ${dayStr} cleared!`);

} catch(e) {
    new Notice("🔥 Error during reset: " + e.message, 10000);
}
-%>