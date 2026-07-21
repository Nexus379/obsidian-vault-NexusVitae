async function generateShoppingList(app, dv, moment) {
    // dv.current() only exists on the inline dataviewjs API; from a Templater button
    // dv is the top-level API (no current()) -> guard, then fall back to a date prompt.
    const cur = (dv && typeof dv.current === "function") ? dv.current() : null;
    let logDateStr = cur ? cur.cal_date : null;

    // If started manually (e.g. from the Shopping Hub), ask for the date.
    if (!logDateStr) {
        let tp = app.plugins.plugins["templater-obsidian"]?.templater?.current_functions_object;
        let userInput = null;
        if (tp && tp.system && typeof tp.system.prompt === "function") {
            userInput = await tp.system.prompt("📅 Which date is the list for? (YYYY-MM-DD)", moment().format("YYYY-MM-DD"));
            if (userInput) logDateStr = userInput;
        }
        if (!logDateStr) {
            logDateStr = moment().format("YYYY-MM-DD");
        }
    }
    
    const logDate = moment(logDateStr, "YYYY-MM-DD");
    const referenceDate = logDate.isValid() ? logDate : moment();
    
    const year = referenceDate.format("YYYY");
    const month = referenceDate.format("MM");
    const kw = referenceDate.format("WW");
    
    const fileName = `Grocerie_${logDate.format("YYYY-MM-DD")}.md`;
    const folderPath = `0_Calendar/4_Projectlogs/Routine/${year}/${month}`;
    const fullPath = `${folderPath}/${fileName}`;
    
    // 1. Strategie auslesen
    const hubPage = dv.page("2_Areas/4_Organize/Plan/Shopping_Hub");
    const strategy = hubPage && hubPage.shopping_strategy ? hubPage.shopping_strategy : "value";
    
    // Engine laden
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
    let Nexus;
    try { 
        delete require.cache[require.resolve(enginePath)]; 
        Nexus = await require(enginePath)(app); 
    } catch(e) { console.error(e); }
    
    // 2. Meal Plan Lookahead berechnen (Jetzt mit Wochenplan-Fallback)
    let planPage = dv.page(`0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_meal.md`);
    if (!planPage) {
        planPage = dv.page("2_Areas/1_Selfcare/Plan/Meal_Plan.md");
    }
    
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
                if (key.startsWith("qty_")) {
                    const atomId = key.replace("qty_", "");
                    const amountPerBatch = Number(recipe[key]) || 0;
                    neededAtoms[atomId] = (neededAtoms[atomId] || 0) + (amountPerBatch * batchesToCook);
                }
            }
        }
    }
    
    // 3. Tages-Block (Shopping Run) generieren
    let blockMd = `## 🛒 Einkauf am ${logDateStr} (Lookahead: ${lookAhead} Days)\n\n`;
    blockMd += `> [!info] Strategy: **${strategy.toUpperCase()}**\n\n`;
    
    blockMd += `### 🥗 Supermarkt & Haushalt\n\n`;
    let totalBudget = 0;
    
    let vendorGroups = { "Uncategorized": [] };
    if (Object.keys(neededAtoms).length > 0) {
        for (let [id, amount] of Object.entries(neededAtoms)) {
            const item = Nexus ? Nexus.find(id) : null;
            const label = item ? (item.label || id) : id.replace(/_/g, " ");
            const icon = item ? (item.icon || "📦") : "📦";
            const val = Math.round(amount * 1000) / 10;
            
            let priceInfo = "";
            let vendorName = "Uncategorized";
            
            if (Nexus && Nexus.getStrategicPrice) {
                const sp = Nexus.getStrategicPrice(id, strategy, 1.0); 
                if (sp && sp.unit_price > 0) {
                    priceInfo = `*(💰 ~${sp.total.toFixed(2)})*`;
                    vendorName = sp.vendor || "Uncategorized";
                    totalBudget += sp.total;
                }
            }
            
            if (!vendorGroups[vendorName]) vendorGroups[vendorName] = [];
            vendorGroups[vendorName].push(`- [ ] ${icon} **${label}** (${val}g) ${priceInfo}`);
        }
    }
    
    // Render grouped lists (auf H4, da H2 der Tag und H3 die Kategorie ist)
    let hasGroceries = false;
    for (let [vendor, items] of Object.entries(vendorGroups)) {
        if (items.length > 0) {
            hasGroceries = true;
            blockMd += `#### 🏬 ${vendor}\n`;
            blockMd += items.join("\n") + "\n\n";
        }
    }
    
    // Manuelle ToBuy Tasks
    const tobuyTasks = dv.pages("#4task/tobuy").where(p => !p.completed);
    if (tobuyTasks.length > 0) {
        blockMd += `#### 🛒 Extra Tasks (To-Buy)\n`;
        for (let t of tobuyTasks) {
            blockMd += `- [ ] 🛒 **${t.file.name}** [[${t.file.name}|↗️]]\n`;
        }
        blockMd += `\n`;
        hasGroceries = true;
    }
    
    if (hasGroceries) {
        blockMd += `**💸 Estimated Shopping Budget:** ~${totalBudget.toFixed(2)}\n\n`;
    } else {
        blockMd += `_No basic items needed._\n\n`;
    }
    
    blockMd += `---\n\n`;
    blockMd += `### 💎 Projekte & Hardware (Pro-Buy)\n\n`;
    const probuy = dv.pages("#3project/probuy").where(p => p.status === "1active");
    if (probuy.length > 0) {
        for (let p of probuy) {
            let budget = p.amount ? `(💰 ${p.amount})` : "";
            blockMd += `- [ ] 💎 **${p.file.name}** ${budget} [[${p.file.name}|↗️]]\n`;
        }
    } else {
        blockMd += `_No active hardware projects._\n\n`;
    }
    
    // 4. In Datei schreiben oder anhängen (unten)
    let existingFile = app.vault.getAbstractFileByPath(fullPath);
    if (existingFile) {
        const content = await app.vault.read(existingFile);
        
        // Füge den neuen Block ganz unten an
        await app.vault.modify(existingFile, content + "\n---\n\n" + blockMd);
        
    } else {
        let outMd = `---\n`;
        outMd += `banner: "![[anime-style-cozy-home-interior-with-furnishings.jpg]]"\n`;
        outMd += `banner_y: 0.5\n`;
        outMd += `banner_icon: 🛒\n`;
        outMd += `arch: ["#0cal"]\n`;
        outMd += `archtype: ["#0cal/7plan/shopping"]\n`;
        outMd += `plan_year: "${year}"\n`;
        outMd += `plan_kw: "${kw}"\n`;
        outMd += `shopping_strategy: "${strategy}"\n`;
        outMd += `---\n\n`;
        outMd += `# 🛒 Shopping Log: Woche ${kw}\n\n`;
        outMd += blockMd;
        
        // Ordner erstellen falls er fehlt
        let cPath = "";
        for (let seg of folderPath.split('/')) {
            cPath = cPath === "" ? seg : `${cPath}/${seg}`;
            if (!app.vault.getAbstractFileByPath(cPath)) await app.vault.createFolder(cPath);
        }
        await app.vault.create(fullPath, outMd);
    }
    
    return `[[${fileName}|🛒 Open Grocery List (${logDate.format("YYYY-MM-DD")})]]`;
}

module.exports = generateShoppingList;
