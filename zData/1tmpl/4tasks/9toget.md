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
    title = await tp.system.prompt("📥 To-Get: What value are you receiving?", "");
}
if (!title || title.trim() === "") title = "Get-" + tp.date.now("HH-mm");

// Physisches Umbenennen für Stabilität
if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. PURE GAIN PROMPTS
const gOptions = ["💼 Income / Salary", "🎁 Present / Gift", "🤝 Sponsorship / Grant", "🍀 Unexpected Windfall"];
const gValues  = ["income", "gift", "sponsor", "windfall"];
let gainType = await tp.system.suggester(gOptions, gValues, false, "✨ What kind of pure gain is this?") || "income";

// NEU: Item-Abfrage (nur wenn es ein Geschenk ist)
let item = "";
if (gainType === "gift") {
    item = await tp.system.prompt("🎁 What is the item/present?", "Description of the item");
}

// KORREKTUR: Die Systemvariable ist und bleibt 'payee'
let payee = await tp.system.prompt("👤 From whom (Payee/Source)?", "Name/Company");
let amount = await tp.system.prompt("💰 Expected Value/Amount?", "0.00");
let account = await tp.system.suggester(["🏦 Bank", "🔵 PayPal", "💵 Cash", "💎 Physical Asset (No Bank)"], ["Bank", "PayPal", "Cash", "Physical"]) || "TBD";

// 🔱 4. CLEANING (Entfernt Trigger wie 7toget- oder g-)
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7toget-|g-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/money.png]]"
banner_icon: 📥
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/toget"
gain_type: "<%- gainType %>"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
due: <%- deadline %>
amount: <%- amount %>
item: "<%- item %>"
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
# 📥 To-Get: <%- displayTitle %>

> [!success] Pure Gain (<%- gainType %>)
> **Source:** `<%- payee %>` | **Expected Value:** `<%- amount %> €`
<%- item !== "" ? "> **Item:** `" + item + "`\n" : "" -%>
> **Target Account/Asset:** `<%- account %>`

- [ ] Receive & Acknowledge: <%- displayTitle %> 

---
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>