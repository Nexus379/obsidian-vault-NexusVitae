---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/pet"
science: 
  - "#sci/Biology"
discipline: 
  - "#disc/Veterinary"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Pets & Animals"
persona: "vet"
status: 1active
entity_class: "pet_supply"
pet_type: "cat"
item_type: "toy"
state: "active"
needs_refill: false
shelf_life_months: 24
# PET SPECS
brand: ""
material: ""
durability: 5
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
room: "kitchen"

---

# 🐕    Dog Food

## 🔬 Pet Lab
| Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| **Pet** | `INPUT[suggester(option(cat, 🐈 Cat), option(dog, 🐕 Dog), option(bird, 🦜 Bird), option(fish, 🐟 Fish)):pet_type]` |     |
| **Type** | `INPUT[suggester(option(toy, 🧶 Toy), option(hygiene, 🧽 Hygiene), option(furniture, 🛋️ Furniture), option(food_bowl, 🥣 Bowl), option(carrier, 🎒 Carrier)):item_type]` |     |
| **Brand** | `INPUT[text:brand]` |     |
| **Vendor** | `INPUT[text:vendor_pref]` |     |
| **Price** | `INPUT[number:unit_price]` € |     |
| **Material** | `INPUT[text:material]` |     |
| **Durability**| `INPUT[number:durability]` / 10 |     |
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
