<%-*
// 🔱 1. NEXUS-DATA-SYNC & DISCIPLINE ENGINE
let persona = tp.variables.persona || "";
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// Variablen für die Frontmatter vorbereiten
let sci = "";
let disc = "";
let icon = "🧭"; // Default Icon für Visionen
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
    title = await tp.system.prompt("✨ Stars: Vision: What is your 5-year destination?", "");
}
if (!title) title = "Vision-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. SMART PROMPT (5 Jahre)
let deadline = await tp.system.prompt(
    "🔭 Set Vision Horizon (YYYY-MM-DD) – Suggestion: 3-5 years", 
    tp.date.now("YYYY-MM-DD", { offset: 5, unit: "years" })
);

// 🔱 4. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(2vision-|v-|vision-|stars-|s-|1stars-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/japan-background-digital-art.jpg]]"
banner_y: 0.45
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#1stars"
archtype:
  - "#1stars/2vision"
due: <%- deadline %>
status: 1active
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:
parent: "<%- pLink %>"
child:
summary:
review:
---

# <%- icon %> Vision: <%- displayTitle %>

> [!quote] The 5-Year Horizon
> "Vision without execution is hallucination." — Thomas Edison
> **Horizon 4:** The vivid picture of a desired future state.
> **Target Date:** `<%- deadline %>`

---

## 🔭 The Blueprint

> [!multi-column]
>
> > [!abstract|wide-1] Target State (The Reality in 5 Years)
> > **How does it feel when this Star is fully shining?**
> > 
> > 
> > **What is the core intent of this vision?**
> > 
>
> > [!todo|wide-1] Success Criteria (Qualitative)
> > **How do I recognize that the vision has been 100% achieved?**
> > 
> > 
> > **What has changed in my daily life?**
> > 

---

## 🏔️ Manifestations (Nexus Downstream)

> [!abstract] Tracking the Execution
> <small style="opacity:0.5; text-transform:uppercase;">Goals & Projects building this Vision</small>
> 
> ```dataviewjs
> const currentName = dv.current().file.name;
> 
> // 1. Find Goals (Horizon 3)
> const goals = dv.pages("#1stars/3goals").where(g => String(g.parent).includes(currentName) || String(g.file.outlinks).includes(currentName));
> if(goals.length > 0) {
>     dv.header(4, "🎯 Active 90-Day Goals (Horizon 3)");
>     dv.list(goals.map(g => g.file.link + (g.due ? ` *(Due: ${g.due})*` : "")));
> }
> 
> // 2. Find Projects (Horizon 2)
> const projects = dv.pages("#3project").where(p => String(p.parent).includes(currentName) || String(p.stars1).includes(currentName) || String(p.file.outlinks).includes(currentName)).where(p => p.status === "1active");
> if(projects.length > 0) {
>     dv.header(4, "🚧 Active Projects (Horizon 2)");
>     dv.list(projects.map(p => p.file.link + ` *(Open Tasks: ${p.file.tasks.where(t => !t.completed).length})*`));
> }
> 
> if(goals.length === 0 && projects.length === 0) {
>     dv.paragraph("_No downstream items linked yet. Break this Vision down into 90-Day Goals!_");
> }
> ```

---
**System Action:** [[stars-goal|+ Create new Goal from this Vision]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
