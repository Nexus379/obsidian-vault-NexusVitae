<%-*
const dv = app.plugins.plugins.dataview?.api;
let areaName = tp.variables.areaName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🏔️ Area Cockpit: [[<%- areaName %>]]

![[zData/5design_modul/OverviewNavigationModul]]

```dataviewjs
const aName = "<%- areaName %>";
const projs = dv.pages('"3_Projects"').where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/") && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName));
const res = dv.pages('"6_Resources"').where(p => p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName));

dv.paragraph(`> [!abstract] 📊 **Area Master Metrics**\n> 🧩 **Projects:** ${projs.length} | 🎯 **Active Tasks:** ${tasks.length} | 🗃️ **Notes:** ${notes.length} | 🔖 **Resources:** ${res.length}`);
```

---

> [!multi-column]
> > [!summary|wide-2] 🧩 Active Projects
> > ```dataviewjs
> > const aName = "<%- areaName %>";
> > const projs = dv.pages('"3_Projects"').where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/") && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
> > if (projs.length > 0) {
> >     dv.table(["🧩 Project", "🚦 Status"], projs.map(p => [p.file.link, p.status || "1active"]));
> > } else {
> >     dv.paragraph("_No linked projects._");
> > }
> > ```
> 
> > [!todo|wide-2] 🎯 Active Tasks
> > ```dataviewjs
> > const aName = "<%- areaName %>";
> > const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
> > if (tasks.length > 0) {
> >     dv.table(["🎯 Task", "🚦 Status"], tasks.map(t => [t.file.link, t.status || "1active"]));
> > } else {
> >     dv.paragraph("_No linked active tasks._");
> > }
> > ```

---

> [!multi-column]
> > [!note|wide-2] 🗃️ Zettelkasten & Knowledge Notes
> > ```dataviewjs
> > const aName = "<%- areaName %>";
> > const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName));
> > if (notes.length > 0) {
> >     dv.table(["🗃️ Note", "🏷️ Type"], notes.map(n => [n.file.link, n.archtype ? String(n.archtype[0]).replace("#5note/", "") : "Note"]));
> > } else {
> >     dv.paragraph("_No linked notes._");
> > }
> > ```
> 
> > [!resource|wide-2] 🔖 Media & Resources
> > ```dataviewjs
> > const aName = "<%- areaName %>";
> > const res = dv.pages('"6_Resources"').where(p => p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName));
> > if (res.length > 0) {
> >     dv.table(["🔖 Resource", "🏷️ Type"], res.map(r => [r.file.link, r.archtype ? String(r.archtype[0]).replace("#6resource/", "") : "Resource"]));
> > } else {
> >     dv.paragraph("_No linked resources._");
> > }
> > ```
