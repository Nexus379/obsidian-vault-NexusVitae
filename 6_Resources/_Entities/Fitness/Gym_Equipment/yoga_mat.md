---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/Fitness"
science: 
  - "#sci/Biology"
  - "#sci/Geography"
discipline: 
  - "#disc/Outdoors"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Fitness & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
Fitness_type: "tent"
state: "active"
needs_refill: false
shelf_life_months: 120
# FITNESS SPECS
brand: ""
weight_g: 0
capacity_persons: 0
water_column_mm: 0
season_rating: 3
pack_size_cm: ""
material: ""
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

# 🧘    Yoga Mat

## ðŸ”¬ Gear Lab
| Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| **Type** | `INPUT[suggester(option(tent, â›º Tent), option(sleeping_bag, ðŸ›ï¸ Sleeping Bag), option(sleeping_pad, ðŸ›Œ Sleeping Pad), option(cooking, ðŸ³ Cooking), option(water_filter, ðŸ’§ Water Filter), option(backpack, ðŸŽ’ Backpack), option(tool, ðŸ”ª Tool)):Fitness_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| **Weight** | `INPUT[number:weight_g]` g |     |
| **Capacity** | `INPUT[number:capacity_persons]` Personen |     |
| **Waterproof** | `INPUT[number:water_column_mm]` mm |     |
| **Season Rating** | `INPUT[number:season_rating]` (1-4) |     |
| **Pack Size** | `INPUT[text:pack_size_cm]` |     |
| **Material** | `INPUT[text:material]` |     |
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

