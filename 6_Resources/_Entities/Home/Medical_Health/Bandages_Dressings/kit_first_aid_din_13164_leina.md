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
LID: "N20260703100004"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "First Aid Kit"
  - "First Aid Set"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "bandage"
storage_location: "Auto"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🧰"
label: "Car First Aid Kit DIN 13164:2022"
brand: "Leina-Werke"
room: "car"
unit_price: 14.95
locations: 
  - "praxisdienst"
  - "baumarkt"
en: "First Aid Kit"
unit_type: "kit"
pl_score: 9.5
props: 
  - "Nylon bag instead of hard plastic (space-saving)"
  - "According to current standard incl. 2 masks"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
---

# 🧰  N20260703100004   Car First Aid Kit DIN 13164:2022

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
- Pay attention to the expiration date of sterile contents!
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
