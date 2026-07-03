---
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/household"
science: 
  - "#sci/Engineering"
discipline: 
  - "#disc/Management"
note5:
nextstudy:
LID: "N20260703153001"
parent: ""
tags:
  - "#entity/household"
aliases:
  - "Nitrile Gloves"
  - "Disposable Gloves"
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
label: "Nitril Einweghandschuhe (1000 Stk. Großpackung)"
brand: "Unigloves"
locations: 
  - "praxisdienst"
en: "Disposable Nitrile Gloves"
unit_type: "box"
props: 
  - "Für Kochen (Fleisch), Putzen & Erste-Hilfe"
  - "Puderfrei und reißfest"
# --- 🏠 HOUSEHOLD SPECS ---
unit_price: 45.00
pref_vendor: "Praxisdienst"
vendors: []
weight_g: 500
volume_ml: 0
hazardous: "No"
eco_friendly: "No"
pl_score: 9.5
---

# 🧤  N20260703153001   Nitril Einweghandschuhe (1000 Stk. Großpackung)

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
- Liegt im Bad, Küche und beim EDC/Campingzeug (Allrounder).
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
