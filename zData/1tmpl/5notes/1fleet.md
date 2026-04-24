<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz
const persona = tp.variables.persona || "student";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "3_Mind";
const icon = tp.variables.icon || "🍂";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🍂 Fleeting Thoughts?", "");
}
if (!title || title.trim() === "") title = "Fleeting-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. TITEL-CLEANING
let displayTitle = title.replace(/^(fleet-|n-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/20354-yin-yang-buddhism-element-gates-gold-4k (1).jpg]]"
banner_y: 0.4
banner_icon: 🍂
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/1fleeting"
status: 1active
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
persona: "<%- persona %>"
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🍂 Captura: <%- displayTitle %>


> [!abstract] Cogitatio Fugax (Fleeting Thought)
> Raw capture of an idea or observation. Not yet distilled.
> 
> **Context:** `$= dv.current().science` 
> 
> **Discipline:** `$= dv.current().discipline`

### ✍️ Adnotatio (Notes)
- 






---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
