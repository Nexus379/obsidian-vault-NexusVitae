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
LID: "N20260701095012"
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
camping_type: "tent"
state: "active"
needs_refill: false
shelf_life_months: 120
# props: 
  - "Decathlon's best trekking tent"
  - "Very wind stable dome structure"
  - "Great ventilation"
unit_type: "piece"
icon: "â›º"
en: "Forclaz MT900 2P"
label: "Forclaz MT900 2P (Decathlon)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Forclaz"
unit_price: 250.00
de: "Forclaz MT900 2P (Decathlon)"
locations: 
  - "outdoor_store"
--- ðŸ•ï¸ OUTDOOR SPECS ---
pref_vendor: "Decathlon / Amazon"
vendors: []
weight_g: 1950
capacity_persons: 2
water_column_mm: 4000
season_rating: 3
pack_size_cm: "Standard"
material: "Nylon/Polyester"
---

# â›º  N20260701095012   Forclaz MT900 2P (Decathlon)

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
