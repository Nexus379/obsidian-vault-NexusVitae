<%-*
// 🔱 1. NEXUS-DATA-SYNC
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = tp.variables.title || tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// FALLBACK: Falls du im Ordner auf "Neue Notiz" klickst (Untitled Check)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
	    title = await tp.system.prompt("🏫 Class/Subject Name?", "");
}
if (!title) title = "Class-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

let sci = tp.variables.sciTag || "#science";
let disc = tp.variables.discTag || "#disc";

// 🔱 3. CLASS SPECIFIC PROMPTS
let room = await tp.system.prompt("📍 Room / Floor?", "Online") || "Online";

let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(class-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 🏫
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/class"
status:
  - 1active
priority:
  - "1"
persona:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
# 🔱 Meta Bind Texts (Use comma separation for multiple entries)
author: ""
original_title: ""
publisher: ""
pub_date: ""
# 🔱 Dynamic Details
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
subject:
- "<%- room %>"
---

# 🏫 Class: <%- luhmannId %> <%- displayTitle %>

> [!reference] Class Details
> **ID:** <%- luhmannId %> 
> 
> **Teacher:** 
> `INPUT[inlineList:author]` 
> 
> **Discipline:** `$= dv.current().discipline`
> 
>  **Science:** `$= dv.current().science`
> 
> **Subject:** `$= dv.current().subject`

<%- tp.file.include("[[zData/3snippets/sortName.md]]") %>

## 📝 Mitschrift
- 



---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
