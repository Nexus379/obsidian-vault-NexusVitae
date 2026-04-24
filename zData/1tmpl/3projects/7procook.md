<%-*
// 🔱 1. NEXUS-DATA-SYNC (Inherit from Router/Prompt)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = "🍜"; // Feste Verankerung für Pro-Cook

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🍜 Pro-Cook: What are you creating?", "");
}
if (!title) title = "ProCook-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. COOK SPECIFICS (Amount bleibt für Ernährung frei!)
let merchant = await tp.system.prompt("🛒 Grocery Store / Merchant?", "Local Market/Supermarket");
let cost     = await tp.system.prompt("💰 Estimated Cost (Money)?", "0.00");
let amount   = await tp.system.prompt("⚖️ Amount (Nutrition/Portions)?", "1 Portion");
let deadline = await tp.system.prompt("📅 Cooking Date?", tp.date.now("YYYY-MM-DD"));

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(7procook-|p-|3project-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Tisch grün obst gempse.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#3project"
archtype:
  - "#3project/procook"
status: <%- tp.variables.projectStatus || "1active" %>
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
area2: "<%- area %>"
merchant: "<%- merchant %>"
cost: <%- cost %>
amount: "<%- amount %>"
due: <%- deadline %>
cal0:
stars1:
project3:
task4:
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# <%- icon %> <%- displayTitle %>

> [!abstract] Focus: Culinary Execution (Horizon 1)
> **Parent Goal/Star:** <%- pLink %>
> **Date:** `<%- deadline %>` | **Cost:** `<%- cost %>`
> **Merchant:** `<%- merchant %>` | **Amount:** `<%- amount %>`

---

## 🥗 Recipe Blueprint

> [!multi-column]
>
> > [!todo|wide-1] Cooking Milestones
> > - [ ] **M1:** Ingredient check & Shopping at `<%- merchant %>`
> > - [ ] **M2:** Preparation & Cooking (Mise en Place)
> > - [ ] **M3:** Tasting & Documentation
>
> > [!info|wide-1] Context & Details
> > **Portion Size:** `<%- amount %>`
> > 
> > 
> > **Acting Persona:** `<%- persona %>`

## 🛠️ Workload / Pensum





---
**System Action:** [[t-todo|+ Create Task]] | [[n-lit|+ Create Recipe Note]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
