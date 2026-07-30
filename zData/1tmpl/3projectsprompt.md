<%-*
// Nexus Router Prompt: Projects
if (!tp.variables) tp.variables = {};
if (!tp.variables.SYS) tp.variables.SYS = { tmpl: "zData/1tmpl", inbox: "0_Inbox" };
if (!tp.variables.ARCH) tp.variables.ARCH = { p: { folder: "3_Projects" } };
// 🔱 1. PROJECT CHOICE FIRST (same basis as the area prompt)
const pStatusOpt = ["1 ⚡ Active", "2 ⏳ Passive", "3 ☁️ Idea", "0 🔄 Recurring"];
const pStatusVal = ["1active", "2passive", "3idea", "0recurring"];

// 🔱 EXACT LIST: 1-8 stay untouched, 9 is added
const pStyleOpt  = ["1 🛠️ Pro-Do", "2 🏃🏽 Pro-Go", "3 🎓 Pro-Study", "4 📅 Pro-Meet", "5 💰 Pro-Buy", "6 💵 Pro-Pay", "7 🍜 Pro-Cook", "8 🎀 Pro-Craft", "9 📥 Pro-Get"];
const pStyleVal  = ["1prodo", "2progo", "3prostudy", "4promeet", "5probuy", "6propay", "7procook", "8procraft", "9proget"];

// 🔱 2. NAVIGATION & ESC-SAFETY
let pStatus = null;
const preSub = tp.variables.preSelectedSub || "";
const originTrigger = String(tp.variables.originTrigger || tp.variables.activeTrigger || "").toLowerCase();
const statusTriggerMap = {
    active: "1active",
    passive: "2passive",
    idea: "3idea",
    recurring: "0recurring"
};
const styleTriggerMap = {
    do: "1prodo", prodo: "1prodo",
    go: "2progo", progo: "2progo",
    study: "3prostudy", prostudy: "3prostudy",
    meet: "4promeet", promeet: "4promeet",
    buy: "5probuy", probuy: "5probuy",
    pay: "6propay", propay: "6propay",
    cook: "7procook", procook: "7procook",
    craft: "8procraft", procraft: "8procraft",
    get: "9proget", proget: "9proget"
};

if (preSub) {
    const normalizedPreSub = preSub.toLowerCase().replace(/[_\s-]/g, "");
    pStatus = pStatusVal.find(v => normalizedPreSub.includes(v));
}

if (!pStatus && statusTriggerMap[originTrigger]) {
    pStatus = statusTriggerMap[originTrigger];
}

if (!pStatus && styleTriggerMap[originTrigger]) {
    pStatus = "1active";
}

if (!pStatus) {
    pStatus = await tp.system.suggester(pStatusOpt, pStatusVal);
}

if (!pStatus) {
    new Notice("Selection cancelled.");
    return; 
}

let style = styleTriggerMap[originTrigger] || await tp.system.suggester(pStyleOpt, pStyleVal) || "1prodo";

// 🔱 3. DISCIPLINE ENGINE
if (typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const displayList = discList.map(d => `${d.icon} ${d.label}`);
    
    const selectedDisc = await tp.system.suggester(displayList, discList);
    
    if (selectedDisc) {
        tp.variables.sci = selectedDisc.sci.join('", "');
        tp.variables.disc = selectedDisc.disc;
        tp.variables.discIcon = selectedDisc.icon;
        tp.variables.area = selectedDisc.area; // Store it straight away for the projects!
        tp.variables.currentArea = selectedDisc.area;
        tp.variables.persona = selectedDisc.persona;
    } else {
        tp.variables.sci = "";
        tp.variables.disc = "";
        tp.variables.discIcon = "";
        tp.variables.area = "";
    }
} else {
    new Notice("⚠️ disciplineEngine.js not found!");
    tp.variables.sci = "";
    tp.variables.disc = "";
}

// 🔱 4. TITLE & LOGISTICS (using the router data)
const { SYS, ARCH } = tp.variables;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = tp.variables.title || tp.file.title;

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🚧 Project Name?", "");
}
if (!title) title = "Project-" + tp.date.now("HH-mm");

if (tp.file.title !== title) await tp.file.rename(title);

// 🎯 NEW: clean display title (matters for a clean folder name)
let displayTitle = title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(1prodo-|p-|3project-)/i, "").trim();

// IMPORTANT: if your router uses "p" instead of "projects", use ARCH.p.folder here
const projectRoot = (ARCH && ARCH.p && ARCH.p.folder) ? ARCH.p.folder : "3_Projects";

// 🎯 Flat by name — status lives in the frontmatter, never in the path. A project
// keeps its folder for its whole life; changing status is a field edit, not a move.
// The status shows up through Supercharged Links, Projects.base and the State formula.
const targetFolder = `${projectRoot}/${displayTitle}`;

// 🛡️ SAFETY NET: store the variables for the final template (1prodo)
tp.variables.projectStatus = pStatus;
tp.variables.title = title; 
tp.variables.displayTitle = displayTitle; 

// Folder bot (secures the structure)
if (!app.vault.getAbstractFileByPath(targetFolder)) {
    let check = "";
    for (const seg of targetFolder.split('/')) {
        check = check === "" ? seg : `${check}/${seg}`;
        if (!app.vault.getAbstractFileByPath(check)) await app.vault.createFolder(check);
    }
}

await tp.file.move(`${targetFolder}/${title}.md`);
await new Promise(r => setTimeout(r, 400)); 

// 🔱 5. FINAL HANDOVER
const tPath = `${SYS.tmpl}/3projects/${style}.md`;
const tFile = app.vault.getAbstractFileByPath(tPath);

if (tFile) {
    tR += await tp.file.include(tFile);
} else {
    new Notice("❌ Nexus Error: Template " + tPath + " missing.");
}

// 🔱 6. THE PROJECT NOTE *IS* THE COCKPIT
// Appended here rather than in each of the ten project templates: every project comes
// through this prompt, so one line reaches all of them and a new project type cannot be
// forgotten.
//
// No separate _Cockpit file: ConnexioModul already collects tasks, notes, resources,
// areas and stars for every note in both directions. Only the calendar side was missing —
// logs and protocols carry #0cal, which Connexio does not cover. That is what this adds,
// plus the open checkboxes so the project can be worked from its own note.
tR += await tp.file.include("[[zData/5design_modul/ProjectCockpitModul]]");
-%>
