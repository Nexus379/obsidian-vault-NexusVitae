<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc";
const sub = tp.variables.sub || "";
const luhmannId = tp.variables.luhmannId || "";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📜 Permanent Note: Core Statement?", "");
}
if (!title || title.trim() === "") title = "Permanent-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING (H1 Anzeige)
let displayTitle = title.replace(/^([a-zA-Z0-9.]+)/, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/flower shop.png]]"
banner_y: 0.5
banner_icon: 📜
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/3permanent"
status: 1active
persona: "<%- persona %>"
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
subject: "<%- sub %>"
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

# 📜 <%- luhmannId %>  <%- displayTitle %>

> [!success] Sententia Primaria (Core Thought)
> **ID:** <%- luhmannId %> 
> 
> **Science:** `$= dv.current().science` | **Discipline:** `$= dv.current().discipline`
> 
> **Context:** <%- pLink %>


### 🧠 Ratio (Argumentation & Herleitung)
-



---

## 🔗 Connectiones (Verknüpfungen)
- **Up (Parent):** <%- pLink %>
- **Sideways (Siblings):** `$= dv.list(dv.pages("#5note/3permanent").filter(p => p.LID && p.LID.length === dv.current().LID.length && p.LID.startsWith(dv.current().LID.slice(0,-1)) && p.file.name != dv.current().file.name).file.link)`
- **Down (Children):** `$= dv.list(dv.pages("#5note/3permanent").filter(p => p.LID && p.LID.length > dv.current().LID.length && p.LID.startsWith(dv.current().LID)).file.link)`



---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
