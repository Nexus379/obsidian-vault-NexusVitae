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
LID: "N20260703100006"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Tick Tweezers"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "tool"
storage_location: "EDC"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 120
icon: "🛠️"
label: "Mivolis Tick Tweezers"
brand: "Mivolis"
room: "backpack"
unit_price: 2.95
locations: 
  - "dm"
en: "Tick Tweezers"
unit_type: "piece"
pl_score: 8.0
props: 
  - "Simple leverage"
  - "Wichtig für Wald-Trips"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
---

# 🛠️  N20260703100006   Mivolis Tick Tweezers

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
- 
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
