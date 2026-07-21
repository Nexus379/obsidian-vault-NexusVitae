<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "healer";
const area = tp.variables.currentArea || tp.variables.area || "#2area/1selfcare";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD");

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🍜 To-Cook: What are you creating?", "");
}
if (!title || title.trim() === "") title = "Cook-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING (Entfernt Trigger wie 7tocook- oder t-)
let displayTitle = title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(7tocook-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/grocery green.jpg]]"
banner_icon: 🍜
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tocook"
status: "1active"
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
# 🍜 To-Cook: <%- displayTitle %>

> [!todo] Short-term Execution (Horizon 0)
> > [!multi-column]
> > > [!blank|wide-5]
> > > **Action:** <%- displayTitle %>
> > > **Project:** <%- pLink || "None" %>
> > > **Deadline:** `<%- deadline %>` 
> > > **Persona:** `<%- persona %>`
> > 
> > >[!blank|wide-0]
> > > **Inbox:** `INPUT[toggle:inbox]`
> > > **Status:**
> > > `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]`


- [ ] Meal: <%- displayTitle %> 🥬 Ingredients: 









---
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>