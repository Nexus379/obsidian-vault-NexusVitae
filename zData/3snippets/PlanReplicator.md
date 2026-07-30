<%-*
/**
 * 🧬 NEXUS PLAN REPLICATOR (Time-Travel & Smart Copy)
 */
try {
    const dv = app.plugins.plugins.dataview.api;
    const currentKw = moment().format("WW");
    const nextKw = moment().add(1, 'weeks').format("WW");
    const year = moment().format("YYYY");
    const renderWeekplan = (raw, values) => {
        let out = raw
            .replace(/^<%-?\*[\s\S]*?-%>\s*/, "")
            .replace(/^<%-?\*[\s\S]*?%>\s*/, "");

        const replacements = {
            dateStr: values.dateStr,
            energy: values.energy,
            year: values.year,
            kw: values.kw,
            planYear: values.year,
            planKw: values.kw,
            displayTitle: `${values.year}-W${values.kw}_${values.planType}`,
            currentWeek: values.currentWeek || 1
        };

        for (const [key, value] of Object.entries(replacements)) {
            out = out.replace(new RegExp(`<%-\\s*${key}\\s*%>`, "g"), String(value));
        }

        out = out.replace(
            /<%-\s*tp\.variables\.title\s*\|\|\s*\([^%]+?_'?\s*\+\s*[^%]+?\)\s*%>/g,
            `${values.year}-W${values.kw}_${values.planType}`
        );
        out = out.replace(
            /<%-\s*tp\.variables\.title\s*\|\|\s*\([^%]+?_(routine|meal)'\)\s*%>/g,
            `${values.year}-W${values.kw}_${values.planType}`
        );

        return out;
    };

    // 1. ASK FOR THE TARGET WEEK
    const targetKwInput = await tp.system.prompt("🗓️ Which calendar week should the plan be created/copied for?", nextKw);
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
    const planType = await tp.system.suggester(planOptions, planKeys, false, "📋 Which plan do you want to replicate?");
    if (!planType) return;

    // 3. LETZTEN PLAN SUCHEN (Source)
    const allPlans = app.vault.getMarkdownFiles().filter(f => f.name.includes(`_${planType}`));
    if (allPlans.length === 0) {
        new Notice(`❌ No earlier ${planType} plans found to copy from!`);
        return;
    }
// Sort descending to find the newest one
    allPlans.sort((a, b) => b.name.localeCompare(a.name));
    const sourceFile = allPlans[0];
    const sourceCache = app.metadataCache.getFileCache(sourceFile);
    const sourceFm = sourceCache?.frontmatter || {};

// 4. SMART FILTER: copy planning data only, never the execution values
    const dataToCopy = {};
    for (let key in sourceFm) {
// Ignore Obsidian-internal fields and pure execution fields (act_, lvl, min)
        if (["position", "arch", "archtype"].includes(key)) continue;
        if (planType === "inpra" && key.startsWith("inpra_")) {
            dataToCopy[key] = sourceFm[key];
            continue;
        }
        if (key.startsWith("act_") || key.includes("_lvl") || key.endsWith("_min")) continue;
        
        // Kopiere spezifische Logik-Blöcke
        if (planType === "routine" && key.startsWith("rt_")) dataToCopy[key] = sourceFm[key];
        else if (planType === "fitness" && key.startsWith("fit_")) dataToCopy[key] = sourceFm[key];
        else if (planType === "meal" && /^(mon|tue|wed|thu|fri|sat|sun)_/.test(key)) dataToCopy[key] = sourceFm[key];
    }

    // 5. CHECK OR CREATE THE TARGET FILE
    const targetMoment = moment(`${year}-W${targetKw}`, "YYYY-[W]WW").startOf("isoWeek");
    const targetName = `${year}-W${targetKw}_${planType}`;
    const targetFolder = `0_Calendar/7_Plan/${year}/${targetMoment.format("MM")}`;
    const targetPath = `${targetFolder}/${targetName}.md`;
    
    let targetFile = app.vault.getAbstractFileByPath(targetPath);
    let mode = "overwrite";

    if (targetFile) {
        // Collision prompt
        const conflictChoice = await tp.system.suggester(
            ["♻️ Overwrite everything (hard reset)", "➕ Fill the gaps only"], 
            ["overwrite", "fill"], 
            false, 
            `⚠️ The plan for week ${targetKw} already exists. What now?`
        );
        if (!conflictChoice) return;
        mode = conflictChoice;
    } else {
        // Create the folder if needed
        let curr = "";
        for (const seg of targetFolder.split("/")) {
            curr = curr === "" ? seg : `${curr}/${seg}`;
            if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
        }
        
// Fetch the template
        const tmplMap = { routine: "weekplan_routine", fitness: "weekplan_fitness", inpra: "weekplan_inpra", meal: "weekplan_meal" };
        const tmplFile = app.vault.getAbstractFileByPath(`zData/1tmpl/0calendar/${tmplMap[planType]}.md`);
        if (!tmplFile) { new Notice("❌ Template missing in the zData folder!"); return; }
        
        let body = await app.vault.read(tmplFile);
        body = renderWeekplan(body, {
            dateStr: targetMoment.format("YYYY-MM-DD"),
            energy: "3",
            year,
            kw: targetKw,
            planType,
            currentWeek: planType === "fitness" ? (Number(sourceFm.training_week || 0) + 1 || 1) : 1
        });
        await app.vault.create(targetPath, body);
        targetFile = app.vault.getAbstractFileByPath(targetPath);
        await new Promise(r => setTimeout(r, 200)); // Wait briefly until Obsidian registers the file
    }

    // 6. DATEN INFIZIEREN (Schreibe YAML)
    await app.fileManager.processFrontMatter(targetFile, (fm) => {
        for (let key in dataToCopy) {
            if (mode === "overwrite") {
                fm[key] = dataToCopy[key];
            } else if (mode === "fill") {
                // Only insert when the field in the new file is still empty
                if (!fm[key] || fm[key] === "free" || fm[key] === "") {
                    fm[key] = dataToCopy[key];
                }
            }
        }
    });

    // 7. DONE! OPEN THE FILE
    new Notice(`✅ ${planType.toUpperCase()} replicated successfully for week ${targetKw}!`);
    app.workspace.getLeaf('tab').openFile(targetFile);

} catch(e) {
    new Notice("🔥 Replication failed: " + e.message, 10000);
}
-%>
