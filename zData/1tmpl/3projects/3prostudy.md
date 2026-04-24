<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "🎓"; // Feste Verankerung für Pro-Study

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎓 Pro-Study: Topic / Subject?", "");
}
if (!title) title = "ProStudy-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. STUDY-TYPE SELECTION
const sOpt = ["📝 Test (Small)", "🔥 Exam (Big)", "🔄 Spaced Repetition", "🏛️ Lecture/Class", "🌍 Field Trip", "📚 General Study"];
const sVal = ["test", "exam", "spaced", "class", "excursion", "general"];
let studyType = await tp.system.suggester(sOpt, sVal) || "general";

// 🔱 4. SMART-DEADLINE (14 Days)
let deadline = await tp.system.prompt("📅 Exam/Deadline Date?", tp.date.now("YYYY-MM-DD", 14));

// 🔱 5. SPACED REPETITION FIX (Verhindert Absturz bei <%- p1 %>)
let p1 = tp.date.now("YYYY-MM-DD");

// 🔱 6. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(3prostudy-|p-|3project-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Black-hole-banner.jpg]]"
banner_y: 0.4
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/prostudy"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
study_type: <%- studyType %>
space_lvl: 0
space_rank: "Ground Crew (Sprout)"
space_date: <%- p1 %>
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

> [!info] Focus: Knowledge Acquisition & Integration (Horizon 1)
> **Subject:** `<%- disc %>` | **Type:** `<%- studyType.toUpperCase() %>`
> **Parent Goal/Star:** <%- pLink %>
> **Exam/Deadline:** `<%- deadline %>`

---

## 🎯 Study Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Milestones & Objectives
> > - [ ] **M1:** Source collection & Initial overview
> > - [ ] **M2:** Deep dive & Note extraction (Atomic Notes)
> > - [ ] **M3:** Synthesis & Spaced Repetition setup (Anki)
>
> > [!abstract|wide-1] Target State & Context
> > **Key Learnings:** > > 
> > 
> > **Why this topic?**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[n-lit|+ Create Atomic Note]] | [[n-lit|+ Create Literature Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
