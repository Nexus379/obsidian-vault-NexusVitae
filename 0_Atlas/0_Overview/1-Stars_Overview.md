---
cssclasses:
  - wide-page
---

# ⭐ Stars & Core Values Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Existing Vision & Values

```dataviewjs
const pages = dv.pages('"1_Stars"')
    .where(p => !p.file.path.includes("zData"))
    .sort(p => p.file.name, "asc");

if (pages.length > 0) {
    dv.table(
        ["⭐ Star / Value", "🏷️ Horizon", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.horizon || "Horizon 4",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No star notes found._");
}
```
