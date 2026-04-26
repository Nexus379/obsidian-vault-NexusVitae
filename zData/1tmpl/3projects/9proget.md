<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "alchemist"; 
const area = tp.variables.currentArea || tp.variables.area || "4_Organize";
const icon = "📥"; 

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📥 Pro-Get: What pure gain project are you starting?", "");
}
if (!title) title = "ProGet-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. PURE GAIN PROMPTS (Project Level)
const gOptions = ["💼 Revenue Stream / Contract", "🤝 Sponsorship / Grant", "🎁 Large Present / Inheritance", "🍀 Unexpected Windfall"];
const gValues  = ["income", "sponsor", "gift", "windfall"];
let gainType = await tp.system.suggester(gOptions, gValues, false, "✨ What kind of pure gain project is this?") || "income";

// Item-Abfrage (sinnvoll bei Geschenken oder Sach-Sponsoring)
let item = "";
if (gainType === "gift" || gainType === "sponsor") {
    item = await tp.system.prompt("🎁/🤝 What is the item/asset? (Leave blank if pure money)", "");
}

// WICHTIG: Hier nutzen wir deine exakte Variable 'payee'
let payee = await tp.system.prompt("👤 From whom (Payee/Giver)?", "Name/Company");
let amount = await tp.system.prompt("💰 Expected Value/Amount?", "0.00");
let account = await tp.system.suggester(["🏦 Bank", "🔵 PayPal", "💵 Cash", "💎 Physical Asset"], ["Bank", "PayPal", "Cash", "Physical"]) || "TBD";

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7proget-|g-|p-|3project-)/i, "").trim();
let deadline = tp.date.now("YYYY-MM-DD", 7);

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/money.png]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/proget"
gain_type: "<%- gainType %>"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
due: <%- deadline %>
amount: <%- amount %>
item: "<%- item %>"
payee: "<%- payee %>"
account: "<%- account %>"
flow: "in"
area2: "<%- area %>"
cal0:
stars1:
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

# <%- icon %> <%- displayTitle %>

> [!success] Pure Gain Project (Horizon 1) - <%- gainType %>
> **From (Payee):** `<%- payee %>` | **Expected**: `<%- amount %> €`
<%- item !== "" ? "> **Asset/Item:** `" + item + "`\n" : "" -%>
> **Account/Target:** `<%- account %>` | **Target Date:** `<%- deadline %>`

---

## 📥 Revenue Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Collection Milestones
> > - [ ] **M1:** Send Request / Provide Info
> > - [ ] **M2:** Confirm Receipt of Value
> > - [ ] **M3:** Update Financial Overview / Assets
>
> > [!abstract|wide-1] Context & Details
> > **Reference No / Contact:**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>