<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc";
const luhmannId = tp.variables.luhmannId || "";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🌳 Evergreen Note: Topic/Thesis?", "");
}
if (!title || title.trim() === "") title = "Evergreen-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. CLEANING (Nexus Standard)
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(ever-|n-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/real monstera leaf.jpg]]"
banner_y: 0.6
banner_icon: 🌳
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/5evergreen"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🌳 Evergreen: <%- displayTitle %>

>[!multi-column]
> > [!grown] Arbor Scientiae (Tree of Knowledge)
> > **ID:** <%- luhmannId %> 
> > 
> > **Science:** `$= dv.current().science`
> >  
> > **Discipline:** `$= dv.current().discipline`
> 
> > An Evergreen note is a living statement. It is constantly updated, refined, and linked with new Atomic Notes.

## 🌿 Synthesis & Insight
- **Core Thesis:** - **Connections:** ## 🧪 Evidence (Linked Atoms)
- 

### 🔗 Connectiones (Connections)
- **Up (Parent):** <%- pLink %>
- **Sideways (Siblings):** `$= dv.list(dv.pages("#5note/5evergreen").filter(p => p.LID && p.LID.length === dv.current().LID.length && p.LID.startsWith(dv.current().LID.slice(0,-1)) && p.file.name != dv.current().file.name).file.link)`
- **Down (Children):** `$= dv.list(dv.pages("#5note").filter(p => p.LID && p.LID.length > dv.current().LID.length && p.LID.startsWith(dv.current().LID)).file.link)`


- $ _A growing note that unites various concepts. It is continuously expanded and refined over time._
---

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
