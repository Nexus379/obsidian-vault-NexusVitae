<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🧠";
const area = tp.variables.currentArea || tp.variables.area || "3_Mind";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🧠 Mind: Name of Mental Responsibility?", "");
}
if (!title) title = "Mind-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 SOLAR-PLEXUS PROMPT (Mentaler Fokus)
let balanceFocus = await tp.system.prompt("✨ Your Mantra for mental Clarity?", "I am focused and disciplined.");

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(3mind-|a-|2area-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/kachelschwarz-lichtblau.jpg]]"
banner_y: 0.35
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/3mind"
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

> [!abstract] Mental Capacity (Horizon 2)
> Knowledge management, psychology, and cognitive relief. This is where mental models are sharpened and the mind is ordered.

---

## ⚡ Mental Alignment

> [!multi-column]
>
> > [!brain|wide-1] Solar Plexus: Will & Focus
> > **Mantra:** <%- balanceFocus %>
> > 
> > *Focus on mental strength, discipline, and forging your own will.*
> > 
> > - **Core Belief:** > > - **Knowledge Focus:** `<%- disc %>`
> > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **How do I maintain mental clarity today?**
> > 
> > 
> > **Is my current focus aligned with my long-term goals?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
