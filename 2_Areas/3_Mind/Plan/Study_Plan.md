---
banner: "![[xAttachment/Images/Banner/library-knowledge.jpg]]"
banner_y: 0.5
banner_icon: 🎓
arch:
  - "#2area"
archtype:
  - "#2area/3mind"
status: 1active
area2: "#2area/3mind"
cssclasses:
  - wide-page
---

# 🎓 Master Study Plan & Star Trek Mastery Matrix

> [!quote] "Live long and prosper — in knowledge and mastery."

> [!multi-column]
>
> > [!info] 🧠 **Mastery Matrix Principle**
> > *Every SRS Card is a Study Card, but not every Study Card is an SRS Card.*  
> > Track your learning missions across disciplines and advance through Star Trek Ranks!
>
> > [!abstract] 📊 **Knowledge Overview**
> > **Active Study Cards:** `$= dv.pages('#5note/3atomic/studycards AND !"zData" AND -"yArchive"').length` cards  
> > **Active SRS Due:** `$= dv.pages('#5note/3atomic/studycards AND !"zData" AND -"yArchive"').where(p => p.space_date && moment(String(p.space_date)).isSameOrBefore(moment(), 'day')).length` due today

---

## 🎖️ Star Trek Rank Mastery Matrix

```dataviewjs
const pages = dv.pages('(#5note/3atomic/studycards OR #5note/3atomic) AND !"zData" AND -"yArchive"')
    .where(p => p.space_rank != null && p.status !== "archive" && p.status !== "archived");

if (pages.length > 0) {
    const grouped = pages.groupBy(p => {
        let disc = p.discipline ? (Array.isArray(p.discipline) ? p.discipline[0] : p.discipline) : "General";
        return String(disc).replace("#disc/", "").toUpperCase();
    });

    const rows = [];
    grouped.forEach(g => {
        let r1 = g.rows.filter(p => !p.space_rank || p.space_rank === 1).map(p => p.file.link).slice(0, 5).join("<br>") || "—";
        let r2 = g.rows.filter(p => p.space_rank === 2).map(p => p.file.link).slice(0, 5).join("<br>") || "—";
        let r3 = g.rows.filter(p => p.space_rank === 3).map(p => p.file.link).slice(0, 5).join("<br>") || "—";
        let r4 = g.rows.filter(p => p.space_rank === 4).map(p => p.file.link).slice(0, 5).join("<br>") || "—";
        let r5 = g.rows.filter(p => p.space_rank >= 5).map(p => p.file.link).slice(0, 5).join("<br>") || "—";
        rows.push([`**${g.key}**`, r1, r2, r3, r4, r5]);
    });

    dv.table(["📚 Discipline (Y-Axis)", "Cadet (L1) 🎖️", "Ensign (L2) 🔰", "Lieutenant (L3) 🎗️", "Commander (L4) 🎖️", "Captain (L5) 👨‍✈️"], rows);
} else {
    dv.paragraph("_No active Study Cards found._");
}
```

---

## 🧠 Spaced Repetition (Active Interval Reviews)

```dataview
TABLE WITHOUT ID
  space_rank as "Rank",
  file.link as "Mission / Topic",
  space_date as "Due Stardate"
WHERE space_date != null
  AND date(space_date) <= date(today) 
  AND status != "archive"
SORT space_date ASC
```
