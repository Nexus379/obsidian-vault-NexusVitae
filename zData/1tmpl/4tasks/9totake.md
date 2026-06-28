<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {};
const persona = tp.variables.persona || "alchemist"; 
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";
const deadline = tp.variables.deadline || tp.date.now("YYYY-MM-DD", 3);

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled / Folder-Templater Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📥 To-Take: What are you receiving?", "");
}
if (!title || title.trim() === "") title = "Take-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 From whom (Source)?", "Name/Company");
let amount = await tp.system.prompt("💰 Expected Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 4. CLEANING (Entfernt Trigger wie 7totake- oder t-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7totake-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/money.png]]"
banner_icon: 📥
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/totake"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
amount: <%- amount %>
payee: "<%- payee %>"
account: "<%- account %>"
flow: "in"
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
# 📥 To-Take: <%- displayTitle %>

> [!success] Income Task (Horizon 0)
> **Source:** `<%- payee %>` | **Expected:** `<%- amount %> €`
> **Target Account:** `<%- account %>`

- [ ] Receive: <%- displayTitle %> 💰 Amount: <%- amount %>

---
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>