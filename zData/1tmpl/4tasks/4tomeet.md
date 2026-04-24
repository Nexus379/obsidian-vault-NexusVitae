<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD");

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📅 To-Meet: Who/What/Where?", "");
}
if (!title || title.trim() === "") title = "Meet-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. MEETING SPECIFICS
let attendees = await tp.system.prompt("👥 Attendees?", "Self/Others");
let location  = await tp.system.prompt("📍 Location?", "Discord/Office/Home");

// Prompts absichern, falls man einfach ESC drückt
if (!attendees) attendees = "we";
if (!location) location = "idk";

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(4tomeet-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Symbolfoto-Daten-3499-detailpp.jpeg]]"
banner_y: 0.5
banner_icon: 📅
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tomeet"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
attendees: "<%- attendees %>"
location: "<%- location %>"
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
parent: "<%- pLink %>"
---

# 📅 To-Meet: <%- displayTitle %>

> [!info] Appointment (Horizon 0)
> **Action:** <%- displayTitle %>
> 
> **Location:** `<%- location %>` 
> 
> **With:** `<%- attendees %>`
>
> **Deadline/Time:** `<%- deadline %>`

## 🕒 Details
- [ ] <%- displayTitle %> | 🕒 Time: 



**System Action:**
[[n-lit|+ Create Protocol]] | [[t-todo|+ Follow-up Task]] 
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>