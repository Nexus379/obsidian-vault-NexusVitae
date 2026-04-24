<%-*
// 🔱 1. DATA-RECOVERY & SAFE VARIABLES
if (!tp.variables) tp.variables = {}; // 🛡️ Crash-Schutz

const persona = tp.variables.persona || "queen_king";
const area = tp.variables.currentArea || tp.variables.area || "analyst";
const sci = tp.variables.sciTag || tp.variables.sci || "#science";
const disc = tp.variables.discTag || tp.variables.disc || "#disc";
const luhmannId = tp.variables.luhmannId || "";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// Wenn kein pLink übergeben wurde, fragt das System nach der Quelle
if (!pLink) {
    const src = await tp.system.prompt("🔗 Source (Resource Name)?", "");
    pLink = src ? `[[${src}]]` : "";
}

// 🔱 2. FALLBACK: Untitled Check
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📘 Literature Thoughts?", "");
}
if (!title || title.trim() === "") title = "Lit-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. AUTHOR LOGIC
let rawCreator = await tp.system.prompt("✍️ Author / Professor / Editor?", "Unknown");
if (!rawCreator) rawCreator = "Unknown";

let creatorSort = rawCreator;
if (rawCreator !== "Unknown" && rawCreator.includes(" ")) {
    let parts = rawCreator.trim().split(/\s+/);
    let lastName = parts.pop();
    let firstName = parts.join(" ");
    creatorSort = lastName + ", " + firstName;
}

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[0-9a-z.]+ /i, "").replace(/^(ref-|r-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/Area Banner/hufflepuff_study.jpg]]"
banner_y: 0.4
banner_icon: 📘
inbox: true
arch:
  - "#5note"
archtype:
  - "#5note/2literature"
status: 1active
priority:
  - "1"
persona: "<%- persona %>"
creator: "<%- rawCreator %>"
creator-sort: "<%- creatorSort %>"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
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
summary:
review:
---

# 📘 Literature: <%- displayTitle %>

> [!multi-column]
> > [!abstract] Questio (Context)
> > Summaries and excerpts in your own words. What are the author's core messages and intentions?
> 
> > [!info] Bibliographia
> > **Source:** <%- pLink %>
> > **Author:** <%- rawCreator %>
> > **Science:** `$= dv.current().science` 
> > **Discipline:** `$= dv.current().discipline`

## 🔖 Key-Takeaways
- 

## 📝 Excerpts & Citations







---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
