<%-*
// 🔱 1. INITIALIZATION & STABILIZATION
if (!tp.variables) tp.variables = {};
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const rawTitle = String(tp.file.title);
const folderPath = tp.file.folder(true);
let activeTrigger = tp.variables.activeTrigger || "";
if (["c", "cal"].includes(activeTrigger)) activeTrigger = "";

// 🔱 2. ARCH / SYS DEFAULTS (Prevents "undefined" errors)
let ARCH = tp.variables.ARCH;
if (!ARCH) {
    ARCH = {
        c: { label: "Calendar", folder: "0_Calendar", prompt: "0calendarprompt" },
        p: { folder: "3_Projects" }
    };
    tp.variables.ARCH = ARCH;
}
let SYS = tp.variables.SYS;
if (!SYS) {
    SYS = { tmpl: "zData/1tmpl", inbox: "0_Inbox" };
    tp.variables.SYS = SYS;
}

// 🔱 3. CALENDAR CONFIGURATION
tp.variables.ARCHTYPES_CAL = [
    { id: "plm",  label: "Journal",    icon: "🌷", subfolder: "1_PLM",         tmpl: "dailyplm" },
    { id: "ppm",  label: "Log",        icon: "🌻", subfolder: "2_PPM",         tmpl: "dailyppm" },
    { id: "pkm",  label: "Studylog",   icon: "🌼", subfolder: "3_PKM",         tmpl: "dailypkm" },
    { id: "proj", label: "Projectlog", icon: "🧩", subfolder: "4_Projectlogs", tmpl: "projectlog", connectTo: "p" },
    { id: "prot", label: "Protocol",   icon: "📜", subfolder: "5_Protocols",   tmpl: "protocol",   connectTo: "c" },
    { id: "rev",  label: "Review",     icon: "🛰️", subfolder: "6_Reviews",     tmpl: "rev" },
    { id: "plan", label: "Plan", icon: "📋", subfolder: "7_Plan", tmpl: "weekplan" }
];
const ARCHTYPES_CAL = tp.variables.ARCHTYPES_CAL;
const reviewBase = "6_Reviews";

const calLabel     = ARCHTYPES_CAL.map(m => `${m.subfolder.split("_")[0]} ${m.icon || ""} ${m.label}`.trim());
const calSubfolder = ARCHTYPES_CAL.map(m => m.subfolder);
const calSuffix    = ARCHTYPES_CAL.map(m => m.id);

// 🔱 4. TRIGGER & DATE DETECTION (NEU: Erkennt jetzt Fitness & Musik)
const planSubkeys = ["fitness", "inpra", "routine", "meal", "srs", "wardrobe", "spaced", "study", "timetable"];

if (!activeTrigger) {
    const lowered = rawTitle.toLowerCase();
    const hit = calSuffix.find(suf => lowered.includes(` ${suf}`) || lowered.endsWith(suf) || lowered.includes(`_${suf}`));
    
    if (hit) {
        activeTrigger = hit;
    } else {
        const planHit = planSubkeys.find(sub => lowered.includes(sub));
        if (planHit) {
            activeTrigger = "plan";
            tp.variables.originTrigger = planHit; 
        }
    }
    tp.variables.activeTrigger = activeTrigger;
}

let dateStr = tp.variables.targetDate;
if (!dateStr) {
    const today = tp.date.now("YYYY-MM-DD");
    if (/^\d{4}-\d{2}-\d{2}/.test(rawTitle)) {
        dateStr = rawTitle.substring(0, 10);
    } 
    else if (/^\d{4}-W\d{2}/i.test(rawTitle)) {
        const weekStr = rawTitle.substring(0, 8).toUpperCase();
        dateStr = moment(weekStr, "YYYY-[W]WW").startOf("isoWeek").format("YYYY-MM-DD");
    } 
    else if (activeTrigger) {
        dateStr = today; 
    } else {
        const pick = await tp.system.suggester(
            [`📅 Today (${today})`, "✏️ Enter custom date..."],
            [today, "CUSTOM"],
            false,
            "Pick a date (YYYY-MM-DD)"
        );
        if (pick === "CUSTOM") {
            const manual = await tp.system.prompt("Date (YYYY-MM-DD)?", today);
            dateStr = (manual && /^\d{4}-\d{2}-\d{2}$/.test(manual)) ? manual : today;
        } else {
            dateStr = pick || today;
        }
    }
}
tp.variables.targetDate = dateStr;

