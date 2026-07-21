<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

// 🔱 DISCIPLINE INHERIT-OR-ASK: caller (dailypkm) may pass sci/disc; if not, ask. Mirrors 3tostudy.
if ((!tp.variables.sci || !tp.variables.disc) && typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const selectedDisc = await tp.system.suggester(
        discList.map(d => `${d.icon} ${d.label}`), discList, false, "🎓 Science / Discipline?"
    );
    if (selectedDisc) {
        tp.variables.sci = selectedDisc.sci.join('", "');
        tp.variables.disc = selectedDisc.disc;
        tp.variables.currentArea = tp.variables.currentArea || selectedDisc.area;
    }
}

const persona = tp.variables.persona || "student";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const area = tp.variables.currentArea || tp.variables.area || "#2area/3mind";
const icon = tp.variables.icon || "🍂";
const luhmannId = tp.variables.luhmannId || ""; // 🔱 FIX: war nicht deklariert -> ReferenceError > ist es uebrehaupt noetig hier?

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🍂 Fleeting Thoughts?", "");
}
if (!title || title.trim() === "") title = "Fleeting-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. TITEL-CLEANING
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(fleet-|n-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/20354-yin-yang-buddhism-element-gates-gold-4k (1).jpg]]"
banner_y: 0.4
banner_icon: 🍂
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/1fleeting"
status: 1active
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
persona: "<%- persona %>"
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🍂 Captura: <%- displayTitle %>


> [!multi-column]
> > [!abstract] Cogitatio Fugax (Fleeting Thought)
> > Raw capture of an idea or observation. Not yet distilled.
> 
> > [!blank]
> > **Context:** `$= dv.current().science` 
> > **Discipline:** `$= dv.current().discipline`
> > **Inbox:** `INPUT[toggle:inbox]`
> > **Phase:** `INPUT[suggester(option(0blueprint, 📝 Blueprint), option(1research, 🔍 Research), option(3investing, ⏳ Investing), option(4polish, ✨ Polish), option(5finish, 🏁 Finish)):explore_lvl]`

## 🧠 Active Recall / Brain Dump 
- 

### ✍️ Adnotatio (Notes)
- 






---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

> [!tip] 🌱 Ready to distill? Promote this fleeting thought into your **Zettelkasten** (Atomic / Permanent / Evergreen) — keeps its Luhmann ID + links:
> `BUTTON[topermanent]`

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
