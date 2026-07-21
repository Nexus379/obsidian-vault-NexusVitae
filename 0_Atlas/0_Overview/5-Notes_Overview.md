---
cssclasses:
  - wide-page
---

# 🗃️ Zettelkasten & Notes Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] Clean Overview: Existing Knowledge Notes

```dataviewjs
const pages = dv.pages('"5_Notes"')
    .where(p => !p.file.path.includes("zData"))
    .sort(p => p.file.mtime, "desc");

if (pages.length > 0) {
    dv.table(
        ["🗃️ Note", "🏷️ Note Type", "🕒 Last Modified"],
        pages.map(p => [
            p.file.link,
            p.archtype ? p.archtype[0] : "Note",
            p.file.mtime.toFormat("yyyy-MM-dd HH:mm")
        ])
    );
} else {
    dv.paragraph("_No notes found._");
}
```