// 🔱 5. MODULE SELECTION (NEU: Erkennt jetzt Index 6 für Pläne!)
let cIdx = null;
const preSub = tp.variables.preSelectedSub || "";
if (preSub) {
    const matchingIndexes = calSubfolder
        .map((folder, index) => preSub.toLowerCase().includes(folder.toLowerCase()) ? index : -1)
        .filter(index => index !== -1);
    if (matchingIndexes.length === 1) cIdx = matchingIndexes[0];
}

if (cIdx === null || cIdx === -1) {
    // 🎯 HIER WAR DER FEHLER: JETZT SIND FITNESS & CO MIT INDEX 6 DRIN!
    const triggerMap = { plm:0, ppm:1, pkm:2, projectlog:3, proj:3, prjlog:3, protocol:4, prot:4, prtcl:4, rev:5, plan:6, fitness:6, inpra:6, routine:6, meal:6, srs:6, spaced:6, wardrobe:6, study:6, timetable:6 };
    if (triggerMap[activeTrigger] !== undefined) cIdx = triggerMap[activeTrigger];
}

if ((cIdx === null || cIdx === -1) && !activeTrigger) {
    cIdx = await tp.system.suggester(calLabel, Array.from(calLabel.keys()), false, "🔱 Nexus Chronos: Which module?");
}

if (cIdx === null || cIdx === -1) return;
const activeMod = ARCHTYPES_CAL[cIdx];
const dateParts = dateStr.split("-");
const y = dateParts[0];
const m = dateParts[1];

// 🛑 PREVENT DUPLICATE DAILY LOGS (DATE + MOD ID CHECK)
if ([0, 1, 2].includes(cIdx)) {
    const checkFolder = `${ARCH.c.folder}/${activeMod.subfolder}/${y}/${m}`;
    const prefix = `${dateStr} ${activeMod.id}`;
    const existingLog = app.vault.getMarkdownFiles().find(f => f.path.startsWith(checkFolder + "/") && f.name.startsWith(prefix));

    if (existingLog) {
        new Notice(`📂 Note already exists for ${dateStr}: ${existingLog.name}`);
        await app.workspace.getLeaf(false).openFile(existingLog);
        app.commands.executeCommandById("file-explorer:reveal-active-file");
        return;
    }
}

// 🔱 6. ENERGY LEVEL
let energy = tp.variables.energy;
if (!energy || !["1","2","3","4","5"].includes(String(energy))) {
    const eLabels = ["🔱 Amazing","🔋 High","🙂 Medium","🪫 Low","⭕ Empty"];
    const eValues = ["5","4","3","2","1"];
    energy = await tp.system.suggester(eLabels, eValues, false, "Energy Level? ⚡") || "3";
    tp.variables.energy = energy;
}

// 🔱 7. DATAVIEW CONNECTION (Projects / Logs)
let logConnect = ""; 
const dv = app.plugins?.plugins?.dataview?.api;
// Note: y and m are already declared on lines 113-114, reuse them here

