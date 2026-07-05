<%-*
const kwMatch = tp.variables.displayTitle; // e.g. 2026-W28
const year = kwMatch.split("-")[0];
const kw = kwMatch.split("W")[1];
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 📚
fileTitle: "<%- tp.variables.title %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/7plan/study"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
tt_mon_1: ""
tt_tue_1: ""
tt_wed_1: ""
tt_thu_1: ""
tt_fri_1: ""
tt_sat_1: ""
tt_sun_1: ""
---

# 📚 Study & PKM Plan: <%- kwMatch %>

> [!info] 🤖 Nexus KI: Knowledge Gaps
> ```dataviewjs
> dv.paragraph("_Analyze unlinked mentions or spaced repetition metrics here._");
> ```

---

## 🗓️ Learning Focus

> [!abstract] **Study Planner**
> `BUTTON[freeze-week]` 
>
> | Day | 🧠 Focus Topic |
> |---|---|
> | **Mon** | `INPUT[text:tt_mon_1]` |
> | **Tue** | `INPUT[text:tt_tue_1]` |
> | **Wed** | `INPUT[text:tt_wed_1]` |
> | **Thu** | `INPUT[text:tt_thu_1]` |
> | **Fri** | `INPUT[text:tt_fri_1]` |
> | **Sat** | `INPUT[text:tt_sat_1]` |
> | **Sun** | `INPUT[text:tt_sun_1]` |

---
## 📝 References
- 
