---
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/medical"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "N20260703100003"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Waterproof Plaster"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "bandage"
storage_location: "Hausapotheke & EDC"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🩹"
label: "Mivolis Waterproof Plasters (Strips)"
brand: "Mivolis"
room: "bathroom"
unit_price: 1.25
locations: 
  - "dm"
en: "Waterproof Plasters"
unit_type: "pack"
pl_score: 9.0
props: 
  - "Extrem gutes Preis-Leistungs-Verhältnis"
  - "Water and dirt repellent"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
---

# 🩹  N20260703100003   Mivolis Waterproof Plasters (Strips)

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
- Available in almost every DM store.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
