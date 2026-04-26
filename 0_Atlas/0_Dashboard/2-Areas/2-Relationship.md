---

cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0
---
# Relationship Central
| [[0_Atlas/0_Dashboard/2-Areas|Areas]] | [[0_Atlas/0_Dashboard/2-Areas/1-Selfcare|🌸 Selfcare]] | [[0_Atlas/0_Dashboard/2-Areas/2-Relationship|🦄 Relationship]] | [[0_Atlas/0_Dashboard/2-Areas/3-Mind|🧠 Mind]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize|🧩 Organize]] | [[0_Atlas/0_Dashboard/2-Areas/5-Creativity|🎨 Creativity]] | [[0_Atlas/0_Dashboard/2-Areas/6-Activity|🚵 Activity]] | [[0_Atlas/0_Dashboard/2-Areas/7-Entertainment|🕹️ Entertainment]] |

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
> >             const hay = String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.area2, p.parent, p.sibling, p.child, p.project3, p.task4, p.note5, p.resource6].join(' ')).toLowerCase();
> >             return hay.includes('#2area/2relationship') || hay.includes('2area/2relationship') || hay.includes('2_areas/2_relationship') || hay.includes('2_relationship') || hay.includes('2relationship');
> >         };
> >         const values = [
> >             dv.pages('#2area/2relationship AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length,
> >             dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"5_Notes" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"6_Resources" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"0_Calendar" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Relationship', 'Projects', 'Tasks', 'Notes', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#ffb3ff', '#fab387', '#f38ba8', '#a6e3a1', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0, hoverOffset: 12 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 12, weight: 'bold', family: 'serif' }, padding: 20, usePointStyle: true } } } } };
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
> > > [!soul] **🦄 Relationship Entries**
> > > ```dataview
> > > TABLE status, priority, area2, file.mtime AS updated
> > > FROM #2area/2relationship AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Projects and Tasks**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "2_Relationship") OR contains(string(area2), "2relationship") OR contains(string(archtype), "#2area/2relationship") OR contains(string(file.outlinks), "2_Relationship")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!literature] **Notes and Resources**
> > > ```dataview
> > > TABLE archtype, status, discipline, file.mtime AS updated
> > > FROM "5_Notes" OR "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "2_Relationship") OR contains(string(area2), "2relationship") OR contains(string(archtype), "#2area/2relationship") OR contains(string(file.outlinks), "2_Relationship")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!info] **Logs and Reviews**
> > > ```dataview
> > > TABLE archtype, status, file.mtime AS updated
> > > FROM "0_Calendar" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "2_Relationship") OR contains(string(area2), "2relationship") OR contains(string(archtype), "#2area/2relationship") OR contains(string(file.outlinks), "2_Relationship")) AND inbox != true
> > > SORT file.mtime DESC
> > > LIMIT 12
> > > ```

> [!source] **Relationship Library**
> ![[0_Atlas/Bases/2-Areas/Relationship.base]]
