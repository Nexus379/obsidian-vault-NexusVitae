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
LID: "N20260703102009"
parent: ""
tags:
  - "#entity/camping"
aliases:
  - "TravelJohn"
explore_lvl: 5finish
priority: 
subject: "Camping & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
camping_type: "hygiene"
state: "active"
needs_refill: false
shelf_life_months: 120
icon: "🚽"
label: "TravelJohn Emergency Toilet (Disposable)"
brand: "TravelJohn"
room: "backpack"
locations: 
  - "hygiene_shop"
en: "Disposable Urinal"
unit_type: "pack"
props: 
  - "Leak-proof due to gel granules"
  - "Perfekt fürs Zelt bei Regen/Nacht"
# --- 🏕️ OUTDOOR SPECS ---
vendors: []
weight_g: 50
capacity_persons: 1
water_column_mm: 0
season_rating: 4
pack_size_cm: "12x5"
material: "Plastik/Gel"
pl_score: 9.0
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 12.00
vendor_value: "Hygiene-Shop"
price_market: 0.00
vendor_market: ""
---

# 🚽  N20260703102009   TravelJohn Emergency Toilet (Disposable)

## 🔬 Gear Lab
| 🏕️ Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(tent, ⛺ Tent), option(sleeping_bag, 🛏️ Sleeping Bag), option(sleeping_pad, 🛌 Sleeping Pad), option(cooking, 🍳 Cooking), option(water_filter, 💧 Water Filter), option(backpack, 🎒 Backpack), option(hygiene, 🧼 Hygiene), option(tool, 🔪 Tool)):camping_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| ⚖️ **Weight** | `INPUT[number:weight_g]` g |     |
| 🧑‍🤝‍🧑 **Capacity** | `INPUT[number:capacity_persons]` Personen |     |
| 🌧️ **Waterproof** | `INPUT[number:water_column_mm]` mm |     |
| ❄️ **Season Rating** | `INPUT[number:season_rating]` (1-4) |     |
| 📏 **Pack Size** | `INPUT[text:pack_size_cm]` |     |
| 🧱 **Material** | `INPUT[text:material]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- Urine instantly turns into odorless gel.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
