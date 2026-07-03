<%-*
// ðŸ”± 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // ðŸ›¡ï¸ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// ðŸ”± 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("ðŸ•ï¸ Fitness Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicFitness-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// ðŸ”± 3. TITEL-CLEANING fÃ¼r die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(Fitness-|c-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/Fitness"
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
subject: "Fitness & Outdoors"
persona: "hiker"
status: 1active
entity_class: "outdoor_gear"
Fitness_type: "tent"
state: "active"
needs_refill: false
shelf_life_months: 120
# --- ðŸ•ï¸ OUTDOOR SPECS ---
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

# ðŸ•ï¸  <%- luhmannId %>   <%- displayTitle %>

## ðŸ”¬ Gear Lab
| ðŸ•ï¸ Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(tent, â›º Tent), option(sleeping_bag, ðŸ›ï¸ Sleeping Bag), option(sleeping_pad, ðŸ›Œ Sleeping Pad), option(cooking, ðŸ³ Cooking), option(water_filter, ðŸ’§ Water Filter), option(backpack, ðŸŽ’ Backpack), option(tool, ðŸ”ª Tool)):Fitness_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| âš–ï¸ **Weight** | `INPUT[number:weight_g]` g |     |
| ðŸ§‘â€ðŸ¤â€ðŸ§‘ **Capacity** | `INPUT[number:capacity_persons]` Personen |     |
| ðŸŒ§ï¸ **Waterproof** | `INPUT[number:water_column_mm]` mm |     |
| â„ï¸ **Season Rating** | `INPUT[number:season_rating]` (1-4) |     |
| ðŸ“ **Pack Size** | `INPUT[text:pack_size_cm]` |     |
| ðŸ§± **Material** | `INPUT[text:material]` |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- 
- 
- 

> [!info] ðŸ‘¤ Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`


`
---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

`
