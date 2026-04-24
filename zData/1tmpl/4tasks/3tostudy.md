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
const persona = tp.variables.persona || "student"; // Perfekter Fallback für Study!
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
const sOpt = ["🔄 Spaced Repetition", "📝 Test (Small)", "🔥 Exam (Big)", "🏛️ Lecture", "📚 General"];
const sVal = ["spaced", "test", "exam", "class", "general"];
let studyType = await tp.system.suggester(sOpt, sVal) || "general";

const today = tp.date.now("YYYY-MM-DD");
const p1 = tp.date.now("YYYY-MM-DD", 1); 

// 🔱 4. CLEANING FÜR DEN DISPLAY-TITLE
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(3tostudy-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/study, blau.jpg]]"
banner_icon: "<%- icon %>"
inbox: true
arch:
  - "#4task"
archtype:
  - "#4task/tostudy/<%- studyType %>"
status: <%- (studyType === 'spaced') ? 'review' : '1active' %>
priority:
  - "1"
persona:
due: <%- today %>
space_lvl: 0
space_rank: "Ground Crew (Sprout)"
space_date: <%- p1 %>
lastgrade: 0
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

> [!abstract] Ebbinghaus Prime-Chain (99% Retention)
> **Last Session:** <%- today %> (Initial Capture)
> **Target Session (P1):** <%- p1 %>
> 
> *Logic: Each next step is calculated from the successful completion of the previous one.*

> [!abstract] 🛡️ Nexus Rank: `VIEW[{rank}]`
> **Next Session:** `VIEW[{next-study}]` | **Level:** `VIEW[{sr-level}]`
> 
> `BUTTON[name(🛡️ Level Up), action(insertTemplate("zData/3snippets/add-spaced-rep.md"))]`

### 🛰️ Mission Control Display 

> [!abstract] 🖖 Starfleet Rank: `VIEW[{spacerank}]`
> `$= const icons = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌", "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"]; const lvl = dv.current().spacelvl; dv.paragraph(icons[Math.min(lvl, icons.length - 1)] + " **Level " + lvl + "**")`
> **Stardate Next:** `VIEW[{nextstudy}]`

`BUTTON[name(🛡️ Update Log), action(insertTemplate("zData/3snippets/add-spaced-rep.md"))]`

## 🧠 Active Recall / Brain Dump 
- 



 
`BUTTON[spaced]`

---
**System Action:**
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
