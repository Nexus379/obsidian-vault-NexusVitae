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
LID: "N20260703103603"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Buscopan"
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
shelf_life_months: 60
icon: "💊"
label: "Buscopan Plus"
brand: "Sanofi"
room: "bathroom"
locations: 
  - "apotheke"
  - "shop_apotheke"
en: "Antispasmodic"
unit_type: "pack"
pl_score: 9.0
props: 
  - "Krampflösend bei Magen-Darm-Beschwerden"
  - "Plus = mit zusätzlichem Schmerzmittel (Paracetamol)"
#
qty: 0
--- 💊 MEDICAL SPECS ---
active_ingredient: "Butylscopolamin, Paracetamol"
prescription_required: "No"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 8.50
vendor_value: ""
price_market: 0.00
vendor_market: ""
---

# 💊  N20260703103603   Buscopan Plus

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
- Very effective for cramp-like stomach pain.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`

