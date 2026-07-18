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

// 🔱 3. SHOPPING PROMPTS
let amount = await tp.system.prompt("💰 Estimated Budget/Price?", "0.00");
let vendor = await tp.system.prompt("🛒 Vendor or Link?", "Amazon");
let deadline = await tp.system.prompt("📅 Acquisition Deadline?", tp.date.now("YYYY-MM-DD", 14)) || tp.date.now("YYYY-MM-DD", 14);

// 🔱 4. CLEANING
let displayTitle = (tp.variables && tp.variables.displayTitle) ? tp.variables.displayTitle : title.replace(/^[a-z0-9.]+ /i, "").replace(/^(5probuy-|p-|3project-)/i, "").trim();

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
status: "<%- tp.variables.projectStatus || '1active' %>"
priority:
  - "3"
due: <%- deadline %>
amount: <%- amount %>
vendor: "<%- vendor %>"
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

> [!info] Focus: Acquisition & Research (Horizon 1)
> > [!multi-column]
> > > [!blank|wide-5]
> > > **Parent Goal/Star:** <%- pLink %>
> > > 
> > > **Deadline:** `<%- deadline %>`   (Target: 14 days)
> > 
> > >[!blank|wide-0]
> > > **Status:**
> > > `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]`

- 💵 Price: `INPUT[number:amount]` € at <%- vendor %>

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
> > **Tracking-Number:** 
> > 
> > **Delivery Date:** 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
