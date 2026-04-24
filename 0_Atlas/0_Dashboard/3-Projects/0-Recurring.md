---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Recurring Projects
| [[0_Atlas/0_Dashboard/3-Projects|Projects]] | [[0_Atlas/0_Dashboard/3-Projects/0-Recurring|🔄 Recurring]] | [[0_Atlas/0_Dashboard/3-Projects/1-Active|⚡ Active]] | [[0_Atlas/0_Dashboard/3-Projects/2-Passive|⏳ Passive]] | [[0_Atlas/0_Dashboard/3-Projects/3-Idea|💡 Ideas]] |

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
> >         const status = "0recurring";
> >         const hasStatus = p => dv.array(p.status).some(v => String(v).toLowerCase() === status);
> >         const types = [
> >             { label: "Pro-Do", tag: "#3project/prodo", color: "#f38ba8" },
> >             { label: "Pro-Go", tag: "#3project/progo", color: "#fab387" },
> >             { label: "Pro-Study", tag: "#3project/prostudy", color: "#89dceb" },
> >             { label: "Pro-Meet", tag: "#3project/promeet", color: "#f9e2af" },
> >             { label: "Pro-Buy", tag: "#3project/probuy", color: "#a6e3a1" },
> >             { label: "Pro-Pay", tag: "#3project/propay", color: "#94e2d5" },
> >             { label: "Pro-Cook", tag: "#3project/procook", color: "#cba6f7" },
> >             { label: "Pro-Craft", tag: "#3project/procraft", color: "#b4befe" }
> >         ];
> >         const pages = dv.pages('"3_Projects"').where(hasStatus);
> >         const counts = types.map(t => pages.where(p => dv.array(p.archtype).some(v => String(v).toLowerCase() === t.tag)).length);
> >         const hasData = counts.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: hasData ? types.map(t => t.label) : ["No projects yet"],
> >                 datasets: [{ data: hasData ? counts : [1], backgroundColor: hasData ? types.map(t => t.color) : ["var(--background-modifier-border)"], borderWidth: 0 }]
> >             },
> >             options: { cutout: '80%', animation: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } }
> >         };
> >         const interval = setInterval(() => {
> >             if (window.renderChart) {
> >                 const oldCanvas = container.querySelector('canvas');
> >                 if (oldCanvas) oldCanvas.remove();
> >                 window.renderChart(chartData, container);
> >                 clearInterval(interval);
> >             }
> >         }, 150);
> >     }
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!repeat] **🔄 Recurring**
> > > ```dataview
> > > TABLE archtype, priority, due, area2, stars1, file.mtime AS updated
> > > FROM "3_Projects"
> > > WHERE string(status) = "0recurring"
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!project] **Project Types**
> > > ```dataview
> > > TABLE rows.file.link AS Projects
> > > FROM "3_Projects"
> > > WHERE string(status) = "0recurring"
> > > GROUP BY archtype
> > > SORT key ASC
> > > ```
