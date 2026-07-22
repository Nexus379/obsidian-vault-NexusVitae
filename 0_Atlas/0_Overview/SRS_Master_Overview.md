---
cssclasses:
  - wide-page
---

# 🎓 Spaced Repetition Master Overview (SRS & Studycards)

![[zData/5design_modul/OverviewNavigationModul]]

---

> [!abstract] 📊 Master Learning Metrics
> ```dataviewjs
> const allNotes = dv.pages('"5_Notes" or "6_Resources"')
>     .where(p => p.archtype && (p.archtype.includes("#5note/3atomic/srs") || p.archtype.includes("#5note/3atomic/studycards") || p.file.tags.includes("#srs/sync") || p.space_rank != null));
> 
> const srsCards = allNotes.filter(p => p.archtype && p.archtype.includes("#5note/3atomic/srs"));
> const studyCards = allNotes.filter(p => p.space_rank != null || (p.archtype && p.archtype.includes("#5note/3atomic/studycards")));
> 
> const today = moment().startOf('day');
> const dueToday = allNotes.filter(p => {
>     if (!p.space_date) return false;
>     return moment(p.space_date).isSameOrBefore(today, 'day');
> });
> 
> dv.paragraph(`
> <div style="display: flex; gap: 20px; text-align: center; margin-bottom: 10px;">
>   <div style="flex: 1; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px; border-left: 4px solid var(--interactive-accent);">
>     <div style="font-size: 1.8em; font-weight: bold;">${allNotes.length}</div>
>     <div style="font-size: 0.85em; opacity: 0.8;">📚 Total Cards</div>
>   </div>
>   <div style="flex: 1; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px; border-left: 4px solid #64b5f6;">
>     <div style="font-size: 1.8em; font-weight: bold;">${srsCards.length}</div>
>     <div style="font-size: 0.85em; opacity: 0.8;">🎴 Flashcards (Community SRS)</div>
>   </div>
>   <div style="flex: 1; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px; border-left: 4px solid #ba68c8;">
>     <div style="font-size: 1.8em; font-weight: bold;">${studyCards.length}</div>
>     <div style="font-size: 0.85em; opacity: 0.8;">🖖 Concept Studycards</div>
>   </div>
>   <div style="flex: 1; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px; border-left: 4px solid #ffb74d;">
>     <div style="font-size: 1.8em; font-weight: bold;">${dueToday.length}</div>
>     <div style="font-size: 0.85em; opacity: 0.8;">🚨 Due Today</div>
>   </div>
> </div>
> `);
> ```

---

### 🌐 Combined Repetition Matrix (Y: Discipline | X: Next Review Horizon)

```dataviewjs
const pages = dv.pages('"5_Notes" or "6_Resources"')
    .where(p => p.archtype && (p.archtype.includes("#5note/3atomic/srs") || p.archtype.includes("#5note/3atomic/studycards") || p.space_rank != null));

const today = moment().startOf('day');

const discSet = new Set();
pages.forEach(p => {
    let disc = p.discipline || p.discTag || p.areaTag || "General";
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
    "🌳 8+ Days / Mastered"
];

const tableRows = [];

sortedDiscs.forEach(disc => {
    const discPages = pages.filter(p => {
        let d = p.discipline || p.discTag || p.areaTag || "General";
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

dv.table(columns, tableRows);
```
