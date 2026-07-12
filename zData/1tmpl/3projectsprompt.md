<%-*
// 🔱 1. PROJECT-CHOICE FIRST (Die Basis wie beim Area-Prompt)
const pStatusOpt = ["1 ⚡ Active", "2 ⏳ Passive", "3 ☁️ Idea", "0 🔄 Recurring"];
const pStatusVal = ["1active", "2passive", "3idea", "0recurring"];

// 🔱 EXAKTE LISTE: 1-8 bleiben unangetastet, 9 wird ergänzt
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
        tp.variables.area = selectedDisc.area; // Direkt für die Projekte sichern!
        tp.variables.currentArea = selectedDisc.area;
        tp.variables.persona = selectedDisc.persona;
    } else {
        tp.variables.sci = "";
        tp.variables.disc = "";
        tp.variables.discIcon = "";
        tp.variables.area = "";
    }
} else {
    new Notice("⚠️ disciplineEngine.js nicht gefunden!");
    tp.variables.sci = "";
    tp.variables.disc = "";
}

// 🔱 4. TITLE & LOGISTICS (Hier nutzen wir die Router-Daten)
const { SYS, ARCH } = tp.variables;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = tp.variables.title || tp.file.title;

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🚧 Project Name?", "");
}
if (!title) title = "Project-" + tp.date.now("HH-mm");

if (tp.file.title !== title) await tp.file.rename(title);

// 🎯 NEU: Clean Display Title (wichtig für einen sauberen Ordnernamen)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(1prodo-|p-|3project-)/i, "").trim();

// 🎯 NEU: GTD Ordner-Mapping
const statusFolderMap = {
    "1active": "1_Active",
    "2passive": "2_Passive",
    "3idea": "3_Idea",
    "0recurring": "0_Recurring"
};
const statFolder = statusFolderMap[pStatus] || "1_Active";

// WICHTIG: Falls dein Router 'p' statt 'projects' nutzt, hier ARCH.p.folder nutzen!
const projectRoot = (ARCH && ARCH.p && ARCH.p.folder) ? ARCH.p.folder : "3_Projects";

// 🎯 NEU: Der Pfad zielt jetzt in den GTD-Ordner
const targetFolder = `${projectRoot}/${statFolder}/${displayTitle}`;

// 🛡️ SICHERHEITS-NETZ: Variablen für das finale Template (1prodo) abspeichern!
tp.variables.projectStatus = pStatus;
tp.variables.title = title; 
tp.variables.displayTitle = displayTitle; 

// Folder-Bot (Sichert die Struktur)
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
-%>
