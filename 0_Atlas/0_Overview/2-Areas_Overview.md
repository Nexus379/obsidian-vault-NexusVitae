---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: 💠
---

# 💠 Areas

<div class="nv-kicker">Seven areas of responsibility, mapped to the chakras — from grounding to dissolution. Areas never end; they are tended.</div>

![[zData/5design_modul/MainNav|MainNav]]

**Create & process:** `BUTTON[a-btn]` `BUTTON[add-area-overview]`
<small style="opacity:.5;font-style:italic;">(Cockpit turns the open area into its own overview page under 0_Overview/2_Areas)</small>

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];

const areas = [
  { n: 1, key: "1selfcare",     name: "Selfcare",     icon: "🌸", chakra: "Root",         slug: "1-Selfcare",     was: "Grounding, body, provision" },
  { n: 2, key: "2creativity",   name: "Creativity",   icon: "🎨", chakra: "Sacral",       slug: "2-Creativity",   was: "Creating, flow, pleasure" },
  { n: 3, key: "3drive",        name: "Drive",        icon: "🔥", chakra: "Solar Plexus", slug: "3-Drive",        was: "Will, drive, discipline" },
  { n: 4, key: "4relationship", name: "Relationship", icon: "🦄", chakra: "Heart",        slug: "4-Relationship", was: "Connection, people" },
  { n: 5, key: "5expression",   name: "Expression",   icon: "🗣️", chakra: "Throat",       slug: "5-Expression",   was: "Voice, teaching, content" },
  { n: 6, key: "6mind",         name: "Mind",         icon: "🧠", chakra: "Third Eye",    slug: "6-Mind",         was: "Knowledge, study, clarity" },
  { n: 7, key: "7crown",        name: "Crown",        icon: "🕉️", chakra: "Crown",        slug: "7-Crown",        was: "Meaning, stillness, letting go" },
];

out.push(`<div class="nv-grid nv-2">`);
for (const a of areas) {
  const mine = dash.area(a.key);
  const openTasks = mine.filter(p => p.isTask && p.open).length;
  out.push(`<div class="nv-card nv-link nv-area cha${a.n}"><div class="nv-ico">${a.icon}</div><div class="nv-body">`
    + `<div class="nv-name"><a class="internal-link" href="0_Atlas/0_Dashboard/2-Areas/${a.slug}">${a.name}</a></div>`
    + `<div class="nv-meta">${a.chakra} · ${a.was}</div>`
    + `<div class="nv-meta">${mine.length} Entries${openTasks ? ` · ${openTasks} offene Tasks` : ""}</div>`
    + `</div></div>`);
}
out.push(`</div>`);

out.push(`<h2>Sub-boards</h2><div class="nv-grid">`);
out.push(`<div class="nv-card nv-link nv-area cha3"><div class="nv-ico">🏋️</div><div class="nv-body">`
  + `<div class="nv-name"><a class="internal-link" href="0_Atlas/0_Dashboard/2-Areas/3-Drive_Fitnessboard">Fitness</a></div>`
  + `<div class="nv-meta">Training & Progression</div></div></div>`);
out.push(`<div class="nv-card nv-link nv-area cha3"><div class="nv-ico">🪙</div><div class="nv-body">`
  + `<div class="nv-name"><a class="internal-link" href="0_Atlas/0_Dashboard/2-Areas/3-Drive_Financeboard">Finance</a></div>`
  + `<div class="nv-meta">Geld & Verpflichtungen</div></div></div>`);
out.push(`</div>`);

out.push(`<h2>Recently in the Areas</h2>`);
out.push(dash.table(
  dash.recent(10, p => p.isArea).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#2area/", ""), dash.fmtDate(p.mtime)]),
  ["Entry", "Area", "Modified"]));

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/2-Areas/Areas.base]]
