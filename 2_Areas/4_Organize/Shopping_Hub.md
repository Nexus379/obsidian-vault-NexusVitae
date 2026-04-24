---
banner: "![[anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_y: 0.5
banner_icon: 🛒
arch:
  - "#2area"
archtype:
  - "#2area/4organize"
inbox: false
status:
  - 1active
priority:
  - "1"
persona:
due:
do:
done:
cal0:
stars1:
area2:
project3:
task4:
note5:
resource6:
parent: ""
sibling: []
child: []
summary:
review:
shopping_extras: []
cssclasses:
  - dashboard-no-border
---

# 🛰️ Nexus Central Procurement Hub

> [!multi-column]
>
> > [!info] 🧊 Inventory & Strategy
> > **Look-Ahead Mode:** `$= (moment().day() === 1) ? "3 Days (Mon-Wed)" : (moment().day() === 4 ? "4 Days (Thu-Sun)" : "24h Focus")`
> > ---
> > **Status:** Data-sync active with [[Meal_Plan]] & [[6_Resources/Recipes|Recipe Database]].
>
> > [!todo] ➕ Quick Actions
> > [[t-buy|+ New To-Buy (Horizon 0)]]
> > [[p-buy|+ New Pro-Buy (Horizon 1)]]

---

## 🥗 1. Atomic Need (Nutrition & Supps)
> [!abstract]- 🧊 Batch Calculation & Strategy Log
> ```dataviewjs
> const planPath = "2_Areas/1_Selfcare/Nutrition/Meal_Plan.md";
> const planPage = dv.page(planPath);
> const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
> let Nexus;
> try { Nexus = await (require(enginePath))(app); } catch(e) {}
> 
> if (!planPage) {
>     dv.paragraph("❌ _Meal Plan not found._");
> } else {
>     const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
>     const slots = ["brk", "ben", "snk", "eve"];
>     
>     // 🔱 Dynamic Look-Ahead
>     const todayIdx = moment().day();
>     let lookAhead = (todayIdx === 1) ? 3 : (todayIdx === 4 ? 4 : 1);
>     let periodText = (todayIdx === 1) ? "Mon-Wed (3 Days)" : (todayIdx === 4 ? "Thu-Sun (4 Days)" : "Next 24h");
>     
>     let recipeCounts = {}; 
>     
>     // 1. Scan Meal Plan for specific period
>     for (let i = 0; i < lookAhead; i++) {
>         const dayStr = days[(todayIdx + i) % 7];
>         for (let slot of slots) {
>             let meals = planPage[`${dayStr}_${slot}`];
>             if (!meals) continue;
>             let mealArray = Array.isArray(meals) ? meals : [meals];
>             for (let m of mealArray) {
>                 const cleanId = String(m).replace(/[\[\]"]/g, "").trim();
>                 recipeCounts[cleanId] = (recipeCounts[cleanId] || 0) + 1;
>             }
>         }
>     }
> 
>     let neededAtoms = {};
>     let prepStatus = [];
> 
>     // 2. Inventory & Batch Calculation
>     for (let [recipeName, neededServings] of Object.entries(recipeCounts)) {
>         const recipe = dv.page(recipeName);
>         if (!recipe) continue;
> 
>         let stored = Number(recipe.portions_stored) || 0;
>         let pDate = recipe.prep_date ? moment(String(recipe.prep_date)) : null;
>         let shelfLife = Number(recipe.prep_shelf_life) || 4; 
>         let isExpired = false;
> 
>         if (stored > 0 && pDate) {
>             let daysOld = moment().diff(pDate, 'days');
>             if (daysOld > shelfLife) {
>                 isExpired = true;
>                 stored = 0; 
>                 prepStatus.push(`🚨 <span style="color:var(--text-error)">**${recipeName}** expired!</span> (${daysOld} days old)`);
>             } else {
>                 prepStatus.push(`🧊 **${recipeName}**: ${stored} portions stored (good for ${shelfLife - daysOld} days)`);
>             }
>         }
> 
>         let deficit = neededServings - stored;
>         let rYield = Number(recipe.portions) || 1;
> 
>         if (deficit > 0) {
>             let batchesToCook = Math.ceil(deficit / rYield);
>             let newPortions = batchesToCook * rYield;
> 
>             if (stored > 0 && !isExpired) {
>                 prepStatus.push(`🛒 **${recipeName}**: Need ${neededServings}, have ${stored} -> Cook ${batchesToCook}x Batch (+${newPortions} port.)`);
>             } else {
>                 prepStatus.push(`🛒 **${recipeName}**: Need ${neededServings} -> Cook ${batchesToCook}x Batch (+${newPortions} port.)`);
>             }
>             
>             for (let key in recipe) {
>                 if (key.startsWith("amt_")) {
>                     const atomId = key.replace("amt_", "");
>                     const amountPerBatch = Number(recipe[key]) || 0;
>                     neededAtoms[atomId] = (neededAtoms[atomId] || 0) + (amountPerBatch * batchesToCook);
>                 }
>             }
>         } else {
>             prepStatus.push(`✅ **${recipeName}**: Covered by stock (${neededServings} needed).`);
>         }
>     }
> 
>     // 3. UI GENERATION
>     dv.header(4, `📋 Strategy Log (${periodText})`);
>     if (prepStatus.length > 0) {
>         dv.paragraph(prepStatus.map(s => "- " + s).join("\n"));
>     } else {
>         dv.paragraph("_No meals planned for this period._");
>     }
> 
>     let html = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 15px;">`;
>     const sortedAtoms = Object.entries(neededAtoms).sort();
>     
>     if (sortedAtoms.length > 0) {
>         sortedAtoms.forEach(([id, amount]) => {
>             const item = Nexus ? Nexus.find(id) : null;
>             const label = item ? (item.label || id) : id.replace(/_/g, " ");
>             const unit = item ? item.unit : "Stk";
>             const val = Math.round(amount * 10) / 10;
>             
>             html += `<div style="padding: 6px 10px; background: var(--background-secondary-alt); border-radius: 4px; border-left: 3px solid var(--interactive-accent); font-size: 0.9em;">
>                 <b>${label}</b> <span style="float:right; opacity:0.8; font-family: monospace;">${val} ${unit}</span>
>             </div>`;
>         });
>     } else {
>         html += `<div style="grid-column: span 2; opacity: 0.6; padding: 10px; text-align: center; background: var(--background-secondary); border-radius: 6px;">_Inventory stable. No batch ingredients needed._</div>`;
>     }
>     html += `</div>`;
>     
>     dv.header(4, "🧺 Required Ingredients (Atoms)");
>     dv.paragraph(html);
> }
> ```

---

## 🛒 2. Consensus Emptio (Manual Procurement)

> [!multi-column]
>
> > [!danger|flat] 💸 Horizon 0: To-Buy (Daily)
> > ```dataview
> > TABLE WITHOUT ID 
> >   ("🔗 " + file.link) AS "Item",
> >   due AS "Deadline"
> > FROM #4task/tobuy
> > WHERE !completed
> > SORT due ASC
> > ```
>
> > [!money|flat] 💎 Horizon 1: Pro-Buy (Acquisitions)
> > ```dataview
> > TABLE WITHOUT ID
> >   ("🏗️ " + file.link) AS "Project",
> >   cost AS "Price"
> > FROM #3project/probuy
> > WHERE status = "1active"
> > SORT due ASC
> > ```

---

## 📦 3. Household & Supply (Extras)
> [!todo] Quick-Add Household Extras
> `INPUT[inlineListSuggester(optionQuery("")):shopping_extras]`
> `BUTTON[reset-household]`

```dataview
TABLE WITHOUT ID
  rows.text AS "Extras",
  file.link AS "Origin"
FROM "0_Calendar"
WHERE shopping_extras AND !completed
GROUP BY file.link
```
