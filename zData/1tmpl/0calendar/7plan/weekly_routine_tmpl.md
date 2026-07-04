<%-*
const kwMatch = tp.variables.displayTitle; // e.g. 2026-W28
const year = kwMatch.split("-")[0];
const kw = kwMatch.split("W")[1];
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 🔸
fileTitle: "<%- tp.variables.title %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/7plan/routine"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
rt_start: "07:00"
rt_duration: 60
rt_periods: 14
rt_breaks: "4:30, 8:60"
rt_mon_1: "focus"
rt_mon_2: "focus"
rt_mon_3: "focus"
rt_tue_1: "focus"
rt_tue_2: "focus"
rt_wed_1: "focus"
rt_wed_2: "focus"
rt_thu_1: "focus"
rt_thu_2: "focus"
rt_fri_1: "focus"
rt_fri_2: "focus"
rt_sat_1: "free"
rt_sun_1: "free"
---

# 🔸 Routine & Timeblocking: <%- kwMatch %>

> [!info] 🤖 Nexus KI: Schedule Analysis
> ```dataviewjs
> dv.paragraph("_Analyze your peak performance times here._");
> ```

---

## 🗓️ Weekly Timeblocking Matrix

> [!abstract] **Routine Engine**
> `BUTTON[freeze-week]` 
> 
> Set the blocks below using values like `focus`, `work`, `free`, `break`, `custom|Your Text`.
>
> | Period | 🌅 Mon | ☀️ Tue | 🌿 Wed | ⚡ Thu | 🥂 Fri | 🏕️ Sat | 🌙 Sun |
> |---|---|---|---|---|---|---|---|
> | **P1** | `INPUT[text:rt_mon_1]` | `INPUT[text:rt_tue_1]` | `INPUT[text:rt_wed_1]` | `INPUT[text:rt_thu_1]` | `INPUT[text:rt_fri_1]` | `INPUT[text:rt_sat_1]` | `INPUT[text:rt_sun_1]` |
> | **P2** | `INPUT[text:rt_mon_2]` | `INPUT[text:rt_tue_2]` | `INPUT[text:rt_wed_2]` | `INPUT[text:rt_thu_2]` | `INPUT[text:rt_fri_2]` | `INPUT[text:rt_sat_2]` | `INPUT[text:rt_sun_2]` |
> | **P3** | `INPUT[text:rt_mon_3]` | `INPUT[text:rt_tue_3]` | `INPUT[text:rt_wed_3]` | `INPUT[text:rt_thu_3]` | `INPUT[text:rt_fri_3]` | `INPUT[text:rt_sat_3]` | `INPUT[text:rt_sun_3]` |

---
## 📝 Notes
- 
