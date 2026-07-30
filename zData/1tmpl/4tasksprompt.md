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
// The existing numbers (1-8) stay EXACTLY as they were.
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
    "get": "9toget",       // 🔱 number 9
    "toget": "9toget",
    "9toget": "9toget",
    "receive": "9toget",
    "income": "9toget"
};

// If there is no trigger
let choice = triggerMap[activeTrigger] || await tp.system.suggester(tOptions, tValues, false, "🛠️ Category?");
if (!choice) choice = "1todo"; // 🔱 THE FALLBACK

// 🔱 3. DEADLINE MATRIX
const deadlineConfig = {
    "1todo": 1,    // +1 day
    "2togo": 14,   // 14 days
    "3tostudy": 1, // +1 day
    "4tomeet": 0,  // Own date
    "5tobuy": 7,   // 7 days
    "6topay": 3,   // 3 days
    "7tocook": 0,  
    "8tocraft": 14, // 14 days
    "9toget": 3
};

const daysToAdd = deadlineConfig[choice] || 0;
let suggestion = (choice === "4tomeet") ? tp.date.now("YYYY-MM-DD") : tp.date.now("YYYY-MM-DD", daysToAdd);

tp.variables.deadline = await tp.system.prompt(
    choice === "4tomeet" ? "📅 Event Date (YYYY-MM-DD)?" : `📅 Deadline (+${daysToAdd}d)?`, 
    suggestion
);

// 🔱 4. PROJECT ASSIGNMENT (the GTD routing for tasks)
let pLink = "";
let targetFolder = taskRoot;

// EVERY task lands in taskRoot. A task is its own GTD horizon (task4), not a part of a
// project — so it never gets a folder inside 3_Projects. The link to the project lives in
// project3 in the frontmatter, and the project's cockpit is what collects them again.
// A project subfolder would store the same fact twice, and worse: renaming the project
// would orphan the folder while the frontmatter link kept working.

// SMART PATH DETECTION: created inside a project folder → adopt that project as the link,
// but still file the task under taskRoot. 3_Projects is flat, so the pattern is
// <root>/<Project> with no status segment.
const _fp = tp.file.folder(true).replace(/\\/g, "/");
const _pm = _fp.match(new RegExp(projectRootPattern + "\\/([^/]+)"));

if (_pm) {
    pLink = `[[${_pm[1]}]]`;
} else {
    const projs = dv ? dv.pages(`"${projectRoot}"`).where(p => String(p.arch ?? "").includes("#3project")).sort(p => p.file.mtime, "desc") : [];
    const projOptions = ["✖️ No Project (General Task)", "➕ ✨ Create New Project"];
    const projPaths = ["NONE", "NEW"];

    for (let p of projs) {
        // The status comes from the frontmatter, not from the path.
        const stat = p.status ? String(p.status) : "1active";
        projOptions.push(`🧩 ${p.file.name} (${stat})`);
        projPaths.push(`${p.file.name}|${stat}`);
    }

    const pick = await tp.system.suggester(projOptions, projPaths, false, "🔗 Link Task to Project?");

    if (pick === "NEW") {
        // Create a new project on the fly (parity with projectlog).
        // 3_Projects is flat: the status is asked for and written to the frontmatter,
        // it is not part of the path — otherwise every status change would move folders.
        const pName = (await tp.system.prompt("📝 Name of the NEW Project?", "New Project") || "New Project").replace(/[\\/:"*?<>|]+/g, "-").trim();
        const statLabels = ["⚡ Active", "💤 Passive", "☁️ Idea", "🔄 Recurring"];
        const statVals = ["1active", "2passive", "3idea", "0recurring"];
        const pStat = await tp.system.suggester(statLabels, statVals, false, "🚦 Initial Project Status?") || "1active";
        tp.variables.projectStatus = pStat;
        pLink = `[[${pName}]]`;
    } else if (pick && pick !== "NONE") {
        // Existing project selected → link only; the task still lives in taskRoot.
        const pName = pick.split("|")[0];
        pLink = `[[${pName}]]`;
    }
}

// Save the variables so the templates (e.g. 1todo.md) can use the link
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

// Build the folder structure — always taskRoot
let pathAcc = "";
for (const seg of targetFolder.split('/').filter(s => s)) {
    pathAcc += (pathAcc ? "/" : "") + seg;
    if (!app.vault.getAbstractFileByPath(pathAcc)) await app.vault.createFolder(pathAcc);
}

// 🔱 6. RENAME & MOVE (stabilised)
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
