<%-*
const dv = app.plugins.plugins.dataview?.api;
let sciName = tp.variables.sciName || "";
let discName = tp.variables.discName || tp.file.title.replace("_Cockpit", "").replace("_Overview", "");

// Resolve through the disciplineEngine. The page title is a LABEL ("Art Class"), while
// notes carry the TAG ("#disc/ArtClass") — matching one against the other found nothing
// for every multi-word discipline. The engine also knows which science tags belong to it,
// so sciName no longer has to be passed in and kept in sync by hand.
let discTag = "";
let sciTags = [];
try {
    const dEng = require(app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js")();
    const fold = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const want = fold(discName);
    const hit = dEng.getDisciplineLabels().find(d =>
        fold(d.label) === want || fold(d.key) === want || fold(d.disc).endsWith(want));
    if (hit) {
        discTag = hit.disc;
        sciTags = hit.sci || [];
        discName = hit.label;
        if (!sciName) sciName = sciTags.map(s => s.replace("#sci/", "")).join(", ");
    }
} catch (e) { /* engine unreachable — the queries fall back to name matching */ }
if (!sciName) sciName = "Science";
-%>
---
cssclasses:
  - wide-page
---

# 📚 Knowledge Cockpit: [[<%- discName %>]] (<%- sciName %>)

![[zData/5design_modul/OverviewNavigationModul]]

**Anlegen & verarbeiten:** `BUTTON[n-btn]` `BUTTON[topermanent]` `BUTTON[spaced]` `BUTTON[add-disc-pkm]`

---

### 🗃️ Zettelkasten & Atomic Notes
```dataviewjs
// Match on TAGS, resolved by the disciplineEngine — the label carries spaces, the tag does not.
const dTag = "<%- discTag %>".toLowerCase();
const sTags = <%- JSON.stringify(sciTags) %>.map(s => s.toLowerCase());
const dName = "<%- discName %>".toLowerCase();
const notes = dv.pages('"5_Notes"').where(p => {
    // Field is called "science", not "sci" — with p.sci half the condition never matched.
    const meta = (String(p.discipline || "") + " " + String(p.science || "") + " " + String(p.file.tags || "")).toLowerCase();
    if (dTag) return meta.includes(dTag) || sTags.some(s => meta.includes(s));
    return meta.includes(dName);   // discipline unknown to the engine: fall back to the name
});

if (notes.length > 0) {
    dv.table(["🗃️ Note", "🏷️ Type", "🕒 Modified"], notes.map(n => [n.file.link, n.archtype ? n.archtype[0] : "Note", n.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No notes found for this discipline._");
}
```

---

### 🔖 Related Resources & Media
```dataviewjs
const dTag = "<%- discTag %>".toLowerCase();
const sTags = <%- JSON.stringify(sciTags) %>.map(s => s.toLowerCase());
const dName = "<%- discName %>".toLowerCase();
const res = dv.pages('"6_Resources"').where(p => {
    // Field is called "science", not "sci" — with p.sci half the condition never matched.
    const meta = (String(p.discipline || "") + " " + String(p.science || "") + " " + String(p.file.tags || "")).toLowerCase();
    if (dTag) return meta.includes(dTag) || sTags.some(s => meta.includes(s));
    return meta.includes(dName);
});

if (res.length > 0) {
    dv.table(["🔖 Resource", "🏷️ Type", "🕒 Modified"], res.map(r => [r.file.link, r.archtype ? r.archtype[0] : "Resource", r.file.mtime.toFormat("yyyy-MM-dd")]));
} else {
    dv.paragraph("_No resources found for this discipline._");
}
```
