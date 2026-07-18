<%-*
/**
 * 🧪 DAILY ALCHEMY INJECTOR (Fixed Active File)
 * Path: zData/3snippets/add-daily-alchemy.md
 */

// 🔱 0. DATEI SICHER GREIFEN (tp.config.active_file = Datei in der der Button sitzt,
//        robuster als getActiveFile() das nur das fokussierte Pane liefert)
const activeFile = tp.config.active_file;
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
        label: localName,
        unit: item.unit_type || "100g"
    };
});

const actionWord = targetProperty === "food_add" ? "ADD" : "REMOVE";
const selectedAtom = await tp.system.suggester(options.map(o => o.display), options, false, `Select Atom to ${actionWord}:`);
if (!selectedAtom) return;

// 🔱 3.5 AMOUNT — factor 1.0 = one base unit of the item (100g / 100ml / 1 piece); stored as `id|amount`
const uDesc = selectedAtom.unit === "100ml" ? "100ml" : (selectedAtom.unit === "piece" ? "1 piece" : "100g");
let amtStr = await tp.system.prompt(`Amount of ${selectedAtom.label}? (1.0 = ${uDesc})`, "1.0");
if (amtStr === null) return;
let amt = Number(String(amtStr).replace(",", ".")) || 1;
const entry = `${selectedAtom.value}|${amt}`;

// 🔱 4. FRONTMATTER INJECTION
await app.fileManager.processFrontMatter(activeFile, (fm) => {
    if (!fm[targetProperty]) fm[targetProperty] = [];
    if (!Array.isArray(fm[targetProperty])) fm[targetProperty] = [fm[targetProperty]];
    fm[targetProperty].push(entry);
});

const icon = targetProperty === "food_add" ? "➕" : "➖";
const amtShown = selectedAtom.unit === "piece" ? `${amt}×` : `${Math.round(amt * 100)}${selectedAtom.unit === "100ml" ? "ml" : "g"}`;
new Notice(`${icon} 🧬 ${selectedAtom.label} (${amtShown}) logged!`);
-%>