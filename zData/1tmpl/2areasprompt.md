<%*
// 🔱 1. AREA-CHOICE FIRST (Die Basis für alles)
const areaOptions = [
    "1 🌸 Selfcare", "2 🦄 Relationship", "3 🧠 Mind", 
    "4 🧩 Organize", "5 🎨 Creativity", "6 🚵🏽 Activity", "7 🕹️ Entertainment"
];
const areaFolders = [
    "1_Selfcare", "2_Relationship", "3_Mind", "4_Organize", "5_Creativity", "6_Activity", "7_Entertainment"
];
const areaTemplates = ["1selfcare", "2relation", "3mind", "4organize", "5creativity", "6activity", "7entertain"];

// SICHERHEIT: Fallback für tp.variables
const v = tp.variables || {};

// 🔱 2. NAVIGATION & ESC-SAFETY
let aIdx = -1;
const preSub = v.preSelectedSub || "";
const originTrigger = String(v.originTrigger || v.activeTrigger || "").toLowerCase();
const areaTriggerMap = {
    selfcare: 0,
    relation: 1,
    relationship: 1,
    person: 1,
    mind: 2,
    organize: 3,
    creativity: 4,
    activity: 5,
    entertain: 6,
    entertainment: 6
};

if (preSub) {
    aIdx = areaFolders.findIndex(f => preSub.includes(f));
}

if (aIdx === -1 && areaTriggerMap[originTrigger] !== undefined) {
    aIdx = areaTriggerMap[originTrigger];
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

// 🔱 3. DISCIPLINE ENGINE
// Sicherstellen, dass tp.variables existiert, bevor wir darauf schreiben
if (!tp.variables) tp.variables = {};
tp.variables.area = targetArea;
tp.variables.currentArea = targetArea;

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
    new Notice("⚠️ disciplineEngine.js not found!");
    tp.variables.sci = "";
    tp.variables.disc = "";
}

// 🔱 4. TITLE & LOGISTICS
// Sicherheits-Fallbacks für SYS und ARCH, falls das Template direkt gestartet wird
const SYS = v.SYS || { tmpl: "zData/0_Templates" };
const ARCH = v.ARCH || { a: { folder: "2_Areas" } };

let title = v.title || tp.file.title;
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

// 🔱 4.5 MOC AUTO-GENERATOR
try {
    let subfolderName = "";
    if (title.includes("/")) {
        subfolderName = title.substring(0, title.lastIndexOf("/"));
    } else {
        subfolderName = targetArea; 
    }

    let mocTitleName = subfolderName;
    if (mocTitleName.includes("/")) {
        mocTitleName = mocTitleName.substring(mocTitleName.lastIndexOf("/") + 1);
    }
    mocTitleName = mocTitleName.replace(/^[0-9]+_/, "");

    const mocFolderPath = "0_Atlas/MOCs";
    const mocFilePath = `${mocFolderPath}/${mocTitleName} MOC.md`;

    if (!app.vault.getAbstractFileByPath(mocFolderPath)) {
        await app.vault.createFolder(mocFolderPath);
    }

    if (!app.vault.getAbstractFileByPath(mocFilePath)) {
        let targetFolderForMOC = `${fullPath}`;
        if (title.includes("/")) {
            targetFolderForMOC += `/${subfolderName}`;
        }
        
        let mocContent = "---\narch:\n  - \"#moc\"\n---\n# 🗺️ " + mocTitleName + " MOC\n";
        mocContent += "```dataviewjs\n";
        mocContent += "const links = dv.pages('\"0_Atlas/MOCs\"').file.sort(f => f.name).map(f => {\n";
        mocContent += "    let name = f.name.replace(/ ?MOC/g, \"\");\n";
        mocContent += "    if(f.name.includes(\"Atlas\")) name = \"🗺️ \" + name;\n";
        mocContent += "    if(f.name.includes(\"Resources\")) name = \"🔖 \" + name;\n";
        mocContent += "    return \"[[\" + f.path + \"|\" + name + \"]]\";\n";
        mocContent += "});\n";
        mocContent += "dv.paragraph(links.join(\" &nbsp;|&nbsp; \"));\n";
        mocContent += "```\n";
        mocContent += "![[zData/5design_modul/NavigationModul|NavigationModul]]\n\n";
        mocContent += `> [!multi-column]\n>\n>> [!abstract] ${mocTitleName} Index\n`;
        mocContent += ">> ```dataview\n";
        mocContent += ">> TABLE without ID\n";
        mocContent += ">>   file.link as \"Item\",\n";
        mocContent += ">>   archtype as \"Typ\",\n";
        mocContent += ">>   status as \"Status\"\n";
        mocContent += `>> FROM "${targetFolderForMOC}"\n`;
        mocContent += ">> SORT archtype ASC, file.mtime DESC\n";
        mocContent += ">> ```\n";

        await app.vault.create(mocFilePath, mocContent);
        new Notice(`🌟 Auto-Generated MOC: ${mocTitleName} MOC`);
    }
} catch (e) {
    console.error("MOC Generator Error:", e);
}

// 🔱 5. FINAL HANDOVER
const tPath = `${SYS.tmpl}/2areas/${contentTemplate}.md`;
const tFile = app.vault.getAbstractFileByPath(tPath);

if (tFile) {
    tR += await tp.file.include(tFile);
} else {
    new Notice("❌ Nexus: Template " + tPath + " missing.");
}
-%>