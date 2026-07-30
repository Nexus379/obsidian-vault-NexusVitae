---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Atomic Notes Central
![[zData/5design_modul/NoteNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 🗃️ **ATOMIC FLOW**
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "100%"; container.style.maxWidth = "240px"; container.style.height = "230px";
> >     container.style.margin = "0 auto";
> >     if (!container.querySelector('canvas')) {
> >         const pages = dv.pages('#5note/3atomic AND !"zData" AND -"yArchive"').where(p => p.inbox !== true);
> >         const values = [
> >             pages.where(p => !String(p.archtype).toLowerCase().includes('studycards') && !String(p.archtype).toLowerCase().includes('cards') && !String(p.archtype).toLowerCase().includes('nutrition')).length,
> >             pages.where(p => String(p.archtype).toLowerCase().includes('studycards')).length,
> >             pages.where(p => String(p.archtype).toLowerCase().includes('cards')).length,
> >             pages.where(p => String(p.archtype).toLowerCase().includes('nutrition')).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Atomic', 'Studycards', 'Cards', 'Nutrition'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#a6e3a1', '#89b4fa', '#f9e2af', '#fab387'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >         const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!literature] **⚛️ Atomic Notes**
> > > ```dataview
> > > TABLE LID, status, science, discipline, file.mtime AS updated
> > > FROM "5_Notes/3_Atomic" OR #5note/3atomic AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT LID ASC, file.mtime DESC
> > > ```
> >
> > > [!info] **Atomic Branches**
> > > ```dataview
> > > TABLE rows.file.link AS Notes
> > > FROM "5_Notes/3_Atomic" OR #5note/3atomic AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > GROUP BY archtype
> > > SORT key ASC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(note5), "3_Atomic") OR contains(string(note5), "3atomic") OR contains(string(archtype), "#5note/3atomic") OR contains(string(file.outlinks), "3_Atomic")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```

> [!source] **Atomic Notes Library**
> ![[0_Atlas/Bases/5-Notes/Atomic.base]]
