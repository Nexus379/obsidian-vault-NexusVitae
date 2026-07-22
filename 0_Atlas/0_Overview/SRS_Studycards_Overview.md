---
cssclasses:
  - wide-page
---

# 🖖 Concept Studycards Overview (Star Trek Ebbinghaus Ranks)

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!info] 🖖 Concept Studycards Matrix (Y: Discipline | X: Space Ranks)

```dataviewjs
const pages = dv.pages('"5_Notes" or "6_Resources"')
    .where(p => p.space_rank != null || (p.archtype && p.archtype.includes("#5note/3atomic/studycards")));

const discSet = new Set();
pages.forEach(p => {
    let disc = p.discipline || p.discTag || p.areaTag || "Concept Knowledge";
    if (Array.isArray(disc)) disc = disc[0];
    discSet.add(disc.replace(/^#/, ''));
});

const sortedDiscs = Array.from(discSet).sort();

const columns = [
    "Discipline",
    "👨‍🎓 Cadet (Rank 1)",
    "🎖️ Lieutenant (Rank 2)",
    "🏅 Commander (Rank 3)",
    "🎗️ Captain (Rank 4)",
    "👑 Admiral (Rank 5)"
];

const rankMap = {
    "cadet": 1, "rank 1": 1, "1": 1,
    "lieutenant": 2, "rank 2": 2, "2": 2,
    "commander": 3, "rank 3": 3, "3": 3,
    "captain": 4, "rank 4": 4, "4": 4,
    "admiral": 5, "rank 5": 5, "5": 5
};

const tableRows = [];

sortedDiscs.forEach(disc => {
    const discPages = pages.filter(p => {
        let d = p.discipline || p.discTag || p.areaTag || "Concept Knowledge";
        if (Array.isArray(d)) d = d[0];
        return d.replace(/^#/, '') === disc;
    });

    const rank1 = [];
    const rank2 = [];
    const rank3 = [];
    const rank4 = [];
    const rank5 = [];

    discPages.forEach(p => {
        const rawRank = String(p.space_rank || p.space_lvl || "1").toLowerCase();
        let rNum = rankMap[rawRank] || parseInt(rawRank) || 1;

        const dateBadge = p.space_date ? `<small style="opacity:0.6;"> (${p.space_date})</small>` : '';
        const itemStr = `${p.file.link}${dateBadge}`;

        if (rNum === 1) rank1.push(itemStr);
        else if (rNum === 2) rank2.push(itemStr);
        else if (rNum === 3) rank3.push(itemStr);
        else if (rNum === 4) rank4.push(itemStr);
        else rank5.push(itemStr);
    });

    tableRows.push([
        `**${disc}**`,
        rank1.length > 0 ? rank1.join("<br>") : "-",
        rank2.length > 0 ? rank2.join("<br>") : "-",
        rank3.length > 0 ? rank3.join("<br>") : "-",
        rank4.length > 0 ? rank4.join("<br>") : "-",
        rank5.length > 0 ? rank5.join("<br>") : "-"
    ]);
});

if (pages.length > 0) {
    dv.table(columns, tableRows);
} else {
    dv.paragraph("_No Concept Studycards found. Create a note with template `3atomic_studycards`._");
}
```
