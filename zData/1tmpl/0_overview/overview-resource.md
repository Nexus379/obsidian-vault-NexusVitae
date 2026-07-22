<%-*
const dv = app.plugins.plugins.dataview?.api;
let resType = tp.variables.resType || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🔖 Resource Cockpit: [[<%- resType %>]]

![[zData/5design_modul/OverviewNavigationModul]]

```dataviewjs
const rType = "<%- resType %>".toLowerCase();
const res = dv.pages('"6_Resources"').where(p => {
    const meta = (p.file.path + " " + String(p.archtype || "")).toLowerCase();
    return meta.includes(rType);
});

dv.paragraph(`> [!abstract] 📊 **Resource Category Metrics**\n> 🔖 **Total Items:** ${res.length}`);
```

---

> [!multi-column]
> > [!resource|wide-2] 🔖 Existing Items in Category
> > ```dataviewjs
> > const rType = "<%- resType %>".toLowerCase();
> > const res = dv.pages('"6_Resources"').where(p => {
> >     const meta = (p.file.path + " " + String(p.archtype || "")).toLowerCase();
> >     return meta.includes(rType);
> > });
> > if (res.length > 0) {
> >     dv.table(["🔖 Item", "🚦 Status", "🕒 Modified"], res.map(r => [r.file.link, r.status || "1active", r.file.mtime.toFormat("yyyy-MM-dd")]));
> > } else {
> >     dv.paragraph("_No resources found for this category._");
> > }
> > ```
