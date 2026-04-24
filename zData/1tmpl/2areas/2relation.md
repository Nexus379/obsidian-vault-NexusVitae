<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🦄";
const area = tp.variables.currentArea || tp.variables.area || "2_Relationship";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🦄 Relationship: Name of Social Responsibility?", "");
}
if (!title) title = "Relationship-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(2relation-|a-|2area-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/cat-art-yin-yang-cats-.jpg]]"
banner_y: 0.4
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/2relationship"
status: 1active
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
due:
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

> [!abstract] Sacral-Chakra Focus (Horizon 2)
> **Energy:** Flow, emotions, and the connection to other beings. 
> This is where I nurture my social circles and the depth of my connections.

---

## 🤝 Interaction & Empathy

> [!multi-column]
>
> > [!love|wide-1] Connections & Exchange
> > **Focus on the "We". Cultivating social resonance, deep conversations, and awareness for fellow human beings.**
> > 
> > - **Key People:** > > - **Quality Time:** > > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **How do I maintain social resonance here?**
> > 
> > 
> > **What does a healthy connection in this area look like?**
> > 

## Workload / Pensum





---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
