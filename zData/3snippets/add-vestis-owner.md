<%-*
/**
 * 👕 NEXUS VESTIS/INVENTORY: ADD OWNER INJECTION
 * Path: zData/3snippets/add-vestis-owner.md
 */

// 1. Fetch the Persons from the Family folder
// Scan ALL relationship groups (Family, Friends, Partner, Custom …) — not just Family
const familyFiles = app.vault.getFiles().filter(f =>
    f.path.includes("2_Areas/4_Relationship") &&
    f.extension === "md" &&
    /^(Character_|Person_)/i.test(f.basename)
);
let options = [];

// Add files found in the folder
familyFiles.forEach(f => {
    let name = f.basename.replace(/^(Character_|Person_|Persona_|User_)/i, "").trim();
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

const activeFile = app.workspace.getActiveFile();
// Hub views where you pick an item from the vault instead of editing the open note
const isDashboard = activeFile && ["Inventory_Matrix", "Vestis"].includes(activeFile.basename);

let targetFile = activeFile;

if (isDashboard) {
    // Dashboard mode: Select an item from the vault
    const entityFiles = app.vault.getFiles().filter(f => f.path.includes("6_Resources/_Entities") && f.extension === "md");
    const itemOptions = entityFiles.map(f => f.basename);
    
    const selectedItemName = await tp.system.suggester(itemOptions, itemOptions, false, "📦 Which item are you assigning?");
    if (!selectedItemName) return;
    
    targetFile = entityFiles.find(f => f.basename === selectedItemName);
    if (!targetFile) return;
}

// 3. Always inject frontmatter directly so Dataview can see it immediately
await app.fileManager.processFrontMatter(targetFile, (fm) => {
    fm[`qty_${personKey}`] = 0;
    fm[`size_${personKey}`] = "";
    fm[`refill_${personKey}`] = false;
});

// 4. The Output Format (Meta Bind Injection)
const output = `\n### 👤 ${personDisplay}\n📦 Quantity: \`INPUT[number:qty_${personKey}]\` | 📏 Size: \`INPUT[text:size_${personKey}]\` | 🔄 Refill: \`INPUT[toggle:refill_${personKey}]\`\n`;

// 5. Insert into the file
if (isDashboard) {
    // Background append
    const content = await app.vault.read(targetFile);
    await app.vault.modify(targetFile, content + output);
    new Notice(`✅ Assigned ${personDisplay} to ${targetFile.basename}`);
} else {
    // Standard Editor insertion
    const activeView = app.workspace.activeLeaf?.view;
    if (activeView && activeView.editor) {
        const editor = activeView.editor;
        const cursor = editor.getCursor();
        editor.replaceRange(output, cursor);
        new Notice(`✅ Owner Inputs injected for ${personDisplay}`);
    } else {
        new Notice("❌ Editor not found.");
    }
}
-%>

