<%-*
const dv = app.plugins.plugins.dataview?.api;
let resType = tp.variables.resType || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");
-%>
---
cssclasses:
  - wide-page
---

# 🔖 Resource Cockpit: [[<%- resType %>]]

![[zData/5design_modul/OverviewNavigationModul]]

**Create & process:** `BUTTON[r-btn]` `BUTTON[convert-bought-entity]` `BUTTON[apply-shopping-price]`

---

### 📊 At a glance
```dataviewjs
// The page title is PLURAL ("Books"), the archtype is SINGULAR ("#6resource/book").
// Comparing them with includes() found nothing, so every plural cockpit stayed empty.
// Matching both directions covers plurals without a hand-kept singular/plural table.
const fold = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const want = fold("<%- resType %>");
const isType = (p) => {
    if (!want) return false;
    const segs = String(p.archtype || "").toLowerCase().split(/[\s,/\[\]"]+/).filter(Boolean);
    if (segs.some(s => s.length >= 3 && (s.startsWith(want) || want.startsWith(s)))) return true;
    return fold(p.file.path).includes(want);
};

// One pass for all four numbers — the split happens afterwards in memory.
const all = dv.pages('"6_Resources"').where(isType);
const st = k => all.where(p => String(p.status || "").toLowerCase().includes(k)).length;

dv.table(["📦 Total", "⚡ Active", "✅ Done", "💡 Queued"],
    [[all.length, st("1active"), st("done"), st("3idea") + st("0start")]]);
```

---

### ⚡ In progress
```dataviewjs
const fold = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const want = fold("<%- resType %>");
const isType = (p) => {
    if (!want) return false;
    const segs = String(p.archtype || "").toLowerCase().split(/[\s,/\[\]"]+/).filter(Boolean);
    if (segs.some(s => s.length >= 3 && (s.startsWith(want) || want.startsWith(s)))) return true;
    return fold(p.file.path).includes(want);
};

const active = dv.pages('"6_Resources"').where(p => {
    if (!isType(p)) return false;
    const s = String(p.status || "").toLowerCase();
    return s.includes("1active") || s.includes("0start");
}).sort(p => p.file.mtime, "desc");

if (active.length > 0) {
    dv.table(["🔖 Item", "✍️ Creator", "⭐ Rating", "🕒 Modified"],
        active.map(r => [r.file.link, r.creator || "—", r.rating || "—", r.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_Nothing in progress._");
}
```

---

### 🔗 What uses it?
```dataviewjs
// Projects and tasks that reference a resource of this type.
const fold = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const want = fold("<%- resType %>");
const isType = (p) => {
    if (!want) return false;
    const segs = String(p.archtype || "").toLowerCase().split(/[\s,/\[\]"]+/).filter(Boolean);
    if (segs.some(s => s.length >= 3 && (s.startsWith(want) || want.startsWith(s)))) return true;
    return fold(p.file.path).includes(want);
};

const names = new Set(dv.pages('"6_Resources"').where(isType).map(p => p.file.name));

const users = dv.pages('"3_Projects" OR "4_Tasks"').where(p =>
    p.file.outlinks.toFile().some(l => names.has(l.name)) ||
    [...names].some(n => String(p.resource6 || "").includes(n))
);

if (users.length > 0) {
    dv.table(["🧩 Entry", "🏷️ Type", "🚦 Status"],
        users.map(u => [u.file.link, u.archtype ? u.archtype[0] : "—", u.status || "1active"]));
} else {
    dv.paragraph("_Not linked anywhere yet._");
}
```

---

### 🔖 All entries
```dataviewjs
const fold = s => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const want = fold("<%- resType %>");
const isType = (p) => {
    if (!want) return false;
    const segs = String(p.archtype || "").toLowerCase().split(/[\s,/\[\]"]+/).filter(Boolean);
    if (segs.some(s => s.length >= 3 && (s.startsWith(want) || want.startsWith(s)))) return true;
    return fold(p.file.path).includes(want);
};

const res = dv.pages('"6_Resources"').where(isType).sort(p => p.file.name, "asc");

if (res.length > 0) {
    dv.table(["🔖 Item", "🚦 Status", "⭐ Rating", "🕒 Modified"],
        res.map(r => [r.file.link, r.status || "1active", r.rating || "—", r.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No resources found for this type._");
}
```
