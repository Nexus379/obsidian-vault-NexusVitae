<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("👕 Clothing Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicClothing-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(clothing-|c-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/clothing"
science: 
  - "#sci/Sociology"
  - "#sci/Chemistry"
discipline: 
  - "#disc/Fashion"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
  - "#entity/apparel"
aliases:
explore_lvl: 5finish
priority: 
subject: "Wardrobe & Apparel"
persona: "stylist"
status: 1active
entity_class: "apparel"
clothing_type: "casual"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 60
# --- 👕 WARDROBE SPECS ---
brand: ""
size: ""
color: ""
material_primary: ""
care_wash_temp: 30
care_tumble_dry: false
is_waterproof: false
toe_shape: ""
pl_score: 0
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

# 👕  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Style & Fabric Lab
| 👕 Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(casual, 👕 Casual), option(formal, 👔 Formal), option(footwear, 👞 Footwear), option(outerwear, 🧥 Outerwear), option(activewear, 🏃 Activewear), option(accessory, 🕶️ Accessory)):clothing_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `VIEW[{unit_price}]` € |     |
| 📏 **Size** | `INPUT[text:size]` |     |
| 🎨 **Color** | `INPUT[text:color]` |     |
| 🧱 **Material** | `INPUT[text:material_primary]` |     |
| 👢 **Toe Shape** | `INPUT[suggester(option(round, ⭕ Round), option(square, 🔲 Square), option(pointed, 🔺 Pointed), option(none, ➖ None)):toe_shape]` |     |
| 🌡️ **Wash Temp** | `INPUT[number:care_wash_temp]` °C |     |
| 🌪️ **Tumble Dry** | `INPUT[toggle:care_tumble_dry]` |     |
| 🌧️ **Waterproof** | `INPUT[toggle:is_waterproof]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

<%- tp.file.include("[[zData/5design_modul/ShoppingPriceMatrix]]") %>

## 📝 Source & Notes
- 
- 
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

