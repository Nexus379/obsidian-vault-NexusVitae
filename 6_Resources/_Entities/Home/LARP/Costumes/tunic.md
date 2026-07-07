---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/larp"
science: 
  - "#sci/History"
  - "#sci/Art"
discipline: 
  - "#disc/Hobbies"
note5:
nextstudy:
LID: ""
parent: ""
tags:
  - "#entity/larp_gear"
aliases:
explore_lvl: 5finish
priority: 
subject: "LARP & Cosplay"
persona: "cosplayer"
status: 1active
entity_class: "larp_gear"
larp_type: "costume"
state: "active"
needs_refill: false
shelf_life_months: 60
# LARP SPECS
store_online: ""
store_local: ""
brand: ""
material: ""
authenticity_lvl: 5
is_foam_weapon: false
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
room: "storage"

---

# 🧝    Tunic

## 🔬 Forge & Tailor Lab
| Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(costume, 👗 Costume), option(armor, 🛡️ Armor), option(weapon, ⚔️ Weapon), option(prop, 📜 Prop)):larp_type]` |     |
| **Brand/Maker** | `INPUT[text:brand]` |     |
| **Online Shop** | `INPUT[text:store_online]` |     |
| **Local Shop** | `INPUT[text:store_local]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **Material** | `INPUT[text:material]` |     |
| **Foam Weapon** | `INPUT[toggle:is_foam_weapon]` |     |
| **Authenticity**| `INPUT[number:authenticity_lvl]` / 10 |     |
| **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## Source & Notes
- Review: LARP Forums / Local Guilds
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

> [!info] Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
