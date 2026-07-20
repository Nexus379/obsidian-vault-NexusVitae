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
    title = await tp.system.prompt("🎴 Anki Cloze: Topic / Subject?", "");
}

// BACKSAFE: Falls Prompt mit ESC geschlossen wird
if (!title || title.trim() === "") {
    title = "AnkiCloze-" + tp.date.now("HH-mm");
}

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

const today = tp.date.now("YYYY-MM-DD");
const p1 = tp.date.now("YYYY-MM-DD", 1); 

// 🔱 3. CLEANING FÜR DEN DISPLAY-TITLE
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(ankicloze-|anki-|3tostudy-|t-|4task-)/i, "").trim();

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
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling: []
child: []
deck: "Nexus::General"
tags: ["#anki/sync"]

---

# 🎴 Anki-Cloze: <%- luhmannId %> <%- displayTitle %>
## 🛰️ Mission Control Display
**Project:** <%- pLink || "None" %>

> [!multi-column]
> > [!calendar|wide-5] Ebbinghaus Prime-Chain (99% Retention)
> > **Last Session:** <%- today %> (Initial Capture)
> > **Target Session (P1):** <%- p1 %>
> > 
> > > <small style="opacity:0.6; font-style:italic;">Each next step is calculated from the successful completion of the previous one.</small>
> >
> > **Status:**
> > `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]` 
> 
> > [!info|wide-0] 🛡️ Nexus Progression
> > **Starfleet Rank:**
> > 
> >  `VIEW[{space_rank}]` 
> >  `$= const icons = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌", "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"]; const lvl = dv.current().space_lvl || 0; dv.paragraph(icons[Math.min(lvl, icons.length - 1)] + " **Level " + lvl + "**")`
> > 🔥 **Next Dynamic Session:** `VIEW[{space_date}]`  

> [!info]- 📖 Anki Cloze Syntax Cheat Sheet
> **1. Cloze Card (Fill-in-the-blank)**
> START
> {Cloze}
> Text: Rome is the {{c1::capital}} of {{c2::Italy}}.
> Extra: Additional info here.
> ID: 0
> END
> 
> **2. Basic Card (Front & Back)**
> START
> {Basic}
> Front: Your question?
> Back: Your answer!
> ID: 0
> END
> 
> **3. Image Occlusion (Hide image parts)**
> START
> {Image Occlusion}
> Header: Title of the image
> Image: paste your image embed here
> ID: 0
> END
> 
> ---
> - **`{{c1::text}}`**: Cloze deletion. The number (`c1`, `c2`…) groups blanks per card.
> - **`Text:`**: The full sentence with cloze deletions embedded.
> - **`Extra:`**: Additional context shown on the back of the card.
> - **`START` / `END`**: Card boundaries. Everything in between = one flashcard.
> - **`ID: ...`**: Card fingerprint. Anki recognizes updates instead of creating duplicates.

[cards-deck:: ]
FILE TAGS: #anki

## 🧠 Cloze / Fill-in-the-blank

START
{Cloze}
Text: According to legend, Rome was founded in {{c1::753 BC}} by {{c2::Romulus}}.
Extra: Historical fact: Rome's legendary founding. 🐺
ID: 0
END



## 🚀 Flashcards

START
{Cloze}
Text: Write your sentence with {{c1::blanks}} here.
Extra: 
ID: 0
END



`BUTTON[spaced]`

---
**System Action:**
[[0_Atlas/0_Dashboard/5-Notes|⬅️ Back to Notes Dashboard]] |[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]
[[n-lit|+ Create Note]] | [[p-active|+ Create Project]] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
