<%-*
/**
 * 🧬 NEXUS PLAN REPLICATOR (Time-Travel & Smart Copy)
 */
try {
    const dv = app.plugins.plugins.dataview.api;
    const currentKw = moment().format("WW");
    const nextKw = moment().add(1, 'weeks').format("WW");
    const year = moment().format("YYYY");

    // 1. ZIEL-WOCHE ABFRAGEN
    const targetKwInput = await tp.system.prompt("🗓️ Für welche KW möchtest du den Plan erstellen/kopieren?", nextKw);
    if (!targetKwInput) return;
    const targetKw = targetKwInput.padStart(2, '0');

    // 2. MODUL AUSWÄHLEN
    const planOptions = [
        "⏰ Routine & Timeblocking", 
        "🏋️ Fitness Routine", 
        "🎸 Instrumental Practice", 
        "🍱 Meal Plan"
    ];
    const planKeys = ["routine", "fitness", "inpra", "meal"];
    const planType = await tp.system.suggester(planOptions, planKeys, false, "📋 Welchen Plan möchtest du replizieren?");
    if (!planType) return;

    // 3. LETZTEN PLAN SUCHEN (Source)
    const allPlans = app.vault.getMarkdownFiles().filter(f => f.name.includes(`_${planType}`));
    if (allPlans.length === 0) {
        new Notice(`❌ Keine alten ${planType}-Pläne gefunden zum Kopieren!`);
        return;
    }
    // Sortiere absteigend, um den neuesten zu finden
    allPlans.sort((a, b) => b.name.localeCompare(a.name));
    const sourceFile = allPlans[0];
    const sourceCache = app.metadataCache.getFileCache(sourceFile);
    const sourceFm = sourceCache?.frontmatter || {};

    // 4. SMART FILTER: Nur Planungs-Daten kopieren, keine Ausführung!
    const dataToCopy = {};
    for (let key in sourceFm) {
        // Ignoriere Obsidian-interne Felder und reine Ausführungs-Felder (act_, lvl, min)
        if (["position", "arch", "archtype"].includes(key)) continue;
        if (key.startsWith("act_") || key.includes("_lvl") || key.endsWith("_min")) continue;
        
        // Kopiere spezifische Logik-Blöcke
        if (planType === "routine" && key.startsWith("rt_")) dataToCopy[key] = sourceFm[key];
        else if (planType === "fitness" && key.startsWith("fit_")) dataToCopy[key] = sourceFm[key];
        else if (planType === "inpra" && (key.startsWith("instr_") || key.startsWith("inpra_"))) dataToCopy[key] = sourceFm[key];
        else if (planType === "meal" && /^(mon|tue|wed|thu|fri|sat|sun)_/.test(key)) dataToCopy[key] = sourceFm[key];
    }

    // 5. ZIEL-DATEI PRÜFEN ODER ERSTELLEN
    const targetName = `${year}-W${targetKw}_${planType}`;
    const targetFolder = `0_Calendar/7_Plan/${year}/${moment().week(targetKw).format("MM")}`;
    const targetPath = `${targetFolder}/${targetName}.md`;
    
    let targetFile = app.vault.getAbstractFileByPath(targetPath);
    let mode = "overwrite";

    if (targetFile) {
        // Kollisions-Abfrage
        const conflictChoice = await tp.system.suggester(
            ["♻️ Alles überschreiben (Hard Reset)", "➕ Nur Lücken füllen (Ergänzen)"], 
            ["overwrite", "fill"], 
            false, 
            `⚠️ Der Plan für KW ${targetKw} existiert bereits. Was tun?`
        );
        if (!conflictChoice) return;
        mode = conflictChoice;
    } else {
        // Erstelle Ordner, falls nötig
        let curr = "";
        for (const seg of targetFolder.split("/")) {
            curr = curr === "" ? seg : `${curr}/${seg}`;
            if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
        }
        
        // Hole das Template
        const tmplMap = { routine: "weekplan_routine", fitness: "weekplan_fitness", inpra: "weekplan_inpra", meal: "weekplan_meal" };
        const tmplFile = app.vault.getAbstractFileByPath(`zData/1tmpl/0calendar/${tmplMap[planType]}.md`);
        if (!tmplFile) { new Notice("❌ Template fehlt im zData-Ordner!"); return; }
        
        targetFile = await app.vault.copy(tmplFile, targetPath);
        await new Promise(r => setTimeout(r, 200)); // Kurz warten, bis Obsidian die Datei registriert
    }

    // 6. DATEN INFIZIEREN (Schreibe YAML)
    await app.fileManager.processFrontMatter(targetFile, (fm) => {
        for (let key in dataToCopy) {
            if (mode === "overwrite") {
                fm[key] = dataToCopy[key];
            } else if (mode === "fill") {
                // Nur einfügen, wenn das Feld in der neuen Datei noch leer ist
                if (!fm[key] || fm[key] === "free" || fm[key] === "") {
                    fm[key] = dataToCopy[key];
                }
            }
        }
    });

    // 7. FERTIG! DATEI ÖFFNEN
    new Notice(`✅ ${planType.toUpperCase()} erfolgreich für KW ${targetKw} repliziert!`);
    app.workspace.getLeaf('tab').openFile(targetFile);

} catch(e) {
    new Notice("🔥 Fehler beim Replizieren: " + e.message, 10000);
}
-%>