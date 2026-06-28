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
    title = await tp.system.prompt("📥 Pro-Take: Source of Income?", "");
}
if (!title) title = "ProTake-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 From whom (Source)?", "Name/Company");
let amount = await tp.system.prompt("💰 Expected Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7protake-|p-|3project-)/i, "").trim();
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
  - "#3project/protake"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
due: <%- deadline %>
amount: <%- amount %>
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

> [!success] Financial Inflow (Horizon 1)
> **Source:** `<%- payee %>` | **Expected**: `<%- amount %>`
> **Account:** `<%- account %>` | **Target Date:** `<%- deadline %>`

---

## 📥 Revenue Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Collection Milestones
> > - [ ] **M1:** Send Invoice / Request
> > - [ ] **M2:** Confirm Receipt of Funds
> > - [ ] **M3:** Update Financial Overview
>
> > [!abstract|wide-1] Context & Details
> > **Reference No:**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>