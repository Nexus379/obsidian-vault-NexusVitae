<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🧩";
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🧩 Organize: Name of Administrative Responsibility?", "");
}
if (!title) title = "Organize-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 HEART-CHECK PROMPT (Balance & Structure)
let balanceFocus = await tp.system.prompt("🧩 What is your focus for balance today?", "Creating structure & maintaining flow.");

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(4organize-|a-|2area-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/4organize"
status: 1active
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
balance_focus: "<%- balanceFocus %>"
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

> [!settings] Structure & Systems (Horizon 2)
> Life infrastructure. Finance, household, optimization, and the maintenance of your personal Nexus system.

---

## ⚖️ L-E-B-E-N Sync

> [!multi-column]
>
> > [!heart|wide-1] Heart-Chakra: The Bridge
> > **Focus:** <%- balanceFocus %>
> > 
> > *The connection between Mind (above) and Matter (below). Here I create order to enable freedom.*
> > 
> > - **Structural Element:** > > - **What can be let go?:** > > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **Is the current system reducing friction or creating it?**
> > 
> > 
> > **What administrative task provides the most relief right now?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
