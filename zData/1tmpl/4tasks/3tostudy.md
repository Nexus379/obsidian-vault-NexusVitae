<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Verhindert den Totalausfall

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

if ((!tp.variables.sci || !tp.variables.disc) && typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const selectedDisc = await tp.system.suggester(
        discList.map(d => `${d.icon} ${d.label}`),
        discList,
        false,
        "Science / Discipline?"
    );
    if (selectedDisc) {
        tp.variables.sci = selectedDisc.sci.join('", "');
        tp.variables.disc = selectedDisc.disc;
        tp.variables.sub = selectedDisc.label;
        tp.variables.currentArea = tp.variables.currentArea || selectedDisc.area;
    }
}

// 🛡️ SICHERES AUSLESEN (nachdem das Modul eventuell Variablen gesetzt hat)
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const sub = tp.variables.sub || "";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = tp.variables.icon || "🎓";

// 🔱 2. FALLBACK & RENAMING (Dein gewünschter Schutz)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎓 To-Study: Topic / Subject?", "");
}

// BACKSAFE: Falls Prompt mit ESC geschlossen wird
if (!title || title.trim() === "") {
    title = "ToStudy-" + tp.date.now("HH-mm");
}

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. STUDY-TYPE SELECTION
const sOpt = ["🔥 Exam (Big)", "📝 Test (Small)", "🎤 Presentation", "📓 Homework", "🏛️ Lecture", "📚 General"];
const sVal = ["exam", "test", "presentation", "homework", "class", "general"];
let studyType = await tp.system.suggester(sOpt, sVal) || "general";

const today = tp.date.now("YYYY-MM-DD");
const p1 = tp.date.now("YYYY-MM-DD", 1); 

// 🔱 4. CLEANING FÜR DEN DISPLAY-TITLE
let displayTitle = title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(3tostudy-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/study, blau.jpg]]"
banner_icon: "<%- icon %>"
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tostudy/<%- studyType %>"
status: 1active
priority:
  - "1"
persona: "student"
due: <%- p1 %>
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
topic: "<%- sub %>"
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# 🎓 Quest: <%- displayTitle %>
> [!abstract] 📋 <%- studyType.toUpperCase() %> · **Project:** <%- pLink || "None" %>
> Discipline: `$= dv.current().discipline`

> [!calendar] ⏳ Deadline
> **Due:** `INPUT[date:due]`
> `$= const d = dv.current().due; if(!d){dv.span("—")}else{const days=moment(String(d)).startOf('day').diff(moment().startOf('day'),'days');const c=days<0?"var(--text-error)":(days<=3?"#ff7b00":"var(--text-success)");dv.paragraph("<span style='color:"+c+";font-weight:bold'>"+(days<0?"OVERDUE by "+(-days)+"d":days+" days left")+"</span>");}`
> **Inbox:** `INPUT[toggle:inbox]`
> **Status:** `INPUT[inlineSelect(option(1active, ⚡ Active), option(2passive, 💤 Passive), option(review, 🔍 Review), option(done, ✅ Done), option(canceled, ❌ Canceled)):status]`

## 📝 Preparation / Brain Dump
- [ ] 

## ✅ Checklist
- [ ] 

---
**System Action:**
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
