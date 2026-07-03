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
LID: "N20260703102007"
parent: ""
tags:
  - "#entity/medical"
aliases:
  - "Lopedium"
explore_lvl: 5finish
priority: 
subject: "Medical & First Aid"
persona: "doctor"
status: 1active
entity_class: "medical"
medical_type: "medication"
storage_location: "Reiseapotheke"
refill_medical: false
stock_level: 0
min_stock: 1
shelf_life_months: 60
icon: "💊"
label: "Lopedium Akut (Loperamide)"
brand: "Hexal"
room: "bathroom"
unit_price: 3.50
locations: 
  - "apotheke"
  - "shop_apotheke"
en: "Loperamide"
unit_type: "pack"
pl_score: 9.0
props: 
  - "Zuverlässige Hilfe bei Reisedurchfall"
  - "Gehört in jedes Notfall-Kit im Ausland"
# --- 💊 MEDICAL SPECS ---
active_ingredient: "Loperamid"
prescription_required: "No"
---

# 💊  N20260703102007   Lopedium Akut (Loperamide)

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
- Essentiell für Camping und Reisen.
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
![[zData/5design_modul/ConnexioModul]]

---

`
