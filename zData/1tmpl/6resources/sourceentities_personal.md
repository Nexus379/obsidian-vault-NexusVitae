<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🧴 Personal Care Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicPersonal-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(personal-|p-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/personal_care"
science: 
  - "#sci/Dermatology"
  - "#sci/MaterialsScience"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Personal Care"
persona: "dermatologist"
status: 1active
entity_class: "personal_care"
personal_type: "skincare"
state: "bathroom"
qty: 0
needs_refill: false
shelf_life_months: 12
# --- 🧴 MATERIAL SPECS ---
brand: ""
material: ""
chlorine_free: "Yes"
absorption: ""
pl_score: 0
pref_vendor: "dm"
pref_price: 0.00
unit_price: 2.49
price_cheap: 1.19
vendor_cheap: "Rossmann"
price_value: 2.49
vendor_value: "Müller"
price_pure_cheap: 2.99
vendor_pure_cheap: "dm Bio"
price_pure: 4.49
vendor_pure: "Alnatura"
price_market: 5.99
vendor_market: "Apotheke"
---

# 🧴  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Material Lab
| 🧴 Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(skincare, 🧴 Skincare), option(haircare, 💇 Haircare), option(makeup, 💄 Makeup), option(hygiene, 🧼 Hygiene), option(dental, 🦷 Dental)):personal_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `VIEW[{unit_price}]` € |     |
| 🧬 **Material** | `INPUT[text:material]` |     |
| ☁️ **Absorption** | `INPUT[text:absorption]` |     |
| 🌿 **Chlorine Free** | `INPUT[text:chlorine_free]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

<%- tp.file.include("[[zData/5design_modul/ShoppingPriceMatrix]]") %>

## 📝 Source & Notes
- 
- 
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

