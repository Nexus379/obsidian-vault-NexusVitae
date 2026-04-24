<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc";
const icon = tp.variables.icon || "🗃️";
const luhmannId = tp.variables.luhmannId || "";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Your atomic note?", "");
}
if (!title || title.trim() === "") title = "Atomic-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING (displayTitle statt dTitle!)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(atomic-|n-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/office-supplies.jpg]]"
banner_y: 0.4
banner_icon: 🗃️
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/4atomic"
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

# 🗃️ <%- luhmannId %>  <%- displayTitle %>

> [!abstract] Elementum (Atomic Fact)
> Cluster: <%- sci %> | Discipline: <%- disc %>

## 🗂️ Flashcard Content
- **Questio (Question):** - **Responsio (Answer):** ---

## 🔗 Struktur-Kontext (LID-Automatik)
- **Parent:** <%- pLink %>
- **Siblings:** `$= dv.list(dv.pages("#5note").filter(p => p.LID && p.LID.length === dv.current().LID.length && p.LID.startsWith(dv.current().LID.slice(0,-1)) && p.file.name != dv.current().file.name).file.link)`
- **Children:** `$= dv.list(dv.pages("#5note").filter(p => p.LID && p.LID.length > dv.current().LID.length && p.LID.startsWith(dv.current().LID)).file.link)`

---

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
