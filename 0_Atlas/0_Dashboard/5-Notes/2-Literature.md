---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Literature Notes Central
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
> >         const linked = p => String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.note5, p.resource6, p.project3, p.task4].join(' ')).toLowerCase().includes('#5note/2literature') || String([p.file.path, p.file.outlinks, p.note5].join(' ')).toLowerCase().includes('2_literature');
> >         const values = [dv.pages('"5_Notes/2_Literature" OR #5note/2literature').length, dv.pages('"3_Projects"').where(linked).length, dv.pages('"4_Tasks"').where(linked).length, dv.pages('"6_Resources"').where(linked).length, dv.pages('"0_Calendar"').where(linked).length];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Literature', 'Projects', 'Tasks', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#89dceb', '#f38ba8', '#fab387', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >         const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!literature] **📖 Literature Notes**
> > > ```dataview
> > > TABLE status, science, discipline, resource6, file.mtime AS updated
> > > FROM "5_Notes/2_Literature" OR #5note/2literature AND !"zData"
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!source] **Source Connections**
> > > ```dataview
> > > TABLE archtype, status, resource6, file.mtime AS updated
> > > FROM "6_Resources"
> > > WHERE contains(string(note5), "2_Literature") OR contains(string(note5), "2literature") OR contains(string(file.outlinks), "2_Literature")
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks"
> > > WHERE contains(string(note5), "2_Literature") OR contains(string(note5), "2literature") OR contains(string(archtype), "#5note/2literature") OR contains(string(file.outlinks), "2_Literature")
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
