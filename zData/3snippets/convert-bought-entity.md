<%-*
// 🛒 CONVERT BOUGHT ITEM TO PERMANENT ENTITY NOTE
// Creates a new resource entity in 6_Resources/_Entities/... when bought

const itemName = await tp.system.prompt("🛒 Gekauftes Item Name? (z.B. Glasreiniger)", "");
if (!itemName || itemName.trim() === "") return;

const cleanName = itemName.trim();

const categories = [
    { label: "1 🧹 Household Item", tmpl: "zData/1tmpl/6resources/sourceentities_household.md", folder: "6_Resources/_Entities/Home/Drugstore/Household" },
    { label: "2 🥦 Ingredient / Food", tmpl: "zData/1tmpl/6resources/sourceentities_ingredients.md", folder: "6_Resources/_Entities/Nutrition/Ingredients" },
    { label: "3 🔌 Tech & Electronics", tmpl: "zData/1tmpl/6resources/sourceentities_tech.md", folder: "6_Resources/_Entities/Electronics_Tech" },
    { label: "4 💊 Medical / Health", tmpl: "zData/1tmpl/6resources/sourceentities_medical.md", folder: "6_Resources/_Entities/Medical" },
    { label: "5 👕 Clothing", tmpl: "zData/1tmpl/6resources/sourceentities_clothing.md", folder: "6_Resources/_Entities/Clothing" },
    { label: "6 🏋️ Fitness Gear", tmpl: "zData/1tmpl/6resources/sourceentities_fitness.md", folder: "6_Resources/_Entities/Fitness" },
    { label: "7 🎨 Art & Stationery", tmpl: "zData/1tmpl/6resources/sourceentities_art.md", folder: "6_Resources/_Entities/Stationery_Art" },
    { label: "8 ⛺ Camping Gear", tmpl: "zData/1tmpl/6resources/sourceentities_camping.md", folder: "6_Resources/_Entities/Camping_Outdoors" }
];

const catIdx = await tp.system.suggester(categories.map(c => c.label), Array.from(categories.keys()));
if (catIdx === null) return;

const selCat = categories[catIdx];

// Create folder if missing
let cPath = "";
for (let seg of selCat.folder.split('/')) {
    cPath = cPath === "" ? seg : `${cPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
}

const targetPath = `${selCat.folder}/${cleanName}.md`;

const existingFile = app.vault.getAbstractFileByPath(targetPath);
if (existingFile instanceof tp.obsidian.TFile) {
    new Notice(`ℹ️ Entity already exists: ${cleanName}. Opening & revealing...`);
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(existingFile);
    app.commands.executeCommandById("file-explorer:reveal-active-file");
} else {
    const tmplFile = app.vault.getAbstractFileByPath(selCat.tmpl);
    let content = "";
    if (tmplFile instanceof tp.obsidian.TFile) {
        content = await app.vault.read(tmplFile);
        content = content.replace(/{{NEXUS_TITLE}}/g, cleanName).replace(/{{title}}/g, cleanName);
    } else {
        content = `---\narch:\n  - "#6resource"\narchtype:\n  - "#6resource/entity"\nstatus: 1active\npref_vendor: ""\npref_price: 0.00\nunit_price: 0.00\nprice_cheap: 0.00\nvendor_cheap: ""\nprice_value: 0.00\nvendor_value: ""\nprice_pure_cheap: 0.00\nvendor_pure_cheap: ""\nprice_pure: 0.00\nvendor_pure: ""\nprice_market: 0.00\nvendor_market: ""\n---\n\n# ${cleanName}\n`;
    }
    
    const created = await app.vault.create(targetPath, content);
    new Notice(`✨ Entity created: ${cleanName}`);
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(created);
    app.commands.executeCommandById("file-explorer:reveal-active-file");
}

tR += `[[${targetPath}|${cleanName}]]`;
-%>
