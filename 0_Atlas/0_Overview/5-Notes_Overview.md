---
cssclasses:
  - nexus-v2
  - dashboard-no-border
banner_icon: ✏️
---

# ✏️ Notes

<div class="nv-kicker">The Zettelkasten. Thoughts travel from fleeting to permanent — the stage lives in the archtype, not in the folder.</div>

![[zData/5design_modul/MainNav|MainNav]]

<div class="nv-nav">
<a class="internal-link" href="0_Atlas/0_Dashboard/5-Notes/1-Fleeting">🍂 Fleeting</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/5-Notes/2-Literature">📘 Literature</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/5-Notes/3-Atomic">🗃️ Atomic</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/5-Notes/4-Permanent">📜 Permanent</a>
<a class="internal-link" href="0_Atlas/0_Dashboard/5-Notes/5-Evergreen">🌳 Evergreen</a>
</div>

**Create & process:** `BUTTON[n-btn]` `BUTTON[topermanent]` `BUTTON[add-note-overview]` `BUTTON[spaced]`
<small style="opacity:.5;font-style:italic;">(Promote lifts a fleeting note into the Zettelkasten — exactly the step this page is for)</small>

```dataviewjs
const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
const out = [];
const stage = (p, k) => String(p.page.archtype ?? "").includes(k);
const notes = dash.where(p => p.isNote);

// Maturity read as a chain: what sits at the front wants to move to the back.
out.push(`<h2>Maturity</h2>`);
out.push(dash.statCards([
  { label: "🍂 Fleeting",   n: notes.filter(p => stage(p, "1fleeting")).length,   sub: "roh",           href: "0_Atlas/0_Dashboard/5-Notes/1-Fleeting" },
  { label: "📘 Literature", n: notes.filter(p => stage(p, "2literature")).length, sub: "from sources",   href: "0_Atlas/0_Dashboard/5-Notes/2-Literature" },
  { label: "🗃️ Atomic",     n: notes.filter(p => stage(p, "3atomic")).length,     sub: "ein Gedanke",   href: "0_Atlas/0_Dashboard/5-Notes/3-Atomic" },
  { label: "📜 Permanent",  n: notes.filter(p => stage(p, "4permanent")).length,  sub: "eigene Worte",  href: "0_Atlas/0_Dashboard/5-Notes/4-Permanent" },
  { label: "🌳 Evergreen",  n: notes.filter(p => stage(p, "5evergreen")).length,  sub: "gewachsen",     href: "0_Atlas/0_Dashboard/5-Notes/5-Evergreen" },
]));

out.push(`<h2>Fleeting — waiting to be processed</h2>`);
const fleet = notes.filter(p => stage(p, "1fleeting")).sort((a, b) => a.mtime - b.mtime);
out.push(fleet.length
  ? dash.table(fleet.slice(0, 12).map(p => [dash.linkTo(p), String(p.page.discipline ?? "").replace("#disc/", ""), dash.fmtDate(p.mtime)]), ["Note", "Discipline", "Waiting since"])
  : `<p class="nv-sub">Nichts Rohes offen — der Kasten ist verdaut.</p>`);

out.push(`<h2>Recently Grown</h2>`);
out.push(dash.table(
  dash.recent(10, p => p.isNote).map(p => [dash.linkTo(p), String(p.page.archtype ?? "").replace("#5note/", ""), dash.fmtDate(p.mtime)]),
  ["Note", "Stage", "Modified"]));

dv.el("div", out.join(""));
```

## Library

![[0_Atlas/Bases/5-Notes/Notes.base]]
