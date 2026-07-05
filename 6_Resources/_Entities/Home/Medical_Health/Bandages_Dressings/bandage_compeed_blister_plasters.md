---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/medical"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "N20260703102001"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Compeed Blister Plaster"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "bandage"
storage_location: "EDC & Camping"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🩹"
label: "Compeed Blister Plasters (Mix)"
brand: "Compeed"
room: "backpack"
unit_price: 6.00
locations: 
  - "dm"
  - "apotheke"
en: "Blister Plasters"
unit_type: "pack"
pl_score: 9.5
props: 
  - "Unverzichtbar für lange Wanderungen"
  - "Like a second skin"
# --- 💊 MEDICAL SPECS ---
active_ingredient: "Hydrokolloid"
prescription_required: "No"
---

# 🩹  N20260703102001   Compeed Blister Plasters (Mix)

## 🔬 Medical Inventory
| 💊 Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(medication, 💊 Medication), option(bandage, 🩹 Bandage/Dressing), option(tool, 🛠️ Tool), option(hygiene, 🧼 Hygiene)):medical_type]` |     |
| 📦 **Storage** | `INPUT[text:storage_location]` |     |
| 📊 **Stock Level** | `INPUT[number:stock_level]` / Min: `INPUT[number:min_stock]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| 🧬 **Active Ingredient**| `INPUT[text:active_ingredient]` |     |
| ⚕️ **Prescription**| `INPUT[suggester(option("No", 🟢 No), option("Yes", 🔴 Yes)):prescription_required]` |     |

---
## 📝 Source & Notes
- Expensive, but worth every cent when hiking.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
