---
cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0
---
# Purpose Central
| [[0_Atlas/0_Dashboard/1-Stars|Stars]] | [[0_Atlas/0_Dashboard/1-Stars/1-Purpose|Purpose]] | [[0_Atlas/0_Dashboard/1-Stars/2-Vision|Vision]] | [[0_Atlas/0_Dashboard/1-Stars/3-Goals|Goals]] |

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
> >     if (chartContainer.innerHTML.length < 50) {
> >         const linked = p => {
> >             const hay = String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.stars1, p.parent, p.sibling, p.child, p.project3, p.task4, p.note5, p.resource6].join(' ')).toLowerCase();
> >             return hay.includes('#1stars/1purpose') || hay.includes('1stars/1purpose') || hay.includes('1_stars/1_purpose') || hay.includes('1purpose');
> >         };
> >         const values = [
> >             dv.pages('#1stars/1purpose AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length,
> >             dv.pages('#1stars/2vision AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('#1stars/3goals AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('("5_Notes" OR "6_Resources") AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Purpose', 'Vision', 'Goals', 'Projects', 'Tasks', 'Knowledge'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#cba6f7', '#89b4fa', '#94e2d5', '#fab387', '#f38ba8', '#a6e3a1'] : ['var(--background-modifier-border)'], borderWidth: 0, hoverOffset: 12 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 12, weight: 'bold', family: 'serif' }, padding: 20, usePointStyle: true } } } } };
> >         const renderInterval = setInterval(() => { if (window.renderChart) { const oldCanvas = chartContainer.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, chartContainer); clearInterval(renderInterval); } }, 150);
> >         setTimeout(() => clearInterval(renderInterval), 5000);
> >     }
> > }
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] 📊 Status & Records
> > 
> > > [!purpose] **Purpose Anchors**
> > > ```dataview
> > > TABLE status, priority, file.mtime AS updated
> > > FROM #1stars/1purpose AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT file.mtime DESC
> > > ```

> [!source] **Purpose Library**
> ![[0_Atlas/Bases/1-Stars/Purpose.base]]
> >
> > > [!vision] **Vision and Goals**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "1_Stars/2_Vision" OR "1_Stars/3_Goals" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(stars1), "1_Purpose") OR contains(string(stars1), "1purpose") OR contains(string(parent), "1_Purpose") OR contains(string(file.outlinks), "1_Purpose")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!project] **Projects and Tasks**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(stars1), "1_Purpose") OR contains(string(stars1), "1purpose") OR contains(string(parent), "1_Purpose") OR contains(string(file.outlinks), "1_Purpose")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!literature] **Notes and Resources**
> > > ```dataview
> > > TABLE archtype, status, discipline, file.mtime AS updated
> > > FROM "5_Notes" OR "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(stars1), "1_Purpose") OR contains(string(stars1), "1purpose") OR contains(string(parent), "1_Purpose") OR contains(string(file.outlinks), "1_Purpose")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
