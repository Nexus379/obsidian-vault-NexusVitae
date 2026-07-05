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
LID: "N20260703153602"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Peha-haft"
  - "Kohäsive Binde"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "bandage"
storage_location: "Camping & EDC"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🩹"
label: "Peha-haft (Selbsthaftende Fixierbinde)"
brand: "Hartmann"
room: "backpack"
unit_price: 3.50
locations: 
  - "praxisdienst"
  - "apotheke"
en: "Cohesive Bandage"
unit_type: "roll"
pl_score: 9.0
props: 
  - "Kbt auf sich selbst, nicht auf der Haut oder Haaren"
  - "Perfekt um einen SAM Splint zu fixieren"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
---

# 🩹  N20260703153602   Peha-haft (Selbsthaftende Fixierbinde)

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
- Sehr wichtig für Sportverletzungen und Verstauchungen.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
