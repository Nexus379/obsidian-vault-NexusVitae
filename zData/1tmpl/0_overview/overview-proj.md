<%-*
const dv = app.plugins.plugins.dataview?.api;
let projName = tp.variables.projName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🚀 Project Cockpit: [[<%- projName %>]]

![[zData/5design_modul/OverviewNavigationModul]]

```dataviewjs
const pName = "<%- projName %>";
const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName)));
const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
const res = dv.pages('"6_Resources"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
const logs = dv.pages('"0_Calendar"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));

dv.paragraph(`> [!abstract] 📊 **Master Cockpit Metrics**\n> 🎯 **Tasks:** ${tasks.length} | 🗃️ **Notes:** ${notes.length} | 🔖 **Resources:** ${res.length} | 📅 **Logs:** ${logs.length}`);
```

---

> [!multi-column]
> > [!todo|wide-2] 🎯 Active Tasks
> > ```dataviewjs
> > const pName = "<%- projName %>";
> > const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName)));
> > if (tasks.length > 0) {
> >     dv.table(["🎯 Task", "🚦 Status"], tasks.map(t => [t.file.link, t.status || "1active"]));
> > } else {
> >     dv.paragraph("_No linked active tasks._");
> > }
> > ```
> 
> > [!note|wide-2] 🗃️ Zettelkasten & Knowledge Notes
> > ```dataviewjs
> > const pName = "<%- projName %>";
> > const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
> > if (notes.length > 0) {
> >     dv.table(["🗃️ Note", "🏷️ Type"], notes.map(n => [n.file.link, n.archtype ? String(n.archtype[0]).replace("#5note/", "") : "Note"]));
> > } else {
> >     dv.paragraph("_No linked notes._");
> > }
> > ```

---

> [!multi-column]
> > [!resource|wide-2] 🔖 Media & Resources
> > ```dataviewjs
> > const pName = "<%- projName %>";
> > const res = dv.pages('"6_Resources"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
> > if (res.length > 0) {
> >     dv.table(["🔖 Resource", "🏷️ Type"], res.map(r => [r.file.link, r.archtype ? String(r.archtype[0]).replace("#6resource/", "") : "Resource"]));
> > } else {
> >     dv.paragraph("_No linked resources._");
> > }
> > ```
> 
> > [!calendar|wide-2] 📅 Project Logs & Protocols
> > ```dataviewjs
> > const pName = "<%- projName %>";
> > const logs = dv.pages('"0_Calendar"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
> > if (logs.length > 0) {
> >     dv.table(["📄 Log / Protocol", "📅 Date"], logs.map(l => [l.file.link, l.cal_date || l.file.mtime.toFormat("yyyy-MM-dd")]));
> > } else {
> >     dv.paragraph("_No linked logs or protocols._");
> > }
> > ```
