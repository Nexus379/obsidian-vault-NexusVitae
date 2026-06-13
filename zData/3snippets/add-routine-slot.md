<%-*
/**
 * 🧩 NEXUS ROUTINE EDITOR (Multi-Day Edition)
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

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

    // --- 3. SELECT SLOT ---
    const slot = await tp.system.suggester(slots.map(s => s.label), slots, false, `⌚ Which block?`);
    if(!slot) return;

    if (slot.id.startsWith("break")) {
        new Notice("☕ This is a fixed buffer.", 3000);
        return;
    }

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
    await app.fileManager.processFrontMatter(file, (fm) => {
        for (let d of selectedDays) {
            const yamlKey = `rt_${d}_${slot.id}`;
            if (subj.key === "free") {
                delete fm[yamlKey];
            } else {
                fm[yamlKey] = finalValue;
            }
        }
    });

    new Notice(`🧩 Routine successfully applied to ${selectedDays.length} day(s)!`, 4000);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>