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
    title = await tp.system.prompt("🗨 Course Name / Topic?", "");
}
if (!title || title.trim() === "") title = "Course-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Short stabilization
}

// 🔱 3. FOLDER-BOT (Course Cover)
const coverFolder = "xAttachment/Cover/Coursecover";
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

// 🔱 5. PROGRESS LOGIC
let prog = await tp.system.prompt("📊 Progress (0-100)?", "0");
let p = parseInt(prog) || 0;
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

let instructor = await tp.system.prompt("👨‍🏫 Instructor / Organization?", "Unknown");

// 🔱 6. TITLE CLEANING
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(course-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 🗨
cover: "[[<%- pureCover %>]]"
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/course"
author: "<%- instructor %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
progress: <%- p %>
progressBar: "<%- bar %>"
persona:
plattform: ""
genre:
publisher:
pub_date:
rating: 
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---

# 🗨 Course: <%- luhmannId %> <%- displayTitle %>

> [!reference] Course Details
> >[!multi-column]
> > > [!blank]
> > > ![[<%- pureCover %>|150]]
> > 
> > > [!blank]
> > > **ID:** <%- luhmannId %> 
> > > 
> > > **Instructor:** `$= dv.current().author`
> > > 
> > > **Progress:** `$= dv.current().progressBar`
> > > 
> > > **Discipline:** `$= dv.current().discipline`

## 📝 Course Notes
- 





---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
