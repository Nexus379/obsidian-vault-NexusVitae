<%-*
// 🔱 1. NEXUS-DATA-SYNC
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = tp.variables.title || tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// FALLBACK: Falls du im Ordner auf "Neue Notiz" klickst (Untitled Check)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
	    title = await tp.system.prompt("🎞️ Series Name?", "");
}
if (!title) title = "Series-" + tp.date.now("HH-mm");

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
if (!genre) genre = "Unknown"; // Fallback, falls weggedrückt

// 6. 🔱 PROGRESS LOGIC (Current Season & Episodes mit Fallback)
let vol = await tp.system.prompt("❄️ Current Season (Volume)?", "1");
if (!vol) vol = "1"; // Fallback auf Staffel 1

let epNow = await tp.system.prompt("📺 Episode Now?", "1");
if (!epNow) epNow = "1"; // Fallback auf Folge 1

let epMax = await tp.system.prompt("🏁 Episode Max (this Season)?", "12");
if (!epMax) epMax = "12"; // Fallback auf 12 Folgen

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
progress: <%- p %>
progressBar: "<%- bar %>"
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
# 🔱 Dynamic Season Tracking
season: <%- vol %>
episode: <%- epNow %>
ep_rating: 0
s<%- vol %>_max: <%- epMax %>

---

# 🎞️ Series: <%- luhmannId %> <%- displayTitle %>

> [!reference] Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > > 
> > > **Season:** `INPUT[number:season]`
> > > **Episode:** `INPUT[number:episode]` 
> > >**Rating:** `INPUT[suggester(option(0, "➖ noch nicht bewertet"), option(1, "⭐ 1"), option(2, "⭐⭐ 2"), option(3, "⭐⭐⭐ 3"), option(4, "⭐⭐⭐⭐ 4"), option(5, "⭐⭐⭐⭐⭐ 5")):ep_rating]`
> > > `BUTTON[add-episode]` 
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > **Style:** `INPUT[suggester(option("🎬 Live-Action"), option("🧧 Anime"), option("✍️ Animation"), option("🎮 CGI-3D"), option("🎥 Documentary")):style]`
> > > 
> > > **Genre:**
> > > `INPUT[text:genre]`
> > > **Director:**
> > > `INPUT[text:director]`
> > > **Cast:**
> > > `INPUT[text:actors]`

## 🎞️ Episode Log

| Season | Episode | Rating | Title/Note | Date |
| ------ | ------- | ------ | ---------- | ---- |
| <%- vol %> | <%- epNow %> | | | <%- tp.date.now("YYYY-MM-DD") %> |
## 📝 Notes
- 

## 📺 Season Overview

> [!abstract] Progress
> ```dataviewjs
> const c = dv.current();
> let rows = [];
> let totalWatched = 0;
> let totalMax = 0;
> 
> for (let i = 1; i <= c.season; i++) {
>     let max = c[`s${i}_max`] || 0;
>     let watched = (i < c.season) ? max : c.episode;
>     
>     totalWatched += watched;
>     totalMax += max;
>     
>     let p = max > 0 ? Math.round((watched / max) * 100) : 0;
>     let bar = p >= 100 ? "✅ Completed" : "█".repeat(Math.floor(p/10)) + "░".repeat(10-Math.floor(p/10)) + " " + p + "%";
>     let maxDisplay = max > 0 ? max : "⚠️ `s" + i + "_max` missing!";
>     let statusIcon = p >= 100 ? "🏆" : "🍿";
>     
>     // Output formatted to match your old aesthetic exactly
>     rows.push([`S${String(i).padStart(2,'0')}`, bar, `${watched} / ${maxDisplay}`, statusIcon]);
> }
> 
> dv.table(["Season", "Progress", "Episodes", "Status"], rows);
> ```




---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

