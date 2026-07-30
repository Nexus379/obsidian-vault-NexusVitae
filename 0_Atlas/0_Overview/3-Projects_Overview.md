---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 🚧
---

# 🚧 Projects

<div class="nv-kicker">Everything with an end. What has no end belongs in an area.</div>

![[zData/5design_modul/MainNav|MainNav]]

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/0_Dashboard/3-Projects/1-Active">⚡ Active</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/3-Projects/2-Passive">⏳ Passive</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/3-Projects/3-Idea">💡 Ideas</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/3-Projects/0-Recurring">🔄 Recurring</a>
</div>

**Create & process:** `BUTTON[p-btn]` `BUTTON[plan-replicator]`

<small>The project cockpit is created from the project note itself — its button sits there.</small>

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
dv.el("div", dash.sectionPage({
  filter: p => p.isProject,
  tableTitle: "All projects",
  columns: ["Entry", "Type", "Status", "Prio", "Due"],
  sort: "priority",
  groups: [
    { label: "⚡ Active",    filter: p => p.status === "1active",    sub: "laufen",       href: "0_Atlas/0_Dashboard/3-Projects/1-Active" },
    { label: "⏳ Passive",   filter: p => p.status === "2passive",   sub: "pausiert",     href: "0_Atlas/0_Dashboard/3-Projects/2-Passive" },
    { label: "💡 Ideen",     filter: p => p.status === "3idea",      sub: "ungeboren",    href: "0_Atlas/0_Dashboard/3-Projects/3-Idea" },
    { label: "🔄 Recurring", filter: p => p.status === "0recurring", sub: "wiederkehrend", href: "0_Atlas/0_Dashboard/3-Projects/0-Recurring" },
  ],
}));
```
