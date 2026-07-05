async function generateShoppingList(app, dv, moment) {
    let logDateStr = dv.current().cal_date;
    
    // Wenn manuell aus dem Shopping Hub gestartet, frage nach dem Datum!
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let userInput = await tp.system.prompt("📅 Für welches Datum soll die Liste sein? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
        if (!userInput) return; // Abgebrochen
        logDateStr = userInput;
    }
    
    const logDate = moment(logDateStr, "YYYY-MM-DD");
    const referenceDate = logDate.isValid() ? logDate : moment();
    
    const fileName = `Grocery_${logDateStr}.md`;
    const folderPath = "0_Calendar/4_Projectlogs/Utilities";
    const fullPath = `${folderPath}/${fileName}`;
    
    // Falls die Datei schon existiert, erstelle nur den Link
    let existingFile = app.vault.getAbstractFileByPath(fullPath);
    if (existingFile) {
        return `[[${fileName}|🛒 Open existing Grocery List (${logDateStr})]]`;
    }
    
    // 1. Strategie auslesen
    const hubPage = dv.page("2_Areas/4_Organize/Shopping_Hub");
    const strategy = hubPage && hubPage.shopping_strategy ? hubPage.shopping_strategy : "value";
    
    // Engine laden
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
    let Nexus;
    try { 
        delete require.cache[require.resolve(enginePath)]; 
        Nexus = await require(enginePath)(app); 
    } catch(e) { console.error(e); }
    
    // 2. Meal Plan Lookahead berechnen
    const planPage = dv.page("2_Areas/1_Selfcare/Nutrition/Meal_Plan.md");
    const todayIdx = referenceDate.day();
    let lookAhead = (todayIdx === 1) ? 3 : (todayIdx === 4 ? 4 : 1);
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const slots = ["brk", "ben", "lun", "snk", "eve"];
    
    let recipeCounts = {}; 
    if (planPage) {
        for (let i = 0; i < lookAhead; i++) {
            const dayStr = days[(todayIdx + i) % 7];
            for (let slot of slots) {
                let meals = planPage[`${dayStr}_${slot}`];
                if (!meals) continue;
                let mealArray = Array.isArray(meals) ? meals : [meals];
                for (let m of mealArray) {
                    const cleanId = String(m).replace(/[\[\]"]/g, "").trim();
                    recipeCounts[cleanId] = (recipeCounts[cleanId] || 0) + 1;
                }
            }
        }
    }
    
    let neededAtoms = {};
    for (let [recipeName, neededServings] of Object.entries(recipeCounts)) {
        const recipe = dv.page(recipeName);
        if (!recipe) continue;

        let stored = Number(recipe.portions_stored) || 0;
        let pDate = recipe.prep_date ? moment(String(recipe.prep_date)) : null;
        let shelfLife = Number(recipe.prep_shelf_life) || 4; 
        let isExpired = (stored > 0 && pDate && referenceDate.diff(pDate, 'days') > shelfLife);
        if (isExpired) stored = 0;

        let deficit = neededServings - stored;
        let rYield = Number(recipe.portions) || 1; 

        if (deficit > 0) {
            let batchesToCook = Math.ceil(deficit / rYield);
            for (let key in recipe) {
                if (key.startsWith("amt_")) {
                    const atomId = key.replace("amt_", "");
                    const amountPerBatch = Number(recipe[key]) || 0;
                    neededAtoms[atomId] = (neededAtoms[atomId] || 0) + (amountPerBatch * batchesToCook);
                }
            }
        }
    }
    
    // 3. Datei generieren
    let outMd = `---\n`;
    outMd += `archtype: ["#0cal/4projectlog"]\n`;
    outMd += `status: 1active\n`;
    outMd += `cal_date: ${logDateStr}\n`;
    outMd += `shopping_strategy: ${strategy}\n`;
    outMd += `---\n\n`;
    outMd += `# 🛒 Grocery Execution: ${logDateStr}\n\n`;
    outMd += `> [!info] Strategy: **${strategy.toUpperCase()}** | Lookahead: **${lookAhead} Days**\n\n`;
    
    outMd += `## 🥗 Supermarkt & Haushalt\n\n`;
    let totalBudget = 0;
    
    let groceryItems = [];
    if (Object.keys(neededAtoms).length > 0) {
        for (let [id, amount] of Object.entries(neededAtoms)) {
            const item = Nexus ? Nexus.find(id) : null;
            const label = item ? (item.label || id) : id.replace(/_/g, " ");
            const icon = item ? (item.icon || "📦") : "📦";
            const val = Math.round(amount * 1000) / 10;
            
            let priceInfo = "";
            if (Nexus && Nexus.getStrategicPrice) {
                // Bei Meal Plan sind amounts in gramm / mengen, unit_price ist meist per stück/kg, wir nehmen 1 Stück als Einheit
                const sp = Nexus.getStrategicPrice(id, strategy, 1.0); 
                if (sp && sp.unit_price > 0) {
                    priceInfo = `*(💰 ~${sp.total.toFixed(2)} @ ${sp.vendor})*`;
                    totalBudget += sp.total;
                }
            }
            groceryItems.push(`- [ ] ${icon} **${label}** (${val}g) ${priceInfo}`);
        }
    }
    
    // Manuelle ToBuy Tasks
    const tobuyTasks = dv.pages("#4task/tobuy").where(p => !p.completed);
    for (let t of tobuyTasks) {
        groceryItems.push(`- [ ] 🛒 **${t.file.name}** [[${t.file.name}|↗️]]`);
    }
    
    if (groceryItems.length > 0) {
        outMd += groceryItems.join("\n") + "\n\n";
        outMd += `**💸 Estimated Grocery Budget:** ~${totalBudget.toFixed(2)}\n\n`;
    } else {
        outMd += `_No groceries needed._\n\n`;
    }
    
    outMd += `---\n\n`;
    outMd += `## 💎 Projekte & Hardware (Pro-Buy)\n\n`;
    const probuy = dv.pages("#3project/probuy").where(p => p.status === "1active");
    if (probuy.length > 0) {
        for (let p of probuy) {
            let budget = p.amount ? `(💰 ${p.amount})` : "";
            outMd += `- [ ] 💎 **${p.file.name}** ${budget} [[${p.file.name}|↗️]]\n`;
        }
    } else {
        outMd += `_No active hardware projects._\n\n`;
    }
    
    // Ordner erstellen falls er fehlt
    let cPath = "";
    for (let seg of folderPath.split('/')) {
        cPath = cPath === "" ? seg : `${cPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
    }
    
    // Datei schreiben
    await app.vault.create(fullPath, outMd);
    
    // Gib den Link zur neuen Datei zurück
    return `[[${fileName}|🛒 Open Generated Grocery List (${logDateStr})]]`;
}

module.exports = generateShoppingList;
