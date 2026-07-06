/**
 * 🔱 NEXUS MASTER ENGINE (Alpha v2.0 - Markdown/Dataview Edition)
 * Central Intelligence for all Silos (Food, Tools, Maintenance)
 */
async function itemsNexusEngine(app, domainFilter = "ALL") {
    // 1. Hole die Dataview API
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        console.error("[Nexus Engine] Fehler: Dataview Plugin ist nicht aktiv oder API nicht verfügbar.");
        return { all: {} };
    }

    const DATABASE = {};
    
    // 2. Lade alle Entities aus dem neuen atomaren Ordner (oder überall wo entity_class existiert)
    const pages = dv.pages().where(p => p.entity_class != null);

    for (let p of pages) {
        try {
            const fm = p.file.frontmatter || {};
            const key = p.file.name;
            const isFood = fm.entity_class === "ingredient";
            const domain = isFood ? "FOOD" : "MAINTENANCE";

            // 3. Optionaler Filter
            if (domainFilter === "FOOD" && !isFood) continue;
            if (domainFilter === "MAINTENANCE" && isFood) continue;

            // 4. Rekonstruktion des `val` Objekts (für Nährwerte/Macros)
            const val = {};
            const valKeys = ['kcal', 'protein_g', 'carbs_total_g', 'carbs_sugar_g', 'fat_total_g', 'fat_sat_g', 'fiber_g', 'sodium_mg', 'calcium_mg', 'iron_mg', 'zinc_mg', 'vit_c_mg', 'vit_d_µg', 'vit_b12_µg'];
            for (let vk of valKeys) {
                if (fm[vk] !== undefined && typeof fm[vk] === 'number') {
                    val[vk] = fm[vk];
                }
            }

            // 5. Ermittle das Silo (Sub-Kategorie)
            let silo = fm.ingre_type || fm.tech_type || fm.household_type || fm.personal_type || fm.art_type || "UNKNOWN";
            silo = silo.toUpperCase();

            // 6. Prices Rekonstruktion
            const prices = {};
            if (fm.pref_vendor && fm.unit_price) {
                prices[fm.pref_vendor] = fm.unit_price;
            }

            // 7. Baue den Datenbank-Eintrag exakt so auf, wie die Dashboards ihn erwarten
            DATABASE[key] = {
                ...fm, // Fügt alle YAML Metadaten als flache Keys hinzu
                id: key,
                domain: domain,
                isFood: isFood,
                silo: silo,
                lang: fm.lang || {}, // Das Python-Skript wird lang{} als Objekt anlegen
                val: val,
                meta: fm.meta || {},
                prices: prices,
                label: (fm.lang && fm.lang.de) ? fm.lang.de : (fm.aliases && fm.aliases[0] ? fm.aliases[0] : key),
                icon: fm.icon || (isFood ? "🥗" : "📦")
            };
        } catch (e) {
            console.error(`[Nexus Engine] Load Error for page ${p.file.name}:`, e);
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

        // 💰 Errechnet den Preis nach ausgewählter Strategie
        getStrategicPrice: (key, strategy = "value", amount = 1.0) => {
            const item = DATABASE[key];
            if (!item) return null;
            
            const stratKeys = ["cheap", "value", "pure_cheap", "pure", "market"];
            let s = stratKeys.includes(strategy) ? strategy : "value";
            
            let price = Number(item[`price_${s}`]) || 0;
            let vendor = item[`vendor_${s}`] || "";
            
            // Fallback auf 'value', falls die gewählte Strategie leer ist
            if (price === 0 && s !== "value") {
                price = Number(item[`price_value`]) || 0;
                vendor = item[`vendor_value`] || "";
            }
            
            // Fallback auf Legacy, falls noch gar keine neuen Felder befüllt wurden
            if (price === 0) {
                price = Number(item.unit_price) || 0;
                vendor = item.pref_vendor || "unknown";
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
            for (let stat in item.val) {
                const value = item.val[stat];
                if (typeof value === 'number') {
                    results[stat] = parseFloat((value * amount).toFixed(2));
                }
            }
            return results;
        }
    };
}

module.exports = itemsNexusEngine;