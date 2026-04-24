<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
let sci = tp.variables.sciTag || tp.variables.sci || "#science";
let disc = tp.variables.discTag || tp.variables.disc || "#disc";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📃 Paper Title?", "");
}
if (!title || title.trim() === "") title = "Paper-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. FOLDER-BOT (Paper cover folder safety)
const coverFolder = "xAttachment/Cover/Papercover";
let current = "";
for (const seg of coverFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}

// 🔱 4. AUTO-COVER SCAN
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let finalImgName = `${cleanName}-cover.jpg`;
let potentialPath = `${coverFolder}/${finalImgName}`;
let pureCover = app.vault.getAbstractFileByPath(potentialPath) ? potentialPath : "";

// If not found, optional prompt:
if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Cover Filename (without .jpg)?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
}

// 🔱 5. SMART AUTHOR LOGIC (Fixed variables!)
let rawCreator = await tp.system.prompt("✍️ First Author (Firstname Lastname)?", "Unknown");
let creatorSort = rawCreator; 

if (rawCreator && rawCreator.includes(" ") && rawCreator !== "Unknown") {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

// 🔱 6. DOI & CLEANING
let doi = await tp.system.prompt("🧬 DOI Number?", "10.xxxx/xxxx");
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(paper-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 📃
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/paper"
status:
  - "1active"
priority:
  - "1"
persona:
creator: "<%- rawCreator %>"
creator-sort: "<%- creatorSort %>"
doi: "<%- doi %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
subject: ""
plattform: ""
publisher:
pub-date:
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

# 📃 Paper: <%- luhmannId %> <%- displayTitle %>

> [!reference] Academic Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Science:** `$= dv.current().science`
> > > 
> > > **Author:** `$= dv.current().creator` 
> > > 
> > > **DOI:** [Link via DOI](https://doi.org/<%- doi %>)








---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
