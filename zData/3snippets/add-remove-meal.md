<%-*
/**
 * 🍔 NEXUS DAILY MODIFIER: MEAL INJECTOR (Add/Remove)
 * Path: zData/3snippets/add-remove-meal.md
 */

// 🔱 1. SELECT ACTION
const modTypes = [
    { display: "➕ ADD (Spontaneous Meal / FastFood)", value: "add" },
    { display: "➖ REMOVE (Skip Planned Recipe)", value: "rem" }
];
const modTypeObj = await tp.system.suggester(modTypes.map(m => m.display), modTypes, false, "Meal Action: Add or Remove?");
if (!modTypeObj) return;
const type = modTypeObj.value;

// 🔱 2. FETCH DATA (Recipes + Engine DB)
let options = [];

// A. Recipes (Markdown Files)
const recipeFiles = app.vault.getFiles().filter(f => f.path.includes("6_Resources/Recipes") && f.extension === "md");
recipeFiles.forEach(f => {
    let name = f.basename;
    options.push({
        display: `🥗 ${name} <Recipe>`,
        value: `[[${f.path}|${name}]]`, 
        label: name,
        isDb: false
    });
});

// B. Database Atoms/FastFood (Nexus Engine)
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
try {
    const engineInit = require(enginePath);
    const Nexus = await engineInit(app);
    const foodDb = Nexus.getDomain("FOOD");
    
    Object.entries(foodDb).forEach(([key, item]) => {
        const localName = item.lang?.["de"] || item.label || item.latin || key;
        options.push({
            display: `${item.icon || "🍔"} ${localName} <Database>`,
            value: key,
            label: localName,
            isDb: true
        });
    });
} catch(e) { 
    console.log("Nexus Engine could not be loaded for suggestions."); 
}

// 🔱 3. UI SYNTHESIS (Suggester)
const selected = await tp.system.suggester(options.map(o => o.display), options, false, `Select Meal to ${type.toUpperCase()}:`);
if (!selected) return;

// 🔱 4. FRONTMATTER INTEGRATION (Daily Note)
const targetProperty = type === "add" ? "meal_spont" : "meal_rem";

await app.fileManager.processFrontMatter(tp.config.active_file, (fm) => {
    // Arrays sicherstellen
    if (!fm[targetProperty]) fm[targetProperty] = [];
    if (!Array.isArray(fm[targetProperty])) fm[targetProperty] = [fm[targetProperty]];

    // Eintrag hinzufügen, falls noch nicht vorhanden
    if (!fm[targetProperty].includes(selected.value)) {
        fm[targetProperty].push(selected.value);
    }

    // Falls ADD und Datenbank-Item -> Mengen-Variable (amt_) initialisieren
    if (type === "add" && selected.isDb) {
        const safeKey = selected.value.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const propertyName = `amt_${safeKey}`;
        if (fm[propertyName] === undefined) {
            fm[propertyName] = 1.0;
        }
    }
});

const actionMsg = type === "add" ? "added to" : "removed from";
new Notice(`🍱 ${selected.label} ${actionMsg} today's matrix!`);
-%>