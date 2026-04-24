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
    { id: "plm",  label: "Journal",    icon: "🌷", subfolder: "1_PLM",        tmpl: "dailyplm" },
    { id: "ppm",  label: "Log",        icon: "🌻", subfolder: "2_PPM",        tmpl: "dailyppm" },
    { id: "pkm",  label: "Studylog",   icon: "🌼", subfolder: "3_PKM",        tmpl: "dailypkm" },
    { id: "proj", label: "Projectlog", icon: "🧩", subfolder: "4_Projectlog", tmpl: "projectlog", connectTo: "p" },
    { id: "prot", label: "Protocol",   icon: "📜", subfolder: "5_Protocol",   tmpl: "protocol",   connectTo: "c" },
    { id: "rev",  label: "Review",     icon: "🛰️", subfolder: "6_Review",   tmpl: "rev" }
];
const ARCHTYPES_CAL = tp.variables.ARCHTYPES_CAL;
const reviewBase = "6_Review";

const calLabel     = ARCHTYPES_CAL.map(m => `${m.icon || ""} ${m.label}`.trim());
const calSubfolder = ARCHTYPES_CAL.map(m => m.subfolder);
const calSuffix    = ARCHTYPES_CAL.map(m => m.id);

// 🔱 4. TRIGGER & DATE DETECTION
if (!activeTrigger) {
    const lowered = rawTitle.toLowerCase();
    const hit = calSuffix.find(suf => lowered.includes(` ${suf}`) || lowered.endsWith(suf));
    if (hit) activeTrigger = hit;
    tp.variables.activeTrigger = activeTrigger;
}

