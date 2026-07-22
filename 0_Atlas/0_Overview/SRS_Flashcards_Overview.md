---
cssclasses:
  - wide-page
---

# 🎴 Community Plugin SRS Flashcards Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] 🎴 Flashcards Repetition Matrix (Y: Discipline | X: Next Review Horizon)

```dataviewjs
const pages = dv.pages('"5_Notes" or "6_Resources"')
    .where(p => p.archtype && (p.archtype.includes("#5note/3atomic/srs") || p.file.tags.includes("#srs/sync")));

const today = moment().startOf('day');

const discSet = new Set();
pages.forEach(p => {
    let disc = p.discipline || p.discTag || p.areaTag || "Vocabulary & Facts";
    if (Array.isArray(disc)) disc = disc[0];
    discSet.add(disc.replace(/^#/, ''));
});

const sortedDiscs = Array.from(discSet).sort();

const columns = [
    "Discipline",
    "🚨 Overdue",
    "📅 Due Today",
    "🌱 1–3 Days",
    "🌿 4–7 Days",
    "🌳 8+ Days"
];

const tableRows = [];

sortedDiscs.forEach(disc => {
    const discPages = pages.filter(p => {
        let d = p.discipline || p.discTag || p.areaTag || "Vocabulary & Facts";
        if (Array.isArray(d)) d = d[0];
        return d.replace(/^#/, '') === disc;
    });

    const overdue = [];
    const dueTodayCol = [];
    const days1to3 = [];
    const days4to7 = [];
    const mastered = [];

    discPages.forEach(p => {
        if (!p.space_date) {
            mastered.push(p.file.link);
            return;
        }
        const due = moment(p.space_date);
        const diffDays = due.diff(today, 'days');

        if (diffDays < 0) overdue.push(`${p.file.link} <small style="opacity:0.6;">(${Math.abs(diffDays)}d)</small>`);
        else if (diffDays === 0) dueTodayCol.push(p.file.link);
        else if (diffDays <= 3) days1to3.push(p.file.link);
        else if (diffDays <= 7) days4to7.push(p.file.link);
        else mastered.push(p.file.link);
    });

    tableRows.push([
        `**${disc}**`,
        overdue.length > 0 ? overdue.join("<br>") : "-",
        dueTodayCol.length > 0 ? dueTodayCol.join("<br>") : "-",
        days1to3.length > 0 ? days1to3.join("<br>") : "-",
        days4to7.length > 0 ? days4to7.join("<br>") : "-",
        mastered.length > 0 ? mastered.join("<br>") : "-"
    ]);
});

if (pages.length > 0) {
    dv.table(columns, tableRows);
} else {
    dv.paragraph("_No SRS Flashcards found. Create a note with template `3atomic_srs`._");
}
```