if (cIdx === 3 && dv && ARCH.p) {
    const projects = dv.pages(`"${ARCH.p.folder}"`)
        .where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/"))
        .sort(p => p.file.mtime, "desc").limit(15).file.path.array();
    const labels   = projects.map(p => "🧩 " + p.split("/").pop().replace(".md",""));
    const pick = await tp.system.suggester(["➕ Manual Entry", ...labels], ["MAN", ...projects], false, "🔗 Link to Project?");

    if (pick === "➕ Manual Entry" || pick === "MAN") {
        const manual = await tp.system.prompt("🔗 Enter Project Name:", "");
        if (manual) {
            logConnect = manual.startsWith("[[") && manual.endsWith("]]") ? manual : `[[${manual}]]`;
        }
    } else if (pick) {
        const fileName = pick.split("/").pop().replace(".md","");
        logConnect = `[[${fileName}]]`;
    }
    
    if (logConnect) {
        tp.variables.displayTitle = logConnect.replace(/[\[\]]/g, "");
        tp.variables.title = tp.variables.displayTitle;
        tp.variables.customPath = `${ARCH.c.folder}/${activeMod.subfolder}/${y}/${tp.variables.displayTitle}/${m}`;
    }
}
else if (cIdx === 4 && dv) {
    const searchPath = `"${ARCH.c.folder}/${calSubfolder[3]}"`; 
    const logs   = dv.pages(searchPath).sort(p => p.file.mtime, "desc").limit(15).file.path.array();
    const labels = logs.map(p => "📜 Log: " + p.split("/").pop().replace(".md",""));
    const pick   = await tp.system.suggester(["➕ Manual Entry", ...labels], ["MAN", ...logs], false, "🔗 Connect to Log Entry?");
    
    if (pick === "➕ Manual Entry" || pick === "MAN") {
        const manualName = await tp.system.prompt("🚧 Enter Log/Source Name:", "");
        if (manualName) {
            logConnect = manualName.includes("[[") ? manualName : `[[${manualName}]]`;
        }
    } else if (pick) {
        logConnect = `[[${pick.split("/").pop().replace(".md","")}]]`;
    }
}

tp.variables.logConnect = logConnect;
await new Promise(r => setTimeout(r, 100));

// 🔱 8. REVIEW LOGIC
let revTemp = "";
let revSuffix = tp.variables.revSuffix || "";
let reviewPhase = "";

if (cIdx === 5) {
    const revOptions = ["Daily","Weekly","Monthly","Quarterly","Half-Yearly","Yearly"];
    const revKeys    = ["revD","revW","revM","revQ","revH","revY"];
    
    reviewPhase = await tp.system.suggester(revOptions, revKeys, false, "🛰️ Nexus Review Phase?");
    if (!reviewPhase) return;

    const revModules = [
        { id: "master", label: "🔱 Master (All Modules)", subfolder: "0_Master" },
        ...ARCHTYPES_CAL.slice(0, 4) 
    ];
    const modChoice = await tp.system.suggester(revModules.map(m => m.label), revModules, false, `🛰️ Review for which Module?`);
    if (!modChoice) return;

    const targetMoment = moment(dateStr, "YYYY-MM-DD");
    tp.variables.kw = targetMoment.format("WW");
    tp.variables.year = targetMoment.format("YYYY");

    if (reviewPhase === "revD") {
        tp.variables.displayTitle = ""; 
    } else if (reviewPhase === "revW") {
        tp.variables.displayTitle = `CW ${tp.variables.kw}`; 
    } else if (reviewPhase === "revM") {
        tp.variables.displayTitle = targetMoment.format("MMMM");
    } else if (reviewPhase === "revQ") {
        tp.variables.displayTitle = `Q${targetMoment.format("Q")}`;
    } else if (reviewPhase === "revH") {
        tp.variables.displayTitle = `H${targetMoment.month() < 6 ? "1" : "2"}`;
    } else if (reviewPhase === "revY") {
        tp.variables.displayTitle = `${tp.variables.year}`;
    }

    let modSubPath = modChoice.subfolder;
    
    if (modChoice.id === "proj" && dv && ARCH.p) {
        const projects = dv.pages(`"${ARCH.p.folder}"`)
            .where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/"))
            .sort(p => p.file.mtime, "desc").limit(15).file.path.array();
        const labels   = projects.map(p => "🧩 " + p.split("/").pop().replace(".md",""));
        const pick     = await tp.system.suggester(["➕ Manual Entry", ...labels], ["MAN", ...projects], false, "🔗 Select Project?");
        const projName = (pick && pick !== "MAN") ? pick.split("/").pop().replace(".md","") : await tp.system.prompt("Project Name?");
        if (projName) { 
            modSubPath += `/${projName}`; 
            tp.variables.logConnect = `[[${projName}]]`; 
        }
    }
    
    const revFolderPath = `${ARCH.c.folder}/${reviewBase}/${modSubPath}`;
    let lastDate = "";
    const filterStr = (modChoice.id === "master" && reviewPhase === "revD") ? " revD" : `${modChoice.id}_${reviewPhase}`;
    const lastFiles = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(`${revFolderPath}/`) && f.name.includes(filterStr))
        .sort((a,b) => b.name.localeCompare(a.name));
    if (lastFiles.length > 0) {
        const dateMatch = lastFiles[0].name.match(/^\d{4}-\d{2}-\d{2}/);
        if (dateMatch) lastDate = dateMatch[0];
    }
    if (!lastDate) {
        const fallbacks = { revD:1, revW:7, revM:30, revQ:90, revH:180, revY:365 };
        lastDate = targetMoment.clone().subtract(fallbacks[reviewPhase], "days").format("YYYY-MM-DD");
    }
    tp.variables.revStart  = lastDate;
    tp.variables.revEnd    = dateStr;
    tp.variables.revModule = modChoice.id; 
    
    if (modChoice.id === "master" && reviewPhase === "revD") {
        revSuffix = "revD"; 
    } else {
        revSuffix = `${modChoice.id}_${reviewPhase}`; 
    }
    
    revTemp = reviewPhase.toLowerCase(); 
    tp.variables.customPath = (reviewPhase === "revH" || reviewPhase === "revY") ? `${revFolderPath}/${y}` : `${revFolderPath}/${y}/${m}`;
}

