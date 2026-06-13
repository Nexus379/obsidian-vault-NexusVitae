<%-*
/**
 * 🎒 NEXUS ARSENAL SETUP (Update Profile via UI)
 */
try {
    const profilePath = "zData/4values/Fitness_Profile.md";
    let profileFile = app.vault.getAbstractFileByPath(profilePath);
    
    // Falls die Datei noch nicht existiert, wird sie hiermit heimlich im Hintergrund erstellt
    if (!profileFile) {
        profileFile = await app.vault.create(profilePath, "---\ntraining_phase: \"\"\nfocus_metric: \"\"\nequipment_wearable: []\nequipment_weights: []\n---\n# 🎒 Nexus Arsenal\nProfile data managed by script.");
    }

    // Get current metadata
    const cache = app.metadataCache.getFileCache(profileFile);
    const fm = cache?.frontmatter || {};

    // 1. Update Phase
    const currentPhase = fm.training_phase || "Bodyweight Mastery";
    const newPhase = await tp.system.prompt("🎯 Current Training Phase:", currentPhase);
    if (newPhase === null) return; // User canceled

    // 2. Update Focus
    const currentFocus = fm.focus_metric || "Endurance & Explosive Power";
    const newFocus = await tp.system.prompt("🔬 Current Focus:", currentFocus);
    if (newFocus === null) return;

    // 3. Update Wearables (comma separated)
    const currentWearables = Array.isArray(fm.equipment_wearable) ? fm.equipment_wearable.join(", ") : (fm.equipment_wearable || "");
    const newWearablesStr = await tp.system.prompt("🥋 Wearables (comma separated, leave blank for none):", currentWearables);
    if (newWearablesStr === null) return;

    // 4. Update Weights (comma separated)
    const currentWeights = Array.isArray(fm.equipment_weights) ? fm.equipment_weights.join(", ") : (fm.equipment_weights || "");
    const newWeightsStr = await tp.system.prompt("🪨 External Weights (comma separated, leave blank for none):", currentWeights);
    if (newWeightsStr === null) return;

    // Process strings into clean arrays
    const wearablesArray = newWearablesStr.split(",").map(s => s.trim()).filter(s => s.length > 0);
    const weightsArray = newWeightsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);

    // Save to file cleanly
    await app.fileManager.processFrontMatter(profileFile, (frontmatter) => {
        frontmatter.training_phase = newPhase;
        frontmatter.focus_metric = newFocus;
        frontmatter.equipment_wearable = wearablesArray;
        frontmatter.equipment_weights = weightsArray;
    });

    new Notice("🎒 Nexus Arsenal updated successfully!", 4000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>