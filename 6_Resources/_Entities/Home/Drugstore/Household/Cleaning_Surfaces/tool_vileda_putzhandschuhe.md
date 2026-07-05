---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/household"
science: 
  - "#sci/Engineering"
discipline: 
  - "#disc/Management"
note5:
nextstudy:
LID: "N20260703153002"
parent: ""
tags:
  - "#entity/household"
aliases:
  - "Cleaning Gloves"
  - "Rubber Gloves"
explore_lvl: 5finish
priority: 
subject: "Household & Supplies"
persona: "manager"
status: 1active
entity_class: "household_goods"
household_type: "tool"
room: "bathroom"
state: "active"
needs_refill: false
shelf_life_months: 60
icon: "🧤"
label: "Vileda Rubber Cleaning Gloves"
brand: "Vileda"
locations: 
  - "dm"
  - "rossmann"
en: "Rubber Cleaning Gloves"
unit_type: "pair"
props: 
  - "Wiederverwendbar für grobe Putzarbeiten / Abwasch"
  - "Hält deutlich länger als die Eigenmarken"
# --- 🏠 HOUSEHOLD SPECS ---
unit_price: 2.50
pref_vendor: "DM"
vendors: []
weight_g: 50
volume_ml: 0
hazardous: "No"
eco_friendly: "No"
pl_score: 9.0
---

# 🧤  N20260703153002   Vileda Rubber Cleaning Gloves

## 🔬 Supply Lab
| 🏠 Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(cleaning_agent, 🧼 Cleaning Agent), option(tool, 🛠️ Tool), option(paper_goods, 🧻 Paper Goods), option(storage, 📦 Storage)):household_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| ⚖️ **Weight** | `INPUT[number:weight_g]` g |     |
| 🧪 **Volume** | `INPUT[number:volume_ml]` ml |     |
| ⚠️ **Hazardous** | `INPUT[suggester(option("No", 🟢 No), option("Yes", 🔴 Yes)):hazardous]` |     |
| 🌱 **Eco-Friendly**| `INPUT[suggester(option("No", 🔴 No), option("Yes", 🟢 Yes)):eco_friendly]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- Liegt unter der Spüle und im Putzschrank.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
