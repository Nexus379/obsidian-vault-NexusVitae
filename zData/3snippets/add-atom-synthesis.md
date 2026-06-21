<%-*
const editor = app.workspace.activeLeaf?.view?.editor;
if (!editor) {
    new Notice("❌ Editor not found.");
    return;
}

const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
const Nexus = await (require(enginePath))(app);
const supplements = Object.entries(Nexus.getDomain("FOOD"))
    .filter(([key, item]) => key.startsWith("supp_") || String(item.silo || "").includes("6_4SUPPLEMENTS"))
    .sort((a, b) => String(a[1].label || a[0]).localeCompare(String(b[1].label || b[0])));

if (supplements.length === 0) {
    new Notice("❌ No supplements found in the Nexus silo.");
    return;
}

const selected = await tp.system.suggester(
    supplements.map(([key, item]) => `${item.icon || "💊"} ${item.lang?.de || item.label || key}`),
    supplements,
    false,
    "Add supplement to tracker?"
);
if (!selected) return;

const [key, item] = selected;
const blockId = `supp-${key.replace(/[^a-z0-9-]/gi, "-")}`;
const content = editor.getValue();
if (content.includes(`^${blockId}`)) {
    new Notice("⚠️ Supplement already exists in the tracker.");
    return;
}

const marker = "`BUTTON[add-atom-synthesis]`";
const markerPos = content.indexOf(marker);
if (markerPos === -1) {
    new Notice("❌ Quick-Infuze marker not found.");
    return;
}

const lineEnd = content.indexOf("\n", markerPos);
const insertPos = lineEnd === -1 ? content.length : lineEnd + 1;
const label = item.lang?.de || item.label || key;
const line = `\n- [ ] ${item.icon || "💊"} **${label}** ^${blockId}\n`;
editor.setValue(content.slice(0, insertPos) + line + content.slice(insertPos));
new Notice(`✅ ${label} added to the tracker.`);
-%>
