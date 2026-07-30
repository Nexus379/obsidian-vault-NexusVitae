---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 🔱
---

# Nexus Vitae

<div class="nv-kicker"><span id="nv-greeting">Welcome back.</span></div>

![[zData/5design_modul/MainNav|MainNav]]

`BUTTON[log-plm-btn]` `BUTTON[log-ppm-btn]` `BUTTON[log-pkm-btn]` `BUTTON[create-daily-review]`

```dataviewjs
// ⚡ ONE block for the whole page — dashEngine scans the vault once.
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];

const h = new Date().getHours();
const greet = h < 5 ? "Still awake." : h < 11 ? "Good morning." : h < 14 ? "Good day."
            : h < 18 ? "Good afternoon." : h < 22 ? "Good evening." : "Good night.";
const today = dv.luxon.DateTime.now();
const kicker = this.container.closest(".markdown-preview-view, .cm-content")?.querySelector("#nv-greeting");
if (kicker) kicker.textContent = `${greet} — ${today.setLocale("en").toFormat("cccc, d. LLLL yyyy")}`;

// ── Heute ──
const dstr = today.toFormat("yyyy-MM-dd");
const slots = [
  { key: "plm", label: "🌷 Journal",  folder: "0_Calendar/1_PLM" },
  { key: "ppm", label: "🌻 Log",      folder: "0_Calendar/2_PPM" },
  { key: "pkm", label: "🌼 Studylog", folder: "0_Calendar/3_PKM" },
];
out.push(`<h2>Today</h2><div class="nv-grid">`);
for (const s of slots) {
  const hit = dash.all.find(p => p.path.startsWith(s.folder) && p.name.startsWith(`${dstr} ${s.key}`));
  out.push(`<div class="nv-card nv-stat${hit ? "" : " is-empty"}">`
    + `<div class="nv-label">${s.label}</div><div class="nv-num">${hit ? "✓" : "—"}</div>`
    + `<div class="nv-sub">${hit ? dash.linkTo(hit, "open") : "not created yet"}</div></div>`);
}
out.push(`</div>`);

// ── Im Fluss ──
out.push(`<h2>In Motion</h2>`);
out.push(dash.statCards([
  { label: "Active projects", n: dash.count(p => p.isProject && p.status === "1active"),   sub: "running now",           href: "0_Atlas/0_Overview/3-Projects_Overview" },
  { label: "Open tasks",    n: dash.count(p => p.isTask && p.open),                      sub: "waiting on you",         href: "0_Atlas/0_Overview/4-Tasks_Overview" },
  { label: "Fleeting Notes",  n: dash.count(p => p.path.startsWith("5_Notes/1_Fleeting")), sub: "waiting to be processed", href: "0_Atlas/0_Overview/5-Notes_Overview" },
  { label: "In inbox",        n: dash.inboxCount,                                          sub: "not filed yet",  href: "0_Atlas/0_Overview/0-Inbox_Overview" },
]));

// ── Bereiche ──
const areas = [
  { n: 1, key: "1selfcare",     name: "Selfcare",     icon: "🌸", chakra: "Root",         slug: "1-Selfcare" },
  { n: 2, key: "2creativity",   name: "Creativity",   icon: "🎨", chakra: "Sacral",       slug: "2-Creativity" },
  { n: 3, key: "3drive",        name: "Drive",        icon: "🔥", chakra: "Solar Plexus", slug: "3-Drive" },
  { n: 4, key: "4relationship", name: "Relationship", icon: "🦄", chakra: "Heart",        slug: "4-Relationship" },
  { n: 5, key: "5expression",   name: "Expression",   icon: "🗣️", chakra: "Throat",       slug: "5-Expression" },
  { n: 6, key: "6mind",         name: "Mind",         icon: "🧠", chakra: "Third Eye",    slug: "6-Mind" },
  { n: 7, key: "7crown",        name: "Crown",        icon: "🕉️", chakra: "Crown",        slug: "7-Crown" },
];
out.push(`<h2>The Seven Areas</h2><div class="nv-grid">`);
for (const a of areas) {
  const c = dash.area(a.key).length;
  out.push(`<div class="nv-card nv-link nv-area cha${a.n}"><div class="nv-ico">${a.icon}</div><div class="nv-body">`
    + `<div class="nv-name"><a class="internal-link" href="0_Atlas/0_Dashboard/2-Areas/${a.slug}">${a.name}</a></div>`
    + `<div class="nv-meta">${a.chakra} · ${c} ${c === 1 ? "Entry" : "Entries"}</div></div></div>`);
}
out.push(`</div>`);

// ── Next Tasks ──
out.push(`<h2>Up Next</h2>`);
out.push(dash.table(
  dash.where(p => p.isTask && p.open)
      .sort((a, b) => String(a.page.priority ?? "9").localeCompare(String(b.page.priority ?? "9")) || b.mtime - a.mtime)
      .slice(0, 8)
      .map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#4task/", ""), p.page.priority ?? "", p.page.due ?? ""]),
  ["Task", "Type", "Prio", "Due"]));

// ── Zuletzt ──
out.push(`<h2>Recently Touched</h2>`);
out.push(dash.table(
  dash.recent(8).map(p => [dash.linkTo(p), String(p.page.arch ?? "").replace("#", ""), dash.fmtDate(p.mtime)]),
  ["Note", "Level", "Modified"]));

dv.el("div", out.join(""));
```

---

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/MOCs/AtlasMOC">🗺️ Atlas MOC</a>
<a class="internal-link" href="0_Atlas/0_Overview/Nexus_Master_Overview">⚡ Overviews</a>
<a class="internal-link" href="Nexus Vitae Guide">📖 Guide</a>
</div>
