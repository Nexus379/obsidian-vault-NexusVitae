<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🧝‍♀️ LARP Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicLARP-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(larp-|l-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/larp"
science: 
  - "#sci/History"
  - "#sci/Art"
discipline: 
  - "#disc/Hobbies"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
  - "#entity/larp_gear"
aliases:
explore_lvl: 5finish
priority: 
subject: "LARP & Cosplay"
persona: "cosplayer"
status: 1active
entity_class: "larp_gear"
larp_type: "costume"
state: "active"
needs_refill: false
shelf_life_months: 60
# --- 🧝‍♀️ LARP SPECS ---
unit_price: 0
store_online: ""
store_local: ""
brand: ""
material: ""
authenticity_lvl: 5
is_foam_weapon: false
pl_score: 0
---

# 🧝‍♀️  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Forge & Tailor Lab
| 🧝‍♀️ Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(costume, 👗 Costume), option(armor, 🛡️ Armor), option(weapon, ⚔️ Weapon), option(prop, 📜 Prop)):larp_type]` |     |
| 🏷️ **Brand/Maker** | `INPUT[text:brand]` |     |
| 🌐 **Online Shop** | `INPUT[text:store_online]` |     |
| 🏰 **Local Shop** | `INPUT[text:store_local]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| 🧱 **Material** | `INPUT[text:material]` |     |
| ⚔️ **Foam Weapon** | `INPUT[toggle:is_foam_weapon]` |     |
| 🎭 **Authenticity**| `INPUT[number:authenticity_lvl]` / 10 |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- Review: LARP Forums / Local Guilds
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
