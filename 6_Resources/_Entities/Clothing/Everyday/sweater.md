---
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
LID: ""
parent: ""
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
needs_refill: false
shelf_life_months: 60
# CLOTHING SPECS
brand: ""
size: ""
color: ""
material_primary: ""
care_wash_temp: 30
care_tumble_dry: false
is_waterproof: false
toe_shape: ""
pl_score: 0
# INVENTORY & VENDOR
qty: 0
vendor_pref: ""
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
room: "bedroom"

---

# 🧶    Sweater

## 🔬 Style & Fabric Lab
| Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(casual, 👕 Casual), option(formal, 👔 Formal), option(footwear, 👞 Footwear), option(outerwear, 🧥 Outerwear), option(activewear, 🏃 Activewear), option(accessory, 🕶️ Accessory)):clothing_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **Size** | `INPUT[text:size]` |     |
| **Color** | `INPUT[text:color]` |     |
| **Material** | `INPUT[text:material_primary]` |     |
| **Toe Shape** | `INPUT[suggester(option(round, ⭕ Round), option(square, 🔲 Square), option(pointed, 🔺 Pointed), option(none, ➖ None)):toe_shape]` |     |
| **Wash Temp** | `INPUT[number:care_wash_temp]` °C |     |
| **Tumble Dry** | `INPUT[toggle:care_tumble_dry]` |     |
| **Waterproof** | `INPUT[toggle:is_waterproof]` |     |
| **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## Source & Notes
- 
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

> [!info] Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
