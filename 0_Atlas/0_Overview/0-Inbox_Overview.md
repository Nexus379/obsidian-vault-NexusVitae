---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 💌
---

# 💌 Inbox

<div class="nv-kicker">Everything without a place yet. The goal is not order — the goal is empty.</div>

![[zData/5design_modul/MainNav|MainNav]]

`BUTTON[stars-btn]` `BUTTON[a-btn]` `BUTTON[p-btn]` `BUTTON[t-btn]` `BUTTON[n-btn]` `BUTTON[r-btn]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];

// The inbox sits outside the main set — hence a small query of its own.
const inbox = dv.pages('!"zData" AND !"yArchive"').where(p => p.inbox === true)
                .sort(p => p.file.mtime, "desc");

out.push(`<h2>At a glance</h2>`);
out.push(dash.statCards([
  { label: "Unfiled", n: inbox.length, sub: inbox.length === 0 ? "clean" : "waiting to be filed" },
  { label: "In folder",  n: dv.pages('"0_Inbox"').length, sub: "physically in 0_Inbox" },
]));

out.push(`<h2>Waiting to be filed</h2>`);
if (!inbox.length) {
  out.push(`<p class="nv-sub">Empty. Exactly how it should look.</p>`);
} else {
  let rows = [];
  for (const p of inbox) {
    rows.push([
      `<a class="internal-link" href="${p.file.path}">${p.file.name}</a>`,
      String(p.arch ?? "").replace("#", ""),
      p.file.folder,
      dash.fmtDate(p.file.mtime),
    ]);
  }
  out.push(dash.table(rows, ["Entry", "Level", "Located in", "Created"]));
}

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/Inboxbase.base]]
