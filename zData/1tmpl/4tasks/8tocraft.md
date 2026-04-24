<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "creator";
const area = tp.variables.currentArea || tp.variables.area || "";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD", 14);

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎀 To-Craft: What are you creating?", "");
}
if (!title || title.trim() === "") title = "Craft-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING (Entfernt Trigger wie 8tocraft- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(8tocraft-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/laterne.jpg]]"
banner_icon: 🎀
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tocraft"
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

# 🎀 To-Craft: <%- displayTitle %>

> [!todo] Opus (Horizon 0)
> **Action:** <%- displayTitle %>
> **Deadline:** `<%- deadline %>`
> **Actor:** `<%- persona %>`

## 🎨 Vision & Design
- [ ] Sketch / Draft: <%- displayTitle %>
- [ ] Define Final Aesthetic

## 🛠️ Materialia & Tools
- [ ] 
- [ ] 

## 🏗️ Proximus Gradus (Next Step)
- [ ] Start Execution: <%- displayTitle %>
- [ ] Quality Review



---
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>