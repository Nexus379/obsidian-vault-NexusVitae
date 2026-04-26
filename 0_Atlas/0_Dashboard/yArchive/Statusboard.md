---
cssclasses:
  - wide-page
  - dashboard-no-border
---

# Archive Statusboard
| [[0_Atlas/0_Dashboard/y-Archive|Archive]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
>
> > [!archive] Archived
> > ```dataview
> > TABLE arch, archtype, status, file.mtime AS updated
> > FROM "yArchive" AND !"zData"
> > WHERE status = "archive" OR status = "archived"
> > SORT file.mtime DESC
> > ```
>
> > [!success] Done
> > ```dataview
> > TABLE arch, archtype, status, file.mtime AS updated
> > FROM "yArchive" AND !"zData"
> > WHERE status = "done"
> > SORT file.mtime DESC
> > ```
>
> > [!danger] Canceled
> > ```dataview
> > TABLE arch, archtype, status, file.mtime AS updated
> > FROM "yArchive" AND !"zData"
> > WHERE status = "canceled"
> > SORT file.mtime DESC
> > ```
>
> > [!warning] Bin
> > ```dataview
> > TABLE arch, archtype, status, file.mtime AS updated
> > FROM "yArchive" AND !"zData"
> > WHERE status = "bin"
> > SORT file.mtime DESC
> > ```

## Status Values
```dataviewjs
const pages = dv.pages('"yArchive" AND !"zData"').where(p => p.status);
const counts = new Map();

pages.forEach(p => {
  const key = String(p.status ?? "").trim();
  if (!key) return;
  counts.set(key, (counts.get(key) ?? 0) + 1);
});

const rows = [...counts.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([status, count]) => {
    const latest = pages
      .where(p => String(p.status ?? "").trim() === status)
      .sort(p => p.file.mtime, "desc")
      .first();
    return [status, count, latest ? latest.file.link : ""];
  });

dv.table(["status", "count", "latest"], rows);
```

## Special Status by Arch
```dataviewjs
const archTags = ["#0cal", "#1stars", "#2area", "#3project", "#4task", "#5note", "#6resou"];
const special = ["archive", "archived", "bin", "canceled", "done", "review"];

const pages = dv.pages('"yArchive" AND !"zData"').where(p => p.status);
const statusNorm = p => String(p.status ?? "").toLowerCase().trim();
const hasArch = (p, a) => dv.array(p.arch).map(x => String(x)).includes(a);

const rows = archTags.map(a => {
  const subset = pages.where(p => hasArch(p, a));
  const counts = Object.fromEntries(special.map(s => [s, subset.where(p => statusNorm(p) === s).length]));
  const other = subset.where(p => !special.includes(statusNorm(p))).length;
  return [a, ...special.map(s => counts[s]), other, subset.length];
});

dv.table(["arch", ...special, "other", "total"], rows);
```
