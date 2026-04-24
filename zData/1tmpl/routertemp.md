<%-*
// 🔱 1. INITIALIZATION & STABILIZATION
await new Promise(r => setTimeout(r, 150));
if (!tp.variables) { tp.variables = {}; }

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const rawTitle = String(tp.file.title);
const folderPath = tp.file.folder(true);

let selection = "";
let subFolderDetected = "";
let activeTrigger = "";

// 🔱 1.1 Extra Stabilization against Banners-Errors
await new Promise(r => setTimeout(r, 200));
if (!tp.variables) tp.variables = {};

// 🛑 1.2 CALENDAR EMERGENCY BRAKE
// If the title contains a date or calendar trigger, we route it
// We save the match to remove it precisely later
const dateMatch = rawTitle.match(/^\d{4}-\d{2}-\d{2}/);
const detectedCalTrigger = ["plm","pkm","ppm","projectlog","proj","protocol","prot","rev"].find(s => rawTitle.toLowerCase().includes(s));
if (dateMatch || detectedCalTrigger) {
    if (!selection) selection = "0calendarprompt";
    if (!activeTrigger) activeTrigger = detectedCalTrigger || ""; // If only a date was found, let Chronos ask for the module
    tp.variables.foundDate = dateMatch ? dateMatch[0] : null; 
}

// 🔱 2. INTERFACE
tp.variables.SYS = { tmpl: "zData/1tmpl", inbox: "0_Inbox" };
const SYS = tp.variables.SYS;

// 🔱 2.1 ARCH-DEFINITION & TRIGGERS
tp.variables.ARCH = {
    c: { label: "Calendar",  folder: "0_Calendar",  icon: "📅", prompt: "0calendarprompt", trigger: ["c","cal"] },
    s: { label: "Stars",     folder: "1_Stars",     icon: "✨", prompt: "1starsprompt", trigger: ["s","stars"] },
    a: { label: "Areas",     folder: "2_Areas",     icon: "💠", prompt: "2areasprompt", trigger: ["a","areas"] },
    p: { label: "Projects",  folder: "3_Projects",  icon: "🧩", prompt: "3projectesprompt", trigger: ["p","projects"] },
    t: { label: "Tasks",     folder: "4_Tasks",     icon: "🛠️", prompt: "4tasksprompt", trigger: ["t","tasks"] },
    n: { label: "Notes",     folder: "5_Notes",     icon: "✏️", prompt: "5notesprompt", trigger: ["n","notes"] },
    r: { label: "Resources", folder: "6_Resources", icon: "🔖", prompt: "6resourcesprompt", trigger: ["r","resources"] }
};

const ARCH = tp.variables.ARCH;
const CHRONOS_TRIGGERS = ["cal", "plm", "pkm", "ppm", "jou", "studylog", "log", "projectlog", "proj", "prot", "rev"];

// 🔱 3. PROMPT-MAPPING
const promptMap = {
    "c": ARCH.c.prompt, "cal": ARCH.c.prompt, "plm": ARCH.c.prompt, "ppm": ARCH.c.prompt, "pkm": ARCH.c.prompt,
    "projectlog": ARCH.c.prompt, "log": ARCH.c.prompt, "rev": ARCH.c.prompt, "studylog": ARCH.c.prompt, "jou": ARCH.c.prompt,
    "s": ARCH.s.prompt, "stars": ARCH.s.prompt, "purpose": ARCH.s.prompt, "vision": ARCH.s.prompt, "goal": ARCH.s.prompt, "goals": ARCH.s.prompt,
    "a": ARCH.a.prompt, "areas": ARCH.a.prompt, "selfcare": ARCH.a.prompt, "relation": ARCH.a.prompt, "person": ARCH.a.prompt,
    "mind": ARCH.a.prompt, "organize": ARCH.a.prompt, "creativity": ARCH.a.prompt, "activity": ARCH.a.prompt,
    "entertain": ARCH.a.prompt, "entertainment": ARCH.a.prompt,
    "p": ARCH.p.prompt, "projects": ARCH.p.prompt, "prodo": ARCH.p.prompt, "progo": ARCH.p.prompt, "prostudy": ARCH.p.prompt,
    "promeet": ARCH.p.prompt, "probuy": ARCH.p.prompt, "propay": ARCH.p.prompt, "procook": ARCH.p.prompt, "procraft": ARCH.p.prompt,
    "t": ARCH.t.prompt, "tasks": ARCH.t.prompt, "todo": ARCH.t.prompt, "togo": ARCH.t.prompt, "tostudy": ARCH.t.prompt,
    "tomeet": ARCH.t.prompt, "tobuy": ARCH.t.prompt, "topay": ARCH.t.prompt, "tocook": ARCH.t.prompt, "tocraft": ARCH.t.prompt, "toenjoy": ARCH.t.prompt,
    "n": ARCH.n.prompt, "notes": ARCH.n.prompt, "fleet": ARCH.n.prompt, "lit": ARCH.n.prompt, "perma": ARCH.n.prompt,
    "atomic": ARCH.n.prompt, "anki": ARCH.n.prompt, "nutri": ARCH.n.prompt, "ever": ARCH.n.prompt,
    "r": ARCH.r.prompt, "resources": ARCH.r.prompt, "ai": ARCH.r.prompt, "article": ARCH.r.prompt, "book": ARCH.r.prompt,
    "class": ARCH.r.prompt, "course": ARCH.r.prompt, "film": ARCH.r.prompt, "game": ARCH.r.prompt, "museum": ARCH.r.prompt,
    "music": ARCH.r.prompt, "paper": ARCH.r.prompt, "recipe": ARCH.r.prompt, "reference": ARCH.r.prompt, "serie": ARCH.r.prompt,
    "video": ARCH.r.prompt
};

