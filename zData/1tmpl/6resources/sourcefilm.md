<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let luhmannId = (tp.variables && tp.variables.luhmannId) ? tp.variables.luhmannId : "R" + tp.date.now("YYYYMMDDHHmm");
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎬 Film Name?", "");
}
if (!title || title.trim() === "") title = "Film-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. FOLDER-BOT (Film Cover)
const coverFolder = "xAttachment/Cover/Filmcover";
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

if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Cover Filename (without .jpg)?", cleanName + "-cover");
    pureCover = manual ? `${coverFolder}/${manual}.jpg` : "";
}

// 🔱 5. STYLE & GENRE SELECTION
const sOpt = ["🎬 Realfilm", "🎨 Animation", "🇯🇵 Anime", "🎭 Theater/Musical", "🎥 Doku", "[+] custom..."];
const sVal = ["Realfilm", "Animation", "Anime", "Theater", "Documentary", "custom"];
let style = await tp.system.suggester(sOpt, sVal);
if (style === "custom") style = await tp.system.prompt("✨ Style Name?");

const gOptions = ["💥 Action", "😹 Comedy", "🎭 Drama", "🚀 Sci-Fi", "🐉 Fantasy", "👻 Horror", "🕵️ Thriller", "💖 Romance", "[+] Custom..."];
let genre = await tp.system.suggester(gOptions, gOptions);
if (genre === "[+] Custom...") genre = await tp.system.prompt("Genre?");

// 🔱 6. ADDITIONAL METADATA
let vol = await tp.system.prompt("🔢 Volume / Part?", "1") || "1";
let volTitle = await tp.system.prompt("🏷️ Name of this Part / Subtitle? (optional)", "") || "";

let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(film-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_y: 0.4
banner_icon: 🎬
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/film"
science:
discipline:
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
original_title: ""
author: ""
director: ""
publisher: ""
pub_date: ""
actors: ""
genre:
  - "<%- genre %>"
style: "<%- style %>"
plattform: ""
# 🔱 Dynamic Details
volume: <%- vol %>
volume_title: "<%- volTitle %>"
volume_max:
---

# 🎬 Film: <%- luhmannId %> <%- displayTitle %>

> [!reference] Cineastische Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> | **Part:** `$= dv.current().volume` `$= dv.current().volume_title ? '- ' + dv.current().volume_title : ''`
> > > 
> > > **Director:** 
> > > `INPUT[inlineList:director]`
> > > 
> > > **Cast:**
> > > `INPUT[inlineList:actors]`
> > > 
> > > **Genre:**
> > > `INPUT[inlineList:genre]`
> > > 
> > > **Style:** `$= dv.current().style`

<%- tp.file.include("[[zData/3snippets/sortName.md]]") %>

## 🎞️ Analyse & Notizen
- 


## 🍿 Review & Notes




---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
