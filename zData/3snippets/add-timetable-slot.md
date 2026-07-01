<%-*
/**
 * 👕 NEXUS WARDROBE/INVENTORY: ADD OWNER INJECTION
 * Path: zData/3snippets/add-wardrobe-owner.md
 */

// 1. Fetch the Persons from the Family folder
const familyFiles = app.vault.getFiles().filter(f => f.path.includes("2_Areas/2_Relationship/Family") && f.extension === "md");
let options = [];

// Add files found in the folder
familyFiles.forEach(f => {
    let name = f.basename.replace(/^(Person_|Persona_|User_)/i, "").trim();
    let safeKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    options.push({ display: `👤 ${name}`, value: safeKey, label: name });
});

// Add static options
options.push({ display: "🏠 Household (Shared)", value: "household", label: "Household" });
options.push({ display: "➕ Custom Person...", value: "custom", label: "Custom" });

// 2. Select the Person
const selectedObj = await tp.system.suggester(options.map(o => o.display), options, false, "👤 Who owns this item?");
if (!selectedObj) return;

let personKey = selectedObj.value;
let personDisplay = selectedObj.label;

if (personKey === "custom") {
    const customName = await tp.system.prompt("Enter name of the person:");
    if (!customName) return;
    personDisplay = customName;
    personKey = customName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// 3. The Output Format (Meta Bind Injection)
const output = `\n### 👤 ${personDisplay}\n📦 Quantity: \`INPUT[number:qty_${personKey}]\` | 📏 Size: \`INPUT[text:size_${personKey}]\` | 🔄 Refill: \`INPUT[toggle:refill_${personKey}]\`\n`;

// 4. Insert into the Editor at Cursor
const activeView = app.workspace.activeLeaf?.view;
if (activeView && activeView.editor) {
    const editor = activeView.editor;
    const cursor = editor.getCursor();
    editor.replaceRange(output, cursor);
    new Notice(`✅ Owner Meta Bind Inputs injected for ${personDisplay}`);
} else {
    new Notice("❌ Editor not found.");
}
-%>
