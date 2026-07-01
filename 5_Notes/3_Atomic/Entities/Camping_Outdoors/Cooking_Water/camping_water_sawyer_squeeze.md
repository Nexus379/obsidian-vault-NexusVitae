arch:
  - "#5note"
archtype:
  - "#5note/3atomic/camping"
science: 
  - "#sci/Biology"
  - "#sci/Geography"
discipline: 
  - "#disc/Outdoors"
note5:
nextstudy:
LID: "N20260701095021"
parent: ""
tags:
  - "#entity/outdoor_gear"
aliases:
  - "Sawyer Squeeze"
  - "Sawyer Squeeze (Wasserfilter)"
priority: 
subject: "Camping & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
camping_type: "water_filter"
state: "active"
needs_refill: false
shelf_life_months: 120
# props: 
  - "The absolute gold standard for thru-hikers"
  - "Filters 100,000 gallons guaranteed"
  - "Fits on standard Smartwater bottles"
unit_type: "piece"
icon: "ðŸ’§"
en: "Sawyer Squeeze"
label: "Sawyer Squeeze (Wasserfilter)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Sawyer"
unit_price: 50.00
de: "Sawyer Squeeze (Wasserfilter)"
locations: 
  - "outdoor_store"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/camping"
science: 
  - "#sci/Biology"
  - "#sci/Geography"
discipline: 
  - "#disc/Outdoors"
note5:
nextstudy:
LID: "N20260701095021"
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
camping_type: "water_filter"
state: "active"
needs_refill: false
shelf_life_months: 120
# props: 
  - "The absolute gold standard for thru-hikers"
  - "Filters 100,000 gallons guaranteed"
  - "Fits on standard Smartwater bottles"
unit_type: "piece"
icon: "ðŸ’§"
en: "Sawyer Squeeze"
label: "Sawyer Squeeze (Wasserfilter)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Sawyer"
unit_price: 50.00
de: "Sawyer Squeeze (Wasserfilter)"
locations: 
  - "outdoor_store"
--- ðŸ•ï¸ OUTDOOR SPECS ---
pref_vendor: "Decathlon / Amazon"
vendors: []
weight_g: 85
capacity_persons: 1
water_column_mm: 0
season_rating: 4
pack_size_cm: "Standard"
material: "Nylon/Polyester"
---

# ðŸ’§  N20260701095021   Sawyer Squeeze (Wasserfilter)

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
