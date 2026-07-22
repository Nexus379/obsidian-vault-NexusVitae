<%-*
if (!tp.variables) tp.variables = {};

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Nutrition Note: Name of Ingredient?", "");
}
if (!title || title.trim() === "") title = "AtomicNutrition-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200));
}

let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) displayTitle = title.substring(luhmannId.length);
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(nutrition-|n-)/i, "").trim();

tR += "---"
%>
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
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority:
subject: "Nutrition"
persona: "alchemist"
status: 1active
entity_class: "ingredient"
ingre_type: "staple_pantry"
state: "pantry"
qty: 0
needs_refill: false
shelf_life_months: 12
kcal: 0
protein_g: 0
fat_total_g: 0
fat_saturated_g: 0
carbs_total_g: 0
carbs_sugar_g: 0
fiber_g: 0
magnesium_mg: 0
iron_animal_mg: 0
iron_plant_mg: 0
calcium_mg: 0
zinc_mg: 0
potassium_mg: 0
vit_a_retinol_mcg: 0
vit_a_beta_carotin_mcg: 0
vit_b12_mcg: 0
vit_c_mg: 0
vit_d_iu: 0
vit_k1_mcg: 0
vit_k2_mcg: 0
tryptophan_mg: 0
leucine_mg: 0
omega3_epa_mg: 0
omega3_dha_mg: 0
pref_vendor: ""
pref_price: 0.00
unit_price: 0.00
price_cheap: 0.00
vendor_cheap: ""
price_value: 0.00
vendor_value: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_pure: 0.00
vendor_pure: ""
price_market: 0.00
vendor_market: ""
---

# <%- luhmannId %> <%- displayTitle %>

## Bio-Synergy
> [!multi-column]
>
>> [!hub] Bio-Stats (per 100g)
>> ```dataviewjs
> > const targets = {
> >     kcal: { value: 2000 },
> >     protein_g: { value: 50 },
> >     fat_total_g: { value: 70 },
> >     carbs_total_g: { value: 260 }
> > };
> > const p = dv.current();
> > const calcPct = (val, target) => val ? Math.round((val / target) * 100) : 0;
> > let macroHtml = "<div style='display: flex; flex-direction: column; gap: 4px; margin-bottom: 15px;'>";
> > const mainFields = [
> >     { label: "Energy", key: "kcal", target: targets.kcal.value, unit: "kcal" },
> >     { label: "Protein", key: "protein_g", target: targets.protein_g.value, unit: "g" },
> >     { label: "Total Fat", key: "fat_total_g", target: targets.fat_total_g.value, unit: "g" },
> >     { label: "Total Carbs", key: "carbs_total_g", target: targets.carbs_total_g.value, unit: "g" }
> > ];
> > mainFields.forEach(m => {
> >     const val = p[m.key] || 0;
> >     const pct = calcPct(val, m.target);
> >     macroHtml += `<div style="font-size: 0.9em;"><b>${m.label}:</b> ${val} ${m.unit}<span style="opacity: 0.6; font-size: 0.85em; margin-left: 8px;">(${pct}%)</span></div>`;
> > });
> > macroHtml += "</div>";
> > dv.paragraph(macroHtml);
>> ```
>
>> [!link] Synergy Potential
>> ```dataviewjs
> > const p = dv.current();
> > const getVal = (stats, key) => Number((stats && stats[key]) || 0);
> > const totalIron = getVal(p, "iron_animal_mg") + getVal(p, "iron_plant_mg");
> > const totalVitA = getVal(p, "vit_a_mcg") + getVal(p, "vit_a_retinol_mcg") + getVal(p, "vit_a_beta_carotin_mcg");
> > const activeSynergies = [
> >     { type: "tip", message: "Iron is present; pair with Vitamin C for better absorption.", check: () => totalIron > 0 && getVal(p, "vit_c_mg") < 20 },
> >     { type: "tip", message: "Vitamin A is present; pair with some fat for absorption.", check: () => totalVitA > 0 && getVal(p, "fat_total_g") < 3 },
> >     { type: "info", message: "High calcium works best with enough magnesium in the overall meal.", check: () => getVal(p, "calcium_mg") > 300 && getVal(p, "magnesium_mg") < 50 }
> > ].filter(rule => rule.check());
> > if (activeSynergies.length > 0) activeSynergies.forEach(s => dv.paragraph(`> [!${s.type}] ${s.message}`));
> > else dv.paragraph("_No specific synergy detected for this isolated ingredient._");
>> ```
>>
>> **Used in Recipes:**
>> ```dataview
>> LIST FROM #6resource/recipe
>> WHERE contains(ingredients, link(this.file.name))
>> ```

## Micronutrient Lab
> [!info] Add specific data points to this atom:
> `BUTTON[add-nutri-atom]`

| Nutrient | Value (per 100g) |     |
| :--- | :--- | --- |
| Type | `INPUT[suggester(option(staple_pantry, Staple/Pantry), option(fresh_produce, Fresh Produce), option(frozen, Frozen), option(supplement, Supplement), option(consumable, Consumable)):ingre_type]` |     |
| Preferred Vendor | `INPUT[text:pref_vendor]` |     |
| Finance Unit Price | `VIEW[{unit_price}]` |     |
| Energy | `INPUT[number:kcal]` kcal |     |
| Protein | `INPUT[number:protein_g]` g |     |
| Carbs | `INPUT[number:carbs_total_g]` g |     |
| Sugar | `INPUT[number:carbs_sugar_g]` g |     |
| Fat | `INPUT[number:fat_total_g]` g |     |
| Fiber | `INPUT[number:fiber_g]` g |     |

<%- tp.file.include("[[zData/5design_modul/ShoppingPriceMatrix]]") %>

## Source & Notes
-
-
-

> [!info] Implementation Rules for Ingredients
> Enter pure numbers in frontmatter fields. Keep units in field names such as `_mg`, `_mcg`, `_iu`, `_g`.

[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
