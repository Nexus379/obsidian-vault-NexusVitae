---
cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0
---

# 💫 Celestial Navigation (Stars)
| [[0_Atlas/0_Dashboard/1-Stars/1-Purpose|🌟 Purpose]] | [[0_Atlas/0_Dashboard/1-Stars/2-Vision|🧭 Vision]] | [[0_Atlas/0_Dashboard/1-Stars/3-Goals|🎯 Goals]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
> 
> > [!hub|wide-0] 🗺️ **ATLAS & ACTION**
> > 
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     chartContainer.style.width = "280px";
> >     chartContainer.style.margin = "0 auto";
> >     
> >     if (chartContainer.innerHTML.length < 50) {
> >         // Fetches all pages except the data folder
> >         const entries = dv.pages('!"zData"');
> > 
> >         // 🔱 YOUR STARS LOGIC (Purpose, Vision, Goals)
> >         // Path update for Stars:
> >         const purpose = dv.pages('"1_Stars/1_Purpose" AND !"zData"').length;
> >         const vision = dv.pages('"1_Stars/2_Vision" AND !"zData"').length;
> >         const goals = dv.pages('"1_Stars/3_Goals" AND !"zData"').length;
> > 
> > 
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: ['🌟 Purpose', '🧭 Vision', '🎯 Goals'],
> >                 datasets: [{
> >                     data: [purpose, vision, goals],
> >                     // 🎨 Your Celestial Colors (Purple, Blue, Turquoise)
> >                     backgroundColor: ['#cba6f7', '#89b4fa', '#94e2d5'], 
> >                     // 🚫 NO BORDERS (Neither Black nor White)
> >                     borderWidth: 0, 
> >                     hoverOffset: 12
> >                 }]
> >             },
> >             options: {
> >                 cutout: '80%', // Elegant, thin orbit
> >                 plugins: {
> >                     legend: { 
> >                         position: 'bottom', 
> >                         labels: { 
> >                             // ✍️ FONT: Automatically dark in Light Mode!
> >                             color: textColor, 
> >                             font: { size: 12, weight: 'bold', family: 'serif' },
> >                             padding: 20,
> >                             usePointStyle: true 
> >                         } 
> >                     }
> >                 }
> >             }
> >         };
> > 
> >         const renderInterval = setInterval(() => {
> >             if (window.renderChart) {
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
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] 📊 Status & Records
> > 
> > > [!multi-column]
> > >
> > >> [!purpose] **1 🌟 Purpose**
> > >> *Your Why – The anchor of your existence.*
> > >> `$= dv.list(dv.pages('#1stars/1purpose AND !"zData"').file.link)`
> > >
> > >> [!vision] **2 🧭 Vision**
> > >> *The 5-10 year horizon.*
> > >> `$= dv.list(dv.pages('#1stars/2vision AND !"zData"').file.link)`
> > >
> > >> [!goals] **3 🎯 Goals**
> > >> *Active milestones.*
> > >> `$= dv.list(dv.pages('#1stars/3goals AND !"zData"').where(p => !dv.array(p.status).includes("❇️done")).file.link)`
> >   
> > > [!blank]
> > > ### 🌌 Current Trajectory (Recent Insights)
> > > ```dataview
> > > TASK
> > > FROM (#4🛠️ OR #3🚧) AND !"zData"
> > > WHERE !completed 
> > > AND (
> > >     contains(stars1, "3 🎯 Goals") OR 
> > >     contains(parent, "3 🎯 Goals") OR
> > >     contains(project3.stars1, "3 🎯 Goals")
> > > )
> > > SORT priority DESC
> > > LIMIT 8
> > > ```

