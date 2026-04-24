<%-*
// 🔱 1. DATA-SYNC & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const SYS = tp.variables.SYS || {};
const ARCH = tp.variables.ARCH || {};

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
const activeTrigger = tp.variables.originTrigger || ""; 

// 🔱 2. TASK SELECTION
const tOptions = ["🛠️ 1_Todo", "🏃🏽 2_Togo", "🎓 3_Tostudy", "📅 4_Tomeet", "💰 5_Tobuy", "💵 6_Topay", "🍜 7_Tocook", "🎀 8_Tocraft"];
const tValues  = ["1todo", "2togo", "3tostudy", "4tomeet", "5tobuy", "6topay", "7tocook", "8tocraft"];

const triggerMap = { 
    "todo": "1todo", 
    "togo": "2togo", 
    "study": "3tostudy", 
    "meet": "4tomeet", 
    "buy": "5tobuy", 
    "pay": "6topay",
    "cook": "7tocook",
    "craft": "8tocraft",
    "t": "1todo" // Expliziter t-Fallback
};

// Wenn kein Trigger
let choice = triggerMap[activeTrigger] || await tp.system.suggester(tOptions, tValues, false, "🛠️ Category?");
if (!choice) choice = "1todo"; // 🔱 DER FALLBACK

// 🔱 3. DEADLINE-MATRIX (Deine Vorgaben)
const deadlineConfig = {
    "1todo": 1,    // +1 Tag
    "2togo": 14,   // 14 Tage
    "3tostudy": 1, // +1 Tag
    "4tomeet": 0,  // Eigenes Datum (Prompt wird leerer Vorschlag oder heute)
    "5tobuy": 7,   // 7 Tage
    "6topay": 3,   // 3 Tage
    "7tocook": 0,  
    "8tocraft": 14 // 14 Tage
};

const daysToAdd = deadlineConfig[choice] || 0;
let suggestion = (choice === "4tomeet") ? tp.date.now("YYYY-MM-DD") : tp.date.now("YYYY-MM-DD", daysToAdd);

tp.variables.deadline = await tp.system.prompt(
    choice === "4tomeet" ? "📅 Event Date (YYYY-MM-DD)?" : `📅 Deadline (+${daysToAdd}d)?`, 
    suggestion
);

// 🔱 5. TITLE & LOGISTICS
if (!title || title.trim() === "" || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🛠️ Task Action: What needs to be done?", "");
}
if (!title || title.trim() === "") title = "Task_" + tp.date.now("HH_mm");
title = title.trim();
tp.variables.title = title;

// Sicherer Fallback für den Root-Folder
const taskRoot = (ARCH && ARCH.t && ARCH.t.folder) ? ARCH.t.folder : "4_Tasks";

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200));
}

let pathAcc = "";
for (const seg of taskRoot.split('/').filter(s => s)) {
    pathAcc += (pathAcc ? "/" : "") + seg;
    if (!app.vault.getAbstractFileByPath(pathAcc)) await app.vault.createFolder(pathAcc);
}

// 🔱 6. RENAME & MOVE (Stabilisiert)
const finalPath = `${taskRoot}/${title}.md`;
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
