<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD", 7);

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK (Untitled / Folder-Templater)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🛒 To-Buy: What do you need?", "");
}
if (!title || title.trim() === "") title = "Buy-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 Contact (Person/Company)?", "Name");
let amount = await tp.system.prompt("💰 Estimated Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 3. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(5tobuy-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/japan-background-digital-art.jpg]]"
banner_icon: 💰
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tobuy"
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
# 💰 To-Buy: <%- displayTitle %>

> [!todo] Purchase Plan (Horizon 0)
> **Item:** <%- displayTitle %>
> **Deadline:** `<%- deadline %>`

- [ ] <%- displayTitle %>
💵 Budget: <%- amount %> € via <%- account %>




---
[[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>