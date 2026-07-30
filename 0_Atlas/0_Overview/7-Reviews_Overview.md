---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 🛰️
---

# 🛰️ Reviews

<div class="nv-kicker">The look back, in six cadences. A system without review is just a filing cabinet.</div>

![[zData/5design_modul/MainNav|MainNav]]

`BUTTON[log-rev-btn]` `BUTTON[create-daily-review]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];
const revs = dash.where(p => p.path.startsWith("0_Calendar/6_Reviews"));
const has = (p, k) => p.name.includes(k) || String(p.page.archtype ?? "").includes(k);

const phases = [
  { k: "revD", icon: "☀️", label: "Daily" },
  { k: "revW", icon: "📆", label: "Weekly" },
  { k: "revM", icon: "🌙", label: "Monthly" },
  { k: "revQ", icon: "🍂", label: "Quarterly" },
  { k: "revH", icon: "⛰️", label: "Half-Year" },
  { k: "revY", icon: "🎆", label: "Yearly" },
];

out.push(`<h2>Taktung</h2>`);
out.push(dash.statCards(phases.map(x => ({
  label: `${x.icon} ${x.label}`,
  n: revs.filter(p => has(p, x.k)).length,
}))));

out.push(`<h2>Letzte Reviews</h2>`);
out.push(revs.length
  ? dash.table(revs.sort((a, b) => b.mtime - a.mtime).slice(0, 12)
      .map(p => [dash.linkTo(p), p.page.rev_start ?? "", p.page.rev_end ?? "", dash.fmtDate(p.mtime)]),
      ["Review", "From", "To", "Modified"])
  : `<p class="nv-sub">No review yet. The weekly is where you start.</p>`);

dv.el("div", out.join(""));
```
