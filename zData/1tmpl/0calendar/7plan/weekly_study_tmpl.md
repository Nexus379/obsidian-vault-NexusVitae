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
mon_topic: ""
tue_topic: ""
wed_topic: ""
thu_topic: ""
fri_topic: ""
sat_topic: ""
sun_topic: ""
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
> | **Mon** | `INPUT[text:mon_topic]` |
> | **Tue** | `INPUT[text:tue_topic]` |
> | **Wed** | `INPUT[text:wed_topic]` |
> | **Thu** | `INPUT[text:thu_topic]` |
> | **Fri** | `INPUT[text:fri_topic]` |
> | **Sat** | `INPUT[text:sat_topic]` |
> | **Sun** | `INPUT[text:sun_topic]` |

---
## 📝 References
- 
