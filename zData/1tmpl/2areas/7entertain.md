<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🕹️";
const area = tp.variables.currentArea || tp.variables.area || "7_Entertainment";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🕹️ Entertainment: Name of Fun Responsibility?", "");
}
if (!title) title = "Entertainment-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 CROWN PROMPT (Consistent Variable: balanceFocus)
let balanceFocus = await tp.system.prompt("🕹️ Crown: What makes you forget time today?", "Absolute flow & joy of play.");

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7entertain-|a-|2area-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/aesthetic-anime-character-gaming.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/7entertain"
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

> [!terminal] Entropy & Enjoyment (Horizon 2)
> Conscious relaxation and entertainment. Gaming, movies, and hobbies that recharge the battery and nourish the inner child.

---

## 🌀 Pure Flow

> [!multi-column]
>
> > [!abstract|wide-1] Crown Chakra: Unity & Entropy
> > **Focus:** <%- balanceFocus %>
> > 
> > *Letting go, silence (or play), and dissolving the ego. When we play, we are one with the moment.*
> > 
> > - **Game/Entertainment:** > > - **State after letting go:** > > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **Is this activity truly recharging me or just consuming time?**
> > 
> > 
> > **Am I able to fully immerse myself in the moment?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
