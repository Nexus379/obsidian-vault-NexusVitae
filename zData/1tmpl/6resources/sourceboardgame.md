<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎲 Boardgame Name?", "");
}
if (!title || title.trim() === "") title = "Boardgame-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. FOLDER-BOT (Boardgame Cover)
const coverFolder = "xAttachment/Cover/Boardgame";
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

// 🔱 5. MECHANIC / GENRE SELECTION
const gOptions = ["♟️ Strategy", "🃏 Deckbuilder", "👷 Worker Placement", "🤝 Co-op", "🗺️ Area Control", "🎲 Party / Family", "🐉 RPG / Campaign", "🧩 Puzzle", "[+] Custom..."];
const gValues = ["Strategy", "Deckbuilder", "Worker-Placement", "Co-op", "Area-Control", "Party", "Campaign", "Puzzle", "custom"];
let genre = await tp.system.suggester(gOptions, gValues);
if (genre === "custom") genre = await tp.system.prompt("✨ Main Mechanic / Genre?");
if (!genre) genre = "Boardgame";

// 🔱 6. BOARDGAME SPECIFICS
let players = await tp.system.prompt("👥 Player Count (e.g. 1-4)?", "1-4");
let playtime = await tp.system.prompt("⏳ Playtime in minutes?", "60");

// 🔱 7. ADDITIONAL METADATA
let vol = await tp.system.prompt("🔢 Expansion / Volume?", "") || "";
let volTitle = await tp.system.prompt("🏷️ Subtitle / Expansion Name?", "") || "";

// 🔱 8. TITLE CLEANING
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(boardgame-|bg-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_y: 0.4
banner_icon: 🎲
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/boardgame"
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
genre:
  - "<%- genre %>"
players: "<%- players %>"
# 🔱 Dynamic Details
playtime: <%- playtime %>
weight:
volume: <%- vol %>
volume_title: "<%- volTitle %>"
---

# 🎲 Boardgame: <%- luhmannId %> <%- displayTitle %>

> [!reference] Game Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> `$= dv.current().volume ? '| **Expansion:** ' + dv.current().volume : ''` `$= dv.current().volume_title ? '- ' + dv.current().volume_title : ''`
> > > 
> > > **Designer:** `$= dv.current().author`
> > > 
> > > **Genre:** `$= dv.current().genre`
> > > 
> > > **Players:** `$= dv.current().players` | **Playtime:** `$= dv.current().playtime` min

<%- tp.file.include("[[zData/3snippets/sortName.md]]") %>

## ⚔️ Setup & Rules Notes
- 


## 🏆 Play Sessions & Scores

| Date | Players | Winner | Score | Notes |
| ---- | ------- | ------ | ----- | ----- |
| <%- tp.date.now("YYYY-MM-DD") %> | | | | |


---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
