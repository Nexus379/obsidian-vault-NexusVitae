---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# ToPay
| [[0_Atlas/0_Dashboard/4-Tasks|Tasks]] | [[0_Atlas/Bases/Tasksbase.base|Tasksbase]] | [[0_Atlas/Bases/4-Tasks/ToPay.base|ToPay.base]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

> [!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "250px";
> >     container.style.margin = "0 auto";
> >     const clean = value => String(value ?? "").toLowerCase();
> >     const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> >     const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> >     const typeKey = "topay";
> >     const typePages = pages.where(p => hasTaskContext(p) && clean(p.archtype).includes(typeKey));
> > 
> >     const statuses = [
> >         { label: "Start", key: "0start", color: "#89dceb" },
> >         { label: "Active", key: "1active", color: "#a6e3a1" },
> >         { label: "Review", key: "review", color: "#cba6f7" },
> >         { label: "Passive", key: "2passive", color: "#f9e2af" },
> >         { label: "Idea", key: "3idea", color: "#fab387" },
> >         { label: "Done", key: "done", color: "#94e2d5" }
> >     ];
> > 
> >     const values = statuses.map(s => typePages.where(p => clean(p.status) === s.key).length);
> >     const hasData = values.some(v => v > 0);
> > 
> >     const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >     const chartData = {
> >         type: 'doughnut',
> >         data: {
> >             labels: hasData ? statuses.map(s => s.label) : ["No Tasks"],
> >             datasets: [{
> >                 data: hasData ? values : [1],
> >                 backgroundColor: hasData ? statuses.map(s => s.color) : ["var(--background-modifier-border)"],
> >                 borderWidth: 0
> >             }]
> >         },
> >         options: {
> >             cutout: '80%',
> >             animation: false,
> >             plugins: {
> >                 legend: {
> >                     position: 'bottom',
> >                     labels: {
> >                         color: textColor,
> >                         font: { size: 9, weight: 'bold' },
> >                         usePointStyle: true
> >                     }
> >                 }
> >             }
> >         }
> >     };
> > 
> >     const interval = setInterval(() => {
> >         if (window.renderChart) {
> >             const oldCanvas = container.querySelector('canvas');
> >             if (oldCanvas) oldCanvas.remove();
> >             window.renderChart(chartData, container);
> >             clearInterval(interval);
> >         }
> >     }, 150);
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ```dataviewjs
> > {
> >     const clean = value => String(value ?? "").toLowerCase();
> >     const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
> >     const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> >     const openStatus = p => !["done", "canceled", "archive", "archived", "bin"].includes(clean(p.status)) && p.done !== true;
> >     const currentStatus = p => clean(p.status).includes("1active") || clean(p.status).includes("0start");
> >     const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> >     const typeKey = "topay";
> > 
> >     const items = [];
> > 
> >     pages
> >         .where(p => hasTaskContext(p) && openStatus(p) && currentStatus(p) && clean(p.archtype).includes(typeKey))
> >         .forEach(p => {
> >             items.push({ name: p.file.name, path: p.file.path, due: p.due, source: "Task File", status: clean(p.status) || "1active" });
> >         });
> > 
> >     pages
> >         .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
> >         .file.tasks
> >         .where(t => !t.completed && !t.path.includes("zData") && !t.path.includes("yArchive"))
> >         .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"))
> >         .where(t => clean(t.text).includes(typeKey) || clean(dv.page(t.path).archtype).includes(typeKey))
> >         .forEach(t => {
> >             const p = dv.page(t.path);
> >             if (!openStatus(p) || !currentStatus(p)) return;
> >             items.push({ name: t.text.replace(/#[^\\s]+/g, "").trim(), path: t.path, due: t.due || p.due, source: p.file.name, status: clean(p.status) || "inline" });
> >         });
> > 
> >     const dueSort = item => item.due ? moment(item.due.toString()).valueOf() : 9999999999999;
> >     const dueLabel = item => item.due ? moment(item.due.toString()).format("DD.MM.YYYY") : "no due";
> > 
> >     const list = items.sort((a, b) => dueSort(a) - dueSort(b)).slice(0, 12);
> >     let html = `<div style="display:flex; flex-direction:column; gap:4px;">`;
> >     if (!list.length) html += `<div style="font-size:.8em; color:var(--text-faint);">No current tasks.</div>`;
> >     for (const item of list) {
> >         html += `<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 10px; border-bottom:1px solid var(--background-modifier-border);">`;
> >         html += `<div style="min-width:0;"><a class="internal-link" href="${item.path}" style="font-weight:650; color:var(--text-normal); text-decoration:none; font-size:.9em;">${esc(item.name)}</a><div style="font-size:.65em; color:var(--text-muted);">${esc(item.source)} &middot; ${esc(item.status)}</div></div>`;
> >         html += `<div style="font-size:.68em; color:var(--text-faint); font-weight:800; white-space:nowrap;">${esc(dueLabel(item))}</div>`;
> >         html += `</div>`;
> >     }
> >     html += `</div>`;
> >     dv.el("div", html);
> > }
> > ```

> [!source] **ToPay**
> ![[0_Atlas/Bases/4-Tasks/ToPay.base]]
