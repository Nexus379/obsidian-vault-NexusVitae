<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const luhmannId = tp.variables.luhmannId || "";
const persona = tp.variables.persona || "student";
const area = tp.variables.currentArea || tp.variables.area || "";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc/general";

// 🌟 Holt automatisch "LAT" direkt aus disc!
const cleanDisc = tp.variables.cleanDisc || disc.split('/').pop().replace('#', '').substring(0, 3).toUpperCase();
const cleanTag = cleanDisc.toLowerCase();

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

---

# 🎴 Card: <%- luhmannId %> <%- displayTitle %>

> [!mind] 🛰️ Mission Control Display
> **Project:** <%- pLink || "None" %>
> 
> > [!multi-column]
> > > [!calendar|wide-5] Ebbinghaus Prime-Chain (99% Retention)
> > > **Last Session:** <%- today %> (Initial Capture)
> > > **Target Session (P1):** <%- p1 %>
> > > 
> > >> <small style="opacity:0.6; font-style:italic;">Each next step is calculated from the successful completion of the previous one.</small>
> > >
> > > **Status:**
> > > `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]` 
> > 
> > > [!info|wide-0] 🛡️ Nexus Progression
> > > **Starfleet Rank:**
> > > 
> > >  `VIEW[{study_rank}]` 
> > >  `$= const icons = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌", "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"]; const lvl = dv.current().study_lvl || 0; dv.paragraph(icons[Math.min(lvl, icons.length - 1)] + " **Level " + lvl + "**")`
> > > 🔥 **Next Dynamic Session:** `VIEW[{study_date}]`  
> 
>
> > [!abstract]- 📖 Anki Syntax Cheatsheet
> > <small>(Custom Regex) _(Important: When actually creating cards, write the triggers without spaces: `; ;` and `Q ;` )_ </small>
> > 
> > **1. Basic Card (One direction only)** 
> > 	 Q ; Your Question/Fact
> > 	 A ; Your Answer
> > 
> > **2. Reversed Card (Vocabulary in both directions)** 
> > 	_Option A_ 
> > 		insula, ae ; ; island, the
> > 	 _Option B_ 
> > 		 insula, ae ; ;
> > 		 island, the
> >  
> > **3. Cloze Card (Fill-in-the-blank)** 
> > C ; The first Roman emperor was named {{c1::Augustus}}.
> >
> > > [!quote]-  Multi Answers
> > > Q ; What are the 3 pillars of Rome's power?
> > > A ;
> > > a) The Military (Legions)
> > > b) The Economy (Trade)
> > > c) The Administration (Bureaucracy)
> > >
> > > insula, ae, f. ; ;
> > > a) die Insel
> > > b) der Wohnblock
> > >
> > > (*kann auch 1., 2., 3., / `-, -, -` *)
> > >
> > >C ; Rom wurde der Legende nach im Jahr {{c1::753}} v. Chr. gegründet.
> > > Die Stadt wuchs besonders schnell, 
> > > da sie strategisch klug am Fluss {{c2::Tiber}} lag.
> >
> > **4. Image Occlusion (Hiding parts of images)** ❌ Do not do this via text in Obsidian! Drag the image directly into the Anki app:
> > > [!info]- 🗺️ How to use Image Occlusion
> > >  Since Regex can only read text, you cannot use it to draw graphical boxes on images directly in Obsidian. Instead, use this standard workflow:
> > > 
> > > 2. Open the **Anki app** on your computer.
> > > 3. Install the Anki Add-on **"Image Occlusion Enhanced"**.
> > > 4. Drag and drop your image (e.g. a map or anatomy chart) directly into Anki.
> > > 5. Use the pop-up tool to quickly draw boxes over the areas you want to hide, and click OK.
> > > 
> > > Anki will instantly generate the flashcards for you. It's much faster and less frustrating than trying to force this graphical process through Obsidian!
> > 
> > **5. DELETE and FROZEN**
> > > [!caution] How to delete and freeze
> > > 
> > > Q ; What is the capital of Italy?
> > > A ; Rome
> > > DELETE
> > > < ! - - I D : 169xxxxx432 - - >
> > >
> > >! after syncing with Anki, you can delete it.

## %- displayTitle %>
TARGET DECK: <%- cleanDisc %>::Subdeck::subsubdeck::subsubdeckdeck
FILE TAGS: <%- disc %>


Q ; What is the capital of Italy?
A ; Rome

##card-tag ##something-tag



---
`BUTTON[spaced]`

[[0_Atlas/Dashboard/5Notes|⬅️ Zurück zum Notes-Dashboard]] |[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

___
