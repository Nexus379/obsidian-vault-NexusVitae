<%-*
/**
 * 👑 NEXUS ROUTINE MULTI-EDITOR (Bulk Fill Edition)
 * Writes granular routines flexibly into multiple slots and days simultaneously.
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // --- ⚙️ READ PARAMETERS FROM ROUTINE-TIMEBLOCKING ---
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const startTime = fm.rt_start || "07:00";     
    const classDuration = Number(fm.rt_duration) || 60;      
    const totalPeriods = Number(fm.rt_periods) || 14;        
    const breaksStr = fm.rt_breaks || "";
    
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

    // Calculate time slots for display (Only numeric periods for block selection)
    let current = moment(startTime, "HH:mm");
    let numericSlots = [];

    for (let i = 1; i <= totalPeriods; i++) {
        let end = moment(current).add(classDuration, 'minutes');
        numericSlots.push({
            id: i,
            label: `Slot ${i} (${current.format("HH:mm")} - ${end.format("HH:mm")})`
        });
        current = end;
        if (customBreaks[i] && i !== totalPeriods) {
            current = moment(current).add(customBreaks[i], 'minutes');
        }
    }

    // 🔱 1. CHOOSE DAY OR DAY-BLOCK
    const dayOptions = [
        { l: "Monday", v: ["mon"] },
        { l: "Tuesday", v: ["tue"] },
        { l: "Wednesday", v: ["wed"] },
        { l: "Thursday", v: ["thu"] },
        { l: "Friday", v: ["fri"] },
        { l: "Saturday", v: ["sat"] },
        { l: "Sunday", v: ["sun"] },
        { l: "🔄 All Weekdays (Mon-Fri)", v: ["mon", "tue", "wed", "thu", "fri"] },
        { l: "🌴 Weekend (Sat-Sun)", v: ["sat", "sun"] },
        { l: "🌍 Whole Week (Mon-Sun)", v: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] }
    ];
    
    const selectedDayGroup = await tp.system.suggester(dayOptions.map(d => d.l), dayOptions, false, "🗓️ Choose target Day(s):");
    if(!selectedDayGroup) return;

    // 🔱 2. CHOOSE START SLOT
    const startSlot = await tp.system.suggester(numericSlots.map(s => s.label), numericSlots, false, "🛫 Select START Slot:");
    if(!startSlot) return;

    // 🔱 3. CHOOSE END SLOT (Automatically filters valid endpoints)
    const validEndSlots = numericSlots.filter(s => s.id >= startSlot.id);
    const endSlot = await tp.system.suggester(validEndSlots.map(s => s.label), validEndSlots, false, "🛬 Select END Slot:");
    if(!endSlot) return;

    // 🔱 4. LOAD ROUTINE ENGINE
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
    let engine;
    try { engine = require(enginePath)(); } catch(e) { new Notice("❌ routineEngine.js not found!"); return; }

    const routineList = engine.getRoutineLabels();
    routineList.unshift({key: "free", icon: "➖", label: "Free Period (Clear entry)"});
    routineList.unshift({key: "break", icon: "☕", label: "Mark as Pause/Break"});

    // 🔱 5. CHOOSE ROUTINE
    const routine = await tp.system.suggester(routineList.map(r => `${r.icon} ${r.label}`), routineList, false, "🧹 Select Routine to deploy:");
    if(!routine) return;

    // Optional detail addition
    let finalKey = routine.key;
    if (routine.key !== "free" && routine.key !== "break") {
        const detail = await tp.system.prompt(`📝 Optional text details for this block? (Leave empty for standard ${routine.label})`, "");
        if (detail && detail.trim() !== "") {
            finalKey = `${routine.key}|${detail.trim()}`;
        }
    }

    // 🔱 6. FRONTMATTER BULK SYNC
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        selectedDayGroup.v.forEach(dayPrefix => {
            for (let slotId = startSlot.id; slotId <= endSlot.id; slotId++) {
                frontmatter[`rt_${dayPrefix}_${slotId}`] = finalKey;
            }
        });
    });

    new Notice(`⚡ Deploy complete! Filled Slots ${startSlot.id} to ${endSlot.id}.`);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>