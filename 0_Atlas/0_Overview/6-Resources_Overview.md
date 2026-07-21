---
cssclasses:
  - wide-page
---

# 🔖 Resources & Entities Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Existing Media & Resources

```dataviewjs
const pages = dv.pages('"6_Resources"')
    .where(p => !p.file.path.includes("zData"))
    .sort(p => p.file.mtime, "desc");

if (pages.length > 0) {
    dv.table(
        ["🔖 Resource", "🏷️ Resource Type", "🚦 Status", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.archtype ? p.archtype[0] : "Resource",
            p.status || "1active",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No resources found._");
}
```
