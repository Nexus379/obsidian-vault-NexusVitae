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

    // 1. Auto-detect which plan we are in.
//    Frontmatter first, file name only as a fallback — and case-insensitive,
//    because the weekly files are lowercase ("2026-W31_fitness.md"),
//    while the masters are capitalised ("Fitness_Routine.md", "Meal_Plan.md").
    const nameLc = file.name.toLowerCase();
    const declared = String(fm.plan_type || "").toLowerCase();

    if (declared === "timetable" || Object.keys(fm).some(k => k.startsWith("tt_")) || nameLc.includes("timetable")) {
        prefix = "tt_"; planType = "Timetable";
    } else if (declared === "routine" || Object.keys(fm).some(k => k.startsWith("rt_")) || nameLc.includes("routine")) {
        prefix = "rt_"; planType = "RoutinePlan";
    } else if (declared === "fitness" || Object.keys(fm).some(k => k.startsWith("fit_")) || nameLc.includes("fitness")) {
        prefix = "fit_"; planType = "FitnessPlan";
    } else if (declared === "meal" || fm.hasOwnProperty("mon_brk") || nameLc.includes("meal")) {
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