// 🚀 8.5 PLAN LOGIC (cIdx 6)
let planTemp = "";
if (cIdx === 6) {
    const targetMoment = moment(dateStr, "YYYY-MM-DD");
    const planYear = targetMoment.format("YYYY");
    const planKw = targetMoment.format("WW");
    tp.variables.planYear = planYear;
    tp.variables.planKw = planKw;
    
    let subType = (tp.variables.originTrigger && tp.variables.originTrigger !== "plan") ? tp.variables.originTrigger : "";
    
    if (!subType || subType === "plan") {
        const planOptions = [
            "💪 Fitness Routine", 
            "🎸 Instrument Practice", 
            "⏰ Timeblocking (Routines)", 
            "🍱 Meal Plan", 
            "🧠 Spaced Repetition", 
            "👗 Wardrobe",
            "📚 Study Plan",
            "🗓️ Timetable"
        ];
        const planKeys = ["fitness", "inpra", "routine", "meal", "srs", "wardrobe", "study", "timetable"];
        
        subType = await tp.system.suggester(planOptions, planKeys, false, "📋 Welchen Wochenplan möchtest du anlegen?");
        if (!subType) return; 
    }

    const planMap = {
        "fitness": "weekplan_fitness",
        "inpra": "weekplan_inpra",
        "routine": "weekplan_routine",
        "meal": "weekplan_meal",
        "spaced": "weekplan_srs",
        "srs": "weekplan_srs",
        "wardrobe": "weekplan_wardrobe",
        "study": "weekplan_study",
        "timetable": "weekplan_timetable"
    };

    planTemp = planMap[subType] || "weekplan";
    tp.variables.customPath = `${ARCH.c.folder}/${activeMod.subfolder}/${planYear}/${targetMoment.format("MM")}`;
    
    tp.variables.displayTitle = `-W${planKw}_${subType}`; 
}

// 🔱 9. TITLE CLEANUP & STRUCTURE
let cleanTitle = "";

if (cIdx === 5 && reviewPhase === "revD") {
    cleanTitle = "";
} else if (cIdx === 6) {
    cleanTitle = tp.variables.displayTitle;
} else if (tp.variables.displayTitle !== undefined && tp.variables.displayTitle !== "") {
    cleanTitle = tp.variables.displayTitle;
} else if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanTitle = tp.variables.title;
} else {
    let tempTitle = rawTitle.replace(/^\d{4}-\d{2}-\d{2}/, "").trim();
    const triggerRegex = new RegExp(`^(${calSuffix.join('|')})\\s*-?\\s*`, "i");
    cleanTitle = tempTitle.replace(triggerRegex, "").trim();
}

