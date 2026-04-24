<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🚵🏽";
const area = tp.variables.currentArea || tp.variables.area || "6_Activity";

// 🔱 2. FALLBACK & PROMPTS (Zuerst alle Fenster!)
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🚵🏽 Activity: Name of Physical Responsibility?", "");
}
if (!title) title = "Activity-" + tp.date.now("HH-mm-ss");

// 🔱 THIRD EYE PROMPT (Muss vor das Rename!)
let balanceFocus = await tp.system.prompt("👁️ Third Eye: What goal do you see before your mind's eye today?", "Aligning body and spirit through movement.");

// 🔱 3. DATEI UMBENENNEN (Erst wenn alle Prompts durch sind)
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(6activity-|a-|2area-)/i, "").trim();

tR += "---\n";  
%>
banner: "![[xAttachment/Images/Banner/street gif.gif]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/6activity"
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

> [!mountain] External Energy (Horizon 2)
> The physical world. Athletic adventures, travel, and the movement of the body in nature and space.

---

## 🏹 Directed Energy

> [!multi-column]
>
> > [!abstract|wide-1] Third Eye: Vision & Movement
> > **Focus:** <%- balanceFocus %>
> > 
> > *Targeted movement requires discipline and body awareness. Here, the will manifests through action.*
> > 
> > - **Movement/Sport:**
> > - **Mental Barrier today:**
> > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **Is my physical exertion serving my long-term vision?**
> > 
> > 
> > **What physical milestone provides the most clarity right now?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
