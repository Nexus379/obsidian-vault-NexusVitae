<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "📅"; // Feste Verankerung für Pro-Meet

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📅 Pro-Meet: Meeting / Event Name?", "");
}
if (!title) title = "ProMeet-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. MEETING SPECIFICS
let attendees = await tp.system.prompt("👥 Attendees?", "Self");
let location  = await tp.system.prompt("📍 Location / Link?", "Discord/Office");
let deadline = await tp.system.prompt("📅 Meeting Date?", tp.date.now("YYYY-MM-DD")) || tp.date.now("YYYY-MM-DD");

// 🔱 4. CLEANING
let displayTitle = (tp.variables && tp.variables.displayTitle) ? tp.variables.displayTitle : title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(4promeet-|p-|3project-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/office-supplies.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/promeet"
status: "<%- tp.variables.projectStatus || '1active' %>"
priority:
  - "2"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
due: <%- deadline %>
attendees: "<%- attendees %>"
location: "<%- location %>"
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

> [!info] Focus: Protocol & Coordination (Horizon 1)
> > [!multi-column]
> > > [!blank|wide-5]
> > > **Parent Goal/Star:** <%- pLink %>
> > > 
> > > **Participants:** `<%- attendees %>` | **Location:** `<%- location %>`
> > > 
> > > **Date:** `<%- deadline %>`
> > > **Deadline:** `<%- deadline %>`   (Target: 14 days)
> > 
> > >[!blank|wide-0]
> > > **Inbox:** `INPUT[toggle:inbox]`
> > > **Status:**
> > > `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]`


## 📋 Meeting Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Agenda & Objectives
> > - [ ] **A1:** 
> > - [ ] **A2:** 
>
> > [!abstract|wide-1] Decisions & Actions
> > - [ ] **Action:** 
> > - [ ] **Action:** 

## 📝 Meeting Notes
- 

## 🛠️ Workload / Pensum





---
**System Action:** [[n-lit|+ Create Protocol Note]] | [[t-todo|+ Create Follow-up Task]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
