<%-*
const activeFile = app.workspace.getActiveFile();
const editor = app.workspace.activeLeaf?.view?.editor;
if (!activeFile || !editor) {
    new Notice("❌ Editor not found.");
    return;
}

const marker = "%%END_OF_MICROS%%";
if (!editor.getValue().includes(marker)) {
    new Notice("❌ Micronutrient marker not found.");
    return;
}

const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
const Nexus = await (require(enginePath))(app);
const foodDb = Nexus.getDomain("FOOD");
const currentFm = app.metadataCache.getFileCache(activeFile)?.frontmatter || {};

const metrics = new Set();
Object.values(foodDb).forEach(item => {
    Object.keys(item.val || {}).forEach(key => metrics.add(key));
});

const options = [...metrics]
    .filter(key => currentFm[key] === undefined)
    .sort();

if (options.length === 0) {
    new Notice("✅ All available nutrient fields already exist.");
    return;
}

const labelFor = key => key
    .replace(/_(mg|mcg|iu|g|ml)$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());

const selected = await tp.system.suggester(options.map(labelFor), options, false, "Add micronutrient field?");
if (!selected) return;

const unitMatch = selected.match(/_(mg|mcg|iu|g|ml)$/);
const unit = unitMatch ? unitMatch[1] : "";

await app.fileManager.processFrontMatter(activeFile, fm => {
    if (fm[selected] === undefined) fm[selected] = 0;
});
await new Promise(resolve => setTimeout(resolve, 150));

const content = editor.getValue();
if (!content.includes(`:${selected}]`)) {
    const row = `| ${labelFor(selected)} | \`INPUT[number:${selected}]\` ${unit} |     |\n`;
    editor.setValue(content.replace(marker, row + marker));
}

new Notice(`✅ ${labelFor(selected)} added.`);
-%>
