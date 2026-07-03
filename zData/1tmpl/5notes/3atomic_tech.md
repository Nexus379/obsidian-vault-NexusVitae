<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("⚙️ Tech Note: Name of Gear?", "");
}
if (!title || title.trim() === "") title = "AtomicTech-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING für die H1
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(tech-|t-)/i, "").trim();

tR += "---"  
%>
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/tech"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
compatibility: []
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "component"
state: "active"
needs_refill: false
shelf_life_months: 60
# --- ⚙️ TECH SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
ghz: 0
ram_gb: 0
storage_gb: 0
rpm: 0
has_camera: false
adapter_type: "HDMI"
socket: ""
material: ""
screen_inches: 0
battery_h: 0
hz: 0
is_curved: false
battery_mah: 0
camera_mp: 0
condition: "new"
pl_score: 0
---

# ⚙️  <%- luhmannId %>   <%- displayTitle %>

## 🔬 Specs Lab
| ⚙️ Specification     | ⚖️ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 🏷️ **Type**         | `INPUT[suggester(option(component, ⚙️ Component), option(peripheral, 🖱️ Peripheral), option(appliance, 📺 Appliance), option(mobile, 📱 Mobile), option(display, 🖥️ Display), option(audio, 🎧 Audio), option(cable_adapter, 🔌 Cable/Adapter)):tech_type]`                                                          |     |
| ✨ **Condition**    | `INPUT[suggester(option(new, 🆕 New), option(refurbished, ♻️ Refurbished), option(used, 🩹 Used)):condition]`                                                                                                                                           |     |
| 🏷️ **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| 🏪 **Vendor**        | `INPUT[text:pref_vendor]`                                                                                                                                      |     |
| 💰 **Price**         | `INPUT[number:unit_price]` €                                                                                                                                   |     |
| 🧠 **RAM**           | `INPUT[number:ram_gb]` GB                                                                                                                                      |     |
| ⚡ **GHz**            | `INPUT[number:ghz]` GHz                                                                                                                                        |     |
| 💾 **Storage**       | `INPUT[number:storage_gb]` GB                                                                                                                                  |     |
| 🔄 **RPM**           | `INPUT[number:rpm]`                                                                                                                                            |     |
| 🔋 **Battery (h)**  | `INPUT[number:battery_h]` h                                                                                                                                      |     |
| 🔋 **Battery (mAh)**| `INPUT[number:battery_mah]` mAh                                                                                                                                    |     |
| 📷 **Camera (MP)**  | `INPUT[number:camera_mp]` MP                                                                                                                                       |     |
| 📏 **Screen (")**   | `INPUT[number:screen_inches]` Zoll                                                                                                                                  |     |
| 🔄 **Refresh (Hz)** | `INPUT[number:hz]` Hz                                                                                                                                              |     |
| 🌙 **Curved**       | `INPUT[toggle:is_curved]`                                                                                                                                           |     |
| 📷 **Camera**        | `INPUT[toggle:has_camera]`                                                                                                                                     |     |
| 🔌 **Adapter/Ports** | `INPUT[suggester(option(USB-C, USB-C), option(USB-A, USB-A), option(Micro-USB, Micro-USB), option(Lightning, Lightning), option(HDMI, HDMI), option(DisplayPort, DisplayPort), option(VGA, VGA), option(SD, SD), option(MicroSD, MicroSD), option(Audio, Audio 3.5mm), option(Ethernet, Ethernet), option(Power, Power)):adapter_type]` |     |
| 🔌 **Socket**        | `INPUT[text:socket]`                                                                                                                                           |     |
| ⭐ **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

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
