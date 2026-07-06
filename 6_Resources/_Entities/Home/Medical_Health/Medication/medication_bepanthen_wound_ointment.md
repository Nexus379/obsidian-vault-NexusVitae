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
LID: "N20260703102005"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Bepanthen"
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
shelf_life_months: 36
icon: "🧴"
label: "Bepanthen Wound and Healing Ointment"
brand: "Bepanthen"
room: "bathroom"
locations: 
  - "apotheke"
  - "docmorris"
en: "Wound Healing Ointment"
unit_type: "tube"
pl_score: 9.0
props: 
  - "Fördert die natürliche Wundheilung"
  - "Ideal für kleine Schürfwunden"
#
qty: 0
--- 💊 MEDICAL SPECS ---
active_ingredient: "Dexpanthenol"
prescription_required: "No"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 5.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
---

# 🧴  N20260703102005   Bepanthen Wound and Healing Ointment

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
- Sehr verträglich und bewährt.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`

