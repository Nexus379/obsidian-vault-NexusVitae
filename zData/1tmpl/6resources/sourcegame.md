<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🕹️ Game Name?", "");
}
if (!title || title.trim() === "") title = "Game-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. STYLE-SELECTION (Gaming Styles)
const sOpt = ["🔥 AAA-Blockbuster", "🎨 Indie", "👾 Retro (8/16-Bit)", "🌐 MMO / Live-Service", "📱 Mobile", "[+] Custom Style..."];
const sVal = ["AAA", "Indie", "Retro", "Live-Service", "Mobile", "custom"];
let style = await tp.system.suggester(sOpt, sVal);
if (style === "custom") style = await tp.system.prompt("Style Name?");
if (!style) style = "AAA";

// 🔱 4. HIERARCHICAL FOLDER-BOT (Path: Cover/Game/Style)
const coverFolder = `xAttachment/Cover/Game/${style}`;
let current = "";
for (const seg of coverFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}

// 🔱 5. AUTO-COVER SCAN
let cleanName = title.toLowerCase().replace(/\s+/g, ""); 
let finalImgName = `${cleanName}-cover.jpg`;
let potentialPath = `${coverFolder}/${finalImgName}`;
let pureCover = app.vault.getAbstractFileByPath(potentialPath) ? potentialPath : "";
if (!pureCover) {
    let manual = await tp.system.prompt("🖼️ Game Cover Filename (without .jpg)?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
}

// 🔱 6. PLATFORM & GENRE
const pOptions = ["Steam", "Nintendo Switch", "PlayStation 5", "Xbox Series X", "Mobile", "Emulator", "[+] Custom..."];
let plat = await tp.system.suggester(pOptions, pOptions);
if (plat === "[+] Custom...") plat = await tp.system.prompt("Platform?");
if (!plat) plat = "PC";

const gOptions = ["Action-Adventure", "RPG", "Soulslike", "FPS", "Simulation", "Strategy", "Horror", "Puzzle", "[+] Custom..."];
let genre = await tp.system.suggester(gOptions, gOptions);
if (genre === "[+] Custom...") genre = await tp.system.prompt("Genre?");
if (!genre) genre = "General";

// 🔱 7. PROGRESS LOGIC (ASCII Bar)
let prog = await tp.system.prompt("📊 Progress (0-100%)?", "0");
let p = parseInt(prog) || 0;
let bar = "░░░░░░░░░░ 0%";
if (p >= 100) bar = "✅ 100% Completed";
else if (p >= 90) bar = "█████████░ 90%";
else if (p >= 80) bar = "████████░░ 80%";
else if (p >= 70) bar = "███████░░░ 70%";
else if (p >= 60) bar = "██████░░░░ 60%";
else if (p >= 50) bar = "█████░░░░░ 50%";
else if (p >= 40) bar = "████░░░░░░ 40%";
else if (p >= 30) bar = "███░░░░░░░ 30%";
else if (p >= 20) bar = "██░░░░░░░░ 20%";
else if (p >= 10) bar = "█░░░░░░░░░ 10%";

// 🔱 8. STUDIO & DIRECTOR
let playtime = await tp.system.prompt("🕒 Playtime (Hours)?", "0");
let studio = await tp.system.prompt("🏢 Developer Studio?", "Unknown");
let rawDir = await tp.system.prompt("🎬 Game Director?", "Unknown");
let dirSort = rawDir;
if (rawDir && rawDir.includes(" ")) {
    let parts = rawDir.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    dirSort = lastName + ", " + firstName;
}

// 🔱 9. TITLE CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(game-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Minecraft Discord Banner_ Craft Your Community - Best Wallpaper HD.jpg]]"
banner_y: 0.6
banner_icon: 🕹️
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/game"
status:
  - "1active"
priority:
  - "1"
persona:
creator:
director: "<%- rawDir %>" 
director-sort: "<%- dirSort %>"
publisher: "<%- studio %>"
genre:
  - "<%- genre %>"
style: "<%- style %>"
plattform: 
  - "<%- plat %>"
progress: <%- p %>
progressBar: "<%- bar %>"
playtime: <%- playtime %>
pub-date:
volume:
volume-max:
chapter: ""
difficulty:
rating:
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🕹️ Game: <%- luhmannId %> <%- displayTitle %>


> [!terminal] System Status
> **Progress:** `$= const p = dv.current().progress; const filled = Math.round(p / 10); "🎮".repeat(filled) + "⏺️".repeat(10 - filled) + " **" + p + "%**"`
> 
> **Playtime:** <%- playtime %>h 
> 
> **Platform:** <%- plat %>
> 
> **Developer:** <%- studio %> 
> 
> **Style:** <%- style %>


## ⚔️ Quests & Milestones
- [ ] Main Story
- [ ] Side Quests
- [ ] Platinum / 100%




---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>