---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N2026063012481589"
parent: ""
tags:
  - "#entity/ingredient"
aliases:
explore_lvl: 5finish
priority: 
subject: "Nutrition"
persona: "alchemist"
status: 1active
entity_class: "ingredient"
ingre_type: "staple_pantry"
pref_vendor: "orient_market"
vendors: []
state: "pantry"
needs_refill: false
shelf_life_months: 12
# calcium_mg: 1400.0
locations: 
  - "asia_market"
  - "orient_market"
fa: "Ø®Ø´Ø®Ø§Ø´ Ø³ÙÛŒØ¯"
protein_g: 18.0
zh: "ç™½ç½‚ç²Ÿç±½"
season: 
  - "all_year"
asia_market: 2.00
latin: "Papaver somniferum (Semen siccum album)"
es: "Amapola blanca"
ar: "Ø®Ø´Ø®Ø§Ø´ Ø£Ø¨ÙŠØ¶"
unit_type: "100g"
icon: "âšª"
ja: "ç™½ã‚±ã‚·ã®å®Ÿ"
vegan: true
kcal: 525
fat_total_g: 42.0
fr: "Pavot blanc"
sci: 
  - "#sci/Culinary"
usage: "Thickening agent for Indian Curries"
en: "White Poppy Seed"
hi: "à¤–à¤¸à¤–à¤¸ (Ø³ÙÛŒØ¯)"
unit_price: 2.00
props: 
  - "Milder and less nutty than blue poppy seeds"
  - "Used as a paste for texture and thickness"
  - "Common in Mughlai cuisine"
orient_market: 2.00
label: "White Poppy Seed"
ru: "Ð‘ÐµÐ»Ñ‹Ð¹ Ð¼Ð°Ðº"
de: "WeiÃŸer Mohn"
--- âš¡ MACROS (per 100g/ml) ---
kcal: 0
protein_g: 0
fat_total_g: 0
fat_saturated_g: 0
carbs_total_g: 0
carbs_sugar_g: 0
fiber_g: 0
# --- ðŸ’Ž MINERALS ---
magnesium_mg: 0
iron_animal_mg: 0
iron_plant_mg: 0
calcium_mg: 0
zinc_mg: 0
potassium_mg: 0
# --- ðŸ§¬ VITAMINS ---
vit_a_retinol_mcg: 0
vit_a_beta_carotin_mcg: 0
vit_b12_mcg: 0
vit_c_mg: 0
vit_d_iu: 0
vit_k1_mcg: 0
vit_k2_mcg: 0
# --- ðŸ§  AMINOS & OMEGAS ---
tryptophan_mg: 0
leucine_mg: 0
omega3_epa_mg: 0
omega3_dha_mg: 0
---

# ðŸ¥—  N2026063012481589   White Poppy Seed

