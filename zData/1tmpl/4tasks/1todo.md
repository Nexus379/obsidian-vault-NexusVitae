<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "warrior"; // Fallback auf dein Frontmatter
const area = tp.variables.currentArea || tp.variables.area || "";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD", 1);

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME (Sicherheitsnetz)
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🛠️ Todo: What is the action?", "");
}
if (!title) title = "Todo-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(1todo-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/matrix.jpg]]"
banner_y: 0.5
banner_icon: 🛠️
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/todo"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
cal0:
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

# 🛠️ Todo: <%- displayTitle %>

> [!todo] Short-term Execution (Horizon 0)
> 
> **Action:** <%- displayTitle %>
> 
> **Deadline:** `<%- deadline %>` 
> 
> **Persona:** `<%- persona %>`

## 📌 Next Step
- [ ] <%- displayTitle %>

## 🛠️ Workload / Pensum

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---
**System Action:**
[[n-lit|+ Create Note]] | [[p-active|+ Create Project from Task]]