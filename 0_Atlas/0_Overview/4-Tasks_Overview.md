---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 🛠️
---

# 🛠️ Tasks

<div class="nv-kicker">GTD contexts: not <em>what</em>, but <em>where and with what</em>. Sorted by what you can actually do right now.</div>

![[zData/5design_modul/MainNav|MainNav]]

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/0-Task-Center">🎛️ Task Center</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/1-ToDo">✅ ToDo</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/2-ToGo">🚶 ToGo</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/3-ToStudy">📚 ToStudy</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/4-ToMeet">🤝 ToMeet</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/5-ToBuy">🛒 ToBuy</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/6-ToPay">💳 ToPay</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/7-ToCook">🍳 ToCook</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/8-ToCraft">🔨 ToCraft</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/4-Tasks/9-ToGet">📦 ToGet</a>
</div>

`BUTTON[t-btn]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];
const has = (p, k) => String(p.page.archtype ?? "").includes(k);

const kinds = [
  // Icons come from the task templates' banner_icon and the 4-Tasks bases, which agree.
  { k: "todo",    icon: "🛠️", label: "ToDo",    slug: "1-ToDo" },
  { k: "togo",    icon: "🏃🏽", label: "ToGo",    slug: "2-ToGo" },
  { k: "tostudy", icon: "🎓", label: "ToStudy", slug: "3-ToStudy" },
  { k: "tomeet",  icon: "📅", label: "ToMeet",  slug: "4-ToMeet" },
  { k: "tobuy",   icon: "💰", label: "ToBuy",   slug: "5-ToBuy" },
  { k: "topay",   icon: "💵", label: "ToPay",   slug: "6-ToPay" },
  { k: "tocook",  icon: "🍜", label: "ToCook",  slug: "7-ToCook" },
  { k: "tocraft", icon: "🎀", label: "ToCraft", slug: "8-ToCraft" },
  { k: "toget",   icon: "📥", label: "ToGet",   slug: "9-ToGet" },
];

const open = dash.where(p => p.isTask && p.open);

out.push(`<h2>By Context</h2>`);
out.push(dash.statCards(kinds.map(x => ({
  label: `${x.icon} ${x.label}`,
  n: open.filter(p => has(p, x.k)).length,
  sub: "offen",
  href: `0_Atlas/0_Dashboard/4-Tasks/${x.slug}`,
}))));

out.push(`<h2>Due or Overdue</h2>`);
const due = open.filter(p => p.page.due).sort((a, b) => String(a.page.due).localeCompare(String(b.page.due)));
out.push(dash.table(
  due.slice(0, 12).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#4task/", ""), p.page.priority ?? "", p.page.due]),
  ["Task", "Context", "Prio", "Due"]));

out.push(`<h2>No Date, by Priority</h2>`);
const noDue = open.filter(p => !p.page.due)
  .sort((a, b) => String(a.page.priority ?? "9").localeCompare(String(b.page.priority ?? "9")) || b.mtime - a.mtime);
out.push(dash.table(
  noDue.slice(0, 12).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#4task/", ""), p.page.priority ?? "", dash.fmtDate(p.mtime)]),
  ["Task", "Context", "Prio", "Modified"]));

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/Tasksbase.base]]
