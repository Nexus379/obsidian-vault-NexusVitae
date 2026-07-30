---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 🔖
---

# 🔖 Resources

<div class="nv-kicker">What comes from outside: read, watched, cooked, owned. Sources and entities.</div>

![[zData/5design_modul/MainNav|MainNav]]

**Create & process:** `BUTTON[r-btn]` `BUTTON[add-resource-overview]` `BUTTON[convert-bought-entity]`

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];
const res = dash.where(p => p.isResource);
const isKind = (p, k) => String(p.page.archtype ?? "").includes(`#6resource/${k}`);

const kinds = [
  { k: "book",      icon: "📚", label: "Books",     slug: "Books" },
  { k: "film",      icon: "🎬", label: "Films",     slug: "Films" },
  { k: "serie",     icon: "🎞️", label: "Series",    slug: "Series" },
  { k: "game",      icon: "🕹️", label: "Games",     slug: "Games" },
  { k: "boardgame", icon: "🎲", label: "Boardgame", slug: "Boardgame" },
  { k: "music",     icon: "🎶", label: "Music",     slug: "Music" },
  { k: "recipe",    icon: "🍳", label: "Recipes",   slug: "Recipes" },
  { k: "course",    icon: "🎓", label: "Courses",   slug: "Courses" },
  { k: "class",     icon: "🏫", label: "Classes",   slug: "Classes" },
  { k: "article",   icon: "📄", label: "Articles",  slug: "Articles" },
  { k: "paper",     icon: "📃", label: "Papers",    slug: "Papers" },
  { k: "video",     icon: "🎬", label: "Videos",    slug: "Videos" },
  { k: "ai",        icon: "🤖", label: "AI",        slug: "AI" },
  { k: "guide",     icon: "🗺️", label: "Guides",    slug: "Guides" },
  { k: "museum",    icon: "🖼️", label: "Museums",   slug: "Museums" },
  { k: "reference", icon: "📚", label: "Reference", slug: "Reference" },
  { k: "software",  icon: "💽", label: "Software",  slug: "Software" },
];

out.push(`<h2>Sources</h2>`);
out.push(dash.statCards(kinds.map(x => ({
  label: `${x.icon} ${x.label}`,
  n: res.filter(p => isKind(p, x.k)).length,
  href: `0_Atlas/0_Dashboard/6-Resources/${x.slug}`,
}))));

out.push(`<h2>Entities</h2>`);
const ent = res.filter(p => String(p.page.archtype ?? "").includes("#6resource/entity"));
out.push(dash.statCards([
  { label: "📦 Entities total", n: ent.length, sub: "things you own" },
  { label: "🥕 Ingredients",          n: ent.filter(p => String(p.page.archtype ?? "").includes("ingredients")).length },
  { label: "👗 Clothing",         n: ent.filter(p => String(p.page.archtype ?? "").includes("clothing")).length },
  { label: "💻 Tech",          n: ent.filter(p => String(p.page.archtype ?? "").includes("tech")).length },
]));

out.push(`<h2>Recently Added</h2>`);
out.push(dash.table(
  dash.recent(12, p => p.isResource).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#6resource/", ""), p.status, dash.fmtDate(p.mtime)]),
  ["Entry", "Type", "Status", "Modified"]));

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/Resourcebase.base]]
