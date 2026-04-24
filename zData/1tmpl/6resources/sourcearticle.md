<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

// Takes the ID from the prompt, or generates one as a fallback
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🗞️ Article Name / Title?", "");
}
if (!title || title.trim() === "") title = "Article-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
   await tp.file.rename(title);
   await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// Taxonomy from the prompt
let sci = tp.variables.sciTag || tp.variables.sci || "#science";
let disc = tp.variables.discTag || tp.variables.disc || "#disc";

// 🔱 2. FOLDER-BOT (Article Cover)
const coverFolder = "xAttachment/Cover/Articlecover";
let current = "";
for (const seg of coverFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}

// 🔱 3. AUTO-COVER SCAN
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let finalImgName = `${cleanName}-cover.jpg`;
let potentialPath = `${coverFolder}/${finalImgName}`;
let pureCover = app.vault.getAbstractFileByPath(potentialPath) ? potentialPath : "";

if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Article Cover Filename?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
}

let creator = await tp.system.prompt("✍️ Author / Creator?", "Unknown");
let url = await tp.system.prompt("🔗 URL?", "https://");

// 🔱 4. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(article-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 🗞️
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/article"
status: 1active
priority:
  - "1"
persona:
creator: "<%- creator %>"
original-title:
genre:
url: "<%- url %>"
publisher:
pub-date:
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
subject: ""
plattform: ""
rating:
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🗞️ <%- luhmannId %> <%- displayTitle %>

> [!reference] Article Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Author:** `$= dv.current().creator`
> > > 
> > > **Science:** `$= dv.current().science`
> > >  
> > > **Discipline:** `$= dv.current().discipline`





---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
