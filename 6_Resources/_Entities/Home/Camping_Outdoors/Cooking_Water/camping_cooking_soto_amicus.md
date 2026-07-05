---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/camping"
science: 
  - "#sci/Biology"
  - "#sci/Geography"
discipline: 
  - "#disc/Outdoors"
note5:
nextstudy:
LID: "N20260701095019"
parent: ""
tags:
  - "#entity/outdoor_gear"
aliases:
explore_lvl: 5finish
priority: 
subject: "Camping & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
camping_type: "cooking"
state: "active"
needs_refill: false
shelf_life_months: 120
# props: 
  - "Extremely reliable piezo igniter (stealth igniter)"
  - "Raised lip protects the flame from wind"
  - "Tiny pack size"
unit_type: "piece"
icon: "ðŸ³"
en: "Soto Amicus"
label: "Soto Amicus (Gaskocher)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Soto"
de: "Soto Amicus (Gaskocher)"
locations: 
  - "outdoor_store"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 45.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
--- ðŸ•ï¸ OUTDOOR SPECS ---
pref_vendor: "Decathlon / Amazon"
vendors: []
weight_g: 81
capacity_persons: 1
water_column_mm: 0
season_rating: 3
pack_size_cm: "Standard"
material: "Nylon/Polyester"
---

# ðŸ³  N20260701095019   Soto Amicus (Gaskocher)

## ðŸ”¬ Gear Lab
| ðŸ•ï¸ Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(tent, â›º Tent), option(sleeping_bag, ðŸ›ï¸ Sleeping Bag), option(sleeping_pad, ðŸ›Œ Sleeping Pad), option(cooking, ðŸ³ Cooking), option(water_filter, ðŸ’§ Water Filter), option(backpack, ðŸŽ’ Backpack), option(tool, ðŸ”ª Tool)):camping_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| âš–ï¸ **Weight** | `INPUT[number:weight_g]` g |     |
| ðŸ§‘â€ðŸ¤â€ðŸ§‘ **Capacity** | `INPUT[number:capacity_persons]` Personen |     |
| ðŸŒ§ï¸ **Waterproof** | `INPUT[number:water_column_mm]` mm |     |
| â„ï¸ **Season Rating** | `INPUT[number:season_rating]` (1-4) |     |
| ðŸ“ **Pack Size** | `INPUT[text:pack_size_cm]` |     |
| ðŸ§± **Material** | `INPUT[text:material]` |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- Review: OutdoorGearLab
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

> [!info] 💡 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
`
`
