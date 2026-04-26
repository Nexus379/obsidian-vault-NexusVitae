---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 💌 Inbox
| [[0_Atlas/0_Dashboard/0-Dashboard|💫 Dashy]] | [[0_Atlas/0_Dashboard/0-Inbox|💌 Inbox]] | [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard-PKM| 🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard| 🪙 Finance]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Review|🔭 Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
> > [!blank]
> > 
> > ### 🔱 **NEXUS NAVIGATOR**
> > ```dataviewjs
> > { 
> >     const chartContainer = this.container;
> >     const REFRESH_COOLDOWN = 60000; // 🛑 RELAX: Only recalculate every 60 seconds
> >     const now = Date.now();
> >     
> >     // Sets container size (you can adjust px here)
> >     chartContainer.style.width = "300px";
> >     chartContainer.style.margin = "0 auto"; // Centers the chart
> >     
> >     // 🛡️ SAFETY: Check if we have already rendered
> >     if (!window.lastPieRender) window.lastPieRender = 0;
> >     const isNewTab = chartContainer.innerHTML.length < 50;
> >     const cooldownOver = (now - window.lastPieRender > REFRESH_COOLDOWN);
> > 
> >     if (isNewTab || cooldownOver) {
> >         window.lastPieRender = now;
> > 
> >         // --- 🟢 1. DATA SOURCE (Change this for other charts) ---
> >         // Here we say: Find all pages that have 'inbox: true' in YAML
> >         const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox === true); 
> > 
> >         // --- 🔵 2. LOGIC (Define what is counted here) ---
> >         const countTag = (tagPrefix) => pages.filter(p => 
> >             dv.array(p.arch).some(a => String(a).includes(tagPrefix))
> >         ).length;
> > 
> >         // This is your data array [Number, Number, Number...]
> >         const dataValues = [
> >             countTag("#0"), countTag("#1"), countTag("#2"), 
> >             countTag("#3"), countTag("#4"), countTag("#5"), countTag("#6")
> >         ];
> > 
> >         // --- 🟡 3. DESIGN (Colors and Labels) ---
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 // These labels must match the number of dataValues!
> >                 labels: ['Cal', 'Stars', 'Area', 'Proj', 'Task', 'Note', 'Res'],
> >                 datasets: [{
> >                     data: dataValues,
> >                     // You can adjust your Chakra colors here
> >                     // Sync with your Chakra logs
> >                     backgroundColor: ['#ff79c6', '#f9e2af', '#f5c2e7', '#a6e3a1', '#eba0ac', '#89dceb', '#b4befe'],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: {
> >                 cutout: '75%', // Thickness of the ring (75% hole)
> >                 animation: false, // 🛑 RELAX: No jumping while typing
> >                 plugins: {
> >                     legend: { position: 'bottom', labels: { color: textColor, font: { size: 9 } } }
> >                 }
> >             }
> >         };
> > 
> >         // --- 🏗️ 4. THE RENDER PROCESS ---
> >         const renderInterval = setInterval(() => {
> >             if (window.renderChart) {
> >                 // Delete old chart before the new one comes (prevents overlay)
> >                 const oldCanvas = chartContainer.querySelector('canvas');
> >                 if (oldCanvas) oldCanvas.remove();
> >                 
> >                 window.renderChart(chartData, chartContainer);
> >                 clearInterval(renderInterval);
> >             }
> >         }, 150);
> >         setTimeout(() => clearInterval(renderInterval), 5000);
> >     }
> > }
> > 
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!inbox|wide-5] Inbox
> > ![[0_Atlas/Bases/Inboxbase.base|Inboxbase]]
