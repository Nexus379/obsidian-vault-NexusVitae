<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "💵"; // Feste Verankerung für Pro-Pay

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("💵 Pro-Pay: Name of Payment?", "");
}
if (!title) title = "ProPay-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 Contact (Person/Company)?", "Name");
let amount = await tp.system.prompt("💰 Estimated Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 4. CLEANING & DEADLINE
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(6propay-|p-|3project-)/i, "").trim();
let deadline = tp.date.now("YYYY-MM-DD", 5);

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Payments-Blog.png]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/propay"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
due: <%- deadline %>
amount: <%- amount %>
payee: "<%- payee %>"
account: "<%- account %>"
flow: "out"
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

> [!caution] Financial Execution (Horizon 1)
> **Parent Goal/Star:** <%- pLink %>
> **Contact:** `<%- payee %>` 
> **Amount**: `<%- amount %>`
> **Account:** `<%- account %>` 
> **Due:** `<%- deadline %>`

---

## 💸 Payment Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Payment Milestones
> > - [ ] **M1:** Verify invoice
> > - [ ] **M2:** Execute transfer via `<%- account %>`
> > - [ ] **M3:** File receipt
>
> > [!abstract|wide-1] Context & Details
> > **Reference / Invoice No:**
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