## Bio-Synergy
> [!multi-column]
>
>> [!hub] **ðŸ”¬ Bio-Stats (per 100g)**
>> ```dataviewjs
> > const targets = {
> >     kcal: { value: 2000 },
> >     protein_g: { value: 50 },
> >     fat_total_g: { value: 70 },
> >     carbs_total_g: { value: 260 }
> > };
> > const p = dv.current();
> > 
> > const calcPct = (val, target) => val ? Math.round((val / target) * 100) : 0;
> > 
> > // âš¡ MAIN MACROS (Vertical List with explicit DIVs)
> > let macroHtml = "<div style='display: flex; flex-direction: column; gap: 4px; margin-bottom: 15px;'>";
> > 
> > const mainFields = [
> >     { label: "Energy", key: "kcal", target: targets.kcal.value, unit: "kcal" },
> >     { label: "Protein", key: "protein_g", target: targets.protein_g.value, unit: "g" },
> >     { label: "Total Fat", key: "fat_total_g", target: targets.fat_total_g.value, unit: "g" },
> >     { label: "Total Carbs", key: "carbs_total_g", target: targets.carbs_total_g.value, unit: "g" }
> > ];
> > 
> > mainFields.forEach(m => {
> >     const val = p[m.key] || 0;
> >     const pct = calcPct(val, m.target);
> >     macroHtml += `<div style="font-size: 0.9em;">
> >                    <b>${m.label}:</b> ${val} ${m.unit} 
> >                    <span style="opacity: 0.6; font-size: 0.85em; margin-left: 8px;">(${pct}%)</span>
> >                  </div>`;
> > });
> > 
> > macroHtml += "</div>";
> > dv.paragraph(macroHtml);
> > 
> > // ðŸ§¬ MICRO-HIGHLIGHTS (The Boxes)
> > const micros = {
> >     "ðŸ’Ž Minerals": ["magnesium_mg", "iron_animal_mg", "iron_plant_mg", "calcium_mg", "zinc_mg", "potassium_mg"],
> >     "ðŸ§¬ Vitamins": ["vit_a_retinol_mcg", "vit_a_beta_carotin_mcg", "vit_c_mg", "vit_d_iu", "vit_b12_mcg", "vit_k2_mcg"]
> > };
> > 
> > let html = "<div style='display: flex; flex-wrap: wrap; gap: 8px;'>";
> > for (let [group, fields] of Object.entries(micros)) {
> >     html += `<div style="border: 1px solid var(--background-modifier-border); padding: 8px; border-radius: 6px; min-width: 170px; background: var(--background-secondary-alt);">
> >                 <div style="font-weight: bold; font-size: 0.8em; color: var(--interactive-accent); border-bottom: 1px solid var(--background-modifier-border); margin-bottom: 4px;">${group}</div>`;
> >     fields.forEach(f => {
> >         const val = p[f];
> >         if(val > 0) {
> >             let name = f.replace(/_mg|_mcg|_iu/g, "").replace(/_/g, " ").toUpperCase();
> >             if (f === "iron_animal_mg") name = "IRON (HEME)";
> >             if (f === "iron_plant_mg") name = "IRON (PLANT)";
> >             if (f === "vit_a_retinol_mcg") name = "VIT A (RET)";
> >             if (f === "vit_a_beta_carotin_mcg") name = "VIT A (CARO)";
> >             
> >             html += `<div style="font-size: 0.85em; margin-top: 2px; display: flex; justify-content: space-between;">
> >                         <span style="opacity: 0.8;">${name}:</span> 
> >                         <b style="color: var(--text-normal);">${val}</b>
> >                      </div>`;
> >         }
> >     });
> >     html += "</div>";
> > }
> > html += "</div>";
> > dv.paragraph(html);
>> ```
>
>> [!link] **Synergy Potential**
>> ```dataviewjs
> > const p = dv.current();
> > const getVal = (stats, key) => Number((stats && stats[key]) || 0);
> > const totalIron = getVal(p, "iron_animal_mg") + getVal(p, "iron_plant_mg");
> > const totalVitA = getVal(p, "vit_a_mcg") + getVal(p, "vit_a_retinol_mcg") + getVal(p, "vit_a_beta_carotin_mcg");
> > const activeSynergies = [
> >     {
> >         type: "tip",
> >         message: "Iron is present; pair with Vitamin C for better absorption.",
> >         check: () => totalIron > 0 && getVal(p, "vit_c_mg") < 20
> >     },
> >     {
> >         type: "tip",
> >         message: "Vitamin A is present; pair with some fat for absorption.",
> >         check: () => totalVitA > 0 && getVal(p, "fat_total_g") < 3
> >     },
> >     {
> >         type: "info",
> >         message: "High calcium works best with enough magnesium in the overall meal.",
> >         check: () => getVal(p, "calcium_mg") > 300 && getVal(p, "magnesium_mg") < 50
> >     }
> > ].filter(rule => rule.check());
> > 
> > if (activeSynergies.length > 0) {
> >     activeSynergies.forEach(s => dv.paragraph(`> [!${s.type}] ${s.message}`));
> > } else {
> >     dv.paragraph("_No specific synergy detected for this isolated ingredient._");
> > }
>> ```
>> 
>> **Used in Recipes:**
>> ```dataview
>> LIST FROM #6resource/recipe
>> WHERE contains(ingredients, link(this.file.name))
>> ```
---

