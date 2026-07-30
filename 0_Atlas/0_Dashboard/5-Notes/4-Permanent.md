---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Permanent Notes Central
![[zData/5design_modul/NoteNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 📜 **PERMANENT FLOW**
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "100%"; container.style.maxWidth = "240px"; container.style.height = "230px";
> >     container.style.margin = "0 auto";
> >     if (!container.querySelector('canvas')) {
> >         const linked = p => String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.note5, p.resource6, p.project3, p.task4].join(' ')).toLowerCase().includes('#5note/4permanent') || String([p.file.path, p.file.outlinks, p.note5].join(' ')).toLowerCase().includes('4_Permanent');
> >         const values = [dv.pages('("5_Notes/4_Permanent" OR #5note/4permanent) AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length, dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"6_Resources" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length, dv.pages('"0_Calendar" AND !"zData" AND -"yArchive"').where(linked).where(p => p.inbox !== true).length];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Permanent', 'Projects', 'Tasks', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#f9e2af', '#f38ba8', '#fab387', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
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
> > > FROM "5_Notes/4_Permanent" OR #5note/4permanent AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT LID ASC, file.mtime DESC
> > > ```
> >
> > > [!source] **Knowledge Inputs**
> > > ```dataview
> > > TABLE archtype, status, resource6, file.mtime AS updated
> > > FROM "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "4_Permanent") OR contains(string(note5), "4permanent") OR contains(string(file.outlinks), "4_Permanent")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "4_Permanent") OR contains(string(note5), "4permanent") OR contains(string(archtype), "#5note/4permanent") OR contains(string(file.outlinks), "4_Permanent")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```

> [!source] **Permanent Notes Library**
> ![[0_Atlas/Bases/5-Notes/Permanent.base]]
