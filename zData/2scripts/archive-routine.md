<%-*
/**
 * 🧹 NEXUS SMART ARCHIVER (Preserves Schedule & Calculates Duration)
 * Auto-detects Timetable, Routine, or Fitness Plan.
 */
try {
    let file = app.workspace.getActiveFile();
    let planType = "Routine";
    let targetPath = "2_Areas/4_Organize/Routine-Timeblocking.md";
    
    if (file && file.name.includes("Timetable")) {
        planType = "Timetable";
        targetPath = file.path;
    } else if (file && file.name.includes("Fitness")) {
        planType = "Fitness";
        targetPath = file.path;
    }
    
    const rFile = app.vault.getAbstractFileByPath(targetPath);
    if (!rFile) {
        new Notice(`Plan file (${targetPath}) not found!`);
        return;
    }
    
    const cache = app.metadataCache.getFileCache(rFile);
    const fm = cache?.frontmatter || {};
    
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    let totals = {};
    let scheduleMd = "";
    
    // --- TIMETABLE & ROUTINE LOGIC ---
    if (planType === "Routine" || planType === "Timetable") {
        const prefix = planType === "Routine" ? "rt" : "tt";
        const rStart = fm[`${prefix}_start`] || "07:00";
        const rDur = Number(fm[`${prefix}_duration`]) || (planType === "Routine" ? 60 : 45);
        const rTotal = Number(fm[`${prefix}_periods`]) || 14;
        
        let engine = null;
        if (planType === "Routine") {
            try { engine = require(app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js")(); } catch(e) {}
        } else {
            try { engine = require(app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js")(); } catch(e) {}
        }
        
        const getLabel = (val) => {
            if (!val || val === "free") return "Free Block";
            if (val === "break") return "☕ Buffer / Rest";
            if (String(val).startsWith("custom|")) return "🔸 " + String(val).split("|")[1];
            let baseKey = String(val).split("|")[0];
            if (engine && engine.all && engine.all[baseKey]) return engine.all[baseKey].label;
            return val;
        };
        
        for (let d = 0; d < 7; d++) {
            let dayPrefix = days[d];
            scheduleMd += `\n### ${dayLabels[d]}\n`;
            scheduleMd += `| Block | Duration | Activity |\n`;
            scheduleMd += `|---|---|---|\n`;
            
            let current = moment(rStart, ["HH:mm", "h:mm A", "h:mma"]);
            for (let i = 1; i <= rTotal; i++) {
                let key = `${prefix}_${dayPrefix}_${i}`;
                let val = fm[key] || "free";
                let label = getLabel(val);
                
                scheduleMd += `| Block ${i} (${current.format("HH:mm")}) | ${rDur} min | ${label} |\n`;
                
                if (!totals[label]) totals[label] = 0;
                totals[label] += rDur;
                
                current.add(rDur, 'minutes');
            }
        }
    } 
    // --- FITNESS LOGIC ---
    else if (planType === "Fitness") {
        const regions = [
            {l: "🤸 Warmup", v: "mobility"},
            {l: "💪 Upper Body", v: "upper"},
            {l: "🦵 Lower Body", v: "lower"},
            {l: "🪨 Core", v: "core"},
            {l: "🔥 Cardio", v: "cardio"}
        ];
        
        let engine = null;
        try { engine = require(app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js")(); } catch(e) {}
        
        const getLabel = (val) => {
            if (!val || val === "free") return "Rest";
            if (String(val).startsWith("custom|")) return "🔸 " + String(val).split("|")[1];
            let baseKey = String(val).split("|")[0];
            if (engine && engine.all && engine.all[baseKey]) return engine.all[baseKey].label;
            return val;
        };
        
        for (let d = 0; d < 7; d++) {
            let dayPrefix = days[d];
            scheduleMd += `\n### ${dayLabels[d]}\n`;
            scheduleMd += `| Region | Exercise |\n`;
            scheduleMd += `|---|---|\n`;
            
            for (let r of regions) {
                let key = `fit_${dayPrefix}_${r.v}`;
                let val = fm[key];
                if (val && val !== "free") {
                    let label = getLabel(val);
                    scheduleMd += `| ${r.l} | ${label} |\n`;
                    
                    if (!totals[label]) totals[label] = 0;
                    totals[label] += 1; // Count sets/exercises instead of minutes
                }
            }
        }
    }
    
    let summaryMd = "\n## 📊 Summary\n";
    if (planType === "Fitness") {
        summaryMd += `| Exercise | Times Performed |\n`;
        summaryMd += `|---|---|\n`;
        const sortedTotals = Object.entries(totals).sort((a,b) => b[1] - a[1]);
        for (const [lbl, count] of sortedTotals) {
            summaryMd += `| ${lbl} | **${count}x** |\n`;
        }
    } else {
        summaryMd += `| Activity | Hours | Minutes |\n`;
        summaryMd += `|---|---|---|\n`;
        const sortedTotals = Object.entries(totals).sort((a,b) => b[1] - a[1]);
        for (const [lbl, mins] of sortedTotals) {
            let h = Math.floor(mins / 60);
            let m = mins % 60;
            summaryMd += `| ${lbl} | **${h}h** | ${m}m |\n`;
        }
    }
    
    // --- BUILD TARGET PATH ---
    const year = moment().format("YYYY");
    const month = moment().locale('en').format("MM_MMMM");
    const kw = moment().format("WW");
    
    let folder = "4_Organize";
    if (planType === "Timetable") folder = "3_Mind";
    if (planType === "Fitness") folder = "6_Activity";
    
    const targetBase = `yArchive/${year}/${month}/2_Areas`;
    const title = `${planType}_Archive_W${kw}_${moment().format("HHmm")}`;
    const finalDest = `${targetBase}/${title}.md`;
    
    // Create folders if needed
    let checkPath = "";
    for (const seg of targetBase.split('/')) {
        checkPath = checkPath === "" ? seg : `${checkPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(checkPath)) {
            await app.vault.createFolder(checkPath);
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    const fileContent = `---
status: archived
archived_at: ${moment().format("YYYY-MM-DD HH:mm")}
---
# 📦 Archived ${planType} (Week ${kw} - ${year})

${summaryMd}

---
## 📅 Detailed Schedule
${scheduleMd}
`;

    await app.vault.create(finalDest, fileContent);
    new Notice(`📦 ${planType} Archived: ${title}`);
    
} catch(e) {
    new Notice("🔥 Error during archiving: " + e.message, 10000);
}
-%>
