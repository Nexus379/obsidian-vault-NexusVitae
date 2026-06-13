<%-*
/**
 * 🎒 NEXUS TIMETABLE EDITOR - Smart Read Edition
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // --- ⚙️ PARAMETER AUS DER DATEI LESEN ---
    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const startTime = fm.tt_start || "08:00";     
    const classDuration = Number(fm.tt_duration) || 45;      
    const totalPeriods = Number(fm.tt_periods) || 8;        
    const breaksStr = fm.tt_breaks || "";
    
    // Pausen-Text (z.B. "2:20, 4:15") in ein intelligentes Objekt verwandeln
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
    // ---------------------------------

    // Zeit-Slots automatisch berechnen
    let current = moment(startTime, "HH:mm");
    let slots = [];

    for (let i = 1; i <= totalPeriods; i++) {
        let end = moment(current).add(classDuration, 'minutes');
        slots.push({
            id: String(i),
            label: `Period ${i} (${current.format("HH:mm")} - ${end.format("HH:mm")})`
        });
        current = end;

        if (customBreaks[i] && i !== totalPeriods) {
            let currentBreakDuration = customBreaks[i];
            let breakEnd = moment(current).add(currentBreakDuration, 'minutes');
            slots.push({
                id: `break${i}`,
                label: `☕ Break (${currentBreakDuration}m) (${current.format("HH:mm")} - ${breakEnd.format("HH:mm")})`
            });
            current = breakEnd;
        }
    }

    // 1. Tag wählen
    const days = [
        {l: "Monday", v: "mon"}, {l: "Tuesday", v: "tue"}, 
        {l: "Wednesday", v: "wed"}, {l: "Thursday", v: "thu"}, {l: "Friday", v: "fri"}
    ];
    const day = await tp.system.suggester(days.map(d => d.l), days, false, "🗓️ Choose a day:");
    if(!day) return;

    // 2. Stunde wählen
    const slot = await tp.system.suggester(slots.map(s => s.label), slots, false, `⌚ Which period on ${day.l}?`);
    if(!slot) return;

    // 3. Discipline Engine laden
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js";
    let engine;
    try { engine = require(enginePath)(); } catch(e) { return; }

    const discList = engine.getDisciplineLabels();
    discList.unshift({key: "free", icon: "➖", label: "Free Period (Clear entry)"});
    discList.unshift({key: "break", icon: "☕", label: "Mark as Pause/Break"});

    // 4. Fach wählen
    const subj = await tp.system.suggester(discList.map(d => `${d.icon} ${d.label}`), discList, false, "📚 Which subject?");
    if(!subj) return;

    // 5. In YAML speichern
    await app.fileManager.processFrontMatter(file, (fm) => {
        fm[`tt_${day.v}_${slot.id}`] = subj.key;
    });

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>