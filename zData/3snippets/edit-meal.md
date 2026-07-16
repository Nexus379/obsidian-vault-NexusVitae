<%-*
/**
 * 🍱 NEXUS MEAL EDITOR (Unified Matrix Format)
 */
try {
    const file = tp.config.active_file;  // Datei, in der der Button sitzt (Plan-Master oder Wochenplan)
    if (!file) return;

    const days = [
        {l: "Monday", v: "mon"}, {l: "Tuesday", v: "tue"}, {l: "Wednesday", v: "wed"}, 
        {l: "Thursday", v: "thu"}, {l: "Friday", v: "fri"}, {l: "Saturday", v: "sat"}, {l: "Sunday", v: "sun"}
    ];
    const day = await tp.system.suggester(days.map(d => d.l), days, false, "🗓️ Choose a day:");
    if(!day) return;

    const slots = [
        {l: "🌅 Breakfast", v: "brk"},
        {l: "🍱 Bento", v: "ben"},
        {l: "🥗 Lunch", v: "lun"},
        {l: "🍎 Snack", v: "snk"},
        {l: "🌙 Dinner", v: "eve"}
    ];
    const slot = await tp.system.suggester(slots.map(s => s.l), slots, false, "🍽️ Select Meal Slot:");
    if(!slot) return;

    // Load recipes from the vault
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        new Notice("Dataview API not found.");
        return;
    }
    
    const recipes = dv.pages('"6_Resources/Recipes"').sort(p => p.file.name);
    const recOptions = recipes.map(p => p.file.name).array();
    
    // Add option to clear the slot
    recOptions.unshift("❌ Clear Slot (Rest)");

    const choice = await tp.system.suggester(recOptions, recOptions, false, `🥗 What's for ${slot.l.split(" ")[1]}?`);
    if(!choice) return;

    await app.fileManager.processFrontMatter(file, (fm) => {
        const key = `${day.v}_${slot.v}`;
        if (choice === "❌ Clear Slot (Rest)") {
            fm[key] = [];
        } else {
            const target = recipes.find(p => p.file.name === choice);
            if (target) {
                // Creates a clean Dataview link inside the array
                fm[key] = [`[[${target.file.path}|${choice}]]`];
            }
        }
    });

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>