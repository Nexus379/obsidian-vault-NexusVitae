<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "💰"; // Feste Verankerung für Pro-Buy

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("💰 Pro-Buy: What are you acquiring?", "");
}
if (!title) title = "ProBuy-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. FINANCIAL PROMPTS (Universal)
let payee = await tp.system.prompt("👤 Contact (Person/Company)?", "Name");
let amount = await tp.system.prompt("💰 Estimated Amount?", "0.00");
let account = await tp.system.suggester(["💳 Visa", "🔵 PayPal", "🏦 Bank", "💵 Cash"], ["Visa", "PayPal", "Bank", "Cash"]) || "TBD";

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(5probuy-|p-|3project-)/i, "").trim();

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
  - "#3project/probuy"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "3"
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

# <%- icon %> <%- displayTitle %>

> [!money] Focus: Acquisition & Research (Horizon 1)
> **Parent Goal/Star:** <%- pLink %>
> **Budget:** `<%- amount %>` 
> **Contact:** `<%- payee %>`
> **Deadline:** `<%- tp.date.now("YYYY-MM-DD", 7) %>`

---

## 🛒 Purchase Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Research & Comparison
> > - [ ] **R1:** Compare prices & reviews
> > - [ ] **R2:** Check compatibility/necessity
> > - [ ] **R3:** Final Decision & Order
>
> > [!abstract|wide-1] Order Details
> > **Tracking-Number:** > > 
> > 
> > **Delivery Date:** > > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
