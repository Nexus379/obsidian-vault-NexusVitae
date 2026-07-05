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
LID: "N20260703100002"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Octenisept"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "medication"
storage_location: "Hausapotheke"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🧴"
label: "Octenisept Wound Disinfection (50ml)"
brand: "Schülke"
room: "bathroom"
unit_price: 6.45
locations: 
  - "shop_apotheke"
  - "docmorris"
  - "apotheke"
en: "Octenisept Wound Spray"
unit_type: "bottle"
pl_score: 8.5
props: 
  - "Painless wound disinfection"
  - "Broad spectrum of activity"
# --- 💊 MEDICAL SPECS ---
active_ingredient: "Octenidin"
prescription_required: "No"
---

# 🧴  N20260703100002   Octenisept Wound Disinfection (50ml)

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
- Bester Preis meist online (UVP ist ~14€).
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
