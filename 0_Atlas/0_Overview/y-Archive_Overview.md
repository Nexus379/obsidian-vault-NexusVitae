---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 📦
---

# 📦 Archiv

<div class="nv-kicker">What was. Nothing is deleted — it only steps back.</div>

![[zData/5design_modul/MainNav|MainNav]]

`BUTTON[archive]` `BUTTON[archive-month]` `BUTTON[freezer]`

```dataviewjs
const dv2 = dv;
const out = [];

// The archive deliberately sits outside the dashEngine set —
// hence a small query of its own here instead of the snapshot.
const arch = dv2.pages('"yArchive"').sort(p => p.file.mtime, "desc");

const byYear = {};
for (const p of arch) {
  const m = p.file.path.match(/yArchive\/(\d{4})/);
  const y = m ? m[1] : "no year";
  byYear[y] = (byYear[y] || 0) + 1;
}

out.push(`<h2>By year</h2><div class="nv-grid">`);
for (const [y, n] of Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0]))) {
  out.push(`<div class="nv-card nv-stat"><div class="nv-label">${y}</div><div class="nv-num">${n}</div><div class="nv-sub">Entries</div></div>`);
}
if (!Object.keys(byYear).length) out.push(`<div class="nv-card nv-stat is-empty"><div class="nv-label">Archive</div><div class="nv-num">0</div><div class="nv-sub">still empty</div></div>`);
out.push(`</div>`);

out.push(`<h2>Zuletzt archiviert</h2>`);
let rows = [];
for (const p of arch.limit(15)) {
  rows.push([
    `<a class="internal-link" href="${p.file.path}">${p.file.name}</a>`,
    p.file.folder.replace("yArchive/", ""),
    p.archived_at ?? "",
  ]);
}
out.push(rows.length
  ? `<table><thead><tr><th>Entry</th><th>Located in</th><th>Archived</th></tr></thead><tbody>`
    + rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("") + `</tbody></table>`
  : `<p class="nv-sub">Nothing archived yet.</p>`);

dv2.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/yArchiveBase.base]]
