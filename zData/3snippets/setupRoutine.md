<%-*
/**
 * ⚙️ NEXUS ROUTINE SETUP (Smart Time End Edition)
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const start = await tp.system.prompt("⏰ Start Time (e.g., 06:00, 7:00 AM):", fm.rt_start || "06:00");
    if(start === null) return;

    const end = await tp.system.prompt("🛑 End Time (e.g., 22:00, 10:30 PM):", fm.rt_end || "22:00");
    if(end === null) return;

    const duration = await tp.system.prompt("⏳ Duration of ONE block (in minutes):", String(fm.rt_duration || 60));
    if(duration === null) return;

    const breaks = await tp.system.prompt("☕ Buffers. Format -> Block:Minutes (e.g., '4:30'):", fm.rt_breaks || "");
    if(breaks === null) return;

    // --- 🧮 SMART CALCULATION ENGINE ---
    const customBreaks = {};
    if (breaks) {
        breaks.split(",").forEach(b => {
            let parts = b.split(":");
            if(parts.length === 2) {
                let pIdx = parseInt(parts[0].trim());
                let pDur = parseInt(parts[1].trim());
                if(!isNaN(pIdx) && !isNaN(pDur)) customBreaks[pIdx] = pDur;
            }
        });
    }

    let current = moment(start, ["HH:mm", "h:mm A", "h:mma", "H:mm", "h A", "ha", "h a"]);
    let targetEnd = moment(end, ["HH:mm", "h:mm A", "h:mma", "H:mm", "h A", "ha", "h a"]);
    
    // Falls das Ende nach Mitternacht liegt (z.B. 06:00 bis 01:00 nachts)
    if (targetEnd.isBefore(current) || targetEnd.isSame(current)) {
        targetEnd.add(1, 'days');
    }

    let calculatedPeriods = 0;
    let tempCurrent = moment(current);

    // Berechnet die exakte Anzahl der Blöcke, bis die Endzeit erreicht ist
    while(calculatedPeriods < 40) { // Failsafe (Maximal 40 Blöcke)
        calculatedPeriods++;
        tempCurrent.add(Number(duration), 'minutes');
        
        if (tempCurrent.isSameOrAfter(targetEnd)) break;
        
        if (customBreaks[calculatedPeriods]) {
            tempCurrent.add(customBreaks[calculatedPeriods], 'minutes');
            if (tempCurrent.isSameOrAfter(targetEnd)) break;
        }
    }
    // ------------------------------------

    // Schreibt die Werte (inklusive des berechneten rt_periods) in dein YAML
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter.rt_start = start;
        frontmatter.rt_end = end;
        frontmatter.rt_duration = Number(duration);
        frontmatter.rt_periods = calculatedPeriods; // Automatisch berechnet!
        frontmatter.rt_breaks = breaks;
    });

    new Notice(`✅ Routine Setup complete! Calculated ${calculatedPeriods} blocks for your day.`);

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>