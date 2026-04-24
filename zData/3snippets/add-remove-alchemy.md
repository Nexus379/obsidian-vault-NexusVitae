<%-*
/**
 * 🧪 DAILY ALCHEMY INJECTOR (Fixed Active File)
 * Path: zData/3snippets/add-daily-alchemy.md
 */

// 🔱 0. DATEI SICHER GREIFEN (Der Lebensretter für Meta Bind)
const activeFile = app.workspace.getActiveFile();
if (!activeFile) {
    new Notice("❌ Fehler: Konnte die aktuelle Datei nicht finden.");
    return;
}

// 🔱 1. INITIALIZATION
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
let Nexus;
try {
    const engineInit = require(enginePath);
    Nexus = await engineInit(app);
} catch (e) {
    new Notice("❌ Fehler: Nexus Engine konnte nicht geladen werden.");
    return;
}
const foodDb = Nexus.getDomain("FOOD");

// 🔱 2. UI: SELECT MOD-TYPE 
const modTypes = [
    {display: "➕ ADD (Extra Zutat gegessen)", value: "food_add"},
    {display: "➖ REMOVE (Zutat weggelassen)", value: "food_rem"}
];
const modTypeObj = await tp.system.suggester(modTypes.map(m => m.display), modTypes, false, "Was ist passiert?");
if (!modTypeObj) return;
const targetProperty = modTypeObj.value;

// 🔱 3. UI: SELECT ATOM (Ingredient)
const options = Object.entries(foodDb).map(([key, item]) => {
    const localName = item.label || key; 
    return {
        display: `${item.icon || "📦"} ${localName} <${item.silo}>`,
        value: key,
        label: localName
    };
});

const actionWord = targetProperty === "food_add" ? "ADD" : "REMOVE";
const selectedAtom = await tp.system.suggester(options.map(o => o.display), options, false, `Select Atom to ${actionWord}:`);
if (!selectedAtom) return;

// 🔱 4. FRONTMATTER INJECTION 
await app.fileManager.processFrontMatter(activeFile, (fm) => {
    if (!fm[targetProperty]) fm[targetProperty] = [];
    if (!Array.isArray(fm[targetProperty])) fm[targetProperty] = [fm[targetProperty]];
    
    // Verhindert Duplikate am selben Tag
    if (!fm[targetProperty].includes(selectedAtom.value)) {
        fm[targetProperty].push(selectedAtom.value);
    }
});

// Feedback
const icon = targetProperty === "food_add" ? "➕" : "➖";
new Notice(`${icon} 🧬 ${selectedAtom.label} im heutigen Log verzeichnet!`);
-%>