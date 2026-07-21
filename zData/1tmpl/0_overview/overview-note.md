<%-*
const dv = app.plugins.plugins.dataview?.api;
let sciName = tp.variables.sciName || "Science";
let discName = tp.variables.discName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 📚 Knowledge Cockpit: [[<%- discName %>]] (<%- sciName %>)

![[zData/5design_modul/OverviewNavigationModul]]

---

### 🗃️ Zettelkasten & Atomic Notes
```dataviewjs
const dName = "<%- discName %>".toLowerCase();
const sName = "<%- sciName %>".toLowerCase();
const notes = dv.pages('"5_Notes"').where(p => {
    const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
    return meta.includes(dName) || meta.includes(sName);
});

if (notes.length > 0) {
    dv.table(["🗃️ Note", "🏷️ Type", "🕒 Modified"], notes.map(n => [n.file.link, n.archtype ? n.archtype[0] : "Note", n.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No notes found for this discipline._");
}
```

---

### 🔖 Related Resources & Media
```dataviewjs
const dName = "<%- discName %>".toLowerCase();
const sName = "<%- sciName %>".toLowerCase();
const res = dv.pages('"6_Resources"').where(p => {
    const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
    return meta.includes(dName) || meta.includes(sName);
});

if (res.length > 0) {
    dv.table(["🔖 Resource", "🏷️ Type", "🕒 Modified"], res.map(r => [r.file.link, r.archtype ? r.archtype[0] : "Resource", r.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No resources found for this discipline._");
}
```
