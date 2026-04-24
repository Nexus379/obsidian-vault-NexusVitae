<%-*
// 🔱 1. NEXUS-DATA-SYNC & DISCIPLINE ENGINE
let persona = tp.variables.persona || "";
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// Variablen für die Frontmatter vorbereiten
let sci = "";
let disc = "";
let icon = "🎯"; // Default Icon für Goals
let area = tp.variables.currentArea || tp.variables.area || "";

// 🚀 DIE NEUE ENGINE ZÜNDEN
if (typeof tp.user.disciplineEngine === "function") {
    const engine = tp.user.disciplineEngine();
    const discList = engine.getDisciplineLabels();
    const displayList = discList.map(d => `${d.icon} ${d.label}`);
    
    const selectedDisc = await tp.system.suggester(displayList, discList);
    
    if (selectedDisc) {
        sci = selectedDisc.sci.join('", "');
        disc = selectedDisc.disc;
        icon = selectedDisc.icon;
        if (!area || area === "area_undefined") {
            area = selectedDisc.area;
        }
    }
} else {
    new Notice("⚠️ disciplineEngine.js nicht gefunden!");
}

// 🔱 2. FALLBACK & RENAME
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("🎯 Stars: Goal Name (90 Days)?", "");
}
if (!title) title = "Goal-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. DEADLINE (90 Days Autopilot)
let deadline = await tp.system.prompt("🎯 Set Deadline (YYYY-MM-DD) – Suggestion: +90 days", tp.date.now("YYYY-MM-DD", 90));

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(3goals-|stars-|s-|1stars-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/gebirge schnee zug.jpg]]"
banner_y: 0.5
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#1stars"
archtype:
  - "#1stars/3goals"
due: <%- deadline %>
status: 1active
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
area2: "<%- area %>"
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
parent: "<%- pLink %>"
---

# <%- icon %> Goal: <%- displayTitle %>

> [!quote] The 90-Day Horizon
> "A goal is a dream with a deadline." — Napoleon Hill
>
> **Horizon 3:** A concrete, measurable result.
> **Deadline:** `<%- deadline %>`

---

## 🎯 The Blueprint (SMART)

> [!multi-column]
>
> > [!abstract|wide-1] Core Definition
> > **Specific:** What exactly needs to be done?
> > 
> > 
> > **Measurable:** How do I know it's 100% reached?
> > 
>
> > [!todo|wide-1] Context & Relevance
> > **Attractive:** Why is this important to me?
> > 
> > 
> > **Relevant:** Does this serve my Vision/Purpose?
> > 
> > 
> > **Time-bound:** Target is `<%- deadline %>`. Are there sub-deadlines?
> > 

---

## 🏔️ Manifestations (Nexus Downstream)

> [!abstract] Tracking the Execution
> <small style="opacity:0.5; text-transform:uppercase;">Projects building this Goal</small>
> 
> ```dataviewjs
> const currentName = dv.current().file.name;
> 
> // 1. Find Projects (Horizon 2)
> const projects = dv.pages("#3project").where(p => String(p.parent).includes(currentName) || String(p.stars1).includes(currentName) || String(p.file.outlinks).includes(currentName)).where(p => p.status === "1active");
> if(projects.length > 0) {
>     dv.header(4, "🚧 Active Projects (Horizon 2)");
>     dv.list(projects.map(p => p.file.link + ` *(Open Tasks: ${p.file.tasks.where(t => !t.completed).length})*`));
> } else {
>     dv.paragraph("_No active projects linked yet. Time to break this goal down into action!_");
> }
> ```

---
**System Action:** [[active|+ Start new active Project from this Goal]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
