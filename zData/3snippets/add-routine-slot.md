<%-*
/**
 * 🧩 NEXUS ROUTINE EDITOR (Multi-Day Edition)
 */
try {
    let file = app.workspace.getActiveFile();
    if (!file) return;

    // If the current file isn't the routine plan, target the Master Routine Plan directly
    const isRoutinePlan = file.name.includes("Routine_Timeblocking") || file.name.includes("_routine");
    if (!isRoutinePlan) {
        file = app.vault.getAbstractFileByPath("2_Areas/4_Organize/Plan/Routine_Timeblocking.md");
        if (!file) {
            new Notice("Routine_Timeblocking.md not found!");
            return;
        }
    }

    // --- 1. READ PARAMETERS FROM FILE ---
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};
    const startTime = fm.rt_start || "06:00";
    const blockDuration = Number(fm.rt_duration) || 60;
    const totalBlocks = Number(fm.rt_periods) || 14;
    const breaksStr = fm.rt_breaks || "";

    // Parse custom breaks into an object
    const customBreaks = {};
    if (breaksStr) {
        breaksStr.split(",").forEach(b => {
            let parts = b.split(":");
            if(parts.length === 2) {
                let pIdx = parseInt(parts[0].trim());
                let pDur = parseInt(parts[1].trim());
                if(!isNaN(pIdx) && !isNaN(pDur)) customBreaks[pIdx] = pDur;
            }
        });
    }

    // Calculate time slots
    let current = moment(startTime, ["HH:mm", "h:mm A", "h:mma"]);
    let slots = [];
    for (let i = 1; i <= totalBlocks; i++) {
        let end = moment(current).add(blockDuration, 'minutes');
        slots.push({ id: String(i), label: `Block ${i} (${current.format("HH:mm")} - ${end.format("HH:mm")})` });
        current = end;

        if (customBreaks[i] && i !== totalBlocks) {
            let bDur = customBreaks[i];
            let bEnd = moment(current).add(bDur, 'minutes');
            slots.push({ id: `break${i}`, label: `☕ Buffer (${bDur}m) (${current.format("HH:mm")} - ${bEnd.format("HH:mm")})` });
            current = bEnd;
        }
    }

    // --- 2. MULTI-DAY SELECTOR ---
    const dayPresets = [
        { l: "1️⃣ Monday", v: ["mon"] },
        { l: "2️⃣ Tuesday", v: ["tue"] },
        { l: "3️⃣ Wednesday", v: ["wed"] },
        { l: "4️⃣ Thursday", v: ["thu"] },
        { l: "5️⃣ Friday", v: ["fri"] },
        { l: "6️⃣ Saturday", v: ["sat"] },
        { l: "7️⃣ Sunday", v: ["sun"] },
        { l: "💼 Workdays (Mon-Fri)", v: ["mon", "tue", "wed", "thu", "fri"] },
        { l: "🌴 Weekend (Sat-Sun)", v: ["sat", "sun"] },
        { l: "🌍 All 7 Days", v: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
        { l: "✍️ Custom combination...", v: "custom" }
    ];

    const dayChoice = await tp.system.suggester(dayPresets.map(d => d.l), dayPresets, false, "🗓️ Choose day(s):");
    if(!dayChoice) return;

    let selectedDays = dayChoice.v;

    // Handle Custom Day Input
    if (selectedDays === "custom") {
        const customInput = await tp.system.prompt("Enter days separated by comma (e.g. mon, wed, fri):");
        if (!customInput) return;
        
        selectedDays = customInput.toLowerCase().split(",")
            .map(d => d.trim())
            .filter(d => ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(d));
            
        if (selectedDays.length === 0) {
            new Notice("❌ Invalid days entered. Please use mon, tue, wed, thu, fri, sat, sun.");
            return;
        }
    }

    // --- 3. SELECT START AND END SLOTS ---
    const numericSlots = slots.filter(s => !s.id.startsWith("break"));

    const startSlot = await tp.system.suggester(numericSlots.map(s => s.label), numericSlots, false, `🛫 Select START Block:`);
    if(!startSlot) return;

    const validEndSlots = numericSlots.filter(s => Number(s.id) >= Number(startSlot.id));
    const endSlot = await tp.system.suggester(validEndSlots.map(s => s.label), validEndSlots, false, "🛬 Select END Block:");
    if(!endSlot) return;

    // --- 4. LOAD ENGINE & CHOOSE ROUTINE ---
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
    let engine;
    try { engine = require(enginePath)(); } catch(e) { 
        new Notice("🔥 Engine Error!"); return; 
    }
    
    const discList = engine.getRoutineLabels ? engine.getRoutineLabels() : Object.keys(engine.all).map(k => ({key: k, ...engine.all[k]}));

    const options = discList.map(r => ({
        label: `[${r.group || 'Routine'}] ${r.icon} ${r.label}`,
        key: r.key
    }));

    options.unshift({key: "break", label: "☕ Mark as Buffer / Rest"});
    options.unshift({key: "free", label: "❌ Empty Block (Clear slot)"});
    options.push({key: "custom", label: "✍️ Custom Block..."});

    const subj = await tp.system.suggester(options.map(o => o.label), options, false, "🎯 Select Routine Category:");
    if(!subj) return;

    let finalValue = subj.key;

    // --- 5. SMART DETAIL PROMPT ---
    if (finalValue !== "free" && finalValue !== "break" && finalValue !== "custom") {
        const detail = await tp.system.prompt("Optional Detail (e.g., 'Laundry', 'Taxes'):");
        if (detail) finalValue = `${finalValue}|${detail}`;
    } else if (finalValue === "custom") {
        const customTxt = await tp.system.prompt("Enter custom block text:");
        if (!customTxt) return;
        finalValue = `custom|${customTxt}`;
    }

    // --- 6. BATCH SAVE TO YAML ---
    let mode = "overwrite";
    if (finalValue !== "free" && finalValue !== "break" && finalValue !== "custom") {
        let hasExisting = false;
        outer: for (let d of selectedDays) {
            for (let slotId = Number(startSlot.id); slotId <= Number(endSlot.id); slotId++) {
                if (fm[`rt_${d}_${slotId}`]) { hasExisting = true; break outer; }
            }
        }
        
        if (hasExisting) {
            const choice = await tp.system.suggester(["♻️ Overwrite existing block(s)", "➕ Stack (Add alongside existing blocks)"], ["overwrite", "add"], false, "⚠️ One or more slots already have an entry. Overwrite or Stack?");
            if (!choice) return;
            mode = choice;
        }
    }

    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        for (let d of selectedDays) {
            for (let slotId = Number(startSlot.id); slotId <= Number(endSlot.id); slotId++) {
                const yamlKey = `rt_${d}_${slotId}`;
                if (finalValue === "free") {
                    delete frontmatter[yamlKey];
                } else {
                    if (mode === "add" && frontmatter[yamlKey]) {
                        let arr = Array.isArray(frontmatter[yamlKey]) ? frontmatter[yamlKey] : [frontmatter[yamlKey]];
                        arr.push(finalValue);
                        frontmatter[yamlKey] = arr;
                    } else {
                        frontmatter[yamlKey] = finalValue;
                    }
                }
            }
        }
    });

    new Notice(`🧩 Routine successfully applied to ${selectedDays.length} day(s) from block ${startSlot.id} to ${endSlot.id}!`, 4000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>