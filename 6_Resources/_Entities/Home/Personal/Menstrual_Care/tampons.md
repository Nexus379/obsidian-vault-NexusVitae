---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/personal_care"
science: 
  - "#sci/Dermatology"
  - "#sci/MaterialsScience"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Personal Care"
persona: "dermatologist"
status: 1active
entity_class: "personal_care"
personal_type: "skincare"
state: "bathroom"
needs_refill: false
shelf_life_months: 12
# PERSONAL SPECS
brand: ""
material: ""
chlorine_free: "Yes"
absorption: ""
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
room: "bathroom"

---

# 🩸    Tampons

## 🔬 Material Lab
| Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(skincare, 🧴 Skincare), option(haircare, 💇 Haircare), option(makeup, 💄 Makeup), option(hygiene, 🧼 Hygiene), option(dental, 🦷 Dental)):personal_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **Material** | `INPUT[text:material]` |     |
| **Absorption** | `INPUT[text:absorption]` |     |
| **Chlorine Free** | `INPUT[text:chlorine_free]` |     |
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
