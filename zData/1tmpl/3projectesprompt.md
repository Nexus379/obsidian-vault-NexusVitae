<%-*
// 🔱 1. PROJECT-CHOICE FIRST (Die Basis wie beim Area-Prompt)
const pStatusOpt = ["⚡ 1_Active", "⏳ 2_Passive", "☁️ 3_Idea", "🔄 0_Recurring"];
const pStatusVal = ["1active", "2passive", "3idea", "0recurring"];
const pStyleOpt  = ["🛠️ Pro-Do", "🏃🏽 Pro-Go", "🎓 Pro-Study", "📅 Pro-Meet", "💰 Pro-Buy", "💵 Pro-Pay", "🍜 Pro-Cook", "🎀 Pro-Craft"];
const pStyleVal  = ["1prodo", "2progo", "3prostudy", "4promeet", "5probuy", "6propay", "7procook", "8procraft"];

// 🔱 2. NAVIGATION & ESC-SAFETY
let pStatus = null;
const preSub = tp.variables.preSelectedSub || "";

if (preSub) {
    const normalizedPreSub = preSub.toLowerCase().replace(/[_\s-]/g, "");
    pStatus = pStatusVal.find(v => normalizedPreSub.includes(v));
}

if (!pStatus) {
    pStatus = await tp.system.suggester(pStatusOpt, pStatusVal);
}

if (!pStatus) {
    new Notice("Selection cancelled.");
    return; 
}

let style = await tp.system.suggester(pStyleOpt, pStyleVal) || "1prodo";

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

// WICHTIG: Falls dein Router 'p' statt 'projects' nutzt, hier ARCH.p.folder nutzen!
const projectRoot = (ARCH && ARCH.p && ARCH.p.folder) ? ARCH.p.folder : "3_Projects";
const targetFolder = projectRoot;
tp.variables.projectStatus = pStatus;

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
