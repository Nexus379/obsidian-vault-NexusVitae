<%-*
/**
 * 🧪 Nexus Lab: Spontaneous Alchemy (Engine-Sync Edition)
 */

// 🔱 1. LOAD MASTER ENGINE
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
const engineInit = require(enginePath);
const Nexus = await engineInit(app);

if (!Nexus) { new Notice("❌ Nexus Engine not found!"); return; }

// 🔱 2. CONFIGURATION
const mode = await tp.system.suggester(["➕ Add (Extra)", "➖ Remove (Skip)"], ["plus", "minus"], false, "Daily Adjustment 🧪");
if (!mode) return;

// 🔱 3. GET ATOMS FROM ENGINE
const allAtoms = Nexus.all;
let atomDisplay = [];
let atomData = [];

for (let key in allAtoms) {
    const item = allAtoms[key];
    if (item.domain === "FOOD") {
        atomDisplay.push(`${item.icon || "📦"} ${item.label || key}`);
        atomData.push(item);
    }
}

// 🔱 4. SELECTION
const selected = await tp.system.suggester(atomDisplay, atomData, false, "Select Atom... 🌿");
if (!selected) return;

const selectedId = selected.id;
const targetProperty = mode === "plus" ? "food_add" : "food_rem";
const safeKey = selectedId.toLowerCase().replace(/[^a-z0-9]/g, '_');
const amountProperty = `amt_${safeKey}`;

// 🔱 5. FRONTMATTER SYNC
await app.fileManager.processFrontMatter(tp.config.active_file, (fm) => {
    if (!fm[targetProperty]) fm[targetProperty] = [];
    if (!Array.isArray(fm[targetProperty])) fm[targetProperty] = [fm[targetProperty]];
    
    if (!fm[targetProperty].includes(selectedId)) {
        fm[targetProperty].push(selectedId);
    }
    if (fm[amountProperty] === undefined) fm[amountProperty] = 1.0;
});

new Notice(`⚡ ${selected.label} added to ${targetProperty}`);
-%>