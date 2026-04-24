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
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let finalImgName = `${cleanName}-cover.jpg`;
let potentialPath = `${coverFolder}/${finalImgName}`;
let pureCover = app.vault.getAbstractFileByPath(potentialPath) ? potentialPath : "";

if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Cover Filename (without .jpg)?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
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

// 🔱 7. SMART LOGIC (Designer)
let rawCreator = await tp.system.prompt("✍️ Game Designer?", "Unknown");
let creatorSort = rawCreator;
if (rawCreator && rawCreator.includes(" ") && rawCreator !== "Unknown") {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

let publisher = await tp.system.prompt("🏢 Publisher?", "Unknown");

// 🔱 8. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(boardgame-|bg-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_y: 0.4
banner_icon: 🎲
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/boardgame"
status:
  - "1active"
priority:
  - "1"
persona:
creator: "<%- rawCreator %>"
creator-sort: "<%- creatorSort %>"
publisher: "<%- publisher %>"
genre:
  - "<%- genre %>"
players: "<%- players %>"
playtime: <%- playtime %>
weight:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🎲 Boardgame: <%- luhmannId %> <%- displayTitle %>

> [!reference] Game Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Designer:** `$= dv.current().creator`
> > > 
> > > **Players:** `$= dv.current().players` | **Time:** `$= dv.current().playtime` min
> > > 
> > > **Mechanic:** `$= dv.current().genre`

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