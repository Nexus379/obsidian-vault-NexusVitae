---
cssclasses:
  - wide-page
---

# 🎯 Tasks Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Active Tasks

```dataviewjs
const pages = dv.pages('"4_Tasks"')
    .where(p => !p.completed && !p.file.path.includes("zData"))
    .sort(p => p.file.mtime, "desc");

if (pages.length > 0) {
    dv.table(
        ["🎯 Task", "🏷️ Type", "🚦 Status", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.archtype ? p.archtype[0] : "Task",
            p.status || "1active",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No active tasks found._");
}
```