// 🔱 4. DETECTION LOGIC
// A) Dashboard / PreSelected
if (tp.variables.preSelectedSub) {
  const pre = tp.variables.preSelectedSub;
  const hit = Object.values(ARCH).find(mod => pre.toLowerCase().includes(mod.folder.toLowerCase()));
  if (hit) { 
      selection = hit.prompt; 
      subFolderDetected = pre; 
      activeTrigger = (hit.trigger && hit.trigger[0]) || ""; 
  }
}

// B) Trigger from Title
if (!selection && rawTitle.includes("-")) {
    let t = rawTitle.split("-")[0].toLowerCase().replace(/\s+/g, "");
    if (promptMap[t]) { selection = promptMap[t]; activeTrigger = t; }
}

// C) Folder Path Analysis
const normPath = folderPath.replace(/\\/g,"/");
if (!selection && normPath !== "/" && normPath !== SYS.inbox) {
    const root = normPath.split("/")[0];
    for (let k of Object.keys(ARCH)) {
        if (root.startsWith(ARCH[k].folder)) {
            selection = ARCH[k].prompt;
            activeTrigger = (ARCH[k].trigger && ARCH[k].trigger[0]) || activeTrigger;
            break;
        }
    }
    const segs = normPath.split("/");
    if (segs.length > 1) subFolderDetected = segs[1];
}

// D) Manual Fallback
if (!selection) {
    const labels = Object.keys(ARCH).map(k => ARCH[k].icon + " " + ARCH[k].label);
    const keys = Object.keys(ARCH).map(k => ARCH[k].prompt);
    selection = await tp.system.suggester(labels, keys);
}
if (!selection) return;

// 🔱 5. CLEANING & NAMING PROMPT (Nexus Intervention)
let cleanTitle = rawTitle;

// 1. Remove date at the beginning (if Chronos)
if (tp.variables.foundDate && cleanTitle.startsWith(tp.variables.foundDate)) {
    if (cleanTitle.length > tp.variables.foundDate.length) {
        cleanTitle = cleanTitle.substring(tp.variables.foundDate.length).replace(/^-/, "").trim();
    } else {
        cleanTitle = ""; // Only date was present
    }
}

// 2. Remove trigger prefix (e.g., "p-" -> "")
if (activeTrigger && promptMap[activeTrigger]) {
    const prefix = activeTrigger + "-";
    if (cleanTitle.toLowerCase().startsWith(prefix.toLowerCase())) {
        cleanTitle = cleanTitle.substring(prefix.length).trim();
    }
}

// 3. Status check for Calendar modules
const selMod = Object.values(ARCH).find(m => m.prompt === selection);
const isChronos = CHRONOS_TRIGGERS.includes(activeTrigger) || (selMod && selMod.folder === ARCH.c.folder);

// 4. Active Prompt Intervention (Language-Agnostic)
const isUntitled = !cleanTitle || cleanTitle.toLowerCase().includes(defaultName.toLowerCase());

if (isUntitled) {
    if (!isChronos) {
        // Dynamic label extraction (e.g., "Projects", "Areas") with "Note" as universal fallback
        const labelStr = (selMod && selMod.label) ? selMod.label : (activeTrigger || "Note");
        
        // System-independent English prompt
        const userTitle = await tp.system.prompt(`Nexus: Name for ${labelStr}?`, "", false);
        
        // Fallback using universal Date format if aborted
        cleanTitle = userTitle || `Entry-${tp.date.now("MM-DD-ss")}`; 
    } else {
        // Delegate to 0calendarprompt
        cleanTitle = ""; 
    }
}

// Final fallback cleanup of "Untitled" remnants
if (cleanTitle.toLowerCase() === defaultName.toLowerCase()) {
    cleanTitle = `Entry-${tp.date.now("MM-DD-ss")}`;
}

// 🔱 TRANSFER TO TP.VARIABLES
tp.variables.title = String(cleanTitle);
tp.variables.activeTrigger = activeTrigger;
tp.variables.preSelectedSub = subFolderDetected;

// 🛡️ INTELLIGENT RENAME
// Only rename physically if it's not a pure Chronos event and the name has changed
if (!isChronos && cleanTitle && cleanTitle.trim() !== "" && cleanTitle !== rawTitle) {
    const checkExist = app.vault.getAbstractFileByPath(`${folderPath}/${cleanTitle}.md`);
    if (!checkExist) {
        await tp.file.rename(cleanTitle);
        // Short stabilization pause for Obsidian
        await new Promise(r => setTimeout(r, 150));
    }
}

// 🔱 6. LOAD SPECIALIST
const finalPath = `${tp.variables.SYS.tmpl}/${selection}.md`;
const fileObj = app.vault.getAbstractFileByPath(finalPath);
if (fileObj) {
    tR = "";
    tR += await tp.file.include(fileObj);
} else {
    new Notice("❌ Nexus Error: " + finalPath + " not found!");
}
-%>
