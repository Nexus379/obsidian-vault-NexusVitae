---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# Task Center
![[zData/5design_modul/TaskNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 🎛️ **COMMAND CENTER**
> > ```dataviewjs
> > {
> >     const container = this.container;
> >     container.style.width = "100%"; container.style.maxWidth = "240px"; container.style.height = "230px";
> >     container.style.margin = "0 auto";
> >     const clean = value => String(value ?? "").toLowerCase();
> >     const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> >     const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> >     const taskPages = pages.where(p => hasTaskContext(p));
> >     const inlineTasks = pages.where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length).file.tasks.where(t => !t.completed && (hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task")));
> >     const values = [
> >         taskPages.where(p => clean(p.status) === "1active").length + inlineTasks.length,
> >         taskPages.where(p => clean(p.status) === "review").length,
> >         taskPages.where(p => clean(p.status) === "2passive").length,
> >         taskPages.where(p => clean(p.status) === "3idea").length,
> >         taskPages.where(p => clean(p.status) === "done").length
> >     ];
> >     const hasData = values.some(v => v > 0);
> >     const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >     const chartData = { type: 'doughnut', data: { labels: hasData ? ["Active", "Review", "Passive", "Idea", "Done"] : ["All Clear"], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ["#a6e3a1", "#cba6f7", "#f9e2af", "#fab387", "#94e2d5"] : ["var(--background-modifier-border)"], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', animation: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
> >     const interval = setInterval(() => { if (window.renderChart) { const oldCanvas = container.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, container); clearInterval(interval); } }, 150);
> > }
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Priority Pulse
> > ```dataviewjs
> > const clean = value => String(value ?? "").toLowerCase();
> > const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
> > const openStatus = p => !["done", "canceled", "archive", "bin"].includes(clean(p.status)) && p.done !== true;
> > 
> > const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const items = [];
> > 
> > pages.where(p => hasTaskContext(p) && openStatus(p)).forEach(p => {
> >     items.push({ name: p.file.name, path: p.file.path, status: clean(p.status) || "1active", priority: String(p.priority ?? ""), due: p.due, source: "Task File" });
> > });
> > 
> > pages.where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
> >     .file.tasks.where(t => !t.completed && !t.path.includes("zData") && !t.path.includes("yArchive"))
> >     .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task")).forEach(t => {
> >         const p = dv.page(t.path);
> >         items.push({ name: t.text.replace(/#[^\s]+/g, "").trim(), path: t.path, status: clean(p.status) || "inline", priority: String(t.priority ?? p.priority ?? ""), due: t.due || p.due, source: p.file.name });
> > });
> > 
> > const normalizePriority = value => {
> >     const p = clean(value);
> >     if (["1", "a", "high", "highest", "🔴"].includes(p)) return "1";
> >     if (["2", "b", "medium", "🟠"].includes(p)) return "2";
> >     if (["3", "c", "low", "🟡"].includes(p)) return "3";
> >     if (["4", "d", "lowest", "🔵"].includes(p)) return "4";
> >     return "rest";
> > };
> > 
> > const dueSort = item => item.due ? moment(item.due.toString()).valueOf() : 9999999999999;
> > const dueLabel = item => item.due ? moment(item.due.toString()).format("DD.MM") : "";
> > 
> > const formatNest = (item) => `- [[${item.path}|${item.name}]] <span style="font-size:0.75em; color:var(--text-muted);">${item.source}${dueLabel(item) ? " · " + dueLabel(item) : ""}</span>`;
> > 
> > const getList = (key) => items.filter(i => normalizePriority(i.priority) === key).sort((a,b) => dueSort(a)-dueSort(b)).slice(0, 6);
> > 
> > const renderList = (key) => {
> >     const list = getList(key);
> >     return list.length ? list.map(i => "> > " + formatNest(i)).join("\n") : "> > *clear*";
> > };
> > 
> > const renderRestList = () => {
> >     const list = getList("rest");
> >     return list.length ? list.map(i => "> " + formatNest(i)).join("\n") : "> *clear*";
> > };
> > 
> > // The markdown is assembled here exactly the way Obsidian needs it:
> > const markdown = `> [!multi-column]
> > >
> > > > [!error] Prio 1
> > ${renderList("1")}
> > >
> > > > [!warning] Prio 2
> > ${renderList("2")}
> > 
> > > [!multi-column]
> > >
> > > > [!example] Prio 3
> > ${renderList("3")}
> > >
> > > > [!info] Prio 4
> > ${renderList("4")}
> > 
> > > [!note] Rest
> > ${renderRestList()}`;
> > 
> > dv.paragraph(markdown);
> > ```

 ## Status Board
```dataviewjs
await require(app.vault.adapter.basePath + "/zData/2scripts/taskCenter.js")().statusBoard(dv);
```

## Task Type Board
```dataviewjs
await require(app.vault.adapter.basePath + "/zData/2scripts/taskCenter.js")().typeBoard(dv);
```
