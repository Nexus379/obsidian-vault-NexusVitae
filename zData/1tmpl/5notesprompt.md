<%-*
// 🔱 1. INITIALISIERUNG & DATA-RECOVERY
if (!tp.variables) tp.variables = {}; // 🛡️ Der lebenswichtige Crash-Schutz!

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const SYS = tp.variables.SYS || { tmpl: "zData/1tmpl" };
const ARCH = tp.variables.ARCH || {};
const notesRoot = (ARCH && ARCH.n && ARCH.n.folder) ? ARCH.n.folder : "5_Notes";
let title = tp.variables.title || tp.file.title;

if (!title || title.trim() === "" || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("✏️ Nexus Note: Note name?", "");
}
if (!title || title.trim() === "") title = "Note_" + tp.date.now("HH_mm");

// 🔱 2. LUHMANN- & PARENT-DETEKTOR
const history = app.workspace.getLastOpenFiles();
const activeFile = app.workspace.getActiveFile();
let lastFile = null;

for (let path of history) {
    let f = app.vault.getAbstractFileByPath(path);
    if (f && f.path.includes(notesRoot) && !f.path.includes("1_Fleeting") && f.path !== activeFile?.path) { 
        lastFile = f; 
        break; 
    }
}

let pID = null;
let pLink = ""; 
if (lastFile) {
    const fm = app.metadataCache.getFileCache(lastFile)?.frontmatter;
    pID = (fm && fm["LID"]) ? fm["LID"] : (lastFile.basename.match(/^([a-zA-Z0-9.]+)/)?.[0] || null);
    pLink = `[[${lastFile.basename}]]`; 
}

// 🔱 3. ID-BERECHNUNG
let finalLID = "";
if (pID) {
    const isDigit = (char) => /\d/.test(char);
    const lastChar = String(pID).slice(-1);
    let childID = isDigit(lastChar) ? pID + "a" : pID + "1";
    let base = pID.slice(0, -1);
    let siblingID = isDigit(lastChar) ? base + (parseInt(lastChar) + 1).toString() : base + String.fromCharCode(lastChar.charCodeAt(0) + 1);

    let structure = await tp.system.suggester(["🌿 Child ("+childID+")", "👯 Sibling ("+siblingID+")", "🆕 New Branch"], ["child", "sibling", "new"]);
    if (structure && structure !== "new") {
        finalLID = (structure === "child") ? childID : siblingID;
        title = `${finalLID} ${title}`;
    }
}

// 🔱 4. TYP-AUSWAHL
const nOptions = ["1 🍂 Fleeting", "2 📘 Literature", "3 🗃️ Atomic...", "4 📜 Permanent", "5 🌳 Evergreen"];
const nVals = ["1fleet", "2lit", "atomic_sub", "4perma", "5ever"];
const nFolders = ["1_Fleeting", "2_Literature", "3_Atomic", "4_Permanent", "5_Evergreen"];
const originTrigger = String(tp.variables.originTrigger || tp.variables.activeTrigger || "").toLowerCase();
const noteTriggerMap = {
    fleet: "1fleet",
    fleeting: "1fleet",
    lit: "2lit",
    literature: "2lit",
    perma: "4perma",
    permanent: "4perma",
    atomic: "3atomic",
    studycards: "3atomic_studycards",
    studycard: "3atomic_studycards",
    srs: "3atomic_studycards",
    vocab: "3atomic_vocabcards",
    vocabcards: "3atomic_vocabcards",
    vocabcard: "3atomic_vocabcards",
    spacedcard: "3atomic_vocabcards",
    ever: "5ever",
    evergreen: "5ever"
};

let nChoice = noteTriggerMap[originTrigger] || "";
let targetFolder = "";

if (!nChoice) {
    const nIdx = await tp.system.suggester(nOptions, Array.from(nOptions.keys()));
    if (nIdx === null) return;
    nChoice = nVals[nIdx];
    targetFolder = `${notesRoot}/${nFolders[nIdx]}`;
} else {
    const directFolders = {
        "1fleet": `${notesRoot}/1_Fleeting`,
        "2lit": `${notesRoot}/2_Literature`,
        "4perma": `${notesRoot}/4_Permanent`,
        "3atomic": `${notesRoot}/3_Atomic`,
        "3atomic_studycards": `${notesRoot}/3_Atomic/studycards`,
        "3atomic_vocabcards": `${notesRoot}/3_Atomic/vocabcards`,
        "5ever": `${notesRoot}/5_Evergreen`
    };
    targetFolder = directFolders[nChoice];
}

if (nChoice === "atomic_sub") {
    const aOptions = ["1 Standard Atomic", "2 Studycards (Nexus SRS)", "3 Vocabcards (Spaced Repetition Plugin)"];
    const aVals = ["3atomic", "3atomic_studycards", "3atomic_vocabcards"];
    const aFoldersFull = [`${notesRoot}/3_Atomic`, `${notesRoot}/3_Atomic/studycards`, `${notesRoot}/3_Atomic/vocabcards`];
    let aIdx = await tp.system.suggester(aOptions, Array.from(aOptions.keys()));
    if (aIdx === null) return;
    nChoice = aVals[aIdx];
    targetFolder = aFoldersFull[aIdx];
}

// 🔱 5. SCIENCE-MODULE INTEGRATION (Delegiert die Abfrage!)
const needsScience = ["4perma", "2lit", "3atomic", "3atomic_studycards", "3atomic_vocabcards", "5ever"];
if (needsScience.includes(nChoice)) {
    if (typeof tp.user.disciplineEngine === "function") {
        const engine = tp.user.disciplineEngine();
        const discList = engine.getDisciplineLabels();
        const selectedDisc = await tp.system.suggester(
            discList.map(d => `${d.icon} ${d.label}`),
            discList,
            false,
            "Science / Discipline?"
        );
        if (selectedDisc) {
            tp.variables.sciTag = selectedDisc.sci.join('", "');
            tp.variables.discTag = selectedDisc.disc;
            tp.variables.subText = selectedDisc.label;
            tp.variables.persona = selectedDisc.persona;
        }
    }
}

// 🔱 6. FINALE VARIABLEN-ÜBERGABE (Wichtig für dein Template!)
tp.variables.luhmannId = finalLID;
tp.variables.title = title;
tp.variables.pLink = pLink;
// Diese kommen aus dem ScienceModule:
tp.variables.sci = tp.variables.sciTag || "#science";
tp.variables.disc = tp.variables.discTag || "#disc";

// 🔱 7. LOGISTIK
if (tp.file.title !== title) await tp.file.rename(title);
await new Promise(r => setTimeout(r, 450));

let current = "";
for (const seg of targetFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}
try { await tp.file.move(`${targetFolder}/${title}.md`); } catch(e) {}
await new Promise(r => setTimeout(r, 850));

// 🔱 8. TEMPLATE LADEN
const templatePath = `${SYS.tmpl}/5notes/${nChoice}.md`;
tR += await tp.file.include(`[[${templatePath}]]`);
-%>
