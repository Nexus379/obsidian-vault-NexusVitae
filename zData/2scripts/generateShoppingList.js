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
    const hubPage = dv.page("2_Areas/1_Selfcare/Household/Shopping_Hub");
    const strategy = hubPage && hubPage.shopping_strategy ? hubPage.shopping_strategy : "value";
    
    // Engine laden
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
    let Nexus;
    try { 
        delete require.cache[require.resolve(enginePath)]; 
        Nexus = await require(enginePath)(app); 
    } catch(e) { console.error(e); }
    
    // 2. Meal plan lookahead (weekly plan first, master as fallback)
    let planPage = dv.page(`0_Calendar/7_Plan/${year}/${month}/${year}-W${kw}_meal.md`);
    if (!planPage) {
        planPage = dv.page("2_Areas/1_Selfcare/Plan/Meal_Plan.md");
    }
    
    const todayIdx = referenceDate.day();
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const slots = ["brk", "ben", "lun", "snk", "eve"];

    // 2b. Shopping days come from the Routine Timeblocking plan, not from a fixed rhythm:
    // every day holding a shop_* block (shop_groceries) is a shopping day, and this run has
    // to bridge the gap up to the NEXT one. Weekly routine wins over the master (planPaths).
    let shoppingDays = [];
    try {
        const ppPath = app.vault.adapter.basePath + "/zData/2scripts/planPaths.js";
        delete require.cache[require.resolve(ppPath)];
        const planPaths = require(ppPath)();
        // referenceDate, not logDateStr: a cancelled date prompt leaves logDateStr null.
        const routine = planPaths.resolve(dv, moment, "routine", referenceDate.format("YYYY-MM-DD"));
        const rPage = routine && routine.page;
        if (rPage) {
            const periods = Number(rPage.rt_periods) || 14;
            for (let d = 0; d < 7; d++) {
                for (let i = 1; i <= periods; i++) {
                    let val = rPage[`rt_${days[d]}_${i}`];
                    if (!val || val === "free" || val === "break") continue;
                    // Same convention as routineEngine: list -> first entry, "key|note" -> key.
                    const baseKey = String(Array.isArray(val) ? val[0] : val).split("|")[0].trim();
                    if (baseKey.startsWith("shop_")) { shoppingDays.push(d); break; }
                }
            }
        }
    } catch (e) { console.error("[Shopping] Routine lookup failed:", e); }

    // No routine planned yet -> keep the previous Mon/Thu rhythm so nothing breaks.
    if (shoppingDays.length === 0) shoppingDays = [1, 4];

    // Days until the next shopping day: 1 (shop again tomorrow) .. 7 (only one run per week).
    let lookAhead = 7;
    for (let i = 1; i <= 7; i++) {
        if (shoppingDays.includes((todayIdx + i) % 7)) { lookAhead = i; break; }
    }
    
    // Per recipe we keep ONE ENTRY PER PLANNED SERVING together with its day offset:
    // a leftover portion only covers a serving if it is still edible on THAT day, and
    // how many servings a meal needs depends on how many people eat.
    //   "[[Lasagne]] x3"  → 3 servings for this meal
    //   <day>_eaters: 3   → applies to every meal of that day without its own count
    //   neither          → 1 serving (unchanged behaviour for existing plans)
    let recipeDays = {};
    if (planPage) {
        for (let i = 0; i < lookAhead; i++) {
            const dayStr = days[(todayIdx + i) % 7];
            const dayEaters = Math.max(1, Number(planPage[`${dayStr}_eaters`]) || 1);
            for (let slot of slots) {
                let meals = planPage[`${dayStr}_${slot}`];
                if (!meals) continue;
                let mealArray = Array.isArray(meals) ? meals : [meals];
                for (let m of mealArray) {
                    const raw = String(m).replace(/[\[\]"]/g, "").trim();
                    // Trailing " x3" / " ×3" — whitespace required, so a recipe whose name
                    // ends in something like "x3" is not mistaken for a portion count.
                    const cnt = raw.match(/\s+[x×]\s*(\d+)$/i);
                    const servings = cnt ? Math.max(1, Number(cnt[1])) : dayEaters;
                    const cleanId = (cnt ? raw.slice(0, cnt.index) : raw).trim();
                    if (!cleanId) continue;
                    const bucket = (recipeDays[cleanId] = recipeDays[cleanId] || []);
                    for (let s = 0; s < servings; s++) bucket.push(i);
                }
            }
        }
    }
    
    // E3/E4 — Fridge stock from the daily Meal logs: leftovers (cooked − me − others) of the
    // last LEFTOVER_DAYS still cover planned servings of the same recipe, so we don't re-buy
    // (e.g. 4 portions Lasagne cooked, 1 eaten → 3 leftovers cover the next planned Lasagne).
    // Each batch keeps how many days old it already is, so the allocation below can check
    // whether it is still edible on the day the serving is actually planned for.
    let leftoverStock = {};
    try {
        const mEngPath = app.vault.adapter.basePath + "/zData/2scripts/mealEngine.js";
        delete require.cache[require.resolve(mEngPath)];
        const mEng = require(mEngPath)();
        for (let b = 0; b < mEng.LEFTOVER_DAYS; b++) {
            const d = moment(referenceDate).subtract(b, 'days');
            const lp = dv.page(`0_Calendar/4_Projectlogs/Routine/${d.format("YYYY")}/${d.format("MM")}/Meal_${d.format("YYYY-MM-DD")}.md`);
            if (!lp) continue;
            for (const row of mEng.parseMealActuals(lp, dv).leftovers) {
                (leftoverStock[row.path] = leftoverStock[row.path] || []).push({ age: b, qty: row.leftover });
            }
        }
    } catch(e) { console.error("Leftover stock scan failed:", e); }

    let neededAtoms = {};
    for (let [recipeName, dayOffsets] of Object.entries(recipeDays)) {
        const recipe = dv.page(recipeName);
        if (!recipe) continue;

        const shelfLife = Number(recipe.prep_shelf_life) || 4;

        // One pool of existing portions, each with the age it has TODAY.
        let pool = [];
        const storedQty = Number(recipe.portions_stored) || 0;
        if (storedQty > 0) {
            const pDate = recipe.prep_date ? moment(String(recipe.prep_date)) : null;
            // No prep_date means we cannot date it — treat as prepped today, as before.
            pool.push({ age: pDate ? referenceDate.diff(pDate, 'days') : 0, qty: storedQty });
        }
        for (const batch of leftoverStock[String(recipeName).split("|")[0].trim()] || []) {
            pool.push({ age: batch.age, qty: batch.qty });
        }
        // Oldest first: use up what expires soonest, so less goes to waste.
        pool.sort((a, b) => b.age - a.age);

        // Walk the planned servings in chronological order and try to cover each from stock.
        let uncovered = 0;
        for (const offset of dayOffsets.sort((a, b) => a - b)) {
            let covered = false;
            for (const p of pool) {
                if (p.qty <= 0) continue;
                if (p.age + offset > shelfLife) continue; // spoiled by the day it would be eaten
                p.qty -= 1;
                covered = true;
                break;
            }
            if (!covered) uncovered++;
        }

        if (uncovered > 0) {
            let rYield = Number(recipe.portions) || 1;
            let batchesToCook = Math.ceil(uncovered / rYield);
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
    // Name the days this run covers, so the list says what it is for at a glance.
    const covered = Array.from({ length: lookAhead }, (_, i) =>
        days[(todayIdx + i) % 7].charAt(0).toUpperCase() + days[(todayIdx + i) % 7].slice(1));
    let blockMd = `## 🛒 Shopping run ${logDateStr} — covers ${covered.join(", ")} (${lookAhead}d)\n\n`;
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
    
    // Render grouped lists (at H4, since H2 is the day and H3 the category)
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
    
    // 4. Write to the file, or append at the bottom
    let existingFile = app.vault.getAbstractFileByPath(fullPath);
    if (existingFile) {
        const content = await app.vault.read(existingFile);
        
        // Append the new block at the very bottom
        await app.vault.modify(existingFile, content + "\n---\n\n" + blockMd);
        
    } else {
        let outMd = `---\n`;
        outMd += `banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"\n`;
        outMd += `banner_y: 0.5\n`;
        outMd += `banner_icon: 🛒\n`;
        outMd += `arch: ["#0cal"]\n`;
        outMd += `archtype: ["#0cal/7plan/shopping"]\n`;
        outMd += `plan_year: "${year}"\n`;
        outMd += `plan_kw: "${kw}"\n`;
        outMd += `shopping_strategy: "${strategy}"\n`;
        outMd += `---\n\n`;
        outMd += `# 🛒 Shopping Log: Week ${kw}\n\n`;
        outMd += blockMd;
        
        // Create the folder if it is missing
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
