---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Evergreen Notes Central
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
> >         const linked = p => String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.note5, p.resource6, p.project3, p.task4].join(' ')).toLowerCase().includes('#5note/5evergreen') || String([p.file.path, p.file.outlinks, p.note5].join(' ')).toLowerCase().includes('5_evergreen');
> >         const values = [dv.pages('("5_Notes/5_Evergreen" OR #5note/5evergreen) AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length, dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"6_Resources" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"0_Calendar" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Evergreen', 'Projects', 'Tasks', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#94e2d5', '#f38ba8', '#fab387', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >         const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!literature] **🌲 Evergreen Notes**
> > > ```dataview
> > > TABLE LID, status, science, discipline, file.mtime AS updated
> > > FROM "5_Notes/5_Evergreen" OR #5note/5evergreen AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!source] **Inputs and References**
> > > ```dataview
> > > TABLE archtype, status, resource6, file.mtime AS updated
> > > FROM "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "5_Evergreen") OR contains(string(note5), "5evergreen") OR contains(string(file.outlinks), "5_Evergreen")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "5_Evergreen") OR contains(string(note5), "5evergreen") OR contains(string(archtype), "#5note/5evergreen") OR contains(string(file.outlinks), "5_Evergreen")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```

> [!source] **Evergreen Notes Library**
> ![[0_Atlas/Bases/5-Notes/Evergreen.base]]
