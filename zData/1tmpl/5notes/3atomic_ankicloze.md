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
    title = await tp.system.prompt("Your atomic note?", "");
}
if (!title || title.trim() === "") title = "Atomic-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); // Kurze Stabilisierung
}

// 🔱 3. TITEL-CLEANING 
let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) { displayTitle = title.substring(luhmannId.length); }
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(atomic-|n-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_icon: 🎴
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/srs"
status: 1active
priority:
  - "1"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
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
deck: "Nexus::General"
tags: ["#srs/sync"]

---

# 🎴 Anki-Cloze: <%- displayTitle %>
> [!info]- 📖 Anki Syntax Cheat Sheet
> **1. Basic Card (Front & Back)**
> START
> {Basic}
> Front: Your question?
> Back: Your answer!
> ID: 0 (Plugin fills this out)
> END
> 
> **2. Cloze Card (Fill-in-the-blank)**
> START
> {Cloze}
> Text: Rome is the {{c1::capital}} of {{c2::Italy}}.
> Extra: Additional info here.
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

> [!quote] 🧩 Cloze Deletions Cheat Sheet
> **Basic Cloze:** The capital of France is ==Paris==. 
> **Multiple Clozes:** ==Rome== is the capital of ==Italy==. *(Creates 2 separate cards)*
> **Classic Anki-Style:** You can still use `{{c1::Text}}` or `{Text}` if you prefer or need specific numbering!
> **Extra Info:** Add extra context directly below the sentence, or use `?` on the next line to add a hidden "back" text.

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


---
[[0_Atlas/0_Dashboard/5-Notes|⬅️ Back to Notes Dashboard]] |[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
