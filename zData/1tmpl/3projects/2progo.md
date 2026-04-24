<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "🏃🏽"; // Feste Verankerung für Pro-Go

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🏃🏽 Pro-Go: Destination/Task?", "");
}
if (!title) title = "ProGo-" + tp.date.now("HH-mm");

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

// 🔱 4. SMART-DEADLINE (14 Days)
let deadline = await tp.system.prompt("📅 Project Deadline?", tp.date.now("YYYY-MM-DD", 14));

// 🔱 5. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(2progo-|p-|3project-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/autumn forest.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/progo"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "2"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
due: <%- deadline %>
location: "<%- loca %>"
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# <%- icon %> <%- displayTitle %>

> [!todo] Focus: Physical Execution (Horizon 1)
> **Location/Context:** `<%- loca %>`
> **Parent Goal/Star:** <%- pLink %>
> **Deadline:** `<%- deadline %>`

---

## 🎯 Project Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Milestones & Objectives
> > - [ ] **M1:** Preparation & packing
> > - [ ] **M2:** Arrival & execution at `<%- loca %>`
> > - [ ] **M3:** Feedback & cleanup
>
> > [!abstract|wide-1] Context & Alignment
> > **Why now?**
> > 
> > 
> > **Success Criteria:**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
