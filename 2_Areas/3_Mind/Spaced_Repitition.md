---
banner: "![[xAttachment/Images/Banner/Area Banner/study, blau.jpg]]"
banner_icon: 🚀
arch: ["#2area"]
archtype: ["#2area/3mind"]
---

# 🚀 Nexus Starfleet Command (Spaced Repetition)

> [!abstract] 🌌 Mission Briefing
> This is your central hub for the Ebbinghaus Prime-Chain. 
> Keep your Starfleet Ranks high and your delayed missions low.

---

## 🚨 Action Center (Due Now)

> [!multi-column]
>
> > [!danger|flat] ⚠️ Delayed Missions (Past Due)
> > ```dataview
> > TABLE WITHOUT ID
> >   space_rank as "Rank",
> >   file.link as "Topic",
> >   space_date as "Overdue Since"
> > WHERE space_date != null
> >   AND space_date < date(today) 
> >   AND status != "archive"
> > SORT space_date ASC
> > ```
>
> > [!check|flat] 🛰️ Active Missions (Today)
> > ```dataview
> > TABLE WITHOUT ID
> >   space_rank as "Rank",
> >   file.link as "Topic",
> >   "Today" as "Due"
> > WHERE space_date = date(today) 
> >   AND status != "archive"
> > SORT space_lvl DESC
> > ```

---

## 📡 Deep Space Radar (Next 7 Days)

> [!abstract] Upcoming Scans
> ```dataview
> TABLE WITHOUT ID
>   space_rank as "Rank",
>   file.link as "Topic",
>   space_date as "Scheduled Date"
> WHERE space_date != null
>   AND space_date > date(today)
>   AND space_date <= date(today) + dur(7 days)
>   AND status != "archive"
> SORT space_date ASC
> ```

---

## 🏛️ Hall of Masters (Top Tier Knowledge)

> [!info] 🎖️ High Council (Level 15+)
> ```dataview
> TABLE WITHOUT ID
>   space_rank as "Rank",
>   file.link as "Topic",
>   space_date as "Next Review"
> WHERE space_date != null
>   AND space_lvl >= 15
>   AND status != "archive"
> SORT space_lvl DESC
> ```

---
[[3Mind|⬅️ Back to Mind Area]]