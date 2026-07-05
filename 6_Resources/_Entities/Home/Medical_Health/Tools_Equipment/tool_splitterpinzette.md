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
LID: "N20260703103606"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Splinter Tweezers"
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
label: "Splinter Tweezers (Pointed)"
brand: "Remos"
room: "backpack"
locations: 
  - "praxisdienst"
  - "apotheke"
  - "dm"
en: "Splinter Tweezers"
unit_type: "piece"
pl_score: 8.5
props: 
  - "Extrem spitze Enden für feine Holzsplitter"
  - "Made of stainless steel"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 4.50
vendor_value: ""
price_market: 0.00
vendor_market: ""
---

# 🛠️  N20260703103606   Splinter Tweezers (Pointed)

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
- Better than flat tick tweezers when working with firewood.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
