<%-*
// 🔱 1. DATA-SYNC & CRASH PROTECTION
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let title = tp.variables.title || tp.file.title;
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let pLink = tp.variables.pLink || "";

// FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📚 Reference Name?", "");
}
if (!title || title.trim() === "") title = "Reference-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// Inherit scientific data from resourcesPrompt
let sci = tp.variables.sciTag || tp.variables.sci || "#science";
let disc = tp.variables.discTag || tp.variables.disc || "#disc";
let sub = tp.variables.subText || tp.variables.sub || "";

// 🔱 2. AUTO-COVER SCAN (Reference-Edition)
const coverFolder = "xAttachment/Cover/Referencecover";
let current = "";
for (const seg of coverFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let pureCover = app.vault.getAbstractFileByPath(`${coverFolder}/${cleanName}-cover.jpg`) ? `${coverFolder}/${cleanName}-cover.jpg` : "";

if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Reference Image Filename (no .jpg)?", cleanName + "-cover");
    pureCover = manual ? `${coverFolder}/${manual}.jpg` : "";
}

// 🔱 3. AUTHOR LOGIC
let rawCreator = await tp.system.prompt("✍️ Author / Professor / Editor?", "Unknown") || "Unknown";
let creatorSort = rawCreator;
if (rawCreator && rawCreator.includes(" ") && rawCreator !== "Unknown") {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(ref-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 📘
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/reference"
status:
  - 1active
priority:
  - "1"
persona:
creator: "<%- rawCreator %>"
creator-sort: "<%- creatorSort %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
genre:
  - "Reference"
subject: "<%- sub %>"
plattform: ""
publisher:
pub-date:
volume:
volume-max:
chapter: ""
rating:
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 📚 Reference: <%- luhmannId %> <%- displayTitle %>

> [!reference] Academic Resource Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Author:** `$= dv.current().creator`
> > > 
> > > **Science:** <%- sci %>
> > > 
> > > **Discipline**: <%- disc %>

## 📑 Core Theses & Research Notes
- 





---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
