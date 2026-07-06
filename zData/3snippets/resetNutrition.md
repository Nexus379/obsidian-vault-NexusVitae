<%-*
const activeFile = app.workspace.getActiveFile();
if (!activeFile) return;

const fm = app.metadataCache.getFileCache(activeFile)?.frontmatter || {};
const archtype = String(fm.archtype || "");
if (!archtype.includes("1plm") && !activeFile.basename.toLowerCase().includes("plm")) {
    new Notice("❌ Nutrition reset is only available in a PLM daily log.");
    return;
}

const confirm = await tp.system.prompt("Reset today's meal and alchemy adjustments? (Yes/No)", "No");
if (!confirm || confirm.toLowerCase() !== "yes") {
    new Notice("Reset cancelled.");
    return;
}

await app.fileManager.processFrontMatter(activeFile, frontmatter => {
    frontmatter.meal_spont = [];
    frontmatter.meal_rem = [];
    frontmatter.food_add = [];
    frontmatter.food_rem = [];
    Object.keys(frontmatter).forEach(key => {
        if (key.startsWith("qty_")) delete frontmatter[key];
    });
});

new Notice("✅ Nutrition adjustments reset.");
-%>
