---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Permanent Notes Central
| [[0_Atlas/0_Dashboard/5-Notes|Notes]] | [[0_Atlas/0_Dashboard/5-Notes/1-Fleeting|🌱 Fleeting]] | [[0_Atlas/0_Dashboard/5-Notes/2-Literature|📖 Literature]] | [[0_Atlas/0_Dashboard/5-Notes/3-Permanent|💎 Permanent]] | [[0_Atlas/0_Dashboard/5-Notes/4-Atomic|⚛️ Atomic]] | [[0_Atlas/0_Dashboard/5-Notes/5-Evergreen|🌲 Evergreen]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "280px";
> >     container.style.margin = "0 auto";
> >     if (!container.querySelector('canvas')) {
> >         const linked = p => String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.note5, p.resource6, p.project3, p.task4].join(' ')).toLowerCase().includes('#5note/3permanent') || String([p.file.path, p.file.outlinks, p.note5].join(' ')).toLowerCase().includes('3_permanent');
> >         const values = [dv.pages('("5_Notes/3_Permanent" OR #5note/3permanent) AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length, dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"6_Resources" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"0_Calendar" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Permanent', 'Projects', 'Tasks', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#f9e2af', '#f38ba8', '#fab387', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >         const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!literature] **💎 Permanent Notes**
> > > ```dataview
> > > TABLE LID, status, science, discipline, file.mtime AS updated
> > > FROM "5_Notes/3_Permanent" OR #5note/3permanent AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT LID ASC, file.mtime DESC
> > > ```
> >
> > > [!source] **Knowledge Inputs**
> > > ```dataview
> > > TABLE archtype, status, resource6, file.mtime AS updated
> > > FROM "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "3_Permanent") OR contains(string(note5), "3permanent") OR contains(string(file.outlinks), "3_Permanent")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "3_Permanent") OR contains(string(note5), "3permanent") OR contains(string(archtype), "#5note/3permanent") OR contains(string(file.outlinks), "3_Permanent")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```

> [!source] **Permanent Notes Library**
> ![[0_Atlas/Bases/5-Notes/Permanent.base]]
