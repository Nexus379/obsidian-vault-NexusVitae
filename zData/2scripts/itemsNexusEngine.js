/**
 * 🔱 NEXUS MASTER ENGINE (Alpha v2.0 - Markdown/Dataview Edition)
 * Central Intelligence for all Silos (Food, Tools, Maintenance)
 */
async function itemsNexusEngine(app, domainFilter = "ALL") {
    const DATABASE = {};

    // === 1. FOOD: from the normalised JSON files (the source of truth) ===
    // The full val{} is taken over — no valKeys whitelist any more (that one cut off iron, magnesium etc.).
    if (domainFilter === "ALL" || domainFilter === "FOOD") {
        const foodFiles = ["ingre_fresh.json", "ingre_pantry.json", "ingre_consumables.json"];
        for (const fn of foodFiles) {
            let raw;
            try { raw = await app.vault.adapter.read(`zData/6items/${fn}`); }
            catch (e) { continue; }
            if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // BOM-Schutz
            let data;
            try { data = JSON.parse(raw); }
            catch (e) { console.error(`[Nexus Engine] JSON-Fehler in ${fn}:`, e); continue; }

            for (const [silo, items] of Object.entries(data)) {
                if (!items || typeof items !== "object") continue;
                for (const [id, it] of Object.entries(items)) {
                    if (!it || typeof it !== "object" || !it.val) continue;
                    DATABASE[id] = {
                        ...it,
                        id: id,
                        domain: "FOOD",
                        isFood: true,
                        silo: String(silo).toUpperCase(),
                        val: it.val,               // volle Nährwerte, ungefiltert
                        energy: it.energy || {},
                        meta: it.meta || {},
                        prices: it.prices || {},
                        lang: it.lang || {},
                        label: (it.lang && it.lang.de) ? it.lang.de : (it.label || id),
                        icon: it.icon || "🥗"
                    };
                }
            }
        }

        // === 1b. TRAVEL OVERLAY ===
        // Abroad only the prices and the shops change — spinach has the same iron in Rome.
        // So instead of cloning 2 MB of nutrition data per city, a thin per-city file
        // overrides just those fields. Everything not listed keeps the home value.
        // Active city comes from the Shopping Hub (shopping_travel_city); empty = at home.
        try {
            const hub = app.metadataCache.getCache("2_Areas/1_Selfcare/Household/Shopping_Hub.md");
            const city = String(hub?.frontmatter?.shopping_travel_city || "").trim();
            if (city) {
                const path = `6_Resources/_Entities/Travel/${city}/ingre_prices.json`;
                let raw = await app.vault.adapter.read(path);
                if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
                const over = JSON.parse(raw);

                // Only these may be overridden. Nutrition, latin, sci, season stay untouched.
                const PRICE_KEYS = [
                    "unit_price", "pref_vendor", "pref_price",
                    "vendor_cheap", "price_cheap", "vendor_value", "price_value",
                    "vendor_best", "price_best", "vendor_pure", "price_pure",
                    "vendor_pure_cheap", "price_pure_cheap", "vendor_market", "price_market"
                ];

                let hits = 0;
                for (const [id, patch] of Object.entries(over)) {
                    const base = DATABASE[id];
                    if (!base || !patch || typeof patch !== "object") continue;
                    for (const k of PRICE_KEYS) {
                        if (patch[k] !== undefined) base[k] = patch[k];
                    }
                    // Shops are the other thing that changes — replace the list, keep the rest of meta.
                    if (patch.meta && patch.meta.locations) {
                        base.meta = { ...base.meta, locations: patch.meta.locations };
                    }
                    if (patch.prices) base.prices = patch.prices;
                    base.travel_city = city;
                    hits++;
                }
                console.log(`[Nexus Engine] Travel overlay "${city}": ${hits} item(s) repriced.`);
            }
        } catch (e) {
            // No overlay for this city yet — home prices simply stay in effect.
        }
    }

    // === 2. MAINTENANCE: entities still come from MD notes (only when Dataview is available) ===
    if (domainFilter === "ALL" || domainFilter === "MAINTENANCE") {
        const dv = app.plugins.plugins.dataview?.api;
        if (dv) {
            const pages = dv.pages().where(p => p.entity_class != null && p.entity_class !== "ingredient");
            for (let p of pages) {
                try {
                    const fm = p.file.frontmatter || {};
                    const key = p.file.name;
                    let silo = fm.tech_type || fm.household_type || fm.personal_type || fm.art_type || "UNKNOWN";
                    silo = String(silo).toUpperCase();
                    const prices = {};
                    if (fm.pref_vendor) prices[fm.pref_vendor] = fm.pref_price || fm.unit_price || 0;
                    if (fm.vendor_cheap) prices[fm.vendor_cheap] = fm.price_cheap || 0;
                    if (fm.vendor_best) prices[fm.vendor_best] = fm.price_best || fm.price_value || 0;
                    if (fm.vendor_value) prices[fm.vendor_value] = fm.price_value || 0;
                    if (fm.vendor_pure_cheap) prices[fm.vendor_pure_cheap] = fm.price_pure_cheap || 0;
                    if (fm.vendor_pure) prices[fm.vendor_pure] = fm.price_pure || 0;
                    if (fm.vendor_market) prices[fm.vendor_market] = fm.price_market || 0;
                    DATABASE[key] = {
                        ...fm, id: key, domain: "MAINTENANCE", isFood: false, silo: silo,
                        lang: fm.lang || {}, val: fm.val || {}, meta: fm.meta || {}, prices: prices,
                        label: (fm.lang && fm.lang.de) ? fm.lang.de : (fm.aliases && fm.aliases[0] ? fm.aliases[0] : key),
                        icon: fm.icon || "📦"
                    };
                } catch (e) {
                    console.error(`[Nexus Engine] Load Error for page ${p.file.name}:`, e);
                }
            }
        }
    }

    return {
        all: DATABASE,
        
        // Filters by FOOD or MAINTENANCE
        getDomain: (domainName) => {
            return Object.fromEntries(Object.entries(DATABASE).filter(([k, v]) => v.domain === domainName));
        },

        // Every name an item can be reached by: botanical, label, all translations.
        namesOf: (item) => [
            item.latin,
            item.label,
            ...Object.values(item.lang || {})
        ].filter(Boolean).map(v => String(v).toLowerCase()),

        // 🌐 The ultimate language search — EXACT.
        // Recipes and the shopping list resolve atom IDs through here, so it must never
        // guess: a near-miss that silently returns the wrong ingredient would change what
        // you actually buy. Use search() when a human is typing.
        find: (input) => {
            if (!input) return null;
            const search = String(input).toLowerCase().replace(/[\s-]/g, '_');

            if (DATABASE[search]) return DATABASE[search];

            for (let key in DATABASE) {
                const item = DATABASE[key];
                const pool = [
                    item.latin,
                    item.label,
                    ...Object.values(item.lang || {})
                ].filter(Boolean).map(v => String(v).toLowerCase().replace(/[\s-]/g, '_'));

                if (pool.includes(search)) return item;
            }
            return null;
        },

        // 🔎 The ultimate language search — FUZZY, for when a human types.
        // You may know the vegetable only in French, or half-remember the spelling:
        // missing accents ("epinard"), typos ("spinaat") and stems ("spina") all land,
        // across latin, label and every lang.* translation.
        // Returns matches sorted best-first, never a single silent guess.
        search: (input, opt) => {
            if (!input) return [];
            const limit = (opt && opt.limit) || 12;
            const minScore = (opt && opt.minScore) || 35;

            let i18n = null;
            try { i18n = require("./i18n.js")(); } catch (e) { return []; }
            if (typeof i18n.norm !== "function" || typeof i18n.fuzzyScore !== "function") return [];

            const term = i18n.norm(input);
            if (!term) return [];

            const hits = [];
            for (let key in DATABASE) {
                const item = DATABASE[key];
                const names = [item.latin, item.label, ...Object.values(item.lang || {})]
                    .filter(Boolean).map(String).concat(key);
                let best = 0;
                for (const name of names) {
                    const s = i18n.fuzzyScore(term, i18n.norm(name));
                    if (s > best) best = s;
                    if (best === 100) break;
                }
                if (best >= minScore) hits.push({ ...item, id: item.id || key, score: best });
            }
            return hits
                .sort((a, b) => b.score - a.score || String(a.label).localeCompare(String(b.label)))
                .slice(0, limit);
        },

        // 📝 Obsidian link generator (links to the real MD file)
        getLink: (key, targetLang = "de") => {
            const item = DATABASE[key];
            if (!item) return `[[${key}]]`;
            const name = (item.lang && item.lang[targetLang]) || item.label || key;
            // We link to the actual markdown file (the key is the file name)
            return `[[${key}|${item.icon || "📦"} ${name}]]`;
        },

        // 💰 Resolves the price for the chosen strategy (budget/cheap, value, pure, market)
        getStrategicPrice: (key, strategy = "value", amount = 1.0) => {
            const item = DATABASE[key];
            if (!item) return null;
            
            const stratKeys = ["cheap", "value", "best", "budget", "pref", "preferred", "pure_cheap", "pure", "market"];
            let s = stratKeys.includes(strategy) ? strategy : "value";
            if (s === "budget") s = "cheap";
            if (s === "best") s = "value";
            if (s === "preferred") s = "pref";
            
            let price = s === "pref" ? (Number(item.pref_price) || Number(item.unit_price) || 0) : (Number(item[`price_${s}`]) || 0);
            let vendor = s === "pref" ? (item.pref_vendor || "") : (item[`vendor_${s}`] || "");

            if (s === "value" && price === 0) {
                price = Number(item.price_best) || 0;
                vendor = item.vendor_best || vendor;
            }

            // If the JSON database has a prices object
            if (price === 0 && item.prices && typeof item.prices === "object" && Object.keys(item.prices).length > 0) {
                if (s === "cheap") {
                    let lowest = Infinity, bestV = "";
                    for (let [v, p] of Object.entries(item.prices)) {
                        if (Number(p) > 0 && Number(p) < lowest) { lowest = Number(p); bestV = v; }
                    }
                    if (lowest !== Infinity) { price = lowest; vendor = bestV; }
                } else if (s === "pure_cheap") {
                    const bioVendors = ["denns", "alnatura", "bio", "dm"];
                    let lowest = Infinity, bestV = "";
                    for (let [v, p] of Object.entries(item.prices)) {
                        const isBio = bioVendors.some(b => String(v).toLowerCase().includes(b));
                        if (isBio && Number(p) > 0 && Number(p) < lowest) { lowest = Number(p); bestV = v; }
                    }
                    if (lowest !== Infinity) { price = lowest; vendor = bestV; }
                } else if (s === "pure") {
                    const bioVendors = ["denns", "alnatura", "bio", "dm"];
                    for (let v of bioVendors) {
                        if (item.prices[v]) { price = Number(item.prices[v]); vendor = v; break; }
                    }
                }
            }
            
            // Fall back to "value" when the chosen strategy is empty
            if (price === 0 && s !== "value" && s !== "pref") {
                price = Number(item.price_value) || Number(item.price_best) || 0;
                vendor = item.vendor_value || item.vendor_best || "";
            }
            
            // Fallback to standard / legacy (pref_price or unit_price)
            if (price === 0) {
                price = Number(item.pref_price) || Number(item.unit_price) || (item.prices ? Number(Object.values(item.prices)[0]) : 0) || 0;
                vendor = item.pref_vendor || (item.prices ? Object.keys(item.prices)[0] : "unknown") || "unknown";
            }
            
            return {
                strategy: price === 0 ? "fallback" : s,
                vendor: vendor || "unknown",
                unit_price: price,
                total: parseFloat((price * amount).toFixed(2))
            };
        },

        // 🧪 Dynamic nutrition maths for ALL variables
        calculate: (key, amount = 1.0) => {
            const item = DATABASE[key];
            if (!item || !item.val) return null;

            let results = {};
            // energy{kcal,kj} now sits apart from val — merged back for the calculation
            const src = Object.assign({}, item.energy || {}, item.val || {});
            for (let stat in src) {
                const value = src[stat];
                if (typeof value === 'number') {
                    results[stat] = parseFloat((value * amount).toFixed(2));
                }
            }
            return results;
        }
    };
}

module.exports = itemsNexusEngine;
