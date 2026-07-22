<%-*
/**
 * 👑 NEXUS TIMETABLE MULTI-EDITOR (Bulk Fill Edition)
 * Writes granular routines flexibly into multiple slots and days simultaneously.
 */
try {
    let file = app.workspace.getActiveFile();
    if (!file) return;

    // If the current file isn't the Timetable, target the Timetable directly
    if (!file.name.includes("Timetable")) {
        file = app.vault.getAbstractFileByPath("2_Areas/3_Mind/Plan/Timetable.md");
        if (!file) {
            new Notice("Timetable.md not found!");
            return;
        }
    }

    // --- ⚙️ READ PARAMETERS FROM TIMETABLE ---
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const startTime = fm.tt_start || "08:00";     
    const classDuration = Number(fm.tt_duration) || 45;      
    const totalPeriods = Number(fm.tt_periods) || 8;        
    const breaksStr = fm.tt_breaks || "";
    
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

    // 🔱 4. LOAD DISCIPLINE ENGINE
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js";
    let engine;
    try { engine = require(enginePath)(); } catch(e) { new Notice("❌ disciplineEngine.js not found!"); return; }

    const routineList = engine.getDisciplineLabels ? engine.getDisciplineLabels() : Object.keys(engine.all).map(k => ({key: k, ...engine.all[k]}));
    routineList.unshift({key: "custom", icon: "✍️", label: "Custom Block..."});
    routineList.unshift({key: "free", icon: "➖", label: "Free Period (Clear entry)"});
    routineList.unshift({key: "break", icon: "☕", label: "Mark as Pause/Break"});

    // 🔱 5. CHOOSE ROUTINE
    const routine = await tp.system.suggester(routineList.map(r => `${r.icon || ''} ${r.label}`), routineList, false, "🧹 Select Subject/Block to deploy:");
    if(!routine) return;

    // Optional detail addition
    let finalKey = routine.key;
    if (routine.key === "custom") {
        const customTxt = await tp.system.prompt("Enter custom block text:");
        if (!customTxt) return;
        finalKey = `custom|${customTxt}`;
    } else if (routine.key !== "free" && routine.key !== "break") {
        const detail = await tp.system.prompt(`📝 Optional text details for this block? (Leave empty for standard ${routine.label})`, "");
        if (detail && detail.trim() !== "") {
            finalKey = `${routine.key}|${detail.trim()}`;
        }
    }

    // 🔱 6. FRONTMATTER BULK SYNC
    let mode = "overwrite";
    if (finalKey !== "free" && finalKey !== "break") {
        let hasExisting = false;
        outer: for (let dayPrefix of selectedDayGroup.v) {
            for (let slotId = startSlot.id; slotId <= endSlot.id; slotId++) {
                if (fm[`tt_${dayPrefix}_${slotId}`]) { hasExisting = true; break outer; }
            }
        }
        
        if (hasExisting) {
            const choice = await tp.system.suggester(["♻️ Overwrite existing blocks", "➕ Stack (Add alongside existing blocks)"], ["overwrite", "add"], false, "⚠️ Some slots already have entries. Do you want to Overwrite or Stack?");
            if (!choice) return;
            mode = choice;
        }
    }

    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        selectedDayGroup.v.forEach(dayPrefix => {
            for (let slotId = startSlot.id; slotId <= endSlot.id; slotId++) {
                const yamlKey = `tt_${dayPrefix}_${slotId}`;
                if (finalKey === "free") {
                    delete frontmatter[yamlKey];
                } else {
                    if (mode === "add" && frontmatter[yamlKey]) {
                        let arr = Array.isArray(frontmatter[yamlKey]) ? frontmatter[yamlKey] : [frontmatter[yamlKey]];
                        arr.push(finalKey);
                        frontmatter[yamlKey] = arr;
                    } else {
                        frontmatter[yamlKey] = finalKey;
                    }
                }
            }
        });
    });

    new Notice(`⚡ Deploy complete! Filled Slots ${startSlot.id} to ${endSlot.id}.`);

    // 🔱 7. LOOP OPTION: Add another slot for same/different subject
    const loopChoice = await tp.system.suggester(
        [
            `➕ Add another slot for '${routine.label}' (Same subject)`,
            "➕ Add slot for a DIFFERENT subject",
            "✅ Done (Finish setup)"
        ],
        ["same", "different", "done"],
        false,
        "🔁 Add another time slot to this Timetable?"
    );

    if (loopChoice === "same") {
        // Run again pre-selecting same subject
        const nextDayGroup = await tp.system.suggester(dayOptions.map(d => d.l), dayOptions, false, `🗓️ Choose NEXT Day(s) for '${routine.label}':`);
        if (nextDayGroup) {
            const nextStart = await tp.system.suggester(numericSlots.map(s => s.label), numericSlots, false, `🛫 Select START Slot for '${routine.label}':`);
            if (nextStart) {
                const nextValidEnd = numericSlots.filter(s => s.id >= nextStart.id);
                const nextEnd = await tp.system.suggester(nextValidEnd.map(s => s.label), nextValidEnd, false, `🛬 Select END Slot for '${routine.label}':`);
                if (nextEnd) {
                    await app.fileManager.processFrontMatter(file, (frontmatter) => {
                        nextDayGroup.v.forEach(dayPrefix => {
                            for (let slotId = nextStart.id; slotId <= nextEnd.id; slotId++) {
                                frontmatter[`tt_${dayPrefix}_${slotId}`] = finalKey;
                            }
                        });
                    });
                    new Notice(`⚡ Deploy complete! Added second slot for '${routine.label}'.`);
                }
            }
        }
    } else if (loopChoice === "different") {
        // Re-trigger script for another subject
        const templater = app.plugins.plugins["templater-obsidian"]?.templater?.current_functions_object;
        if (templater) {
            const snippet = app.vault.getAbstractFileByPath("zData/3snippets/add-timetable-slot.md");
            if (snippet) await templater.include_file(snippet);
        }
    }

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>