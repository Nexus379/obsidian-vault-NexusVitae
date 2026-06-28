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
function coverSlug(name) {
    return String(name || "").trim()
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/['’]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase();
}
function coverCore(name) {
    return String(name || "").toLowerCase()
        .replace(/\.[^.]+$/, "")
        .replace(/[-_\s]*cover$/i, "")
        .replace(/[^a-z0-9]/g, "");
}
function findCover(folder, name) {
    const dir = app.vault.getAbstractFileByPath(folder);
    const target = coverCore(name);
    const exts = ["jpg", "jpeg", "png", "webp"];
    if (!dir || !dir.children) return "";
    const hit = dir.children.find(f => f.extension && exts.includes(f.extension.toLowerCase()) && coverCore(f.name) === target);
    return hit ? hit.path : "";
}

let cleanName = coverSlug(title); 
let pureCover = findCover(coverFolder, title);

// If not found, optional prompt:
if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Cover Filename (without .jpg)?", cleanName + "-cover");
    pureCover = manual ? `${coverFolder}/${manual}.jpg` : "";
}

// 🔱 5. DOI & CLEANING
let doi = await tp.system.prompt("🧬 DOI Number?", "10.xxxx/xxxx");
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(paper-|r-)/i, "").trim();

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
doi: "<%- doi %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
subject: ""
plattform: ""
chapter: ""
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
> > > **Author:** 
> > > `INPUT[inlineList:author]` 
> > > 
> > > **DOI:** [Link via DOI](https://doi.org/<%- doi %>)

<%- tp.file.include("[[zData/3snippets/sortName.md]]") %>

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
