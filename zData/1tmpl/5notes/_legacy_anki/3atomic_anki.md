<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Verhindert den Totalausfall

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 DISCIPLINE INHERIT-OR-ASK: caller (dailypkm) may pass sci/disc; if not, ask.
if ((!tp.variables.sci || !tp.variables.disc) && typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const selectedDisc = await tp.system.suggester(
        discList.map(d => `${d.icon} ${d.label}`), discList, false, "🎓 Science / Discipline?"
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
const persona = tp.variables.persona || "student";
const area = tp.variables.currentArea || tp.variables.area || "";
const icon = tp.variables.icon || "🎴";
const luhmannId = tp.variables.luhmannId || "";

// 🔱 2. FALLBACK & RENAMING
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎴 Anki Flashcard: Topic / Subject?", "");
}

// BACKSAFE: Falls Prompt mit ESC geschlossen wird
if (!title || title.trim() === "") {
    title = "AnkiCard-" + tp.date.now("HH-mm");
}

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

const today = tp.date.now("YYYY-MM-DD");
const p1 = tp.date.now("YYYY-MM-DD", 1); 

// 🔱 3. CLEANING FÜR DEN DISPLAY-TITLE
let displayTitle = title.replace(/^\d+[\d.a-z]*\s+/i, "").replace(/^(ankicard-|anki-|3tostudy-|t-|4task-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_icon: "<%- icon %>"
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/anki"
status: 1active
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
topic: "<%- sub %>"
persona: "<%- persona %>"
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
resource6:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling: []
child: []
tags: ["#anki", "#obsidian-to-anki"]

---

# 🎴 Anki-Atomic: <%- luhmannId %> <%- displayTitle %>
## Obsidian to Anki Export
**Project:** <%- pLink || "None" %>

[cards-deck:: ]
[tags:: #anki]


## 🚀 Flashcards

START
{Basic}
Front: 
Back: 
- 
ID: 0
END



---


---
**System Action:**
[[0_Atlas/0_Dashboard/5-Notes|⬅️ Back to Notes Dashboard]] |[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
