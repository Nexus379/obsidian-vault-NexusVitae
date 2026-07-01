arch:
  - "#5note"
archtype:
  - "#5note/3atomic/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N2026063012483311"
parent: ""
tags:
  - "#entity/ingredient"
aliases:
  - "Aqua vitae (Kentucky)"
  - "Jim Beam"
  - "Jim Beam White Label"
  - "Джим Бим"
  - "ジムビーム"
  - "جيم بيم"
  - "جیم بیم"
  - "जिम बीम"
  - "占边"
priority: 
subject: "Nutrition"
persona: "alchemist"
status: 1active
entity_class: "ingredient"
ingre_type: "staple_pantry"
pref_vendor: "everywhere"
vendors: []
state: "pantry"
needs_refill: false
shelf_life_months: 12
# props: 
  - "Classic Kentucky Straight Bourbon"
  - "High corn content in the mash (at least 51%)"
  - "Known for a spicy, oaky profile with vanilla finish"
ru: "Джим Бим"
unit_type: "piece"
icon: "🥃"
en: "Jim Beam"
zh: "占边"
origin: "USA (Kentucky)"
type: "Bourbon"
sci: 
  - "#sci/FoodScience"
es: "Jim Beam"
everywhere: 20.00
latin: "Aqua vitae (Kentucky)"
vol_pct: 40.0
ar: "جيم بيم"
fr: "Jim Beam"
ja: "ジムビーム"
label: "Jim Beam White Label"
fa: "جیم بیم"
unit_price: 20.00
de: "Jim Beam"
locations: 
  - "everywhere"
hi: "जिम बीम"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N2026063012483311"
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
pref_vendor: "everywhere"
vendors: []
state: "pantry"
needs_refill: false
shelf_life_months: 12
# props: 
  - "Classic Kentucky Straight Bourbon"
  - "High corn content in the mash (at least 51%)"
  - "Known for a spicy, oaky profile with vanilla finish"
ru: "Джим Бим"
unit_type: "piece"
icon: "🥃"
en: "Jim Beam"
zh: "占边"
origin: "USA (Kentucky)"
type: "Bourbon"
sci: 
  - "#sci/FoodScience"
es: "Jim Beam"
everywhere: 20.00
latin: "Aqua vitae (Kentucky)"
vol_pct: 40.0
ar: "جيم بيم"
fr: "Jim Beam"
ja: "ジムビーム"
label: "Jim Beam White Label"
fa: "جیم بیم"
unit_price: 20.00
de: "Jim Beam"
locations: 
  - "everywhere"
hi: "जिम बीम"
--- ⚡ MACROS (per 100g/ml) ---
kcal: 0
protein_g: 0
fat_total_g: 0
fat_saturated_g: 0
carbs_total_g: 0
carbs_sugar_g: 0
fiber_g: 0
# --- 💎 MINERALS ---
magnesium_mg: 0
iron_animal_mg: 0
iron_plant_mg: 0
calcium_mg: 0
zinc_mg: 0
potassium_mg: 0
# --- 🧬 VITAMINS ---
vit_a_retinol_mcg: 0
vit_a_beta_carotin_mcg: 0
vit_b12_mcg: 0
vit_c_mg: 0
vit_d_iu: 0
vit_k1_mcg: 0
vit_k2_mcg: 0
# --- 🧠 AMINOS & OMEGAS ---
tryptophan_mg: 0
leucine_mg: 0
omega3_epa_mg: 0
omega3_dha_mg: 0
---

# 🥗  N2026063012483311   Jim Beam White Label

