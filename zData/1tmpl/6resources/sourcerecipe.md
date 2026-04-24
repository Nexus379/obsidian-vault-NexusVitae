<%-*
// 🔱 1. INITIALIZATION & NEXUS-SYNC
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";

// FALLBACK: Untitled Check (Prevents anonymous files)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🥗 Recipe Name?", "");
}
if (!title || title.trim() === "") title = "Recipe-" + tp.date.now("HH-mm");

// Physical renaming for database stability
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
} 

// 🔱 2. AUTO-COVER SCAN (Food-Edition)
// Automatically creates the folder if it's missing in the new vault
const coverFolder = "xAttachment/Cover/Foodcover";
let checkPath = "";
for (const seg of coverFolder.split('/')) {
    checkPath = checkPath === "" ? seg : `${checkPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(checkPath)) await app.vault.createFolder(checkPath);
}

// Searches for an image named exactly like the recipe (lowercase, no spaces)
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let pureCover = app.vault.getAbstractFileByPath(`${coverFolder}/${cleanName}-cover.jpg`) ? `${coverFolder}/${cleanName}-cover.jpg` : "";

// Fallback: If no image is found, prompt for one
if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Recipe Image Filename (no .jpg)?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
}

// Title cleaning for the visual H1 heading
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(recipe-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/grocery green.jpg]]"
banner_y: 0.6
banner_icon: 🍰
cover: "[[<%- pureCover %>]]"
aliases: ["<%- displayTitle %>"]
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/recipe"
status:
  - 1active
priority: 
  - "4"
persona: creator
explore_lvl:
difficulty:
  - "1"
spice_lvl:
prep_h: 0
prep_m: 15
portions: 1
mealtype: []
mealtime: []
cook_tool: []
cook_method: []
last_cooked:
portions_stored: 0 
prep_date: "" 
prep_shelf_life: 3
is_prep: false
rating:
  - "1"
area2:
ingredients: []
---

# 🥗 <%- displayTitle %>

## ⚖️ Ingredient Management (Alchemy)

> [!multi-column]
> > [!abstract] **Lab Protocol**
> > 1. Select Atoms.
> > 2. Define Potency (1.0 = 100g).
> > 
> > `BUTTON[add-recipe-ingre]` 
> 
> > [!info] **Recipe Scaling**
> > 🍽️ **Current Servings:** `VIEW[{portions}]`
> > 
> > `BUTTON[change-portion-recipe]`
> > <small>(Use the button to physically recalculate all ingredient amounts in the YAML)</small>

### 🧪 Active Atoms

#### **Standard / Main:**
%%INGREDIENTS_LIST%%

```dataviewjs
/**
 * 🧪 NEXUS RECIPE ENGINE - Integrated Synthesis & Optimizer
 */

// 🔱 1. LOAD MASTER ENGINE
const enginePath = "zData/2scripts/itemsNexusEngine.js";
const engineFile = app.vault.getAbstractFileByPath(enginePath);
if (!engineFile) { dv.paragraph("> [!error] Critical: Items Nexus Engine missing."); return; }

const Nexus = await require(app.vault.adapter.basePath + "/" + enginePath)(app);
const getVal = (stats, key) => Number((stats && stats[key]) || 0);
const getTotalIron = (stats) => getVal(stats, "iron_animal_mg") + getVal(stats, "iron_plant_mg");
const getTotalVitA = (stats) => getVal(stats, "vit_a_mcg") + getVal(stats, "vit_a_retinol_mcg") + getVal(stats, "vit_a_beta_carotin_mcg");
const Nutri = {
    getVal,
    getTotalIron,
    getTotalVitA,
    synergyRules: [
        {
            type: "boost",
            name: "Iron Catalyst",
            message: "Iron is present; Vitamin C can improve absorption.",
            check: (stats) => getTotalIron(stats) > 0 && getVal(stats, "vit_c_mg") >= 20
        },
        {
            type: "info",
            name: "Fat-Soluble Vitamin Support",
            message: "Vitamin A is present; dietary fat helps absorption.",
            check: (stats) => getTotalVitA(stats) > 0 && getVal(stats, "fat_total_g") >= 3
        },
        {
            type: "warning",
            name: "Mineral Balance",
            message: "High calcium with low magnesium; consider magnesium-rich ingredients.",
            check: (stats) => getVal(stats, "calcium_mg") > 400 && getVal(stats, "magnesium_mg") < 50
        }
    ]
};

// 🔱 2. MASTER DATA & SELECTION
const p = dv.current();
const ingredients = Array.isArray(p.ingredients) ? p.ingredients : (p.ingredients ? [p.ingredients] : []);
const masterCatalog = Nexus.getDomain("FOOD");

if (ingredients.length === 0) {
    dv.paragraph("> [!info] 🔬 **Lab Status:** Awaiting synthesis. Add atoms to begin.");
} else {
    // 🔱 3. FULL SPECTRUM CALCULATION
    let totals = {};
    const baseMetrics = ["kcal", "protein_g", "fat_total_g", "carbs_total_g", "fiber_g", "magnesium_mg", "iron_animal_mg", "iron_plant_mg", "calcium_mg", "zinc_mg", "potassium_mg", "vit_a_mcg", "vit_a_retinol_mcg", "vit_a_beta_carotin_mcg", "vit_b12_mcg", "vit_c_mg", "vit_d_iu", "vit_k_mcg", "vit_k1_mcg", "vit_k2_mcg"];
    const metrics = Array.from(new Set([
        ...baseMetrics,
        ...Object.values(masterCatalog).flatMap(item => Object.keys(item.val || {}))
    ])).sort();
    metrics.forEach(m => totals[m] = 0);

    ingredients.forEach(ing => {
        const safeKey = String(ing).toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
        const factor = p["amt_" + safeKey] || 0;
        const atom = masterCatalog[ing] || Nexus.find(ing);
        
        if (atom && atom.val) {
            metrics.forEach(m => {
                const val = Nutri.getVal ? Nutri.getVal(atom.val, m) : (atom.val[m] || 0);
                totals[m] += val * factor;
            });
        }
    });

    // 🔱 4. DEEP-SYNC TO FRONTMATTER (Freezes data into YAML)
    const tFile = app.vault.getAbstractFileByPath(p.file.path);
    await app.fileManager.processFrontMatter(tFile, (fm) => {
        metrics.forEach(key => {
            const val = totals[key] || 0;
            if (val > 0) {
                fm[`recipe_${key}`] = Number(val.toFixed(2));
            } else {
                delete fm[`recipe_${key}`]; 
            }
        });
        if (Nutri.getTotalIron) fm.recipe_iron_total = Number(Nutri.getTotalIron(totals).toFixed(2));
        if (Nutri.getTotalVitA) fm.recipe_vit_a_total = Number(Nutri.getTotalVitA(totals).toFixed(2));
    });

    const portions = Number(p.portions) || 1;

    // 🔱 5. ALCHEMY OPTIMIZER (Smart Suggestions)
    dv.header(3, "💡 Alchemy Optimizer");
    let suggestions = [];
    
    // Check 1: Iron needs Vit C
    if (Nutri.getTotalIron && Nutri.getTotalIron(totals)/portions > 2 && Nutri.getVal(totals, "vit_c_mg")/portions < 20) {
        suggestions.push("🍋 **Missing Catalyst:** You have Iron, but low Vitamin C. Add a squeeze of lemon, bell pepper, or parsley to boost absorption.");
    }
    // Check 2: Fat-soluble vitamins need lipids
    if (Nutri.getTotalVitA && Nutri.getTotalVitA(totals)/portions > 500 && Nutri.getVal(totals, "fat_total_g")/portions < 3) {
        suggestions.push("🥑 **Unlock Vitamin A:** High Vitamin A detected, but almost no fat. Add a dash of olive oil, nuts, or avocado to absorb it.");
    }
    // Check 3: Protein Baseline
    if (Nutri.getVal(totals, "protein_g")/portions < 15) {
        suggestions.push("💪 **Protein Gap:** This meal is low in protein (< 15g). Consider adding tofu, eggs, beans, or lean meat to stabilize blood sugar.");
    }
    // Check 4: Calcium-Magnesium Balance
    if (Nutri.getVal(totals, "calcium_mg")/portions > 400 && Nutri.getVal(totals, "magnesium_mg")/portions < 50) {
        suggestions.push("🎃 **Mineral Imbalance:** High Calcium needs Magnesium to stay balanced. Think about adding pumpkin seeds, spinach, or dark chocolate.");
    }

    if (suggestions.length > 0) {
        dv.paragraph("> [!example] **Suggested Additions**\n> " + suggestions.join("\n> \n> "));
    } else {
        dv.paragraph("> [!success] **Formula Optimized:** Nutritional profile is well balanced.");
    }

    // 🔱 6. RENDERING: DASHBOARD
    let macHTML = "<h3>📊 Core Foundation (Per Serving)</h3><ul>";
    ["kcal", "protein_g", "fat_total_g", "carbs_total_g"].forEach(k => {
        const totalVal = Nutri.getVal ? Nutri.getVal(totals, k) : (totals[k] || 0);
        const servingVal = totalVal / portions;
        const label = k.replace("_g", "").replace("kcal", "Energy").toUpperCase();
        macHTML += `<li><strong>${label}:</strong> ${servingVal.toFixed(1)} ${k === "kcal" ? "kcal" : "g"}</li>`;
    });
    macHTML += "</ul>";

    let microHTML = "<h3>💎 Key Minerals (Per Serving)</h3><ul>";
    ["magnesium_mg", "iron_plant_mg", "zinc_mg"].forEach(k => {
        const totalVal = Nutri.getVal ? Nutri.getVal(totals, k) : (totals[k] || 0);
        const servingVal = totalVal / portions;
        microHTML += `<li><strong>${k.split('_')[0].toUpperCase()}:</strong> ${servingVal.toFixed(1)} mg</li>`;
    });
    microHTML += "</ul>";

    dv.span(`<div style='display: flex; gap: 40px;'><div>${macHTML}</div><div>${microHTML}</div></div>`);

    // 🔱 7. FULL MOLECULAR PROFILE DROPDOWN
    let fullHtml = `<details><summary style="cursor: pointer; opacity: 0.8; font-size: 0.9em; margin-top: 15px; margin-bottom: 10px;">🧬 View Full Molecular Profile (${metrics.length} Atoms per Serving)</summary>`;
    fullHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 5px; font-size: 0.85em; opacity: 0.9;">`;
    metrics.forEach(m => {
        if (totals[m] > 0) {
            let cleanName = m.replace(/_mg|_mcg|_g|_iu|_ml/g, "").replace(/_/g, " ");
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            let unit = m.split('_').pop();
            fullHtml += `<div><b>${cleanName}:</b> ${(totals[m] / portions).toFixed(2)} ${unit}</div>`;
        }
    });
    fullHtml += `</div></details>`;
    dv.span(fullHtml);

    // 🔱 8. BIO-RESONANCE (Live Synergy Check)
    dv.header(3, "🛰️ Bio-Resonance Analysis");
    let resonanceFound = false;
    
    if (Nutri.synergyRules) {
        Nutri.synergyRules.forEach(rule => {
            if (rule.check(totals)) {
                resonanceFound = true;
                const typeMap = { boost: "success", warning: "caution", info: "info" };
                const type = typeMap[rule.type] || "info";
                dv.paragraph(`> [!${type}] **${rule.name}**\n> ${rule.message}`);
            }
        });
    }

    if (!resonanceFound) dv.paragraph("> [!info] **Resonance Stable:** No active synergies or conflicts detected.");
}
```
## Alchemy Process

> [!blank] 🎛️ **Nexus Info**
> 
> **💎 Status**
> `INPUT[inlineSelect(option("0recurring", "🔄 Recurring"), option("0start", "🆕 Start"), option("1active", "🟢 Active"), option("2passive", "🟡 Passive"), option("3idea", "💡 Idea"), option("done", "✅ Done"), option("canceled", "❌ Canceled"), option("review", "🔍 Review"), option("archive", "📂 Archive"), option("bin", "🗑️ Bin")):status]`
> **🌀 Explore**
> `INPUT[inlineSelect(option("0blueprint", "🌑 Blueprint"), option("1research", "🔍 Research"), option("3investing", "🧪 Testing"), option("4polish", "✨ Polish"), option("5finish", "💎 Finish")):explore_lvl]`

> [!multi-column]
> > [!example] 🧬 **Bio-Coordinates**
> > **Time:**
> > 
> > `INPUT[number:prep_h]`h  `INPUT[number:prep_m]`m
> > **Type:** `BUTTON[add-meal-type]`
> > 
> > `VIEW[{mealtype}]` 
> > 
> > **Time:** `BUTTON[add-meal-time]`
> >
> > `VIEW[{mealtime}]`
> > 
> > **Method:** `BUTTON[add-cook-method]`
> > 
> > `VIEW[{cook_method}]`
> > 
> > **Tool:** `BUTTON[add-cook-tool]`
> > 
> > `VIEW[{cook_tool}]`
> > 
> > **🌶️ Spice** `INPUT[inlineSelect(option(0, "None"), option(1, "🌶️"), option(2, "🌶️🌶️"), option(3, "🌶️🌶️🌶️")):spice_lvl]`
> 
> > [!cake] **Synthesis Summary**
> > ```dataviewjs
> > const p = dv.current();
> > const items = p.ingredients || p.spont_meals || [];
> > const isList = Array.isArray(items) ? items : [items];
> > 
> > if (isList.length > 0) {
> >      try {
> >          const file = app.vault.getAbstractFileByPath(p.file.path);
> >          const content = await app.vault.read(file);
> >          
> >          const startIdx = content.indexOf("### 🧪 Active Atoms");
> >          const endIdx = content.indexOf("%%INGREDIENTS_LIST%%");
> >          
> >          let html = "<div style='line-height:1.2; font-size:0.92em; padding-top:2px;'>";
> >          
> >          if (startIdx !== -1 && endIdx !== -1) {
> >              const section = content.substring(startIdx, endIdx);
> >              const blocks = section.split(/#### \*\*([^*]+):\*\*/);
> >              
> >              if (blocks.length < 2) {
> >                  const keys = section.match(/amt_[a-z0-9_]+/g) || [];
> >                  keys.forEach(k => {
> >                      const val = p[k] || 0;
> >                      const name = k.replace("amt_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
> >                      if (val > 0) html += `• <b>${Math.round(val * 100)}g</b> ${name}<br>`;
> >                  });
> >              } else {
> >                  for (let i = 1; i < blocks.length; i += 2) {
> >                      const catName = blocks[i].trim();
> >                      const keys = blocks[i+1].match(/amt_[a-z0-9_]+/g);
> >                      
> >                      if (keys) {
> >                          html += `<div style='margin-top:6px; color:var(--text-accent); border-bottom:1px solid var(--background-modifier-border); font-weight:bold;'>${catName}</div>`;
> >                          keys.forEach(k => {
> >                              const val = p[k] || 0;
> >                              const name = k.replace("amt_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
> >                              if (val > 0) html += `• <b>${Math.round(val * 100)}g</b> ${name}<br>`;
> >                          });
> >                      }
> >                  }
> >              }
> >          }
> >          
> >          html += "</div>";
> >          dv.el("div", html);
> >          
> >      } catch (e) { 
> >          dv.paragraph("🧪 _Processing molecular data..._"); 
> >      }
> > } else { 
> >      dv.paragraph("_Awaiting molecular synthesis..._"); 
> > }
> > ```

> [!blank]
> **⚖️ Difficulty** `INPUT[inlineSelect(option("1", "💥"), option("2", "💥💥"), option("3", "💥💥💥"), option("4", "💥💥💥💥"), option("5", "💥💥💥💥💥")):difficulty]`
> **⭐ Rating** `INPUT[inlineSelect(option("1", "⭐"), option("2", "⭐⭐"), option("3", "⭐⭐⭐"), option("4", "⭐⭐⭐⭐"), option("5", "⭐⭐⭐⭐⭐")):rating]`

> [!info] 🧊 **Prep Intelligence**
> `VIEW[{is_prep}]` **Prep-Mode:** `INPUT[toggle:is_prep]`
> 📥 **Stored:** `INPUT[number:portions_stored]` servings 
>
> 📅 **Prepped on:** `INPUT[date:prep_date]` | 
> ⏱️ **Life (Days):** `INPUT[number:prep_shelf_life]`
> 
> ---
> `$= const p = dv.current(); if(!p.is_prep || !p.prep_date) { dv.span("_No active prep data_") } else { const end = moment(p.prep_date).add(p.prep_shelf_life, 'days'); const diff = end.diff(moment(), 'days'); const color = diff < 0 ? "var(--text-error)" : "var(--text-success)"; dv.paragraph("⚠️ **Good until:** <span style='color:" + color + "'>" + end.format("YYYY-MM-DD") + "</span> (" + (diff < 0 ? "EXPIRED" : diff + " days left") + ")"); }`

## 🍳 Execution (Preparation)

### 🔪 1. Mise en Place
 - [ ]

### 🔥 2. Synthesis




### 🍽️ 3. Finalization
 - [ ]

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
