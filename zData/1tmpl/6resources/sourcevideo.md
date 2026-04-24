<%-*
// 🔱 1. DATA-SYNC & CRASH PROTECTION
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("💻 Video Name?", "");
}
if (!title || title.trim() === "") title = "Video-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(video-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 💻
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/video"
status:
  - "1active"
priority:
  - "1"
persona:
cover: ""
plattform: ""
author:
genre:
publisher:
pub-date:
url:
season-max: 1
season-now: 1
episode-now: 1
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 💻 Video: <%- luhmannId %> <%- displayTitle %>

> [!video] Stream
> **Channel:** ---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>