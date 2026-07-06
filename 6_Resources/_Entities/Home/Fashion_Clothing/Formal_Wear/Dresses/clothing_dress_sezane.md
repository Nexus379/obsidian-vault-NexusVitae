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
LID: "N20260701101009"
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
clothing_type: "formal"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 60
# props: 
  - "The ultimate Parisian chic brand"
  - "Incredible attention to romantic details"
  - "Very high quality European manufacturing"
unit_type: "piece"
icon: "ðŸ‘—"
en: "SÃ©zane Midi Dress"
label: "SÃ©zane Midi-Kleid"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "SÃ©zane"
de: "SÃ©zane Midi-Kleid"
locations: 
  - "fashion_boutique"
price_pure: 0.00
vendor_pure: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_cheap: 0.00
vendor_cheap: ""
price_value: 180.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
--- ðŸ‘• WARDROBE SPECS ---
size: "M / 38 / 42"
color: "Black"
material_primary: "Organic Cotton / Silk"
care_wash_temp: 30
care_tumble_dry: false
is_waterproof: false
---

# ðŸ‘—  N20260701101009   SÃ©zane Midi-Kleid

## ðŸ”¬ Style & Fabric Lab
| ðŸ‘• Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(casual, ðŸ‘• Casual), option(formal, ðŸ‘” Formal), option(footwear, ðŸ‘ž Footwear), option(outerwear, ðŸ§¥ Outerwear), option(activewear, ðŸƒ Activewear), option(accessory, ðŸ•¶ï¸ Accessory)):clothing_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| ðŸ“ **Size** | `INPUT[text:size]` |     |
| ðŸŽ¨ **Color** | `INPUT[text:color]` |     |
| ðŸ§± **Material** | `INPUT[text:material_primary]` |     |
| ðŸŒ¡ï¸ **Wash Temp** | `INPUT[number:care_wash_temp]` Â°C |     |
| ðŸŒªï¸ **Tumble Dry** | `INPUT[toggle:care_tumble_dry]` |     |
| ðŸŒ§ï¸ **Waterproof** | `INPUT[toggle:is_waterproof]` |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- Review: Fashion Forums / Tailors
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

> [!info] 💡 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
`
`



