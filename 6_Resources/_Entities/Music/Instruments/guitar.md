---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/music"
science: 
  - "#sci/Art"
  - "#sci/Physics"
discipline: 
  - "#disc/Music"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Music Gear"
persona: "musician"
status: 1active
entity_class: "musical_instrument"
tech_type: "analog"
state: "active"
needs_refill: false
shelf_life_months: 120
# MUSIC SPECS
brand: ""
material: ""
is_digital: false
requires_power: false
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

# 🎸    Guitar

## Specs Lab
| Specification | ⚖️ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **Type**         | `INPUT[suggester(option(analog, 🎸 Analog), option(digital, 🎹 Digital), option(studio, 🎛️ Studio), option(listening, 🎧 Listening), option(accessory, 🎻 Accessory), option(maintenance, 🧹 Maintenance)):tech_type]`                                                          |     |
| **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| **Vendor**        | `INPUT[text:vendor_pref]`                                                                                                                                      |     |
| **Price**         | `INPUT[number:unit_price]` €                                                                                                                                   |     |
| **Material**      | `INPUT[text:material]`                                                                                                                                      |     |
| **Power needed**  | `INPUT[toggle:requires_power]`                                                                                                                                     |     |
| **Digital**       | `INPUT[toggle:is_digital]`                                                                                                                                     |     |
| **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

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
