<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "🚧"; // Feste Verankerung für Projekte

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🛠️ Pro-Do: Project Name?", "");
}
if (!title) title = "ProDo-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. SMART-DEADLINE (14 Days Standard)
let deadline = await tp.system.prompt("📅 Project Deadline?", tp.date.now("YYYY-MM-DD", 14));

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(1prodo-|p-|3project-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/giphy.gif]]"
banner_y: 0.672
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/prodo"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
due: <%- deadline %>
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

> [!caution] Focus: Execution (Horizon 1)
> **Parent Goal/Star:** <%- pLink %>
> **Deadline:** `<%- deadline %>` (Target: 14 days)

---

## 🎯 Project Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Milestones & Objectives
> > - [ ] **M1:** Definition of concept & vision
> > - [ ] **M2:** Initial implementation steps
> > - [ ] **M3:** Final review & completion
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
