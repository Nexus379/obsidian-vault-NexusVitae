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
LID: "N20260703100005"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Rescue Blanket"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "tool"
storage_location: "EDC & Auto"
refill_medical: false
stock_level: 0
min_stock: 2
shelf_life_months: 120
icon: "🛡️"
label: "Mivolis First Aid Rescue Blanket"
brand: "Mivolis"
room: "backpack"
locations: 
  - "dm"
en: "Rescue Blanket"
unit_type: "piece"
pl_score: 9.0
props: 
  - "Gold/Silber für Wärme/Kälteschutz"
  - "Extremely compact packaging"
# --- 💊 MEDICAL SPECS ---
active_ingredient: ""
prescription_required: "No"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 1.95
vendor_value: ""
price_market: 0.00
vendor_market: ""
---

# 🛡️  N20260703100005   Mivolis First Aid Rescue Blanket

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
- Ein Muss für jedes EDC Kit.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
