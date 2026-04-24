<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const persona = tp.variables.persona || "";
let sci = tp.variables.sci || "";
let disc = tp.variables.disc || "";
let icon = tp.variables.discIcon || tp.variables.icon || "🌸";
let area = tp.variables.currentArea || tp.variables.area || "1_Selfcare";

// 🔱 2. FALLBACK & PROMPTS (Zuerst alle Fenster!)
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🌸 Selfcare: Name of Responsibility?", "");
}
if (!title) title = "Selfcare-" + tp.date.now("HH-mm-ss");

// 🔱 3. ROOT-CHAKRA PROMPT (Muss vor das Rename!)
let balanceFocus = await tp.system.prompt("🌸 Root Chakra: What is your focus for grounding today?", "Nourishing my physical foundation.");

// 🔱 4. RENAME (Erst wenn alle Prompts durch sind)
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 5. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(1selfcare-|a-|2area-)/i, "").trim();

tR += "---\n";  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/power up anime girl soul.png]]"
banner_y: 0.2
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/1selfcare"
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

> [!abstract] Resonance & Regeneration (Horizon 2)
> Focus on the connection to self, energetic alignment, and physical foundation. The space for silence and healing.

---

## 🧘 Grounding & Foundation

> [!multi-column]
>
> > [!pink|wide-1] Root Chakra: Grounding
> > **Focus:** <%- balanceFocus %>
> > 
> > *My physical and energetic base. Without sleep and nutrients, the system fails.*
> > 
> > - **Nutrients:** `<%- sci %>` focus
> > - **Sleep/Rest:** 
> > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **What is the non-negotiable minimum for this area?**
> > 
> > 
> > **How do I maintain my energy here?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>