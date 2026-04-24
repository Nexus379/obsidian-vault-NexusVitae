<%-*
// 🔱 1. NEXUS-DATA-SYNC & DISCIPLINE ENGINE
let persona = tp.variables.persona || "";
let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// Variablen für die Frontmatter vorbereiten
let sci = "";
let disc = "";
let icon = "🌟";
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

// 🔱 2. FALLBACK
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("✨ Stars: Your Purpose?", "");
}
if (!title) title = "Purpose-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200)); 
}

// 🔱 3. CLEANING
let displayTitle = title.replace(/^[a-z0-9.]+ /i, "").replace(/^(1purpose-|stars-|s-|1stars-)/i, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26612
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#1stars"
archtype:
  - "#1stars/1purpose"
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

# <%- icon %> Purpose: <%- displayTitle %>

> [!quote] The Infinite Horizon
> "He who has a *why* to live for can bear almost any *how*." — Friedrich Nietzsche
> **Horizon 5:** The ultimate intent. Timeless and ongoing.

---

## 🧭 The Core Ethos

> [!multi-column]
>
> > [!stars|wide-1] The Drive (Ikigai)
> > **What fundamental drive creates this Purpose?**
> > 
> > 
> > **What unique value do I bring to the world here?**
> > 
>
> > [!shield|wide-1] Boundaries & Principles
> > **What are my non-negotiable rules for this?**
> > 
> > 
> > **What will I explicitly NOT do? (Anti-Goals)**
> > 

---

## 🏔️ Manifestations (Nexus Downstream)

> [!abstract] Tracking the Execution
> <small style="opacity:0.5; text-transform:uppercase;">Visions, Goals & Projects linked to this Purpose</small>
> 
> ```dataviewjs
> const currentName = dv.current().file.name;
> 
> // 1. Find Visions (Horizon 4)
> const visions = dv.pages("#1stars/2vision").where(v => String(v.parent).includes(currentName) || String(v.file.outlinks).includes(currentName));
> if(visions.length > 0) {
>     dv.header(4, "👁️ Linked Visions (Horizon 4)");
>     dv.list(visions.file.link);
> }
> 
> // 2. Find Goals (Horizon 3)
> const goals = dv.pages("#1stars/3goals").where(g => String(g.parent).includes(currentName) || String(g.file.outlinks).includes(currentName));
> if(goals.length > 0) {
>     dv.header(4, "🎯 Active 90-Day Goals (Horizon 3)");
>     dv.list(goals.map(g => g.file.link + (g.due ? ` *(Due: ${g.due})*` : "")));
> }
> 
> // 3. Find Projects (Horizon 2)
> const projects = dv.pages("#3project").where(p => String(p.parent).includes(currentName) || String(p.stars1).includes(currentName) || String(p.file.outlinks).includes(currentName)).where(p => p.status === "1active");
> if(projects.length > 0) {
>     dv.header(4, "🚧 Active Projects (Horizon 2)");
>     dv.list(projects.map(p => p.file.link + ` *(Open Tasks: ${p.file.tasks.where(t => !t.completed).length})*`));
> }
> 
> if(visions.length === 0 && goals.length === 0 && projects.length === 0) {
>     dv.paragraph("_No downstream items linked yet. Time to manifest this Purpose!_");
> }
> ```

---
**System Action:** [[stars-vision|+ Create new Vision]] | [[stars-goal|+ Create new Goal]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %> 
