<%-*
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // 1. Determine prefix securely
    const cache = app.metadataCache.getFileCache(file);
    const fmCache = cache?.frontmatter || {};
    let prefix = "pm"; 
    
    if (fmCache.am_start !== undefined || fmCache.am_periods !== undefined) {
        prefix = "am";
    } else if (fmCache.pm_start !== undefined || fmCache.pm_periods !== undefined) {
        prefix = "pm";
    } else {
        const fileName = file.name.toLowerCase();
        if (fileName.includes("morning") || fileName.includes("am")) prefix = "am";
    }

    // 2. Load Engine
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
    const engine = (require(enginePath))();
    const routines = engine.getRoutineLabels();

    // 3. Build Searchable Labels (Including Aliases)
    const displayLabels = routines.map((r) => {
        let searchTerms = [];
        if (r.aliases) searchTerms = searchTerms.concat(r.aliases);
        if (r.alias) searchTerms = searchTerms.concat(r.alias);
        if (r.tags) searchTerms = searchTerms.concat(r.tags);
        const termString = searchTerms.length > 0 ? `   🔍 [${searchTerms.join(", ")}]` : "";
        return `${r.icon}${r.label} (${r.key})${termString}`;
    });

    // 4. Selection via Suggester
    const selected = await tp.system.suggester(displayLabels, routines);
    if (!selected) return;

    // 5. Prompts for Detail and Duration (With strict 15 min fallback)
    const detail = await tp.system.prompt("Optional detail (Enter for none):");
    const durInput = await tp.system.prompt("Duration in min (e.g. 15):", "15");
    // Strict fallback: if input is not a number or is 0, default to 15
    const finalDur = Number(durInput) > 0 ? Number(durInput) : 15;

    // 6. Find next free index (am1, am2...)
    let nextNum = 1;
    await app.fileManager.processFrontMatter(file, (fm) => {
        while (fm[`${prefix}${nextNum}`] !== undefined) {
            nextNum++;
        }
        // Save fields entirely separate
        fm[`${prefix}${nextNum}`] = selected.key; 
        fm[`${prefix}${nextNum}det`] = detail || ""; 
        fm[`${prefix}${nextNum}dur`] = finalDur; 
        fm[`${prefix}_periods`] = nextNum;
    });

    // 7. Format Output with exact bulleted list design
    const displayTitle = detail ? `**${selected.label}**` : `**${selected.label}**`;
    const output = `- ${selected.icon}${displayTitle}\n    - 📝 Routine: \`INPUT[text:${prefix}${nextNum}]\`\n    - 💬 Detail: \`INPUT[text:${prefix}${nextNum}det]\`\n    - ⏱️ Duration: \`INPUT[number:${prefix}${nextNum}dur]\` min.\n\n`;

    // 8. Insert at specific marker
    const activeView = app.workspace.activeLeaf?.view;
    if (activeView && activeView.editor) {
        const editor = activeView.editor;
        let insertLine = -1;
        for (let i = 0; i < editor.lineCount(); i++) {
            if (editor.getLine(i).includes("---~End~---")) {
                insertLine = i;
                break;
            }
        }
        
        if (insertLine !== -1) {
            editor.replaceRange(output, { line: insertLine, ch: 0 });
            new Notice(`✅ Block ${nextNum} added before ---~End~---`);
        } else {
            const cursor = editor.getCursor();
            editor.replaceRange(output, cursor);
            new Notice(`✅ Block ${nextNum} added at cursor`);
        }
    } else {
        new Notice("❌ Editor not found.");
    }
} catch(e) {
    new Notice("🔥 Error: " + e.message);
}
-%>