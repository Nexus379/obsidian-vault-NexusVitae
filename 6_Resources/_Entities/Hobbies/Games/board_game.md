---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/household"
science: 
  - "#sci/Chemistry"
discipline: 
  - "#disc/Household"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Household"
persona: "chemist"
status: 1active
entity_class: "household_item"
hobbies_type: ""
state: "storage"
needs_refill: false
shelf_life_months: 24
# HOBBIES SPECS
brand: ""
ph_level: 7.0
solvent_type: ""
surfactant_conc: ""
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
room: "living_room"

---

# 🎲    Board Game

## Specs Lab
| Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(cleaning_supply, 🧽 Cleaning), option(tool, 🛠️ Tool), option(textile, 🧺 Textile), option(organization, 📦 Org)):household_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **pH Level** | `INPUT[number:ph_level]` |     |
| **Solvent Type** | `INPUT[text:solvent_type]` |     |
| **Surfactants** | `INPUT[text:surfactant_conc]` |     |
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
