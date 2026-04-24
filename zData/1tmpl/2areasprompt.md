<%-*
// 🔱 1. AREA-CHOICE FIRST (Die Basis für alles)
const areaOptions = [
    "🌸 1_Selfcare", "🦄 2_Relationship", "🧠 3_Mind", 
    "🧩 4_Organize", "🎨 5_Creativity", "🚵🏽 6_Activity", "🕹️ 7_Entertainment"
];
const areaFolders = [
    "1_Selfcare", "2_Relationship", "3_Mind", "4_Organize", "5_Creativity", "6_Activity", "7_Entertainment"
];
const areaTemplates = ["1selfcare", "2relation", "3mind", "4organize", "5creativity", "6activity", "7entertain"];

// 🔱 2. NAVIGATION & ESC-SAFETY
let aIdx = -1;
const preSub = tp.variables.preSelectedSub || "";

if (preSub) {
    aIdx = areaFolders.findIndex(f => preSub.includes(f));
}

if (aIdx === -1) {
    aIdx = await tp.system.suggester(areaOptions, Array.from(areaOptions.keys()));
}

// Wenn ESC gedrückt wurde: Abbruch statt 'undefined' Fehler
if (aIdx === null || aIdx === -1) {
    new Notice("Selection cancelled. No changes made.");
    return; 
}

const targetArea = areaFolders[aIdx];
const contentTemplate = areaTemplates[aIdx];

// 🔱 3. DISCIPLINE ENGINE (Erst JETZT, mit der Area im Gepäck)
// Wir speichern die Area vorab in tp.variables, damit spätere Templates sie "sehen" können
tp.variables.area = targetArea;
tp.variables.currentArea = targetArea;

// Die Engine abfragen statt altem Inline-Modul
if (typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const displayList = discList.map(d => `${d.icon} ${d.label}`);
    
    const selectedDisc = await tp.system.suggester(displayList, discList);
    
    if (selectedDisc) {
        tp.variables.sci = selectedDisc.sci.join('", "');
        tp.variables.disc = selectedDisc.disc;
        tp.variables.discIcon = selectedDisc.icon;
    } else {
        tp.variables.sci = "";
        tp.variables.disc = "";
        tp.variables.discIcon = "";
    }
} else {
    new Notice("⚠️ disciplineEngine.js nicht gefunden!");
    tp.variables.sci = "";
    tp.variables.disc = "";
}

// 🔱 4. TITLE & LOGISTICS
const { SYS, ARCH } = tp.variables; // Holt die dynamischen Pfade vom Master-Router
let title = tp.variables.title || tp.file.title;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("💠 Area Name?", "");
}
if (!title) title = "Area-" + tp.date.now("HH-mm");

if (tp.file.title !== title) await tp.file.rename(title);

// Dynamischer Pfad durch ARCH.a.folder
const fullPath = `${ARCH.a.folder}/${targetArea}`;

// Folder-Bot (Ensures folder exists)
if (!app.vault.getAbstractFileByPath(fullPath)) {
    await app.vault.createFolder(fullPath);
}

await tp.file.move(`${fullPath}/${title}.md`);
await new Promise(r => setTimeout(r, 400)); 

// 🔱 5. FINAL HANDOVER
const tPath = `${SYS.tmpl}/2areas/${contentTemplate}.md`;
const tFile = app.vault.getAbstractFileByPath(tPath);

if (tFile) {
    tR += await tp.file.include(tFile);
} else {
    new Notice("❌ Nexus: Template " + tPath + " missing.");
}
-%>
