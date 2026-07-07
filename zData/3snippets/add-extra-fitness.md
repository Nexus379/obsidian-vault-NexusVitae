<%-*
/**
 * 🏋️ NEXUS EXTRA FITNESS LOGGER
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // 1. Load Engine & Get All Exercises
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
    const engine = require(enginePath)();
    const allExercises = engine.getLabels();

    const options = allExercises.map(ex => ({
        label: `${ex.icon} ${ex.label} (${ex.persona})`,
        value: ex.label,
        icon: ex.icon
    }));

    options.push({label: "✍️ Custom Exercise...", value: "custom", icon: "✍️"});

    const choice = await tp.system.suggester(options.map(o => o.label), options, false, "🔥 Select Extra Workout:");
    if(!choice) return;

    let finalName = choice.value;
    let finalIcon = choice.icon;

    if (finalName === "custom") {
        finalName = await tp.system.prompt("Custom Exercise Name:");
        if (!finalName) return;
        finalIcon = "⚡";
    }

    // 2. Ask for details
    const details = await tp.system.prompt("⏱️ Duration or 🔄 Sets x Reps (e.g. 45m, 3x10):");
    if (!details) return;
    
    // 3. Ask for the Day
    const days = [
        { label: "Monday", id: "**Monday**" },
        { label: "Tuesday", id: "**Tuesday**" },
        { label: "Wednesday", id: "**Wednesday**" },
        { label: "Thursday", id: "**Thursday**" },
        { label: "Friday", id: "**Friday**" },
        { label: "Saturday", id: "**Saturday**" },
        { label: "Sunday", id: "**Sunday**" }
    ];
    const chosenDay = await tp.system.suggester(days.map(d => d.label), days, false, "🗓️ On which day did you do this extra workout?");
    if (!chosenDay) return;

    // 4. Inject into the Markdown Table
    const content = await app.vault.read(file);
    const newRow = `> | *${chosenDay.label} (Extra)* | ${finalIcon} **${finalName}** | ${details} | ✅ |`;
    
    // We look for the line containing the chosen day in the table
    // Example: > | **Monday** | `INPUT[text:mon_plan]` ...
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`| ${chosenDay.id} |`)) {
            // Insert the new row right below this day
            lines.splice(i + 1, 0, newRow);
            break;
        }
    }
    
    const newContent = lines.join("\n");
    await app.vault.modify(file, newContent);
    new Notice("🔥 Extra Workout added to the table!", 3000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>