let previousCleanTitle = "";
const cleanupRegex = new RegExp(`^\\s*(-|\\b(?:${calSuffix.join('|')})\\b)\\s*`, "i");
while (cleanTitle !== previousCleanTitle) {
    previousCleanTitle = cleanTitle;
    cleanTitle = cleanTitle.replace(cleanupRegex, "");
}

const localDefaultPattern = new RegExp("^" + defaultName + "(\\s\\d+)?$", "i");
if (localDefaultPattern.test(cleanTitle)) {
    cleanTitle = "";
}

if (!cleanTitle && (!cIdx || (cIdx !== 5 && cIdx !== 6))) {
    const needsManualName = ["proj", "prot", "ppm"].includes(activeMod.id);
    if (needsManualName) {
        let pMsg = `Nexus: Name for ${activeMod.label}?`;
        if (activeMod.id === "ppm") pMsg = "🌻 Nexus PPM: Strategic Focus for today?";
        cleanTitle = await tp.system.prompt(pMsg, "", false) || "";
    } else {
        cleanTitle = "";
    }
} else if (cIdx === 5 && reviewPhase !== "revD" && !cleanTitle) {
    cleanTitle = await tp.system.prompt(`Nexus: Title for ${activeMod.label}?`, "", false) || "";
}

tp.variables.title = cleanTitle;
tp.variables.displayTitle = cleanTitle;

// 🔱 FINAL FILENAME
let finalTitle = "";
if (cIdx === 6) {
    finalTitle = moment(dateStr, "YYYY-MM-DD").format("YYYY") + cleanTitle;
} else {
    let displaySuffix = (cIdx === 5) ? revSuffix : activeMod.id;
    finalTitle = `${dateStr} ${displaySuffix}`;
    if (cleanTitle) finalTitle += ` - ${cleanTitle}`;
}

// 🔱 10.1 SET TARGET PATH
const targetFolder = tp.variables.customPath || `${ARCH.c.folder}/${activeMod.subfolder}/${y}/${m}`;

// 🔱 10.2 ENSURE FOLDER STRUCTURE
let curr = "";
for (const seg of targetFolder.split("/")) {
    curr = curr === "" ? seg : `${curr}/${seg}`;
    if (!app.vault.getAbstractFileByPath(curr)) {
        await app.vault.createFolder(curr);
    }
}

// 🔱 10.3 FINAL FILE LOGISTICS
const targetPath = `${targetFolder}/${finalTitle}.md`;
if (tp.file.path !== targetPath) {
    const fileAtTarget = app.vault.getAbstractFileByPath(targetPath);
    if (!fileAtTarget) {
        await tp.file.move(targetPath);
        await new Promise(r => setTimeout(r, 150));
    } else {
        new Notice("⚠️ Note already exists at destination: " + finalTitle);
    }
}

tp.variables.finalTitle = finalTitle;
tp.variables.targetFolder = targetFolder;

// 🔱 11. LOAD FINAL SPECIALIST
let finalTempName = activeMod.tmpl;
if (cIdx === 5) finalTempName = revTemp;
if (cIdx === 6) finalTempName = planTemp;

if (finalTempName) {
    const templatePath = `${SYS.tmpl}/0calendar/${finalTempName}.md`;
    const tFile = app.vault.getAbstractFileByPath(templatePath);
    if (tFile) {
        let raw = await app.vault.read(tFile);
        if (raw.includes("{{YEAR}}") || raw.includes("{{KW}}")) {
            // Shape-based plan (fitness/routine/meal): copy-fill like the snapshot button.
            const py = tp.variables.planYear || tp.date.now("YYYY");
            const pk = tp.variables.planKw || tp.date.now("WW");
            tR += raw.replace(/\{\{YEAR\}\}/g, py).replace(/\{\{KW\}\}/g, pk);
        } else {
            // Templater weekplan (inpra/srs/wardrobe/study): run normally.
            tR += await tp.file.include(tFile);
        }
    } else {
        new Notice("❌ Template missing: " + templatePath);
    }
}
-%>
