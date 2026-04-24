<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🖼️ Museum/Exhibition/Work Name?", "");
}
if (!title || title.trim() === "") title = "Museum-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(museum-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 🖼️
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/museum"
status:
  - "1active"
priority:
  - "1"
persona:
cover: ""
location:
subject:
artist:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---
# 🖼️ Museum: <%- luhmannId %> <%- displayTitle %>

> [!palette] Cultural Resonance
> Analysis of aesthetics, era, and the emotional impact of the work.

## 🎨 Impressions
- 






---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>