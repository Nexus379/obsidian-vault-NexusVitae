---
cssclasses:
  - wide-page
---

# 🏔️ Areas of Responsibility Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Active Areas

```dataviewjs
const pages = dv.pages('"2_Areas"')
    .where(p => !p.file.path.includes("zData"))
    .sort(p => p.file.name, "asc");

if (pages.length > 0) {
    dv.table(
        ["🏔️ Area", "🏷️ Status", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.status || "active",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No area notes found._");
}
```
