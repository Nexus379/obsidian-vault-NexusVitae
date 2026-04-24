---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# Tasks
| [[0_Atlas/Bases/Tasksbase.base|Tasksbase]] | [[0_Atlas/0_Dashboard/4-Tasks/1-Task-Center|Task Center]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

>[!multi-column]
>
> > [!blank|wide-0]
> > ### 🔱 **NEXUS NAVIGATOR**
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "250px";
> >     container.style.margin = "0 auto";
> >     const clean = value => String(value ?? "").toLowerCase();
> >     const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> >     const pages = dv.pages('!"zData"').where(p => !p.file.path.includes("zData") && !p.file.path.includes("yArchive"));
> >     const taskPages = pages.where(p => hasTaskContext(p) && p.done !== true && !["done", "canceled", "archive", "bin"].includes(clean(p.status)));
> >     const inlineTasks = pages
> >         .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
> >         .file.tasks
> >         .where(t => !t.completed && !t.path.includes("zData") && !t.path.includes("yArchive"))
> >         .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"));
> >     const types = [
> >         { label: "Cook", key: "tocook", color: "#f38ba8" },
> >         { label: "Craft", key: "tocraft", color: "#fab387" },
> >         { label: "Pay", key: "topay", color: "#f9e2af" },
> >         { label: "Buy", key: "tobuy", color: "#eed49f" },
> >         { label: "Do", key: "todo", color: "#a6e3a1" },
> >         { label: "Go", key: "togo", color: "#94e2d5" },
> >         { label: "Meet", key: "tomeet", color: "#89dceb" },
> >         { label: "Study", key: "tostudy", color: "#89b4fa" }
> >     ];
> >     const counts = types.map(type => {
> >         const fileCount = taskPages.where(p => clean(p.archtype).includes(type.key)).length;
> >         const inlineCount = inlineTasks.where(t => clean(t.text).includes(type.key) || clean(dv.page(t.path).archtype).includes(type.key)).length;
> >         return fileCount + inlineCount;
> >     });
> >     const hasData = counts.some(v => v > 0);
> >     const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >     const chartData = { type: 'doughnut', data: { labels: hasData ? types.map(t => t.label) : ["All Clear"], datasets: [{ data: hasData ? counts : [1], backgroundColor: hasData ? types.map(t => t.color) : ["var(--background-modifier-border)"], borderWidth: 0 }] }, options: { cutout: '80%', animation: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >     const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Upcoming Tasks
> > ```dataviewjs
> > {
> >     const clean = value => String(value ?? "").toLowerCase();
> >     const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
> >     const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> >     const pages = dv.pages('!"zData"').where(p => !p.file.path.includes("zData") && !p.file.path.includes("yArchive"));
> >     const items = [];
> >     pages.where(p => hasTaskContext(p) && p.done !== true && !["done", "canceled", "archive", "bin"].includes(clean(p.status))).forEach(p => {
> >         items.push({ name: p.file.name, path: p.file.path, due: p.due, source: "Task File", status: clean(p.status) || "1active" });
> >     });
> >     pages
> >         .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
> >         .file.tasks
> >         .where(t => !t.completed && !t.path.includes("zData") && !t.path.includes("yArchive"))
> >         .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"))
> >         .forEach(t => {
> >             const p = dv.page(t.path);
> >             items.push({ name: t.text.replace(/#[^\s]+/g, "").trim(), path: t.path, due: t.due || p.due, source: p.file.name, status: clean(p.status) || "inline" });
> >         });
> >     const dueSort = item => item.due ? moment(item.due.toString()).valueOf() : 9999999999999;
> >     const dueLabel = item => item.due ? moment(item.due.toString()).format("DD.MM.YYYY") : "no due";
> >     const list = items.sort((a, b) => dueSort(a) - dueSort(b)).slice(0, 18);
> >     let html = `<div style="display:flex; flex-direction:column; gap:4px;">`;
> >     if (!list.length) html += `<div style="font-size:.8em; color:var(--text-faint);">No open tasks.</div>`;
> >     for (const item of list) {
> >         html += `<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 10px; border-bottom:1px solid var(--background-modifier-border);">`;
> >         html += `<div style="min-width:0;"><a class="internal-link" href="${item.path}" style="font-weight:650; color:var(--text-normal); text-decoration:none; font-size:.9em;">${esc(item.name)}</a><div style="font-size:.65em; color:var(--text-muted);">${esc(item.source)} &middot; ${esc(item.status)}</div></div>`;
> >         html += `<div style="font-size:.68em; color:var(--text-faint); font-weight:800; white-space:nowrap;">${dueLabel(item)}</div>`;
> >         html += `</div>`;
> >     }
> >     html += `</div>`;
> >     dv.el("div", html);
> > }
> > ```
> >
> > ### Week Calendar
> > ```dataviewjs
> > const clean = value => String(value ?? "").toLowerCase();
> > const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> > const pages = dv.pages('!"zData"').where(p => !p.file.path.includes("zData") && !p.file.path.includes("yArchive"));
> > const taskCalendarTasks = pages
> >     .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
> >     .file.tasks
> >     .where(t => !t.completed && !t.path.includes("zData") && !t.path.includes("yArchive"))
> >     .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"));
> > await dv.view("zData/tasksCalendar", {pages: taskCalendarTasks, view: "week", firstDayOfWeek: "0", options: "style4 lineClamp1"})
> > ```

> [!important] Task Center
> [[0_Atlas/0_Dashboard/4-Tasks/1-Task-Center|Open detailed Task Center]]
