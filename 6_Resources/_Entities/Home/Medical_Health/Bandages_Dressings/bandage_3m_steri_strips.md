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
LID: "N20260703103604"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Steri Strips"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "bandage"
storage_location: "EDC & Camping"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "🩹"
label: "3M Steri-Strips (Wound Closure)"
brand: "3M"
room: "backpack"
locations: 
  - "apotheke"
  - "praxisdienst"
en: "Wound Closure Strips"
unit_type: "pack"
pl_score: 9.5
props: 
  - "Verschließt tiefe Schnitte ohne Nähen"
  - "Extrem wichtig für echte Outdoor-Notfälle"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 6.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
---

# 🩹  N20260703103604   3M Steri-Strips (Wound Closure)

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
- Alternative zum Klammern/Nähen im Wald.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
