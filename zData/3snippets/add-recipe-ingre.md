<%-*
/**
 * 🏗️ NEXUS ARCHITECT v5.0 (Pure Recipe Builder)
 * Callout-Safe, Marker-Safe, 100% Recipe-Focused.
 */

const file = tp.config.active_file;

// 🔱 1. ENGINE & DATEN
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
const Nexus = await (require(enginePath))(app);
const foodDb = Nexus.getDomain("FOOD");

const options = Object.entries(foodDb).map(([k, v]) => ({
    display: `${v.icon || "📦"} ${v.lang?.de || v.label || k}`,
    value: k, icon: v.icon || "📦", label: v.lang?.de || v.label || k
}));

const selected = await tp.system.suggester(options.map(o => o.display), options, false, "Atom wählen...");
if (!selected) return;

const safeKey = selected.value.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
const propName = `amt_${safeKey}`;

const editor = app.workspace.activeLeaf.view.editor;
const content = editor.getValue();

// 🔱 2. EDITOR & KATEGORIEN SUCHEN
const startMarker = "### 🧪 Active Atoms";
const endMarker = "%%INGREDIENTS_LIST%%";
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) { 
    new Notice("❌ missing in Template!"); return; 
}

// Callout-Präfix sichern (z.B. "> > ")
const lastNewline = content.lastIndexOf("\n", endIdx);
const linePrefix = content.substring(lastNewline + 1, endIdx); 

const section = content.substring(startIdx, endIdx);
let categories = [];

// Sucht exakt nach: #### **Name:**
const catMatches = section.match(/#### \*\*([^*]+):\*\*/g);
if (catMatches) {
    catMatches.forEach(c => {
        const name = c.replace(/.*#### \*\*/, "").replace(":**", "").trim();
        if (!categories.includes(name)) categories.push(name);
    });
}
if (categories.length === 0) categories.push("Standard / Main");
categories.push("+ New Category...");

const targetCat = await tp.system.suggester(categories, categories, false, "In welche Kategorie?");
if (!targetCat) return;

let finalCat = targetCat;
if (targetCat === "+ New Category...") finalCat = await tp.system.prompt("Name der Kategorie?");

// 🔱 3. FRONTMATTER UPDATE (Nur ingredients!)
await app.fileManager.processFrontMatter(file, (f) => {
    if (!f.ingredients) f.ingredients = [];
    if (!Array.isArray(f.ingredients)) f.ingredients = [f.ingredients];
    if (!f.ingredients.includes(selected.value)) f.ingredients.push(selected.value);
    if (f[propName] === undefined) f[propName] = 1.0;
});

// 🔱 4. EINZEILIGE INJECTION (Mit Callout- und Marker-Schutz)
const newItem = `* ${selected.icon} **${selected.label}** \`INPUT[number(placeholder(1.0)):${propName}]\``;
let updated = "";

if (targetCat === "+ New Category...") {
    const block = `#### **${finalCat}:**\n${linePrefix}${newItem}\n${linePrefix}\n${linePrefix}${endMarker}`;
    updated = content.replace(linePrefix + endMarker, linePrefix + block);
} else {
    const catString = `#### **${targetCat}:**`;
    const catPos = content.indexOf(catString, startIdx);
    
    if (catPos !== -1) {
        const nextCatPos = content.indexOf("#### **", catPos + catString.length);
        if (nextCatPos !== -1 && nextCatPos < endIdx) {
            // Sicherer Insert VOR der nächsten Kategorie
            let lineStart = content.lastIndexOf("\n", nextCatPos - 1);
            let preText = content.substring(0, lineStart + 1);
            let postText = content.substring(lineStart + 1);
            updated = preText + linePrefix + newItem + "\n" + postText;
        } else {
            // Sicherer Insert am Ende der Liste
            updated = content.replace(linePrefix + endMarker, linePrefix + newItem + "\n" + linePrefix + endMarker);
        }
    } else {
        updated = content.replace(linePrefix + endMarker, `#### **${targetCat}:**\n${linePrefix}${newItem}\n${linePrefix}\n${linePrefix}${endMarker}`);
    }
}

editor.setValue(updated);
new Notice(`⚗️ ${selected.label} added in Recipe.`);
-%>