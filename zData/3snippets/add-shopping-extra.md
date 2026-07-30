<%-*
// 🛒 ADD SHOPPING EXTRA — pick a buyable item from the item_*.json databases (or type your own),
// append it to the note's shopping_extras. The same JSONs feed the vendor/store automation.
const files = ["item_household.json", "item_pet.json", "item_personal.json", "item_art.json"];

// Language layer: display name follows LANG, and it brings the fuzzy matching along.
let i18n = null;
try { i18n = require(app.vault.adapter.basePath + "/zData/2scripts/i18n.js")(); } catch (e) { }
const LANG = (i18n && i18n.LANG) || "en";

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
                // Every name this item can be reached by — used for the search, and shown
                // so you can see which words work before you even type.
                const names = [it.label, it.latin, ...Object.values(it.lang || {})]
                    .filter(Boolean).map(String);
                const shown = (it.lang && it.lang[LANG]) || it.label;
                const others = names.filter(n => n !== shown);
                items.push({
                    display: `${it.icon || "📦"} ${shown}` + (others.length ? `   🔍 [${others.join(", ")}]` : ""),
                    value: shown,
                    names: names.concat(key)
                });
            }
        }
    } catch (e) { /* skip unreadable file */ }
}
items.sort((a, b) => a.display.localeCompare(b.display));

// The first entry is the escape hatch: you may know the thing only in another language,
// or half-remember how it is spelled.
const SEARCH = "__search__";
const opts = ["🔎 Search in any language…", ...items.map(i => i.display), "✏️ Type your own…"];
const vals = [SEARCH, ...items.map(i => i.value), "__custom__"];

let pick = await tp.system.suggester(opts, vals, false, "🛒 Add to shopping extras:");
if (!pick) return;

if (pick === SEARCH) {
    const term = await tp.system.prompt("🔎 Which item? (any language, typos are fine)");
    if (!term || !term.trim()) return;

    let hits = [];
    if (i18n && typeof i18n.norm === "function" && typeof i18n.fuzzyScore === "function") {
        const t = i18n.norm(term);
        hits = items.map(i => {
            let best = 0;
            for (const n of i.names) {
                const s = i18n.fuzzyScore(t, i18n.norm(n));
                if (s > best) best = s;
                if (best === 100) break;
            }
            return { ...i, score: best };
        }).filter(i => i.score >= 35).sort((a, b) => b.score - a.score).slice(0, 12);
    }

    if (hits.length === 0) {
        new Notice(`❌ Nothing close to "${term}" — adding it as typed.`);
        pick = term.trim();
    } else {
        pick = await tp.system.suggester(hits.map(h => h.display), hits.map(h => h.value));
        if (!pick) return;
    }
}

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