## ðŸ”¬ Micronutrient Lab
> [!info] ðŸ”± Add specific data points to this atom:
> `BUTTON[add-nutri-atom]`

## ðŸ§ª Micronutrient Lab (65)
| ðŸ§ª Nutrient    | âš–ï¸ Value (per 100g)             |     |
| :------------- | :------------------------------ | --- |
| ðŸ¥— **Type** | `INPUT[suggester(option(staple_pantry, ðŸ¥« Staple/Pantry), option(fresh_produce, ðŸ¥¦ Fresh Produce), option(frozen, â„ï¸ Frozen), option(supplement, ðŸ’Š Supplement), option(consumable, ðŸ½ï¸ Consumable)):ingre_type]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| âš¡ **Energy** | `INPUT[number:kcal]` kcal       |     |
| ðŸ¥© **Protein** | `INPUT[number:protein_g]` g     |     |
| ðŸž **Carbs** | `INPUT[number:carbs_total_g]` g |     |
| CARBS SUGAR G  | `INPUT[number:carbs_sugar_g]` g |     |
| ðŸ¥‘ **Fat** | `INPUT[number:fat_total_g]` g   |     |
%%END_OF_MICROS%%

---
## ðŸ“ Source & Notes
- 
- 
- 



---

> [!multi-column]
> 
> > [!law] **1. The Metric Scale**
> > 
> > - **mg (Milligram):** The standard for **Macros & Minerals** (e.g., Magnesium, Iron, Zinc).
> >     
> > - **mcg / Âµg (Microgram):** Exclusively for **Trace Elements & Vitamins** (e.g., B12, Folate, Selenium).
> >     
> > - & _Note:_ **1 mg = 1000 mcg**. Precision is non-negotiable to avoid 1000x calculation errors.
> >     
> 
> > [!microscope] **2. Specialized Units**
> > 
> > - **IU (International Units):** Reserved for **Vitamin D3**.
> >     
> > - _Conversion:_ 1 mcg D3 â‰ˆ 40 IU. Since supplements use IU, the Nexus Engine treats IU as the "Source of Truth" for D3.
> >     
> > - **kcal:** The absolute unit for thermal energy (Calories).

>[!info] ðŸ›¡ï¸ Implementation Rules for Atoms (Ingredients)
> 
> To keep the **Nexus Engine** functional, follow these strict data entry protocols:
> 
> 1. **Pure Integers:** Only enter the number into the YAML/Frontmatter.
>     
>     - âœ… `magnesium_mg: 350`
>         
>     - âŒ `magnesium_mg: 350mg` (This breaks the JavaScript calculation).
>         
> 2. **Naming Convention:** Always include the unit in the field name (e.g., `_mg`, `_mcg`, `_iu`). This acts as a permanent reminder and prevents "Unit-Drift."
>     
> 3. **Zero-Value Policy:** If a nutrient is not present, leave it at `0` or empty. Do not use strings like "none" or "trace".

---
### ðŸŒ‘ Metabolism Optimized; Data Rooted ðŸŒ‘
---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---


---
#### ðŸ”± Connexio
> [!link]- ðŸ”— Nexus
>>[!multi-column]
>>>[!task] ðŸ› ï¸ Tasks
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #4task
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #4task WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>>[!project] ðŸš§ Projects
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #3project
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #3project WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>> [!note] âœï¸ Notes
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #5note
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #5note WHERE contains(this.file.inlinks, file.link) OR contains(this.file.outlinks, file.link)
>>>```
>
>> [!source]- ðŸ”– Sources
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resource AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!area]- ðŸ’  Areas
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #2area
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #2area WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>>
>>> [!stars]- âœ¨ Stellae
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #1stars
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #1stars WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>
>> [!abstract]- ðŸ”™ Hub & Backlinks
>> ```dataview
>> LIST FROM [[#]]
>> ```

---

``
`
