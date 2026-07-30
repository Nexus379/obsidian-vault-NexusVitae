---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 📅
---

# 📅 Calendar

<div class="nv-kicker">Three daily tracks — PLM for yourself, PPM for execution, PKM for learning. Plus project logs, protocols, reviews and the weekly plans.</div>

![[zData/5design_modul/MainNav|MainNav]]

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM">🌷 PLM</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM">🌻 PPM</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM">🌼 PKM</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard">🎓 Studyboard</a>
<a class="internal-link" href="0_Atlas/0_Overview/7-Reviews_Overview">🛰️ Reviews</a>
</div>

`BUTTON[log-plm-btn]` `BUTTON[log-ppm-btn]` `BUTTON[log-pkm-btn]` `BUTTON[log-plan-btn]` `BUTTON[create-weekly-plan]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];
const now = dv.luxon.DateTime.now();
const cal = dash.where(p => p.isCalendar);

const inFolder = (p, f) => p.path.startsWith(`0_Calendar/${f}`);

out.push(`<h2>Inventory</h2>`);
out.push(dash.statCards([
  { label: "🌷 Journal",    n: cal.filter(p => inFolder(p, "1_PLM")).length,         sub: "PLM", href: "0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM" },
  { label: "🌻 Logs",       n: cal.filter(p => inFolder(p, "2_PPM")).length,         sub: "PPM", href: "0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM" },
  { label: "🌼 Studylogs",  n: cal.filter(p => inFolder(p, "3_PKM")).length,         sub: "PKM", href: "0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM" },
  { label: "🧩 Project logs", n: cal.filter(p => inFolder(p, "4_Projectlogs")).length, sub: "History" },
  { label: "📜 Protocols", n: cal.filter(p => inFolder(p, "5_Protocols")).length,   sub: "Fest" },
  { label: "🛰️ Reviews",    n: cal.filter(p => inFolder(p, "6_Reviews")).length,     sub: "Review", href: "0_Atlas/0_Overview/7-Reviews_Overview" },
]));

// ── Weekly plans of the current week ──
const y = now.toFormat("yyyy"), m = now.toFormat("MM"), kw = now.toFormat("WW");
const modules = [
  { pre: "routine",   icon: "⏰", label: "Routine" },
  { pre: "fitness",   icon: "🏋️", label: "Fitness" },
  { pre: "meal",      icon: "🍱", label: "Meal" },
  { pre: "inpra",     icon: "🎸", label: "Instrument" },
  { pre: "timetable", icon: "🗓️", label: "Timetable" },
  { pre: "study",     icon: "📚", label: "Study" },
  { pre: "srs",       icon: "🧠", label: "SRS" },
  { pre: "vestis",    icon: "👗", label: "Vestis" },
];
out.push(`<h2>Weekly Plans · CW ${kw}</h2><div class="nv-grid">`);
for (const mod of modules) {
  const path = `0_Calendar/7_Plan/${y}/${m}/${y}-W${kw}_${mod.pre}.md`;
  const hit = cal.find(p => p.path === path);
  out.push(`<div class="nv-card nv-stat${hit ? "" : " is-empty"}">`
    + `<div class="nv-label">${mod.icon} ${mod.label}</div>`
    + `<div class="nv-num">${hit ? "✓" : "—"}</div>`
    + `<div class="nv-sub">${hit ? dash.linkTo(hit, "open") : "Master applies"}</div></div>`);
}
out.push(`</div>`);

out.push(`<h2>Recently in the Calendar</h2>`);
out.push(dash.table(
  dash.recent(12, p => p.isCalendar).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#0cal/", ""), dash.fmtDate(p.mtime)]),
  ["Entry", "Type", "Modified"]));

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/Calendarbase.base]]
