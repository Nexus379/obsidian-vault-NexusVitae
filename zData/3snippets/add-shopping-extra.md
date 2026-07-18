<%-*
// 🛒 ADD SHOPPING EXTRA — pick a buyable item from the item_*.json databases (or type your own),
// append it to the note's shopping_extras. The same JSONs feed the vendor/store automation.
const files = ["item_household.json", "item_leisure.json", "item_personal.json", "item_tech_office.json"];
const items = [];
for (const fn of files) {
    try {
        const f = app.vault.getAbstractFileByPath("zData/6items/" + fn);
        if (!f) continue;
        const db = JSON.parse(await app.vault.read(f));
        for (const cat in db) {
            const group = db[cat];
            if (!group || typeof group !== "object") continue;
            for (const key in group) {
                const it = group[key];
                // skip "--- SECTION ---" string dividers and anything without a label
                if (!it || typeof it !== "object" || !it.label) continue;
                items.push({ display: `${it.icon || "📦"} ${it.label}`, value: it.label });
            }
        }
    } catch (e) { /* skip unreadable file */ }
}
items.sort((a, b) => a.display.localeCompare(b.display));

const opts = [...items.map(i => i.display), "✏️ Type your own…"];
const vals = [...items.map(i => i.value), "__custom__"];

const pick = await tp.system.suggester(opts, vals, false, "🛒 Add to shopping extras:");
if (!pick) return;

let val = pick;
if (pick === "__custom__") {
    val = await tp.system.prompt("🛒 Item name?");
    if (!val || !val.trim()) return;
    val = val.trim();
}

const file = tp.config.target_file;
await app.fileManager.processFrontMatter(file, (fm) => {
    if (!Array.isArray(fm.shopping_extras)) fm.shopping_extras = fm.shopping_extras ? [fm.shopping_extras] : [];
    if (!fm.shopping_extras.includes(val)) fm.shopping_extras.push(val);
});
new Notice(`🛒 Added: ${val}`);
-%>
