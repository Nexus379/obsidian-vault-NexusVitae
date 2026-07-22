<%-*
const dv = app.plugins.plugins.dataview?.api;
let projName = tp.variables.projName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🚀 Project Cockpit: [[<%- projName %>]]

> [!info] 🧩 Linked Project Overview & Cockpit

---

### 🎯 Active Tasks
```dataviewjs
const pName = "<%- projName %>";
const tasks = dv.pages('"4_Tasks"').where(p => !p.completed && (p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName)));
if (tasks.length > 0) {
    dv.table(["🎯 Task", "🚦 Status", "🕒 Modified"], tasks.map(t => [t.file.link, t.status || "1active", t.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked active tasks._");
}
```

---

### 🗃️ Zettelkasten & Knowledge Notes
```dataviewjs
const pName = "<%- projName %>";
const notes = dv.pages('"5_Notes"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
if (notes.length > 0) {
    dv.table(["🗃️ Note", "🏷️ Type", "🕒 Modified"], notes.map(n => [n.file.link, n.archtype ? n.archtype[0] : "Note", n.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked notes._");
}
```

---

### 🔖 Media & Resources
```dataviewjs
const pName = "<%- projName %>";
const res = dv.pages('"6_Resources"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
if (res.length > 0) {
    dv.table(["🔖 Resource", "🏷️ Type", "🕒 Modified"], res.map(r => [r.file.link, r.archtype ? r.archtype[0] : "Resource", r.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked resources._");
}
```

---

### 📅 Logs & Protocols
```dataviewjs
const pName = "<%- projName %>";
const logs = dv.pages('"0_Calendar"').where(p => p.file.outlinks.toFile().some(l => l.name === pName) || String(p.project3).includes(pName));
if (logs.length > 0) {
    dv.table(["📄 Log / Protocol", "📅 Date", "🕒 Modified"], logs.map(l => [l.file.link, l.cal_date || "-", l.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No linked logs or protocols._");
}
```
