---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# Task Center
| [[0_Atlas/0_Dashboard/4-Tasks|Tasks]] | [[0_Atlas/Bases/Tasksbase.base|Tasksbase]] |

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
> >     const chartData = { type: 'doughnut', data: { labels: hasData ? ["Active", "Review", "Passive", "Idea", "Done"] : ["All Clear"], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ["#a6e3a1", "#cba6f7", "#f9e2af", "#fab387", "#94e2d5"] : ["var(--background-modifier-border)"], borderWidth: 0 }] }, options: { cutout: '80%', animation: false, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } };
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
> > // Hier wird das Markdown fehlerfrei und millimetergenau für Obsidian zusammengebaut:
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
const clean = value => String(value ?? "").toLowerCase();
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
const items = [];
pages.where(p => hasTaskContext(p)).forEach(p => items.push({ name: p.file.name, path: p.file.path, status: clean(p.status) || "1active", priority: String(p.priority ?? ""), due: p.due, archtype: String(dv.array(p.archtype).join(", ")), source: "Task File" }));
pages.where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length).file.tasks.where(t => !t.path.includes("zData") && !t.path.includes("yArchive")).where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task")).forEach(t => {
    const p = dv.page(t.path);
    items.push({ name: t.text.replace(/#[^\s]+/g, "").trim(), path: t.path, status: t.completed ? "done" : (clean(p.status) || "inline"), priority: String(t.priority ?? p.priority ?? ""), due: t.due || p.due, archtype: String(dv.array(p.archtype).join(", ")), source: p.file.name });
});
const statuses = [
    { key: "0start", title: "Start", color: "#89dceb" },
    { key: "1active", title: "Active", color: "#a6e3a1" },
    { key: "review", title: "Review", color: "#cba6f7" },
    { key: "2passive", title: "Passive", color: "#f9e2af" },
    { key: "3idea", title: "Idea", color: "#fab387" },
    { key: "inline", title: "Inline", color: "#bac2de" },
    { key: "done", title: "Done", color: "#94e2d5" }
];
const dueSort = item => item.due ? moment(item.due.toString()).valueOf() : 9999999999999;
const dueLabel = item => item.due ? moment(item.due.toString()).format("DD.MM.YYYY") : "";
const archLabel = item => item.archtype.replace(/#4task\//g, "").replace(/#4task/g, "").trim();
let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">`;
for (const status of statuses) {
    const list = items.filter(item => item.status === status.key).sort((a, b) => dueSort(a) - dueSort(b)).slice(0, 18);
    html += `<div style="border-left:3px solid ${status.color}; background:var(--background-secondary); border-radius:6px; padding:8px;">`;
    html += `<div style="font-size:.72em; font-weight:800; color:${status.color}; text-transform:uppercase; margin-bottom:6px;">${status.title} · ${list.length}</div>`;
    if (!list.length) html += `<div style="font-size:.7em; color:var(--text-faint);">empty</div>`;
    for (const item of list) {
        html += `<div style="padding:5px 0; border-top:1px solid var(--background-modifier-border);"><a class="internal-link" href="${item.path}" style="font-size:.78em; font-weight:650; color:var(--text-normal); text-decoration:none;">${esc(item.name)}</a><div style="font-size:.62em; color:var(--text-muted);">${esc(item.source)}${archLabel(item) ? " · " + esc(archLabel(item)) : ""}${dueLabel(item) ? " · " + dueLabel(item) : ""}</div></div>`;
    }
    html += `</div>`;
}
html += `</div>`;
dv.el("div", html);
```

## Task Type Board
```dataviewjs
const clean = value => String(value ?? "").toLowerCase();
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const hasTaskContext = p => clean(p.arch).includes("#4task") || clean(p.archtype).includes("#4task") || p.file.path.includes("4_Tasks");
const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
const openStatus = p => !["done", "canceled", "archive", "archived", "bin"].includes(clean(p.status)) && p.done !== true;

const types = [
  { label: "Cook", key: "tocook", color: "#f38ba8" },
  { label: "Craft", key: "tocraft", color: "#fab387" },
  { label: "Pay", key: "topay", color: "#f9e2af" },
  { label: "Buy", key: "tobuy", color: "#eed49f" },
  { label: "Do", key: "todo", color: "#a6e3a1" },
  { label: "Go", key: "togo", color: "#94e2d5" },
  { label: "Meet", key: "tomeet", color: "#89dceb" },
  { label: "Study", key: "tostudy", color: "#89b4fa" },
  { label: "Get", key: "toget", color: "#cba6f7" }
];

const getTypeKey = (archtype, text) => {
  const hay = `${clean(archtype)} ${clean(text)}`;
  const found = types.find(t => hay.includes(t.key));
  return found ? found.key : "other";
};

const items = [];

pages.where(p => hasTaskContext(p) && openStatus(p)).forEach(p => {
  items.push({
    name: p.file.name,
    path: p.file.path,
    due: p.due,
    source: "Task File",
    type: getTypeKey(dv.array(p.archtype).join(" "), "")
  });
});

pages
  .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
  .file.tasks
  .where(t => !t.completed)
  .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"))
  .forEach(t => {
    const p = dv.page(t.path);
    items.push({
      name: t.text.replace(/#[^\s]+/g, "").trim(),
      path: t.path,
      due: t.due || p.due,
      source: p.file.name,
      type: getTypeKey(dv.array(p.archtype).join(" "), t.text)
    });
  });

const dueSort = item => item.due ? moment(item.due.toString()).valueOf() : 9999999999999;
const dueLabel = item => item.due ? moment(item.due.toString()).format("DD.MM") : "";

const grouped = new Map();
types.forEach(t => grouped.set(t.key, []));
grouped.set("other", []);

items.forEach(i => {
  if (!grouped.has(i.type)) grouped.set(i.type, []);
  grouped.get(i.type).push(i);
});

let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">`;

for (const t of [...types, { label: "Other", key: "other", color: "var(--text-muted)" }]) {
  const list = (grouped.get(t.key) ?? []).sort((a, b) => dueSort(a) - dueSort(b));
  const top = list.slice(0, 6);
  html += `<div style="border-left:3px solid ${t.color}; background:var(--background-secondary); border-radius:6px; padding:8px;">`;
  html += `<div style="font-size:.72em; font-weight:800; color:${t.color}; text-transform:uppercase; margin-bottom:6px;">${esc(t.label)} · ${list.length}</div>`;
  if (!top.length) html += `<div style="font-size:.7em; color:var(--text-faint);">empty</div>`;
  for (const item of top) {
    html += `<div style="padding:5px 0; border-top:1px solid var(--background-modifier-border);"><a class="internal-link" href="${item.path}" style="font-size:.78em; font-weight:650; color:var(--text-normal); text-decoration:none;">${esc(item.name)}</a><div style="font-size:.62em; color:var(--text-muted);">${esc(item.source)}${dueLabel(item) ? " · " + dueLabel(item) : ""}</div></div>`;
  }
  html += `</div>`;
}

html += `</div>`;
dv.el("div", html);
```
