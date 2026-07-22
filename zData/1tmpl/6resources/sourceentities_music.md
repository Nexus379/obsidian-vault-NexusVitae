<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎵 Music Note: Name of Instrument/Gear?", "");
}
if (!title || title.trim() === "") title = "AtomicMusic-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(music-|m-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/music"
science: 
  - "#sci/Art"
  - "#sci/Physics"
discipline: 
  - "#disc/Music"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority: 
subject: "Music Gear"
persona: "musician"
status: 1active
entity_class: "musical_instrument"
tech_type: "analog"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 120
# --- 🎵 MUSIC SPECS ---
brand: ""
material: ""
is_digital: false
requires_power: false
pl_score: 0
pref_vendor: ""
pref_price: 0.00
unit_price: 0.00
price_cheap: 0.00
vendor_cheap: ""
price_value: 0.00
vendor_value: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_pure: 0.00
vendor_pure: ""
price_market: 0.00
vendor_market: ""
---

# 🎵  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Specs Lab
| 🎵 Specification     | ⚖️ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 🏷️ **Type**         | `INPUT[suggester(option(analog, 🎸 Analog), option(digital, 🎹 Digital), option(studio, 🎛️ Studio), option(listening, 🎧 Listening), option(accessory, 🎻 Accessory), option(maintenance, 🧹 Maintenance)):tech_type]`                                                          |     |
| 🏷️ **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| 🏪 **Vendor**        | `INPUT[text:pref_vendor]`                                                                                                                                      |     |
| 💰 **Price**         | `VIEW[{unit_price}]` €                                                                                                                                   |     |
| 🪵 **Material**      | `INPUT[text:material]`                                                                                                                                      |     |
| 🔌 **Power needed**  | `INPUT[toggle:requires_power]`                                                                                                                                     |     |
| 🎛️ **Digital**       | `INPUT[toggle:is_digital]`                                                                                                                                     |     |
| ⭐ **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

<%- tp.file.include("[[zData/5design_modul/ShoppingPriceMatrix]]") %>

## 📝 Source & Notes
- 
- 
- 

> [!info] 👤 Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

