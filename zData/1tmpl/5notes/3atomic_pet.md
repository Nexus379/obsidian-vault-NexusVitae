<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🐾 Pet Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicPet-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(pet-|p-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/pet"
science: 
  - "#sci/Biology"
discipline: 
  - "#disc/Veterinary"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Pets & Animals"
persona: "vet"
status: 1active
entity_class: "pet_supply"
pet_type: "cat"
item_type: "toy"
state: "active"
needs_refill: false
shelf_life_months: 24
# --- 🐾 PET SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
material: ""
durability: 5
pl_score: 0
---

# 🐾  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Pet Lab
| 🐾 Specification | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🐾 **Pet** | `INPUT[suggester(option(cat, 🐈 Cat), option(dog, 🐕 Dog), option(bird, 🦜 Bird), option(fish, 🐟 Fish)):pet_type]` |     |
| 🏷️ **Type** | `INPUT[suggester(option(toy, 🧶 Toy), option(hygiene, 🧽 Hygiene), option(furniture, 🛋️ Furniture), option(food_bowl, 🥣 Bowl), option(carrier, 🎒 Carrier)):item_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| 🧱 **Material** | `INPUT[text:material]` |     |
| 🛡️ **Durability**| `INPUT[number:durability]` / 10 |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- 
- 
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

`
---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

`
