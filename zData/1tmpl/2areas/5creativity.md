<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🎨";
const area = tp.variables.currentArea || tp.variables.area || "5_Creativity";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎨 Creativity: Name of Expression?", "");
}
if (!title) title = "Creativity-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 THROAT-CHAKRA PROMPT (Speaking your Truth)
let balanceFocus = await tp.system.prompt("🎨 Throat Chakra: What do you want to express today?", "Letting my creative truth flow.");

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(5creativity-|a-|2area-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/laterne.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/5creativity"
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

> [!palette] Expression & Creation (Horizon 2)
> The playground for ideas. Artistic development, inspiration, and projects that arise from pure joy of creation.

---

## ✍️ Creative Flow

> [!multi-column]
>
> > [!abstract|wide-1] Throat-Chakra: Authentic Voice
> > **Focus:** <%- balanceFocus %>
> > 
> > *This is where the inner vision becomes loud. It is about authentic communication and creating something new.*
> > 
> > - **Medium/Project:** > > - **What needs to be spoken/created?:** > > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **Am I expressing my truth or following a trend?**
> > 
> > 
> > **Is there a "Brain-Dump" needed to clear the channel?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
