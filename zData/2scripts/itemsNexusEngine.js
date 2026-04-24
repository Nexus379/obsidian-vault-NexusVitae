/**
 * 🔱 NEXUS MASTER ENGINE (Alpha v1.0)
 * Central Intelligence for all Silos (Food, Tools, Maintenance)
 */
async function itemsNexusEngine(app) {
    const allFiles = app.vault.getFiles().filter(f => f.path.includes("zData/6items/") && f.extension === "json");
    const DATABASE = {};

    for (let file of allFiles) {
        try {
            const isFood = file.name.startsWith("ingre_");
            const domain = isFood ? "FOOD" : "MAINTENANCE";
            const content = JSON.parse(await app.vault.read(file));

            for (let cat in content) {
                const items = content[cat];
                if (typeof items !== 'object') continue; // Überspringt Header-Strings

                for (let key in items) {
                    const item = items[key];
                    if (typeof item === 'object') {
                        DATABASE[key] = {
                            ...item,
                            id: key,
                            domain: domain,
                            isFood: isFood,
                            silo: file.basename.replace(/^(ingre_|item_)/, "").toUpperCase(),
                            // Sicherstellung, dass lang und val Objekte existieren
                            lang: item.lang || {},
                            val: item.val || {},
                            meta: item.meta || {}
                        };
                    }
                }
            }
        } catch (e) { console.error(`[Nexus Engine] Load Error in ${file.name}:`, e); }
    }

    return {
        all: DATABASE,
        
        // Filtert nach FOOD oder MAINTENANCE
        getDomain: (domainName) => {
            return Object.fromEntries(Object.entries(DATABASE).filter(([k, v]) => v.domain === domainName));
        },

        // 🌐 Die ultimative Sprach-Suche (Sucht in ALLEN Sprachen gleichzeitig)
        find: (input) => {
            if (!input) return null;
            const search = input.toLowerCase().replace(/[\s-]/g, '_');
            
            if (DATABASE[search]) return DATABASE[search];
            
            for (let key in DATABASE) {
                const item = DATABASE[key];
                const searchPool = [
                    item.latin?.toLowerCase(),
                    item.label?.toLowerCase(),
                    ...Object.values(item.lang).map(v => String(v).toLowerCase())
                ].map(v => v?.replace(/[\s-]/g, '_')).filter(Boolean);
                
                if (searchPool.includes(search)) return item;
            }
            return null;
        },

        // 📝 Obsidian Link Generator (Icon + Name in Wunschsprache)
        getLink: (key, targetLang = "de") => {
            const item = DATABASE[key];
            if (!item) return `[[${key}]]`;
            const name = item.lang[targetLang] || item.label || key;
            return `[[${key}|${item.icon || "📦"} ${name}]]`;
        },

        // 🧪 Dynamische Nährwert-Rechnung für ALLE Variablen (kcal, vit_c, quercetin, etc.)
        calculate: (key, amount = 1.0) => {
            const item = DATABASE[key];
            if (!item || !item.val) return null;
            
            let results = {};
            // Geht dynamisch durch alle Schlüssel in "val" (egal ob 5 oder 50 Variablen)
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