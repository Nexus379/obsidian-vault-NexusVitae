<%-*
// 🔱 1. NEXUS-DATA-SYNC
let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = tp.variables.title || tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Film Name?", "");
}
if (!title) title = "film-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 2. STYLE-SELECTION
const sOpt = ["🎬 Live-Action", "🧧 Anime", "✍️ Animation", "🎮 CGI / 3D", "🎥 Documentary", "[+] Custom Style..."];
const sVal = ["Live-Action", "Anime", "Animation", "CGI-3D", "Documentary", "custom"];
let style = await tp.system.suggester(sOpt, sVal);
if (style === "custom") style = await tp.system.prompt("Style Name?");
if (!style) style = "Live-Action";

// 🔱 3. HIERARCHISCHER FOLDER-BOT (Cover/Film/Stil)
const coverFolder = `xAttachment/Cover/Film/${style}`;
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
    let manual = await tp.system.prompt("🖼️ Poster Filename?", cleanName + "-cover");
    pureCover = manual ? `${coverFolder}/${manual}.jpg` : "";
}

// 🔱 5. GENRE-SELECTION (Style-aware)
let gOptions = ["Action", "Sci-Fi", "Thriller", "Comedy", "Drama", "Horror", "Adventure", "Classic"];
if (style === "Anime") { gOptions = ["Shonen", "Seinen", "Shojo", "Isekai", "Slice of Life", "Mecha", "Fantasy"]; }
gOptions.push("[+] Custom...");
let genre = await tp.system.suggester(gOptions, gOptions);
if (genre === "[+] Custom...") genre = await tp.system.prompt("Genre?");

// 🔱 6. SMART LOGIC (Director & Author Sort)
let rawDir = await tp.system.prompt("🎬 Director / Regisseur?", "Unknown") || "Unknown";
let dirSort = rawDir;
if (rawDir.includes(" ")) {
    let parts = rawDir.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    dirSort = lastName + ", " + firstName;
}

let rawCreator = await tp.system.prompt("Author?", "Unknown") || "Unknown";
let creatorSort = rawCreator;
if (rawCreator.includes(" ")) {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

// 🔱 7. ADDITIONAL METADATA
let company = await tp.system.prompt("🏢 Production Company / Studio?", "Unknown") || "Unknown";
let cast = await tp.system.prompt("🎭 Actors / Cast (comma separated)?", "Unknown") || "Unknown";
let vol = await tp.system.prompt("🔢 Volume / Part?", "1") || "1";

let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(film-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/aesthetic-anime-character-gaming.jpg]]"
banner_icon: 🎬
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/film"
status:
  - "1active"
priority:
  - "1"
persona:
plattform: ""
creator: "<%- rawCreator %>"
creator_sort: "<%- creatorSort %>"
director: "<%- rawDir %>"
director_sort: "<%- dirSort %>"
actors: 
<%- cast.split(',').map(s => `  - "${s.trim()}"`).join('\n') %>
original_title:
style: "<%- style %>"
genre:
- "<%- genre %>"
publisher: "<%- company %>"
pub_date:
volume: <%- vol %>
volume_max:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🎬 Film: <%- luhmannId %> <%- displayTitle %>

> [!reference] Cineastische Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> | **Part:** `$= dv.current().volume`
> > > 
> > > **Director:** `$= dv.current().director` 
> > > 
> > > **Genre:** `$= dv.current().genre`
> > > 
> > > **Style:** `$= dv.current().style`




## 🎞️ Analyse & Notizen
- 


## 🍿 Review & Notes






---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

