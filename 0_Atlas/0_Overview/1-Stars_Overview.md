---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: ✨
---

# ✨ Stars

<div class="nv-kicker">The upper GTD horizons: why at all, where to, and what for the next 90 days. Everything below serves this.</div>

![[zData/5design_modul/MainNav|MainNav]]

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/0_Dashboard/1-Stars/1-Purpose">🌟 Purpose</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/1-Stars/2-Vision">🧭 Vision</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/1-Stars/3-Goals">🎯 Goals</a>
</div>

`BUTTON[stars-btn]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
dv.el("div", dash.sectionPage({
  filter: p => p.isStar,
  tableTitle: "All stars",
  columns: ["Entry", "Type", "Status", "Due", "Modified"],
  groups: [
    { label: "🌟 Purpose", n: 0, filter: p => String(p.page.archtype ?? "").includes("1purpose"), sub: "das Warum",     href: "0_Atlas/0_Dashboard/1-Stars/1-Purpose" },
    { label: "🧭 Vision",  n: 0, filter: p => String(p.page.archtype ?? "").includes("2vision"),  sub: "3–5 Jahre",     href: "0_Atlas/0_Dashboard/1-Stars/2-Vision" },
    { label: "🎯 Goals",   n: 0, filter: p => String(p.page.archtype ?? "").includes("3goals"),   sub: "90 days",       href: "0_Atlas/0_Dashboard/1-Stars/3-Goals" },
  ],
}));
```

## Library

![[0_Atlas/Bases/1-Stars/Stars.base]]
