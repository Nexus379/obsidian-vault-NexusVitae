<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "🗣️";
const area = tp.variables.currentArea || tp.variables.area || "#2area/5expression";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🗣️ Expression: Name of your voice / channel?", "");
}
if (!title) title = "Expression-" + tp.date.now("HH-mm");
if (tp.file.title !== title) { await tp.file.rename(title); await new Promise(r => setTimeout(r, 200)); }

let displayTitle = title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(5expression-|a-|2area-)/i, "").trim();
tR += "---"
%>
banner: "![[xAttachment/Images/Banner/street gif.gif]]"
banner_y: 0.4
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/5expression"
status: 1active
priority:
  - "5"
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

> [!abstract] Throat-Chakra Focus (GTD Horizon 2 · Areas of Focus)
> **Energy:** Expression, voice, and truth.
> This is where I speak, write, teach and share — where the inner becomes outer.

---

## 🗣️ Voice & Communication

> [!multi-column]
>
> > [!quote|wide-1] Speak & Share
> > **What truth wants to be voiced? Where do I teach, write, publish?**
> >
> > - **Channels:**
> > - **Audience:**
> > - **Acting Persona:** `<%- persona %>`
>
> > [!todo|wide-1] Standards
> > **How do I keep my expression authentic and clear?**
> >

## Workload




---
**System Action:** [[n-lit|+ Create Note]] | [[p-active|+ Create Project]]

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
