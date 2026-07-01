<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🏕️ Camping Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicCamping-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(camping-|c-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/camping"
science: 
  - "#sci/Biology"
  - "#sci/Geography"
discipline: 
  - "#disc/Outdoors"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Camping & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
camping_type: "tent"
state: "active"
needs_refill: false
shelf_life_months: 120
# --- 🏕️ OUTDOOR SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
weight_g: 0
capacity_persons: 0
water_column_mm: 0
season_rating: 3
pack_size_cm: ""
material: ""
pl_score: 0
---

# 🏕️  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Gear Lab
| 🏕️ Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(tent, ⛺ Tent), option(sleeping_bag, 🛏️ Sleeping Bag), option(sleeping_pad, 🛌 Sleeping Pad), option(cooking, 🍳 Cooking), option(water_filter, 💧 Water Filter), option(backpack, 🎒 Backpack), option(tool, 🔪 Tool)):camping_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| ⚖️ **Weight** | `INPUT[number:weight_g]` g |     |
| 🧑‍🤝‍🧑 **Capacity** | `INPUT[number:capacity_persons]` Personen |     |
| 🌧️ **Waterproof** | `INPUT[number:water_column_mm]` mm |     |
| ❄️ **Season Rating** | `INPUT[number:season_rating]` (1-4) |     |
| 📏 **Pack Size** | `INPUT[text:pack_size_cm]` |     |
| 🧱 **Material** | `INPUT[text:material]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- 
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
