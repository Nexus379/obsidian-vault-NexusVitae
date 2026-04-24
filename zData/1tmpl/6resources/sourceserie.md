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

// 🔱 2. STYLE-SELECTION (Erweitert)
const sOpt = ["🎬 Live-Action", "🧧 Anime", "✍️ Animation", "🎮 CGI / 3D", "🎥 Documentary", "[+] Neuer Stil..."];
const sVal = ["Live-Action", "Anime", "Animation", "CGI-3D", "Documentary", "custom"];
let style = await tp.system.suggester(sOpt, sVal);
if (style === "custom") style = await tp.system.prompt("Stil Name?");
if (!style) style = "Live-Action";

// 🔱 3. HIERARCHISCHER FOLDER-BOT (Pfad: Cover/Serie/Stil)
const coverFolder = `xAttachment/Cover/Serie/${style}`;
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
    let manual = await tp.system.prompt("🖼️ Poster Filename?", cleanName + "-cover");
    pureCover = `${coverFolder}/${manual}.jpg`;
}

// 5. 🔱 GENRE-SELECTION (Style-aware)
let gOptions = ["Action", "Sci-Fi", "Thriller", "Comedy", "Drama", "Horror", "Adventure", "Classic"];
if (style === "Anime") { gOptions = ["Shonen", "Seinen", "Shojo", "Isekai", "Slice of Life", "Mecha", "Fantasy"]; }
gOptions.push("[+] Custom...");
let genre = await tp.system.suggester(gOptions, gOptions);
if (genre === "[+] Custom...") genre = await tp.system.prompt("Genre?");

// 6. 🔱 PROGRESS LOGIC (Current Season & Episodes)
let vol = await tp.system.prompt("❄️ Current Season (Volume)?", "1");
let epNow = await tp.system.prompt("📺 Episode Now?", "1");
let epMax = await tp.system.prompt("🏁 Episode Max (this Season)?", "12");
let p = Math.round((parseInt(epNow) / parseInt(epMax)) * 100);
let bar = "░░░░░░░░░░ 0%";
if (p >= 100) bar = "✅ Completed";
else if (p >= 90) bar = "█████████░ 90%";
else if (p >= 80) bar = "████████░░ 80%";
else if (p >= 70) bar = "███████░░░ 70%";
else if (p >= 60) bar = "██████░░░░ 60%";
else if (p >= 50) bar = "█████░░░░░ 50%";
else if (p >= 40) bar = "████░░░░░░ 40%";
else if (p >= 30) bar = "███░░░░░░░ 30%";
else if (p >= 20) bar = "██░░░░░░░░ 20%";
else if (p >= 10) bar = "█░░░░░░░░░ 10%";

// 7. 🔱 SMART LOGIC (Director & Author Sort)
let rawDir = await tp.system.prompt("🎬 Director / Creator?", "Unknown");
let dirSort = rawDir;
if (rawDir.includes(" ")) {
    let parts = rawDir.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    dirSort = lastName + ", " + firstName;
}
let rawAuthor = await tp.system.prompt("✍️ Original Author?", "");
if (rawAuthor.includes(" ")) {
    let parts = rawAuthor.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    authorSort = lastName + ", " + firstName;
}

let company = await tp.system.prompt("🏢 Production Company / Studio?", "Unknown");
let cast = await tp.system.prompt("🎭 Cast (comma separated)?", "Unknown");

let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(serie-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/aesthetic-anime-character-gaming.jpg]]"
banner_y: 0.4
banner_icon: 🎞️
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/serie"
status:
  - "1active"
priority:
  - "1"
author: "<%- rawAuthor %>"
author-sort: "<%- authorSort %>"
director: "<%- rawDir %>" 
director-sort: "<%- dirSort %>"
actors: 
- <%- cast.split(',').map(s => `  - "${s.trim()}"`).join('\n') %>
style: "<%- style %>"
episode-now: <%- epNow %>
episode-max: <%- epMax %>
progress: <%- p %>
progressBar: "<%- bar %>"
volume: <%- vol %>
persona:
plattform: ""
original-title:
genre:
- "<%- genre %>"
publisher: "<%- company %>"
pub-date:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🎞️ Series: <%- luhmannId %> <%- displayTitle %>

> [!reference] Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > > 
> > >  **Progress:** `$= dv.current().progressBar`
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Season:** `$= dv.current().volume`
> > > 
> > > **Director:** `$= dv.current().director` 
> > >  
> > > **Stil:** `$= dv.current().style`
> > > 
> > >  **Genre:** `$= dv.current().genre`



## 📺 Season Overview


| Season | Progress | Episodes | Status |
| ------ | -------- | -------- | ------ |
| S<%- vol.padStart(2, '0') %> | <%- p %>% | <%- epNow %>/<%- epMax %> | 🍿 |

## 📝 Notes
- 

## 🎞️ Episode Log

| Season | Episode | Title/Note | Date |
| ------- | ----- | ----------- | ----- |
| <%- vol %> | <%- epNow %> | | <%- tp.date.now("YYYY-MM-DD") %> |









---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

