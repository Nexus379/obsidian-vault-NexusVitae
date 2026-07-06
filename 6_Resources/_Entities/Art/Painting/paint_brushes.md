---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/art"
science: 
  - "#sci/MaterialsScience"
  - "#sci/Optics"
discipline: 
  - "#disc/Art"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Leisure & Art"
persona: "artist"
status: 1active
entity_class: "art_supply"
art_type: "medium_dry"
state: "studio"
needs_refill: false
shelf_life_months: 60
# ART SPECS
brand: ""
core_type: ""
ink_type: ""
lightfastness: ""
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
room: "studio"

---

# 🖌️    Paint Brushes

## 🔬 Studio Lab
| Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(medium_dry, ✏️ Dry Medium), option(medium_wet, 🖌️ Wet Medium), option(paper_canvas, 📜 Paper/Canvas), option(tool, 🛠️ Tool)):art_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **Core Type** | `INPUT[text:core_type]` |     |
| **Ink Type** | `INPUT[text:ink_type]` |     |
| **Lightfastness**| `INPUT[text:lightfastness]` |     |
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
