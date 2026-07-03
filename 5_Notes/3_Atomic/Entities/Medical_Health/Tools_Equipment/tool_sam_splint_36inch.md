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
LID: "N20260703153601"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "SAM Splint"
  - "Alu-Polsterschiene"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "tool"
storage_location: "Camping & EDC"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 120
icon: "🦴"
label: "SAM Splint (Universal-Schiene 36 Zoll)"
brand: "SAM Medical"
room: "backpack"
unit_price: 15.00
locations: 
  - "praxisdienst"
en: "SAM Splint (Universal Splint)"
unit_type: "piece"
pl_score: 9.5
props: 
  - "Zur Ruhigstellung von Brüchen und Verstauchungen"
  - "Leicht, röntgendurchlässig und wiederverwendbar"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
---

# 🦴  N20260703153601   SAM Splint (Universal-Schiene 36 Zoll)

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
- Wird zusammen mit einer kohäsiven Binde (Peha-haft) gewickelt.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
