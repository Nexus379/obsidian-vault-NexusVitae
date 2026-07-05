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
LID: "N20260703102006"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Cetirizin"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "medication"
storage_location: "Hausapotheke & EDC"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 36
icon: "💊"
label: "Cetirizin Hexal (Antiallergic)"
brand: "Hexal"
room: "bathroom"
unit_price: 4.00
locations: 
  - "apotheke"
  - "shop_apotheke"
en: "Antihistamine"
unit_type: "pack"
pl_score: 9.5
props: 
  - "Fast relief for allergies and hay fever"
  - "Geringes Müdigkeitsrisiko"
# --- 💊 MEDICAL SPECS ---
active_ingredient: "Cetirizindihydrochlorid"
prescription_required: "No"
---

# 💊  N20260703102006   Cetirizin Hexal (Antiallergic)

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
- Wichtig in der Frühlings-/Sommerzeit.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
