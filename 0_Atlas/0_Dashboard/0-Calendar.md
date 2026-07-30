---
cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
---
# 🗒️ Logs
| [[0_Atlas/0_Dashboard/0-Calendar|📅Calendar]] | [[0_Atlas/Bases/Calendarbase.base|⚙️Calendarbase]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM|🌷PLM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM|🌻PPM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM|🌼PKM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard|🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Financeboard|🪙Finance]] | [[0_Atlas/0_Dashboard/7-Reviews|🛰️Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
> > [!blank|wide-0]
> > #### 📅 **TIME FLOW**
> > 
> > ```dataviewjs
> > // 🔱 NEXUS DOUGHNUT: Kleiner & Kompakter
> > { 
> >     const nexusContainer = this.container;
> >     
> >     // Sets the container size (adjust the px here)
> >     nexusContainer.style.width = "100%"; nexusContainer.style.maxWidth = "240px"; nexusContainer.style.height = "230px";
> >     nexusContainer.style.margin = "0 auto"; // Zentriert den Chart
> >     
> >     if (nexusContainer.innerHTML.length < 50) {
> >         const entries = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > 
> >         const plm = entries.filter(p => dv.array(p.persona).some(m => ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun"].some(tag => String(m).includes(tag))) || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("plm"))).length;
> >         const ppm = entries.filter(p => dv.array(p.persona).some(m => ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic"].some(tag => String(m).includes(tag))) || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("ppm") && !String(t).toLowerCase().includes("study")))).length;
> >         const pkm = entries.filter(p => dv.array(p.persona).some(m => String(m).toLowerCase().includes("student") || String(m).toLowerCase().includes("analyst") || String(m).toLowerCase().includes("creator") || String(m).toLowerCase().includes("teacher") || String(m).toLowerCase().includes("author") || String(m).toLowerCase().includes("speaker") || String(m).toLowerCase().includes("explorer") || String(m).toLowerCase().includes("alchemist") || String(m).toLowerCase().includes("seeker") || String(m).toLowerCase().includes("mystic") || String(m).toLowerCase().includes("researcher") || String(m).toLowerCase().includes("archivist") || String(m).toLowerCase().includes("technician")) || dv.array(p.archtype).some(t => ["3pkm", "pkm", "study"].some(tag => String(t).toLowerCase().includes(tag)))).length;
> > 
> >         const dataValues = [plm, ppm, pkm];
> >         const hasData = dataValues.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: hasData ? ['Life', 'Manage', 'Knowledge'] : ['Empty Orbit'],
> >                 datasets: [{
> >                     data: hasData ? dataValues : [1],
> >                     backgroundColor: hasData ? ['#f5c2e7', '#a6e3a1', '#89dceb'] : ['var(--background-modifier-border)'],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: {
> >                 maintainAspectRatio: false, cutout: '76%',
> >                 plugins: {
> >                     legend: { 
> >                         position: 'bottom', 
> >                         labels: { color: textColor, font: { size: 9 } } // Smaller type for a small display
> >                     }
> >                 }
> >             }
> >         };
> > 
> >         const attemptRender = setInterval(() => {
> >             if (window.renderChart) {
> >                 window.renderChart(chartData, nexusContainer);
> >                 clearInterval(attemptRender);
> >             }
> >         }, 150);
> >         
> >         setTimeout(() => clearInterval(attemptRender), 5000);
> >     }
> > }
> > 
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] 📊 Status & Records
> > ```dataviewjs
> > await require(app.vault.adapter.basePath + "/zData/2scripts/calendarMonth.js")().render(dv, app);
> > ```



> [!multi-column]
> > [!calendar|wide-0] ** Week**
> > ```dataviewjs
> > await dv.view("zData/tasksCalendar", {pages: "", view: "week", firstDayOfWeek: "0", options: "style1"})
> > ```
> 
> > [!calendar|wide-5] **Month**
> > ```dataviewjs
> > await dv.view("zData/tasksCalendar", {pages: "", view: "month", firstDayOfWeek: "0", options: "style2"})
> > ```
