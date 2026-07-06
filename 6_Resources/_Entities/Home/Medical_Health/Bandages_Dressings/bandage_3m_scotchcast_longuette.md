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
LID: "N20260703153901"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Kunstharz-Schiene"
  - "Soft Cast"
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
label: "3M Scotchcast Longuette (Gießharz-Schiene)"
brand: "3M"
room: "backpack"
locations: 
  - "praxisdienst"
en: "Fiberglass Splint"
unit_type: "pack"
pl_score: 9.0
props: 
  - "Halboffene Schiene (härtet durch Wasser aus)"
  - "Wird mit der Peha-haft Binde am Arm fixiert"
#
qty: 0
--- 💊 MEDICAL SPECS ---
active_ingredient: "Polyurethanharz (Fiberglas)"
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

# 🩹  N20260703153901   3M Scotchcast Longuette (Gießharz-Schiene)

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
- Sehr sicher für Laien, da es den Arm nicht komplett umschließt und nichts abschnüren kann.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`

