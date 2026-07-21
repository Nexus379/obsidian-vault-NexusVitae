---
cssclasses:
  - wide-page
---

# 🧩 Projects Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Active & Passive Projects

```dataviewjs
const pages = dv.pages('"3_Projects"')
    .where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/") && !p.file.path.includes("/Protocols/") && !p.file.path.includes("zData"))
    .sort(p => p.file.mtime, "desc");

if (pages.length > 0) {
    dv.table(
        ["🧩 Project", "🚦 Status", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.status || "1active",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No projects found._");
}
```
