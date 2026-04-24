<%-*
// 1. Load the disciplines from your local Engine
async function loadDisciplines() {
    const filePath = "zData/2scripts/disciplineEngine.js";
    const file = app.vault.getAbstractFileByPath(filePath);
    if (!file) { new Notice("❌ disciplineEngine.js not found"); return {}; }
    
    try {
        const code = await app.vault.read(file);
        const module = { exports: {} };
        // Execute the Engine code
        new Function("module", "exports", code)(module, module.exports);
        const engineFn = module.exports;
        
        // If the Engine returns an object with .all, use that, otherwise the object itself
        const engineData = (typeof engineFn === "function") ? engineFn() : {};
        return engineData.all || engineData;
    } catch (e) {
        console.error("Engine Load Error:", e);
        new Notice("⚠️ Error loading the Discipline Engine");
        return {};
    }
}

const disciplines = await loadDisciplines();
const keys = Object.keys(disciplines).sort(); // Sorted for better overview

// 2. Create labels for the Suggester (Icon + Name)
const labels = keys.map(k => `${disciplines[k].icon || "📁"} ${disciplines[k].label}`);

// 3. Make selection via Obsidian Suggester
const selectedKey = await tp.system.suggester(labels, keys);

if (selectedKey) {
    const disc = disciplines[selectedKey];
    
    // Fallback for Sci-Tags, in case one is missing
    const sciTags = (disc.sci && disc.sci.length) ? disc.sci.join(", ") : "#sci/General";
    
    // Random ID for Meta-Bind (prevents conflicts if used multiple times)
    const counter = Math.floor(Math.random() * 9000) + 1000;
    const fieldTopic = `${selectedKey}_${counter}`;
    const fieldTime = `${selectedKey}_${counter}_min`;

    // 4. The Output Format (Clean & Scannable) for the Editor
    const output = `${disc.icon} **${disc.label}**\n📝 Topic: \`INPUT[text:${fieldTopic}]\`\n⏱️ Time: \`INPUT[number:${fieldTime}]\` min.\n<small style="opacity:0.65;font-style:italic;font-size:0.9em;">(Sci: ${sciTags})</small>\n\n`;

    // 5. Insert into the Editor
    const activeView = app.workspace.activeLeaf?.view;
    if (activeView && activeView.editor) {
        const editor = activeView.editor;
        const cursor = editor.getCursor();
        editor.replaceRange(output, cursor);
        new Notice(`✅ ${disc.label} added to Study Metrics`);
    } else {
        new Notice("❌ Editor not found.");
    }
}
-%>