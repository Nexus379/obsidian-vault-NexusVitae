<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash protection

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let luhmannId = (tp.variables && tp.variables.luhmannId) ? tp.variables.luhmannId : "R" + tp.date.now("YYYYMMDDHHmm");
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📔 Book Name?", "");
}
if (!title || title.trim() === "") title = "Book-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}


// 🔱 3. AUTO-COVER SCAN (With Folder-Bot Safety)
const coverFolder = "xAttachment/Cover/Bookcover";
let current = "";
for (const seg of coverFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}

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

// 🔱 4. ADDITIONAL METADATA
let vol = await tp.system.prompt("🔢 Volume / Part (e.g. 1)?", "") || "";
let volTitle = await tp.system.prompt("🏷️ Name of this Part / Subtitle? (optional)", "") || "";

// 🔱 5. GENRE-SELECTION
const gOptions = ["🌱 Self-Dev", "🧘 Philosophy", "🛐 Spirit", "📜 Bio", "🌍 Advent", "🐉 Fantasy", "🚀 Sci-Fi", "🕵️ Thriller", "🎭 Drama", "💖 Romance", "👻 Horror", "🏛️ Classic", "🎨 Manga", "💰 Business", "🥘 Cook", "💡 Guide", "🧩 Other", "[+] custom..."];
const gValues = ["Self-Dev", "Philosophy", "Spirituality", "Biography", "Adventure", "Fantasy", "Sci-Fi", "Thriller", "Drama", "Romance", "Horror", "Classic", "Manga", "Business", "Cooking", "Guide", "Other", "custom"];
let genre = await tp.system.suggester(gOptions, gValues);

if (genre === "custom") genre = await tp.system.prompt("✨ Genre?", "Mystery");
if (!genre) genre = "General";

// 🔱 6. TITLE CLEANING (Nexus Standard)
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(book-|n-|r-|s-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_y: 0.4
banner_icon: 📔
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/book"
science:
discipline:
status:
  - 1active
priority:
  - "1"
persona:
# 🔱 Meta Bind Texts (Use comma separation for multiple entries)
author: ""
original_title: ""
publisher: ""
pub_date: ""
isbn: ""
genre: 
  - "<%- genre %>" 
subject: ""
plattform: ""
# 🔱 Dynamic Details
volume: <%- vol %>
volume_title: "<%- volTitle %>"
chapter_now: ""
volume_max:






---

# 📔 Book: <%- luhmannId %> <%- displayTitle %>

> [!reference] Book Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> `$= dv.current().volume ? '| **Volume:** ' + dv.current().volume : ''` `$= dv.current().volume_title ? '- ' + dv.current().volume_title : ''`
> > > 
> > > **Author:**
> > > `INPUT[inlineList:author]`
> > > 
> > > **Genre:**
> > > `INPUT[inlineList:genre]`
> > > 
> > > **Publisher:**
> > > `INPUT[inlineList:publisher]`

<%- tp.file.include("[[zData/3snippets/sortName.md]]") %>

## 🔖 Quotes & Thoughts
- 

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
