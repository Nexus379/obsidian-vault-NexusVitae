---
cssclasses:
  - wide-page
---

# 📅 Calendar & Logs Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Existing Logs & Reviews

```dataviewjs
const pages = dv.pages('"0_Calendar"')
    .where(p => !p.file.path.includes("zData"))
    .sort(p => p.file.mtime, "desc");

if (pages.length > 0) {
    dv.table(
        ["📄 Note", "🏷️ Type", "📅 Cal Date", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.archtype ? p.archtype[0] : (p.arch ? p.arch[0] : "Log"),
            p.cal_date || "-",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No calendar logs found._");
}
```