let dateStr = tp.variables.targetDate;
if (!dateStr) {
    const today = tp.date.now("YYYY-MM-DD");
    if (/^\d{4}-\d{2}-\d{2}/.test(rawTitle)) {
        dateStr = rawTitle.substring(0, 10);
    } else if (activeTrigger) {
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

// 🔱 5. MODULE SELECTION
let cIdx = null;
const preSub = tp.variables.preSelectedSub || "";
if (preSub) {
    cIdx = calSubfolder.findIndex(v => preSub.toLowerCase().includes(v.toLowerCase()));
}
if (cIdx === null || cIdx === -1) {
    const triggerMap = { plm:0, ppm:1, pkm:2, projectlog:3, proj:3, prjlog:3, protocol:4, prot:4, prtcl:4, rev:5 };
    if (triggerMap[activeTrigger] !== undefined) cIdx = triggerMap[activeTrigger];
}

if ((cIdx === null || cIdx === -1) && !activeTrigger) {
    cIdx = await tp.system.suggester(calLabel, Array.from(calLabel.keys()), false, "🔱 Nexus Chronos: Which module?");
}

if (cIdx === null || cIdx === -1) return;
const activeMod = ARCHTYPES_CAL[cIdx];

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
const [y, m] = dateStr.split("-");

// --- CASE A: PROJECTLOG (cIdx 3) ---
if (cIdx === 3 && dv && ARCH.p) {
    const projects = dv.pages(`"${ARCH.p.folder}"`).sort(p => p.file.mtime, "desc").limit(15).file.path.array();
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
    
    // PRE-CALCULATE PATH
    if (logConnect) {
        tp.variables.displayTitle = logConnect.replace(/[\[\]]/g, "");
        tp.variables.title = tp.variables.displayTitle;
        tp.variables.customPath = `${ARCH.c.folder}/${activeMod.subfolder}/${y}/${tp.variables.displayTitle}/${m}`;
    }
}
// --- CASE B: PROTOCOL (cIdx 4) ---
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
    
    // 1. Phase?
    reviewPhase = await tp.system.suggester(revOptions, revKeys, false, "🛰️ Nexus Review Phase?");
    if (!reviewPhase) return;

    // 2. Module? (Master + Modules)
    const revModules = [
        { id: "master", label: "🔱 Master (All Modules)", subfolder: "0_Master" },
        ...ARCHTYPES_CAL.slice(0, 4) 
    ];
    const modChoice = await tp.system.suggester(revModules.map(m => m.label), revModules, false, `🛰️ Review for which Module?`);
    if (!modChoice) return;

    const targetMoment = moment(dateStr, "YYYY-MM-DD");
    tp.variables.kw = targetMoment.format("WW");
    tp.variables.year = targetMoment.format("YYYY");

    // 3. Display Title Logic
    if (reviewPhase === "revD") {
        tp.variables.displayTitle = ""; // Empty! Keeps filename clean for daily
    } else if (reviewPhase === "revW") {
        tp.variables.displayTitle = `CW ${tp.variables.kw}`; 
    } else if (reviewPhase === "revM") {
        tp.variables.displayTitle = targetMoment.format("MMMM");
    } else if (reviewPhase === "revQ") {
        tp.variables.displayTitle = `Q${targetMoment.format("Q")}`;
    } else if (reviewPhase === "revY") {
        tp.variables.displayTitle = `${tp.variables.year}`;
    }

    let modSubPath = modChoice.subfolder;
    
    // Select Project if Project Review
    if (modChoice.id === "proj" && dv && ARCH.p) {
        const projects = dv.pages(`"${ARCH.p.folder}"`).sort(p => p.file.mtime, "desc").limit(15).file.path.array();
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
    const folderObj = app.vault.getAbstractFileByPath(revFolderPath);
    if (folderObj && folderObj.children) {
        const filterStr = `${modChoice.id}_${reviewPhase}`;
        const lastFiles = folderObj.children.filter(f => f.name.includes(filterStr)).sort((a,b)=>b.name.localeCompare(a.name));
        if (lastFiles.length > 0) lastDate = lastFiles[0].name.substring(0,10);
    }
    if (!lastDate) {
        const fallbacks = { revD:1, revW:7, revM:30, revQ:90, revH:180, revY:365 };
        lastDate = tp.date.now("YYYY-MM-DD", -fallbacks[reviewPhase]);
    }
    tp.variables.revStart  = lastDate;
    tp.variables.revEnd    = dateStr;
    tp.variables.revModule = modChoice.id; // "master", "plm", "proj" etc.
    
    // 🎯 THE CLEAN FILENAME FIX
    if (modChoice.id === "master" && reviewPhase === "revD") {
        revSuffix = "revD"; // Minimalist Daily Review: "revD"
    } else {
        revSuffix = `${modChoice.id}_${reviewPhase}`; // Others: "master_revW", "proj_revD"
    }
    
    revTemp = reviewPhase.toLowerCase(); // "revd", "revw"
    
    tp.variables.customPath = (reviewPhase === "revH" || reviewPhase === "revY") ? `${revFolderPath}/${y}` : `${revFolderPath}/${y}/${m}`;
}

// 🔱 9. TITLE CLEANUP & STRUCTURE
let cleanTitle = "";

if (tp.variables.displayTitle !== undefined && tp.variables.displayTitle !== "") {
    cleanTitle = tp.variables.displayTitle;
} 
else if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanTitle = tp.variables.title;
} else {
    cleanTitle = rawTitle.replace(/^\d{4}-\d{2}-\d{2}/, "")
                         .replace(new RegExp(`^${activeTrigger}-?`, "i"), "")
                         .trim();
}

if (!cleanTitle && (!cIdx || cIdx !== 5)) {
    const needsManualName = ["proj", "prot"].includes(activeMod.id);
    if (needsManualName) {
        cleanTitle = await tp.system.prompt(`Nexus: Name for ${activeMod.label}?`, "", false) || "";
    } else {
        cleanTitle = ""; 
    }
} else if (cIdx === 5 && reviewPhase !== "revD" && !cleanTitle) {
    // Only ask for a name if it's a Review, NOT Daily, and has no title yet
    cleanTitle = await tp.system.prompt(`Nexus: Title for ${activeMod.label}?`, "", false) || "";
}

tp.variables.title = cleanTitle;
tp.variables.displayTitle = cleanTitle; 

// 🔱 FINAL FILENAME (e.g., 2026-04-20 revD)
let displaySuffix = (cIdx === 5) ? revSuffix : activeMod.id;
let finalTitle = `${dateStr} ${displaySuffix}`;
if (cleanTitle) finalTitle += ` - ${cleanTitle}`;

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
const finalTempName = revTemp || activeMod.tmpl;
if (finalTempName) {
    const templatePath = `${SYS.tmpl}/0calendar/${finalTempName}.md`;
    const tFile = app.vault.getAbstractFileByPath(templatePath);
    if (tFile) {
        tR += await tp.file.include(tFile);
    } else {
        new Notice("❌ Template missing: " + templatePath);
    }
}
-%>
