---
tags: [migration]
---
<%*
const jsonDir = "zData/6items";
const tmplDir = "zData/1tmpl/5notes";
const outDir = "5_Notes/3_Atomic/Entities";

// Stelle sicher, dass der Ordner existiert
const outFolder = app.vault.getAbstractFileByPath(outDir);
if (!outFolder) {
    await app.vault.createFolder(outDir);
}

// Helfer zum Lesen
async function readFile(path) {
    const f = app.vault.getAbstractFileByPath(path);
    if (!f) return null;
    return await app.vault.read(f);
}

// Lade die Templates
const templates = {
    ingredient: await readFile(`${tmplDir}/3atomic_ingredients.md`),
    tech_gear: await readFile(`${tmplDir}/3atomic_tech.md`),
    household_item: await readFile(`${tmplDir}/3atomic_household.md`),
    personal_care: await readFile(`${tmplDir}/3atomic_personal.md`),
    art_supply: await readFile(`${tmplDir}/3atomic_art.md`)
};

for (let k in templates) {
    if (templates[k]) {
        let parts = templates[k].split("---");
        templates[k] = parts.length >= 3 ? parts.slice(2).join("---").trim() : templates[k].trim();
    }
}

// Zuweisung der Dateien zu den Klassen
const mapping = [
    { file: "ingre_pantry.json", class: "ingredient", field: "ingre_type", val: "staple_pantry" },
    { file: "ingre_fresh.json", class: "ingredient", field: "ingre_type", val: "fresh_produce" },
    { file: "ingre_consumables.json", class: "ingredient", field: "ingre_type", val: "consumable" },
    { file: "item_tech_office.json", class: "tech_gear", field: "tech_type", val: "peripheral" },
    { file: "item_household.json", class: "household_item", field: "household_type", val: "cleaning_supply" },
    { file: "item_personal.json", class: "personal_care", field: "personal_type", val: "skincare" },
    { file: "item_leisure.json", class: "art_supply", field: "art_type", val: "tool" }
];

let count = 0;
new Notice("Migration gestartet! Bitte kurz warten...");

for (let map of mapping) {
    const jsonStr = await readFile(`${jsonDir}/${map.file}`);
    if (!jsonStr) continue;
    
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch(e) {
        console.error(`Failed to parse ${map.file}: ` + e);
        continue;
    }
    
    for (let catKey in data) {
        let items = data[catKey];
        if (typeof items !== 'object' || items === null) continue;
        
        for (let key in items) {
            let item = items[key];
            if (typeof item !== 'object' || item === null) continue;
            
            // Konstruiere das YAML
            let fm = {
                arch: ["#5note"],
                archtype: [`#5note/3atomic/${map.class}`],
                status: "1active",
                entity_class: map.class,
                [map.field]: map.val,
                state: "active",
                lang: item.lang || {}
            };
            
            let aliases = [];
            if (item.label) aliases.push(item.label);
            else aliases.push(key);
            
            for (let langKey in fm.lang) {
                if (fm.lang[langKey] && !aliases.includes(fm.lang[langKey])) {
                    aliases.push(fm.lang[langKey]);
                }
            }
            if (item.latin && !aliases.includes(item.latin)) aliases.push(item.latin);
            fm.aliases = aliases;
            
            let vendors = [];
            if (item.prices) {
                vendors = Object.keys(item.prices);
                fm.vendors = vendors;
                fm.pref_vendor = item.pref_vendor || (vendors.length > 0 ? vendors[0] : "");
                fm.unit_price = fm.pref_vendor && item.prices[fm.pref_vendor] ? item.prices[fm.pref_vendor] : 0;
            } else {
                fm.vendors = [];
                fm.pref_vendor = "";
                fm.unit_price = item.unit_price || 0;
            }
            
            if (item.val) {
                for (let vk in item.val) {
                    fm[vk] = item.val[vk];
                }
            }
            
            if (item.icon) fm.icon = item.icon;
            
            let body = templates[map.class] || "";
            // Use split/join to avoid literal %> which breaks Templater parsing
            body = body.split("<%-" + " luhmannId " + "%>").join("");
            body = body.split("<%-" + " displayTitle " + "%>").join(aliases[0]);
            
            // Konvertiere das fm Objekt zu sauberem YAML
            let yamlLines = ["---"];
            for (let fk in fm) {
                let fv = fm[fk];
                if (Array.isArray(fv)) {
                    yamlLines.push(fk + ":");
                    for (let val of fv) {
                        let safeVal = String(val).split('"').join('\\"');
                        yamlLines.push('  - "' + safeVal + '"');
                    }
                } else if (typeof fv === 'object' && fv !== null) {
                    yamlLines.push(fk + ":");
                    for (let langK in fv) {
                        let safeVal = String(fv[langK]).split('"').join('\\"');
                        yamlLines.push('  ' + langK + ': "' + safeVal + '"');
                    }
                } else if (typeof fv === 'string') {
                    let safeVal = fv.split('"').join('\\"');
                    yamlLines.push(fk + ': "' + safeVal + '"');
                } else if (fv === null) {
                    yamlLines.push(fk + ": null");
                } else {
                    yamlLines.push(fk + ": " + fv);
                }
            }
            yamlLines.push("---");
            yamlLines.push("");
            yamlLines.push(body);
            
            let finalStr = yamlLines.join("\n");
            
            let outPath = `${outDir}/${key}.md`;
            let existing = app.vault.getAbstractFileByPath(outPath);
            if (existing) {
                await app.vault.modify(existing, finalStr);
            } else {
                await app.vault.create(outPath, finalStr);
            }
            count++;
        }
    }
}
new Notice(`✅ Migration erfolgreich! ${count} Einträge erstellt.`);
%>
