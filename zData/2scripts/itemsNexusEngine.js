/**
 * 🔱 NEXUS MASTER ENGINE (Alpha v2.0 - Markdown/Dataview Edition)
 * Central Intelligence for all Silos (Food, Tools, Maintenance)
 */
async function itemsNexusEngine(app, domainFilter = "ALL") {
    const DATABASE = {};

    // === 1. FOOD: aus den normalisierten JSON-Dateien (Quelle der Wahrheit) ===
    // Volle val{} wird übernommen — KEIN valKeys-Whitelist mehr (der schnitt Eisen/Magnesium/etc. ab).
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
    }

    // === 2. MAINTENANCE: Entities weiter aus MD-Notizen (nur wenn Dataview verfügbar) ===
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
        
        // Filtert nach FOOD oder MAINTENANCE
        getDomain: (domainName) => {
            return Object.fromEntries(Object.entries(DATABASE).filter(([k, v]) => v.domain === domainName));
        },

        // 🌐 Die ultimative Sprach-Suche
        find: (input) => {
            if (!input) return null;
            const search = input.toLowerCase().replace(/[\s-]/g, '_');
            
            if (DATABASE[search]) return DATABASE[search];
            
            for (let key in DATABASE) {
                const item = DATABASE[key];
                const searchPool = [
                    item.latin?.toLowerCase(),
                    item.label?.toLowerCase(),
                    ...Object.values(item.lang || {}).map(v => String(v).toLowerCase())
                ].map(v => v?.replace(/[\s-]/g, '_')).filter(Boolean);
                
                if (searchPool.includes(search)) return item;
            }
            return null;
        },

        // 📝 Obsidian Link Generator (Linkt jetzt auf die echte MD Datei!)
        getLink: (key, targetLang = "de") => {
            const item = DATABASE[key];
            if (!item) return `[[${key}]]`;
            const name = (item.lang && item.lang[targetLang]) || item.label || key;
            // Wir linken auf die tatsächliche Markdown-Datei (key ist der Dateiname)
            return `[[${key}|${item.icon || "📦"} ${name}]]`;
        },

        // 💰 Errechnet den Preis nach ausgewählter Strategie (Budget/Cheap, Value, Pure, Market)
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

            // Falls JSON-Datenbank ein prices-Objekt besitzt
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
            
            // Fallback auf 'value', falls gewählte Strategie leer ist
            if (price === 0 && s !== "value" && s !== "pref") {
                price = Number(item.price_value) || Number(item.price_best) || 0;
                vendor = item.vendor_value || item.vendor_best || "";
            }
            
            // Fallback auf Standard / Legacy (pref_price oder unit_price)
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

        // 🧪 Dynamische Nährwert-Rechnung für ALLE Variablen
        calculate: (key, amount = 1.0) => {
            const item = DATABASE[key];
            if (!item || !item.val) return null;

            let results = {};
            // energy{kcal,kj} liegt jetzt getrennt von val — für die Rechnung wieder zusammenführen
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
