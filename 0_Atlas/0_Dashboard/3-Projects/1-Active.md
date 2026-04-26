---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Active Projects
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
> >         const status = "1active";
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
> >         const pages = dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(hasStatus);
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
> > > [!project] **⚡ Active**
> > > ```dataview
> > > TABLE archtype, priority, due, area2, stars1, file.mtime AS updated
> > > FROM "3_Projects" AND !"zData" AND -"yArchive"
> > > WHERE string(status) = "1active" AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!project] **Project Types**
> > > ```dataview
> > > TABLE rows.file.link AS Projects
> > > FROM "3_Projects" AND !"zData" AND -"yArchive"
> > > WHERE string(status) = "1active" AND inbox != true
> > > GROUP BY archtype
> > > SORT key ASC
> > > ```
> >
> > > [!info] **Type Board**
> > > ```dataviewjs
> > > const clean = value => String(value ?? "").toLowerCase();
> > > const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
> > > const pages = dv.pages('"3_Projects" AND !"zData" AND -"yArchive"')
> > >   .where(p => p.inbox !== true)
> > >   .where(p => String(p.status).toLowerCase() === "1active");
> > > 
> > > const types = [
> > >   { label: "Pro-Do", tag: "#3project/prodo", color: "#f38ba8" },
> > >   { label: "Pro-Go", tag: "#3project/progo", color: "#fab387" },
> > >   { label: "Pro-Study", tag: "#3project/prostudy", color: "#89dceb" },
> > >   { label: "Pro-Meet", tag: "#3project/promeet", color: "#f9e2af" },
> > >   { label: "Pro-Buy", tag: "#3project/probuy", color: "#a6e3a1" },
> > >   { label: "Pro-Pay", tag: "#3project/propay", color: "#94e2d5" },
> > >   { label: "Pro-Cook", tag: "#3project/procook", color: "#cba6f7" },
> > >   { label: "Pro-Craft", tag: "#3project/procraft", color: "#b4befe" }
> > > ];
> > > 
> > > const hasType = (p, tag) => clean(dv.array(p.archtype).join(" ")).includes(clean(tag));
> > > const dueSort = p => p.due ? moment(p.due.toString()).valueOf() : 9999999999999;
> > > const dueLabel = p => p.due ? moment(p.due.toString()).format("DD.MM") : "";
> > > 
> > > let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">`;
> > > for (const t of types) {
> > >   const list = pages
> > >     .where(p => hasType(p, t.tag))
> > >     .sort(p => p.priority, "desc")
> > >     .sort(p => dueSort(p), "asc")
> > >     .slice(0, 6);
> > > 
> > >   const total = pages.where(p => hasType(p, t.tag)).length;
> > >   html += `<div style="border-left:3px solid ${t.color}; background:var(--background-secondary); border-radius:6px; padding:8px;">`;
> > >   html += `<div style="font-size:.72em; font-weight:800; color:${t.color}; text-transform:uppercase; margin-bottom:6px;">${esc(t.label)} · ${total}</div>`;
> > >   if (!list.length) html += `<div style="font-size:.7em; color:var(--text-faint);">empty</div>`;
> > >   for (const p of list) {
> > >     html += `<div style="padding:5px 0; border-top:1px solid var(--background-modifier-border);"><a class="internal-link" href="${p.file.path}" style="font-size:.78em; font-weight:650; color:var(--text-normal); text-decoration:none;">${esc(p.file.name)}</a><div style="font-size:.62em; color:var(--text-muted);">${dueLabel(p) ? dueLabel(p) : ""}</div></div>`;
> > >   }
> > >   html += `</div>`;
> > > }
> > > html += `</div>`;
> > > dv.el("div", html);
> > > ```
