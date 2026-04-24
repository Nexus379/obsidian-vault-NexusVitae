---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Fleeting Notes Central
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
> >         const linked = p => String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.note5, p.resource6, p.project3, p.task4].join(' ')).toLowerCase().includes('#5note/1fleeting') || String([p.file.path, p.file.outlinks, p.note5].join(' ')).toLowerCase().includes('1_fleeting');
> >         const values = [
> >             dv.pages('"5_Notes/1_Fleeting" OR #5note/1fleeting').length,
> >             dv.pages('"3_Projects"').where(linked).length,
> >             dv.pages('"4_Tasks"').where(linked).length,
> >             dv.pages('"6_Resources"').where(linked).length,
> >             dv.pages('"0_Calendar"').where(linked).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Fleeting', 'Projects', 'Tasks', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#fab387', '#f38ba8', '#89dceb', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >         const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!literature] **🌱 Fleeting Notes**
> > > ```dataview
> > > TABLE status, priority, file.mtime AS updated
> > > FROM "5_Notes/1_Fleeting" OR #5note/1fleeting AND !"zData"
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!project] **Linked Work**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData"
> > > WHERE contains(string(note5), "1_Fleeting") OR contains(string(note5), "1fleeting") OR contains(string(archtype), "#5note/1fleeting") OR contains(string(file.outlinks), "1_Fleeting")
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!source] **Linked Resources**
> > > ```dataview
> > > TABLE archtype, status, resource6, file.mtime AS updated
> > > FROM "6_Resources" AND !"zData"
> > > WHERE contains(string(note5), "1_Fleeting") OR contains(string(note5), "1fleeting") OR contains(string(file.outlinks), "1_Fleeting")
> > > SORT file.mtime DESC
> > > ```
