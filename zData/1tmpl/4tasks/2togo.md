<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD");

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🏃🏽 To-Go: Destination / Mission?", "");
}
if (!title) title = "ToGo-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. SMART LOCATION SUGGESTER
const lOptions = ["🏠 Home", "🏢 Office", "🛒 Supermarket", "🏋️ Gym", "🌳 Nature", "☕ Café", "🏛️ Library", "➕ Custom..."];
const lValues = ["Home", "Office", "Supermarket", "Gym", "Nature", "Cafe", "Library", "custom"];

let loca = await tp.system.suggester(lOptions, lValues);
if (loca === "custom") {
    loca = await tp.system.prompt("📍 Enter Custom Location:");
}
if (!loca) loca = "TBD";

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(2togo-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/giphy.gif]]"
banner_y: 0.5
banner_icon: 🏃🏽
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/togo"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
location: "<%- loca %>"
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
LID: "G<%- tp.date.now("YYYYMMDDHHmm") %>"
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🏃🏽 To-Go: <%- displayTitle %>

> [!todo] Mission Location: `<%- loca %>` (Horizon 0)
> **Action:** <%- displayTitle %>
> **Persona:** `<%- persona %>`
> **Deadline:** `<%- deadline %>`

## 📌 Physical Task
- [ ] Mission: <%- displayTitle %> 📍 Loca: `<%- loca %>`

## 🛠️ Workload / Pensum

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---
**System Action:**
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]]