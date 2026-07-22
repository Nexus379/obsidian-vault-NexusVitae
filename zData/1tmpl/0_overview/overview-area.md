<%-*
const dv = app.plugins.plugins.dataview?.api;
let areaName = tp.variables.areaName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🏔️ Area Cockpit: [[<%- areaName %>]]

> [!info] 💠 Linked Area Overview & Cockpit

---

### 🧩 Active Projects
```dataviewjs
const aName = "<%- areaName %>";
const projs = dv.pages('"3_Projects"').where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/") && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
if (projs.length > 0) {
    dv.table(["🧩 Project", "🚦 Status", "🕒 Modified"], projs.map(p => [p.file.link, p.status || "1active", p.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked projects._");
}
```

---

### 🎯 Active Tasks
```dataviewjs
const aName = "<%- areaName %>";
const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName)));
if (tasks.length > 0) {
    dv.table(["🎯 Task", "🚦 Status", "🕒 Modified"], tasks.map(t => [t.file.link, t.status || "1active", t.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked active tasks._");
}
```

---

### 🗃️ Zettelkasten & Knowledge Notes
```dataviewjs
const aName = "<%- areaName %>";
const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === aName) || String(p.area2).includes(aName));
if (notes.length > 0) {
    dv.table(["🗃️ Note", "🏷️ Type", "🕒 Modified"], notes.map(n => [n.file.link, n.archtype ? n.archtype[0] : "Note", n.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked notes._");
}
```
