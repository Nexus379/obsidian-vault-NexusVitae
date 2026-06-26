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

// 🔱 4. SMART AUTHOR LOGIC (Lastname, Firstname Auto-Sort)
let rawCreator = await tp.system.prompt("✍️ Author (Firstname Lastname)?", "Unknown");
let creatorSort = rawCreator;
if (rawCreator && rawCreator.includes(" ")) {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

// 🔱 5. GENRE-SELECTION
const gOptions = ["🌱 Self-Dev", "🧘 Philosophy", "🛐 Spirit", "📜 Bio", "🌍 Advent", "🐉 Fantasy", "🚀 Sci-Fi", "🕵️ Thriller", "🎭 Drama", "💖 Romance", "👻 Horror", "🏛️ Classic", "🎨 Manga", "💰 Business", "🥘 Cook", "💡 Guide", "🧩 Other", "[+] custom..."];
const gValues = ["Self-Dev", "Philosophy", "Spirituality", "Biography", "Adventure", "Fantasy", "Sci-Fi", "Thriller", "Drama", "Romance", "Horror", "Classic", "Manga", "Business", "Cooking", "Guide", "Other", "custom"];
let genre = await tp.system.suggester(gOptions, gValues);

if (genre === "custom") genre = await tp.system.prompt("✨ Genre?", "Mystery");
if (!genre) genre = "General";

// 🔱 6. TITLE CLEANING (Nexus Standard)
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(book-|n-|r-|s-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_y: 0.4
banner_icon: 📔
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resou"
archtype:
  - "#6resou/book"
status:
  - 1active
priority:
  - "1"
persona:
creator: "<%- rawCreator %>"
creator_sort: "<%- creatorSort %>"
isbn:
original_title:
genre: 
  - "<%- genre %>" 
publisher:
pub_date:
subject: ""
plattform: ""
volume:
chapter_now: ""
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
# 📔 <%- luhmannId %> <%- displayTitle %>

> [!reference] Resource Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Author:** `$= dv.current().creator`
> > > 
> > > **Genre:** `$= dv.current().genre`


## 🔖 Key Takeaways
- 







---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
