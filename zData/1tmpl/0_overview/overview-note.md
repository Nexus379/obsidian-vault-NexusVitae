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

```dataviewjs
const dName = "<%- discName %>".toLowerCase();
const sName = "<%- sciName %>".toLowerCase();
const notes = dv.pages('"5_Notes"').where(p => {
    const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
    return meta.includes(dName) || meta.includes(sName);
});
const res = dv.pages('"6_Resources"').where(p => {
    const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
    return meta.includes(dName) || meta.includes(sName);
});

dv.paragraph(`> [!abstract] 📊 **Discipline Knowledge Metrics**\n> 🗃️ **Atomic & Knowledge Notes:** ${notes.length} | 🔖 **Discipline Resources:** ${res.length}`);
```

---

> [!multi-column]
> > [!note|wide-2] 🗃️ Zettelkasten & Atomic Notes
> > ```dataviewjs
> > const dName = "<%- discName %>".toLowerCase();
> > const sName = "<%- sciName %>".toLowerCase();
> > const notes = dv.pages('"5_Notes"').where(p => {
> >     const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
> >     return meta.includes(dName) || meta.includes(sName);
> > });
> > if (notes.length > 0) {
> >     dv.table(["🗃️ Note", "🏷️ Type", "🕒 Modified"], notes.map(n => [n.file.link, n.archtype ? String(n.archtype[0]).replace("#5note/", "") : "Note", n.file.mtime.toFormat("yyyy-MM-dd")]));
> > } else {
> >     dv.paragraph("_No notes found for this discipline._");
> > }
> > ```
> 
> > [!resource|wide-2] 🔖 Related Resources & Media
> > ```dataviewjs
> > const dName = "<%- discName %>".toLowerCase();
> > const sName = "<%- sciName %>".toLowerCase();
> > const res = dv.pages('"6_Resources"').where(p => {
> >     const meta = (String(p.discipline || "") + " " + String(p.sci || "") + " " + String(p.file.tags || "")).toLowerCase();
> >     return meta.includes(dName) || meta.includes(sName);
> > });
> > if (res.length > 0) {
> >     dv.table(["🔖 Resource", "🏷️ Type", "🕒 Modified"], res.map(r => [r.file.link, r.archtype ? String(r.archtype[0]).replace("#6resource/", "") : "Resource", r.file.mtime.toFormat("yyyy-MM-dd")]));
> > } else {
> >     dv.paragraph("_No resources found for this discipline._");
> > }
> > ```
