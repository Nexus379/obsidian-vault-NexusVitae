<%-*
const kwMatch = tp.variables.displayTitle; // e.g. 2026-W28
const year = kwMatch.split("-")[0];
const kw = kwMatch.split("W")[1];
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 🍱
fileTitle: "<%- tp.variables.title %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/7plan/meal"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
mon_brk: ""
mon_lun: ""
mon_eve: ""
tue_brk: ""
tue_lun: ""
tue_eve: ""
wed_brk: ""
wed_lun: ""
wed_eve: ""
thu_brk: ""
thu_lun: ""
thu_eve: ""
fri_brk: ""
fri_lun: ""
fri_eve: ""
sat_brk: ""
sat_lun: ""
sat_eve: ""
sun_brk: ""
sun_lun: ""
sun_eve: ""
---

# 🍱 Meal Plan: <%- kwMatch %>

> [!info] 🤖 Nexus KI: Nutritional Balance
> ```dataviewjs
> dv.paragraph("_Analyze macro trends from past weeks here._");
> ```

---

## 🗓️ Menu Matrix

> [!abstract] **Meal Planner**
> `BUTTON[freeze-week]` 
>
> | Day | 🌅 Breakfast | 🥗 Lunch | 🌙 Dinner |
> |---|---|---|---|
> | **Mon** | `INPUT[text:mon_brk]` | `INPUT[text:mon_lun]` | `INPUT[text:mon_eve]` |
> | **Tue** | `INPUT[text:tue_brk]` | `INPUT[text:tue_lun]` | `INPUT[text:tue_eve]` |
> | **Wed** | `INPUT[text:wed_brk]` | `INPUT[text:wed_lun]` | `INPUT[text:wed_eve]` |
> | **Thu** | `INPUT[text:thu_brk]` | `INPUT[text:thu_lun]` | `INPUT[text:thu_eve]` |
> | **Fri** | `INPUT[text:fri_brk]` | `INPUT[text:fri_lun]` | `INPUT[text:fri_eve]` |
> | **Sat** | `INPUT[text:sat_brk]` | `INPUT[text:sat_lun]` | `INPUT[text:sat_eve]` |
> | **Sun** | `INPUT[text:sun_brk]` | `INPUT[text:sun_lun]` | `INPUT[text:sun_eve]` |

---
## 🛒 Shopping & Notes
- 
