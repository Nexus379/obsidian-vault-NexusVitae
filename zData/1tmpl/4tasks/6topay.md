<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "organizer";
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD", 3);

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("💵 To-Pay: Invoice/Bill", "");
}
if (!title || title.trim() === "") title = "Pay-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 Contact (Person/Company)?", "Name");
let amount = await tp.system.prompt("💰 Estimated Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 3. CLEANING (Entfernt Trigger wie 6topay- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(6topay-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/study, blau.jpg]]"
banner_icon: 💵
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/topay"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
amount: <%- amount %>
payee: "<%- payee %>"
account: "<%- account %>"
flow: "out"
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
# 💵 To-Pay: <%- displayTitle %>

- [ ] Bill: <%- displayTitle %> 💳 Link/App: 






---
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>