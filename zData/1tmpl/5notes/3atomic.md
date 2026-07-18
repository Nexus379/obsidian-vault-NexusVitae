<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc";
const icon = tp.variables.icon || "🗃️";
const luhmannId = tp.variables.luhmannId || "";
const p1 = tp.date.now("YYYY-MM-DD", 1); // first SRS session = tomorrow (prime-chain seed)

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Your atomic note?", "");
}
if (!title || title.trim() === "") title = "Atomic-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING (displayTitle statt dTitle!)
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(atomic-|n-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/office-supplies.jpg]]"
banner_y: 0.4
banner_icon: 🗃️
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/3atomic"
status: 1active
priority:
  - "1"
persona: "student"
space_lvl: 0
space_rank: "Ground Crew (Sprout)"
space_date: <%- p1 %>
lastgrade: 0
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🗃️ <%- luhmannId %>  <%- displayTitle %>

> [!abstract] Elementum (Atomic Fact)
> Cluster: <%- sci %> | Discipline: <%- disc %>
> > **Phase:** `INPUT[suggester(option(0blueprint, 📝 Blueprint), option(1research, 🔍 Research), option(3investing, ⏳ Investing), option(4polish, ✨ Polish), option(5finish, 🏁 Finish)):explore_lvl]`

## 🗂️ Active Recall (Questio / Responsio)
> [!question] **Questio:**
> 
> [!success]- **Responsio:**
> 

## 🔗 Struktur-Kontext (LID-Automatik)
- **Parent:** <%- pLink %>
- **Siblings:** `$= dv.list(dv.pages("#5note").filter(p => p.LID && p.LID.length === dv.current().LID.length && p.LID.startsWith(dv.current().LID.slice(0,-1)) && p.file.name != dv.current().file.name).file.link)`
- **Children:** `$= dv.list(dv.pages("#5note").filter(p => p.LID && p.LID.length > dv.current().LID.length && p.LID.startsWith(dv.current().LID)).file.link)`

---

> [!info] 🛡️ Nexus Progression (Prime-Chain SRS)
> **Rank:** `VIEW[{space_rank}]` `$= const icons = ["🌱","🌿","🍀","⚓","🖖","🎖️","🚢","🏛️","📡","🛰️","☄️","🌌","🛸","👁️","🌀","✨","🎭","🔱","💎","👑","🌟","🪐","🌠","🌌"]; const lvl = dv.current().space_lvl || 0; dv.span(icons[Math.min(lvl, icons.length-1)] + " **Level " + lvl + "**")`
> 🔥 **Next Session:** `VIEW[{space_date}]`
> 
> `BUTTON[spaced]`

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
