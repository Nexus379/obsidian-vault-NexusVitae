<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const luhmannId = tp.variables.luhmannId || "";
const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc/general";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Card topic?", "");
}
if (!title || title.trim() === "") title = "Card-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING 
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(card-|vocab-|srs-|atomic-|n-)/i, "").trim();

// 🔱 4. SRS SEED — every card IS a studycard, so it carries the same internal study_* scheduling.
//    (The individual vocab/cloze items are reviewed via the community plugin's inline <!--SR:--> comments.)
const today = tp.date.now("YYYY-MM-DD");
const p1 = tp.date.now("YYYY-MM-DD", 1);

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_icon: 🎴
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/cards"
status: 1active
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
persona: "<%- persona %>"
due: <%- today %>
study_lvl: 0
study_rank: "Ground Crew (Sprout)"
study_date: <%- p1 %>
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
tags: ["#cards"]

---

# 🎴 Card: <%- displayTitle %>

<%- tp.file.include("[[zData/1tmpl/5notes/cards_cheat sheet]]") %>

## 🛰️ Flashcard Content (Spaced Repetition Plugin)

Question :: Answer

--
