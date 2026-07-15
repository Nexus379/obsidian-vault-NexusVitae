<%-*
/**
 * 🔄 NEXUS TIMETABLE SYNC
 * Baut den Routine-Plan vollautomatisch um den Timetable auf.
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const commuteInput = await tp.system.prompt("🚲 / 🚌 How long is the commute to the location (in minutes)?", "45");
    if (commuteInput === null) return;
    const commuteMins = parseInt(commuteInput) || 0;

    const days = ["mon", "tue", "wed", "thu", "fri"];
    
    // 1. TIMETABLE LESEN (mit Fallback-Logik)
 let kw = fm.plan_kw;
 let year = fm.plan_year;

// Falls die Metadaten leer sind, aus dem Dateinamen (z.B. "2026-W29_routine") lesen
if (!kw || !year) {
    const match = file.name.match(/(\d{4})-?W(\d{1,2})/);
    if (match) {
        if (!year) year = match[1];
        if (!kw) kw = match[2];
    }
}

// Monat berechnen (Backticks für die String-Interpolation wichtig!)
const month = (year && kw) ? moment(`${year}-W${kw}`, "YYYY-[W]WW").format("MM") : null;
    
    let ttFile = null;
    if (year && month && kw) {
        const weeklyTtPath = `0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_timetable.md`;
        ttFile = app.vault.getAbstractFileByPath(weeklyTtPath);
    }
    
    if (!ttFile) {
        // Fallback auf Master
        ttFile = app.vault.getAbstractFileByPath("2_Areas/3_Mind/Plan/Timetable.md");
    }

    if (!ttFile) {
        new Notice("🔥 Fehler: Timetable (Weder Wochenplan noch Master) nicht gefunden.");
        return;
    }
    const ttCache = app.metadataCache.getFileCache(ttFile);
    const ttFm = ttCache?.frontmatter || {};

    const ttStart = ttFm.tt_start || "08:15";
    const ttDur = parseInt(ttFm.tt_duration) || 45;
    const ttPeriods = parseInt(ttFm.tt_periods) || 8;
    const ttBreaksStr = String(ttFm.tt_breaks || "");
    const ttBreaks = {};
    if (ttBreaksStr) {
        ttBreaksStr.split(",").forEach(b => {
            let p = b.split(":");
            if (p.length === 2) ttBreaks[parseInt(p[0])] = parseInt(p[1]);
        });
    }

    // Timetable Block-Zeiten berechnen
    const ttBlockTimes = {};
    let currentTT = moment(ttStart, "HH:mm");
    for (let i = 1; i <= ttPeriods; i++) {
        let endTT = moment(currentTT).add(ttDur, 'minutes');
        ttBlockTimes[i] = { start: moment(currentTT), end: moment(endTT) };
        currentTT = moment(endTT);
        if (ttBreaks[i] && i !== ttPeriods) {
            currentTT.add(ttBreaks[i], 'minutes');
        }
    }

    // Pro Tag die erste und letzte Vorlesung ermitteln
    const dailySchedule = {};
    days.forEach(day => {
        let firstBlock = 999;
        let lastBlock = -1;
        let className = "University";

        for (let i = 1; i <= ttPeriods; i++) {
            const val = ttFm[`tt_${day}_${i}`];
            if (val && val !== "free" && val !== "break") {
                if (i < firstBlock) firstBlock = i;
                if (i > lastBlock) lastBlock = i;
                // Nimm den Namen des ersten Blocks als Event-Namen (z.B. german_studies)
                if (firstBlock === i) {
                    let parts = String(val).split("|");
                    className = parts[0].replace(/_/g, " ");
                    className = className.charAt(0).toUpperCase() + className.slice(1);
                }
            }
        }

        if (firstBlock <= lastBlock) {
            let startClass = moment(ttBlockTimes[firstBlock].start);
            let endClass = moment(ttBlockTimes[lastBlock].end);
            dailySchedule[day] = {
                className: className,
                startClass: startClass,
                endClass: endClass,
                startCommute: moment(startClass).subtract(commuteMins, 'minutes'),
                endCommute: moment(endClass).add(commuteMins, 'minutes')
            };
        }
    });

    // 2. ROUTINE BLÖCKE BERECHNEN
    const rtStart = fm.rt_start || "05:00";
    const rtDur = parseInt(fm.rt_duration) || 45;
    const rtPeriods = parseInt(fm.rt_periods) || 14;
    const rtBreaksStr = String(fm.rt_breaks || "");
    const rtBreaks = {};
    if (rtBreaksStr) {
        rtBreaksStr.split(",").forEach(b => {
            let p = b.split(":");
            if (p.length === 2) rtBreaks[parseInt(p[0])] = parseInt(p[1]);
        });
    }

    const rtBlockTimes = {};
    let currentRT = moment(rtStart, "HH:mm");
    for (let i = 1; i <= rtPeriods; i++) {
        let endRT = moment(currentRT).add(rtDur, 'minutes');
        rtBlockTimes[i] = { start: moment(currentRT), end: moment(endRT) };
        currentRT = moment(endRT);
        if (rtBreaks[i] && i !== rtPeriods) {
            currentRT.add(rtBreaks[i], 'minutes');
        }
    }

    // 3. ABGLEICH UND ÜBERSCHREIBEN (in app.fileManager)
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        days.forEach(day => {
            const sched = dailySchedule[day];
            if (!sched) return; // Nichts zu tun an diesem Tag

            // Formatierungs-Strings für die Anzeige
            const classStr = `${sched.startClass.format("HH:mm")} - ${sched.endClass.format("HH:mm")}`;
            const commInStr = `${sched.startCommute.format("HH:mm")} - ${sched.startClass.format("HH:mm")}`;
            const commOutStr = `${sched.endClass.format("HH:mm")} - ${sched.endCommute.format("HH:mm")}`;

            for (let i = 1; i <= rtPeriods; i++) {
                const rtBlock = rtBlockTimes[i];
                const rStart = rtBlock.start;
                const rEnd = rtBlock.end;

                // Helfer: Überschneiden sich zwei Zeiträume (auch nur teilweise)?
                const overlaps = (aStart, aEnd, bStart, bEnd) => {
                    return Math.max(aStart.valueOf(), bStart.valueOf()) < Math.min(aEnd.valueOf(), bEnd.valueOf());
                };

                let assigned = false;

                // 1. Check Class
                if (overlaps(rStart, rEnd, sched.startClass, sched.endClass)) {
                    frontmatter[`rt_${day}_${i}`] = `custom|🎓 ${sched.className} (${classStr})`;
                    assigned = true;
                }
                
                // 2. Check Commute IN (Morgen) - Nur wenn noch nicht durch Class belegt
                if (!assigned && overlaps(rStart, rEnd, sched.startCommute, sched.startClass)) {
                    frontmatter[`rt_${day}_${i}`] = `custom|🚲 / 🚌 Commute (${commInStr})`;
                    assigned = true;
                }

                // 3. Check Commute OUT (Abend)
                if (!assigned && overlaps(rStart, rEnd, sched.endClass, sched.endCommute)) {
                    frontmatter[`rt_${day}_${i}`] = `custom|🚲 / 🚌 Commute (${commOutStr})`;
                    assigned = true;
                }
            }
        });
    });

    new Notice("✅ Timetable erfolgreich synchronisiert!");

} catch(e) {
    console.error(e);
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>
