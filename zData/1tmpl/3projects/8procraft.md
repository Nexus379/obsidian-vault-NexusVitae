<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "🎀"; // Feste Verankerung für Pro-Craft

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎀 Pro-Craft: What are you creating?", "");
}
if (!title) title = "ProCraft-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CRAFT SPECIFICS
let merchant = await tp.system.prompt("🛒 Materials from?", "Local Store/Online");
let cost     = await tp.system.prompt("💰 Material Costs?", "0.00");

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(8procraft-|p-|3project-)/i, "").trim();

// 🔱 5. SMART-DEADLINE (14 Days)
let deadline = await tp.system.prompt("📅 Target Completion?", tp.date.now("YYYY-MM-DD", 14));

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/violet sky ocean.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/procraft"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
area2: "<%- area %>"
merchant: "<%- merchant %>"
cost: <%- cost %>
due: <%- deadline %>
cal0:
stars1:
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

> [!caution] Focus: Physical Creation (Horizon 1)
> **Parent Goal/Star:** <%- pLink %>
> **Materials:** `<%- merchant %>` | **Costs:** `<%- cost %>`
> **Deadline:** `<%- deadline %>`

---

## 🎨 Crafting Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Milestones & Objectives
> > - [ ] **M1:** Gathering materials & Initial design
> > - [ ] **M2:** Assembly / Physical creation process
> > - [ ] **M3:** Final polishing & Documentation
>
> > [!abstract|wide-1] Context & Details
> > **Why this craft?**
> > 
> > 
> > **Success Criteria:**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Tutorial/Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
