<%-*
// 🔱 1. DATEN-IMPORT & INITIALISIERUNG
const { SYS, ARCH } = tp.variables; // ⬅️ Holt die Pfade dynamisch vom Master-Router ab!
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;

// Titel-Check (Sprachunabhängig)
if (!title || title.trim() === "" || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🌟 Nexus Stars: Name your purpose, vision or goal?", "");
}
if (!title || title.trim() === "") title = "Star_" + tp.date.now("HH_mm");

tp.variables.title = title;

// 🔱 2. NAVIGATION & OPTIONEN
const sOptions = ["🌟 1_Purpose", "🧭 2_Vision", "🎯 3_Goals"];
const sFolders = ["1_Purpose", "2_Vision", "3_Goals"];
const sTemps   = ["1purpose", "2vision", "3goals"]; 

let sIdx = -1;
const preSub = tp.variables.preSelectedSub || "";

if (preSub) {
    sIdx = sFolders.findIndex(f => preSub.toLowerCase().includes(f.toLowerCase()));
}

if (sIdx === -1) {
    sIdx = await tp.system.suggester(sOptions, Array.from(sOptions.keys()));
}
if (sIdx === null || sIdx === -1) return;

// 🔱 2.1 AREA-ZUTEILUNG (Omni-Bridge Vorbereitung)
// Da jeder Star (Goal/Vision) einer Area zugeordnet sein sollte:
const areaLabels = ["🌸 1_Selfcare", "🦄 2_Relationship", "🧠 3_Mind", "🧩 4_Organize", "🎨 5_Creativity", "🚵🏽 6_Activity", "🕹️ 7_Entertainment"];
const aIdx = await tp.system.suggester(areaLabels, [1,2,3,4,5,6,7]);
tp.variables.currentArea = aIdx ? `area${aIdx}` : "area_undefined";

// Pfad bauen (Nutzt dynamisch ARCH.s.folder vom Router)
const targetFolder = `${ARCH.s.folder}/${sFolders[sIdx]}`;
const templateFile = sTemps[sIdx];

// 🔱 3. LOGISTIK (Rename & Move)
if (tp.file.title !== title) await tp.file.rename(title);
await new Promise(r => setTimeout(r, 400)); 

// Folder-Bot (Baut die Struktur falls nötig)
if (!app.vault.getAbstractFileByPath(targetFolder)) {
    let curr = "";
    for (const seg of targetFolder.split('/')) {
        curr = curr === "" ? seg : `${curr}/${seg}`;
        if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
    }
}

const finalPath = `${targetFolder}/${title}.md`;
if (tp.file.path !== finalPath && !app.vault.getAbstractFileByPath(finalPath)) {
    await tp.file.move(finalPath);
}
await new Promise(r => setTimeout(r, 400)); 

// 🔱 4. FINALE ÜBERGABE (Nutzt dynamisch SYS.tmpl vom Router)
const tPath = `${SYS.tmpl}/1stars/${templateFile}.md`;
const tFile = app.vault.getAbstractFileByPath(tPath);

if (tFile) {
    tR += await tp.file.include(tFile);
} else {
    new Notice("❌ Nexus Star-Template fehlt: " + tPath);
}
-%>