/**
 * 💶 SYNC ITEM PRICES — writes prices maintained in entity NOTES back into the
 * ingre_*.json master databases.
 *
 * WHY THIS EXISTS
 *   The flow is one-directional today: JSON -> note. `apply-shopping-price` records
 *   what you paid in the note's frontmatter, but the master database keeps the price
 *   it was seeded with. Over a year that drifts badly, and the shopping list plans
 *   your budget from the stale number.
 *
 * WHAT IT TOUCHES
 *   Only the three ingre_* files, and only entries that a note actually matches.
 *   It never creates, renames or deletes an item, and never touches nutrition data.
 *   Per item it updates: unit_price, the vendor and price strategy fields, price_updated.
 *
 * SAFETY
 *   A timestamped backup of every file it is about to change is written next to it
 *   before anything else happens. Nothing is written if parsing fails.
 */

async function syncItemPrices(app, opt) {
    const options = opt || {};
    const dryRun = options.dryRun === true;
    const files = options.files || ["ingre_fresh.json", "ingre_pantry.json", "ingre_consumables.json"];
    const dir = "zData/6items/";
    const entityRoot = options.entityRoot || "6_Resources/_Entities";

    // Same folding as the search layer: umlauts out, separators gone, lowercase.
    let fold;
    try {
        fold = require("./i18n.js")().norm;
    } catch (e) {
        fold = (s) => String(s || "").normalize("NFC").toLowerCase()
            .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
    }

    // ─── 1. Collect the price block from every entity note ────────────────────
    const VENDOR_KEYS = ["cheap", "value", "pure", "pure_cheap", "market"];
    const notes = [];
    for (const f of app.vault.getMarkdownFiles()) {
        if (!f.path.startsWith(entityRoot)) continue;
        const fm = app.metadataCache.getFileCache(f)?.frontmatter;
        if (!fm) continue;

        const block = {};
        let any = false;
        if (Number(fm.unit_price) > 0) { block.unit_price = Number(fm.unit_price); any = true; }
        if (fm.pref_vendor) { block.pref_vendor = fm.pref_vendor; block.pref_price = Number(fm.pref_price) || 0; any = true; }
        for (const k of VENDOR_KEYS) {
            const v = fm[`vendor_${k}`], p = Number(fm[`price_${k}`]) || 0;
            if (v && p > 0) { block[`vendor_${k}`] = v; block[`price_${k}`] = p; any = true; }
        }
        if (!any) continue;   // nothing priced yet — skip, do not overwrite JSON with zeros

        // Every name this note can be matched by.
        const names = [f.basename, fm.label]
            .concat(Array.isArray(fm.aliases) ? fm.aliases : (fm.aliases ? [fm.aliases] : []))
            .filter(Boolean).map(fold).filter(Boolean);

        notes.push({ path: f.path, names: new Set(names), block });
    }

    if (notes.length === 0) {
        return { ok: true, notes: 0, matched: 0, changed: 0, files: [], message: "No priced entity notes found." };
    }

    // ─── 2. Walk the JSON databases and update what matches ───────────────────
    const stamp = window.moment().format("YYYY-MM-DD");
    const report = { ok: true, notes: notes.length, matched: 0, changed: 0, files: [], details: [] };

    for (const fn of files) {
        let raw;
        try { raw = await app.vault.adapter.read(dir + fn); }
        catch (e) { report.details.push(`${fn}: unreadable, skipped`); continue; }
        if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

        let data;
        try { data = JSON.parse(raw); }
        catch (e) { report.details.push(`${fn}: JSON error, skipped (${e.message})`); continue; }

        let touched = 0;
        for (const silo of Object.keys(data)) {
            const group = data[silo];
            if (!group || typeof group !== "object") continue;

            for (const id of Object.keys(group)) {
                const item = group[id];
                if (!item || typeof item !== "object") continue;   // "--- SECTION ---" dividers

                // Match on the id itself, the label, and every translation.
                const cands = new Set([id, item.label].concat(Object.values(item.lang || {}))
                    .filter(Boolean).map(fold).filter(Boolean));

                const hit = notes.find(n => [...n.names].some(x => cands.has(x)));
                if (!hit) continue;
                report.matched++;

                // Only write fields that actually differ, so untouched items stay byte-identical.
                let itemChanged = false;
                for (const [k, v] of Object.entries(hit.block)) {
                    if (item[k] !== v) { item[k] = v; itemChanged = true; }
                }
                if (itemChanged) {
                    item.price_updated = stamp;
                    touched++;
                    report.details.push(`${id} ← ${hit.path.split("/").pop()}`);
                }
            }
        }

        if (touched > 0) {
            report.changed += touched;
            report.files.push(`${fn} (${touched})`);
            if (!dryRun) {
                // Backup first — 2 MB of hand-curated nutrition data is not reproducible.
                const backup = `${dir}_backup_${fn.replace(".json", "")}_${window.moment().format("YYYYMMDD-HHmmss")}.json`;
                await app.vault.adapter.write(backup, raw);
                await app.vault.adapter.write(dir + fn, JSON.stringify(data, null, 2));
            }
        }
    }

    return report;
}

module.exports = syncItemPrices;
