---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Atomic Notes Central
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
> >         const pages = dv.pages('#5note/4atomic AND !"zData"');
> >         const values = [
> >             pages.where(p => !String(p.archtype).toLowerCase().includes('anki') && !String(p.archtype).toLowerCase().includes('nutrition')).length,
> >             pages.where(p => String(p.archtype).toLowerCase().includes('anki')).length,
> >             pages.where(p => String(p.archtype).toLowerCase().includes('nutrition')).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Atomic', 'Anki', 'Nutrition'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#a6e3a1', '#cba6f7', '#fab387'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
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
> > > FROM "5_Notes/4_Atomic" OR #5note/4atomic AND !"zData"
> > > SORT LID ASC, file.mtime DESC
> > > ```
> >
> > > [!info] **Atomic Branches**
> > > ```dataview
> > > TABLE rows.file.link AS Notes
> > > FROM "5_Notes/4_Atomic" OR #5note/4atomic AND !"zData"
> > > GROUP BY archtype
> > > SORT key ASC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData"
> > > WHERE contains(string(note5), "4_Atomic") OR contains(string(note5), "4atomic") OR contains(string(archtype), "#5note/4atomic") OR contains(string(file.outlinks), "4_Atomic")
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