## Bio-Synergy
> [!multi-column]
>
>> [!hub] **🔬 Bio-Stats (per 100g)**
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
> > // ⚡ MAIN MACROS (Vertical List with explicit DIVs)
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
> > // 🧬 MICRO-HIGHLIGHTS (The Boxes)
> > const micros = {
> >     "💎 Minerals": ["magnesium_mg", "iron_animal_mg", "iron_plant_mg", "calcium_mg", "zinc_mg", "potassium_mg"],
> >     "🧬 Vitamins": ["vit_a_retinol_mcg", "vit_a_beta_carotin_mcg", "vit_c_mg", "vit_d_iu", "vit_b12_mcg", "vit_k2_mcg"]
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
>> LIST FROM #6resou/recipe
>> WHERE contains(ingredients, link(this.file.name))
>> ```
---

## 🔬 Micronutrient Lab
> [!info] 🔱 Add specific data points to this atom:
> `BUTTON[add-nutri-atom]`

## 🧪 Micronutrient Lab (65)
| 🧪 Nutrient    | ⚖️ Value (per 100g)             |     |
| :------------- | :------------------------------ | --- |
| 🥗 **Type** | `INPUT[suggester(option(staple_pantry, 🥫 Staple/Pantry), option(fresh_produce, 🥦 Fresh Produce), option(frozen, ❄️ Frozen), option(supplement, 💊 Supplement), option(consumable, 🍽️ Consumable)):ingre_type]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| ⚡ **Energy** | `INPUT[number:kcal]` kcal       |     |
| 🥩 **Protein** | `INPUT[number:protein_g]` g     |     |
| 🍞 **Carbs** | `INPUT[number:carbs_total_g]` g |     |
| CARBS SUGAR G  | `INPUT[number:carbs_sugar_g]` g |     |
| 🥑 **Fat** | `INPUT[number:fat_total_g]` g   |     |
%%END_OF_MICROS%%

---
## 📝 Source & Notes
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
> > - **mcg / µg (Microgram):** Exclusively for **Trace Elements & Vitamins** (e.g., B12, Folate, Selenium).
> >     
> > - & _Note:_ **1 mg = 1000 mcg**. Precision is non-negotiable to avoid 1000x calculation errors.
> >     
> 
> > [!microscope] **2. Specialized Units**
> > 
> > - **IU (International Units):** Reserved for **Vitamin D3**.
> >     
> > - _Conversion:_ 1 mcg D3 ≈ 40 IU. Since supplements use IU, the Nexus Engine treats IU as the "Source of Truth" for D3.
> >     
> > - **kcal:** The absolute unit for thermal energy (Calories).

>[!info] 🛡️ Implementation Rules for Atoms (Ingredients)
> 
> To keep the **Nexus Engine** functional, follow these strict data entry protocols:
> 
> 1. **Pure Integers:** Only enter the number into the YAML/Frontmatter.
>     
>     - ✅ `magnesium_mg: 350`
>         
>     - ❌ `magnesium_mg: 350mg` (This breaks the JavaScript calculation).
>         
> 2. **Naming Convention:** Always include the unit in the field name (e.g., `_mg`, `_mcg`, `_iu`). This acts as a permanent reminder and prevents "Unit-Drift."
>     
> 3. **Zero-Value Policy:** If a nutrient is not present, leave it at `0` or empty. Do not use strings like "none" or "trace".

---
### 🌑 Metabolism Optimized; Data Rooted 🌑
---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---


---
#### 🔱 Connexio
> [!link]- 🔗 Nexus
>>[!multi-column]
>>>[!task] 🛠️ Tasks
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
>>>[!project] 🚧 Projects
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
>>> [!note] ✏️ Notes
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
>> [!source]- 🔖 Sources
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resou AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!area]- 💠 Areas
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
>>> [!stars]- ✨ Stellae
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
>> [!abstract]- 🔙 Hub & Backlinks
>> ```dataview
>> LIST FROM [[#]]
>> ```

---

```meta-bind-button
label: "Archivieren"
icon: "archive"
style: primary
actions:
  - type: runTemplaterFile
    # Nutze den kompletten Pfad ohne führenden Slash
    templateFile: "zData/2scripts/archiveall.md" 

```






