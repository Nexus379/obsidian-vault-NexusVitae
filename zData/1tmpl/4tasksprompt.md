<%-*
// Nexus Router Prompt: Tasks
if (!tp.variables) tp.variables = {};
const SYS = tp.variables.SYS || { tmpl: "zData/1tmpl" };
const ARCH = tp.variables.ARCH || {};
const dv = app.plugins.plugins.dataview?.api;
const taskRoot = (ARCH && ARCH.t && ARCH.t.folder) ? ARCH.t.folder : "4_Tasks";
const projectRoot = (ARCH && ARCH.p && ARCH.p.folder) ? ARCH.p.folder : "3_Projects";
const projectRootPattern = projectRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
const activeTrigger = tp.variables.originTrigger || ""; 

// 🔱 2. TASK SELECTION
// Die bestehenden Nummern (1-8) bleiben EXAKT wie sie waren!
const tOptions = ["1 🛠️ Todo", "2 🏃🏽 Togo", "3 🎓 Tostudy", "4 📅 Tomeet", "5 💰 Tobuy", "6 💵 Topay", "7 🍜 Tocook", "8 🎀 Tocraft", "9 📥 Toget"];
const tValues  = ["1todo", "2togo", "3tostudy", "4tomeet", "5tobuy", "6topay", "7tocook", "8tocraft", "9toget"];

const triggerMap = { 
    "todo": "1todo", 
    "1todo": "1todo",
    "togo": "2togo", 
    "go": "2togo",
    "2togo": "2togo",
    "study": "3tostudy", 
    "tostudy": "3tostudy",
    "3tostudy": "3tostudy",
    "meet": "4tomeet", 
    "tomeet": "4tomeet",
    "4tomeet": "4tomeet",
    "buy": "5tobuy", 
    "tobuy": "5tobuy",
    "5tobuy": "5tobuy",
    "pay": "6topay",
    "topay": "6topay",
    "6topay": "6topay",
    "cook": "7tocook",
    "tocook": "7tocook",
    "7tocook": "7tocook",
    "craft": "8tocraft",
    "tocraft": "8tocraft",
    "8tocraft": "8tocraft",
    "get": "9toget",       // 🔱 NEU (Nummer 9)
    "toget": "9toget",
    "9toget": "9toget",
    "receive": "9toget",
    "income": "9toget"
};

// Wenn kein Trigger
let choice = triggerMap[activeTrigger] || await tp.system.suggester(tOptions, tValues, false, "🛠️ Category?");
if (!choice) choice = "1todo"; // 🔱 DER FALLBACK

// 🔱 3. DEADLINE-MATRIX (Deine Vorgaben)
const deadlineConfig = {
    "1todo": 1,    // +1 Tag
    "2togo": 14,   // 14 Tage
    "3tostudy": 1, // +1 Tag
    "4tomeet": 0,  // Eigenes Datum
    "5tobuy": 7,   // 7 Tage
    "6topay": 3,   // 3 Tage
    "7tocook": 0,  
    "8tocraft": 14, // 14 Tage
    "9toget": 3    // 🔱 NEU
};

const daysToAdd = deadlineConfig[choice] || 0;
let suggestion = (choice === "4tomeet") ? tp.date.now("YYYY-MM-DD") : tp.date.now("YYYY-MM-DD", daysToAdd);

tp.variables.deadline = await tp.system.prompt(
    choice === "4tomeet" ? "📅 Event Date (YYYY-MM-DD)?" : `📅 Deadline (+${daysToAdd}d)?`, 
    suggestion
);

// 🔱 4. PROJECT ASSIGNMENT (Das neue GTD-Routing für Tasks)
let pLink = "";
let targetFolder = taskRoot;

// SMART PATH DETECTION: created directly inside a project's Tasks folder → auto-link, skip the prompt
const _fp = tp.file.folder(true).replace(/\\/g, "/");
const _pm = _fp.match(new RegExp(projectRootPattern + "\\/(1_Active|2_Passive|3_Idea|0_Recurring|4_Archive)\\/([^/]+)\\/Tasks"));

if (_pm) {
    pLink = `[[${_pm[2]}]]`;
    targetFolder = `${projectRoot}/${_pm[1]}/${_pm[2]}/Tasks`;
} else {
    const projs = dv ? dv.pages(`"${projectRoot}"`).where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/")).sort(p => p.file.mtime, "desc") : [];
    const projOptions = ["✖️ No Project (General Task)", "➕ ✨ Create New Project"];
    const projPaths = ["NONE", "NEW"];

    for (let p of projs) {
        let match = p.file.path.match(new RegExp(projectRootPattern + "\\/(1_Active|2_Passive|3_Idea|0_Recurring|4_Archive)"));
        let stat = match ? match[1] : "1_Active";
        projOptions.push(`🧩 ${p.file.name} (${stat})`);
        projPaths.push(`${p.file.name}|${stat}`);
    }

    const pick = await tp.system.suggester(projOptions, projPaths, false, "🔗 Link Task to Project?");

    if (pick === "NEW") {
        // Create a new project on the fly (parity with projectlog)
        const pName = (await tp.system.prompt("📝 Name of the NEW Project?", "New Project") || "New Project").replace(/[\\/:"*?<>|]+/g, "-").trim();
        const statLabels = ["🟢 1_Active", "🟡 2_Passive", "💡 3_Idea", "🔄 0_Recurring"];
        const statFolders = ["1_Active", "2_Passive", "3_Idea", "0_Recurring"];
        const pStat = await tp.system.suggester(statLabels, statFolders, false, "🚦 Initial Project Status?") || "1_Active";
        pLink = `[[${pName}]]`;
        targetFolder = `${projectRoot}/${pStat}/${pName}/Tasks`;
    } else if (pick && pick !== "NONE") {
        // Existing project selected → build the project Tasks path
        const parts = pick.split("|");
        const pName = parts[0];
        const pStat = parts[1];
        pLink = `[[${pName}]]`;
        targetFolder = `${projectRoot}/${pStat}/${pName}/Tasks`;
    }
}

// Variablen sichern, damit die Templates (z.B. 1todo.md) den Link nutzen können
tp.variables.pLink = pLink;

// 🔱 5. TITLE & LOGISTICS
if (!title || title.trim() === "" || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🛠️ Task Action: What needs to be done?", "");
}
if (!title || title.trim() === "") title = "Task_" + tp.date.now("HH_mm");
title = title.trim();
tp.variables.title = title;

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200));
}

// Ordnerstruktur bauen (entweder 4_Tasks oder der Projekt-Ordner)
let pathAcc = "";
for (const seg of targetFolder.split('/').filter(s => s)) {
    pathAcc += (pathAcc ? "/" : "") + seg;
    if (!app.vault.getAbstractFileByPath(pathAcc)) await app.vault.createFolder(pathAcc);
}

// 🔱 6. RENAME & MOVE (Stabilisiert)
const finalPath = `${targetFolder}/${title}.md`;
if (tp.file.path !== finalPath && !app.vault.getAbstractFileByPath(finalPath)) {
    await tp.file.move(finalPath);
}

// 🔱 7. LOAD CONTENT
const tmplBase = SYS.tmpl || "zData/1tmpl"; // Hardcoding fallback
const tPath = `${tmplBase}/4tasks/${choice}.md`;
const tFile = app.vault.getAbstractFileByPath(tPath);

if (tFile) {
    tR += await tp.file.include(tFile);
} else {
    new Notice("❌ Template missing: " + tPath);
    tR += `> [!error] Template missing: ${tPath}`;
}
-%>
