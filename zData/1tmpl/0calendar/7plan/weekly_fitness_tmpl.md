<%-*
const kwMatch = tp.variables.displayTitle; // e.g. 2026-W28
const year = kwMatch.split("-")[0];
const kw = kwMatch.split("W")[1];
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 🏋️
fileTitle: "<%- tp.variables.title %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/7plan/fitness"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
mon_plan: ""
mon_act: 0
tue_plan: ""
tue_act: 0
wed_plan: ""
wed_act: 0
thu_plan: ""
thu_act: 0
fri_plan: ""
fri_act: 0
sat_plan: ""
sat_act: 0
sun_plan: ""
sun_act: 0
---

# 🏋️ Fitness & Training Plan: <%- kwMatch %>

> [!info] 🤖 Nexus KI: Historical Analysis
> ```dataviewjs
> const currKw = Number(dv.current().plan_kw);
> const year = dv.current().plan_year;
> const pastPlans = dv.pages('"0_Calendar/7_Plan/Fitness/Weekly"')
>     .where(p => p.plan_year === year && Number(p.plan_kw) < currKw)
>     .sort(p => p.file.name, "desc").limit(3);
> 
> if (pastPlans.length === 0) {
>     dv.paragraph("_No historical data found. Start building your legacy!_");
> } else {
>     let totalWorkouts = 0;
>     pastPlans.forEach(p => {
>         const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
>         days.forEach(d => {
>             if (Number(p[d+"_act"]) > 0) totalWorkouts++;
>         });
>     });
>     const avg = (totalWorkouts / pastPlans.length).toFixed(1);
>     dv.paragraph(`📊 **Historical Data (Last ${pastPlans.length} weeks):**\nAverage Workouts per Week: **${avg}**\n\n> [!tip] **KI Suggestion:** Aim for ${Math.ceil(avg)} to ${Math.ceil(avg) + 1} sessions this week to maintain progressive overload.`);
> }
> ```

---

## 🗓️ Weekly Execution Matrix

> [!abstract] **Plan vs. Actuals**
> `BUTTON[freeze-week]` 
> 
> | Day | 🎯 Planned Workout | 🏃🏽 Actuals (Sets/Min) | Status |
> |---|---|---|---|
> | **Monday** | `INPUT[text:mon_plan]` | `INPUT[number:mon_act]` | `$= dv.current().mon_act > 0 ? "✅" : (dv.current().mon_plan ? "⏳" : "—")` |
> | **Tuesday** | `INPUT[text:tue_plan]` | `INPUT[number:tue_act]` | `$= dv.current().tue_act > 0 ? "✅" : (dv.current().tue_plan ? "⏳" : "—")` |
> | **Wednesday**| `INPUT[text:wed_plan]` | `INPUT[number:wed_act]` | `$= dv.current().wed_act > 0 ? "✅" : (dv.current().wed_plan ? "⏳" : "—")` |
> | **Thursday** | `INPUT[text:thu_plan]` | `INPUT[number:thu_act]` | `$= dv.current().thu_act > 0 ? "✅" : (dv.current().thu_plan ? "⏳" : "—")` |
> | **Friday** | `INPUT[text:fri_plan]` | `INPUT[number:fri_act]` | `$= dv.current().fri_act > 0 ? "✅" : (dv.current().fri_plan ? "⏳" : "—")` |
> | **Saturday** | `INPUT[text:sat_plan]` | `INPUT[number:sat_act]` | `$= dv.current().sat_act > 0 ? "✅" : (dv.current().sat_plan ? "⏳" : "—")` |
> | **Sunday** | `INPUT[text:sun_plan]` | `INPUT[number:sun_act]` | `$= dv.current().sun_act > 0 ? "✅" : (dv.current().sun_plan ? "⏳" : "—")` |

> `BUTTON[add-extra-workout]`

---
## 📝 Notes & Adjustments
- 

```meta-bind-button
label: "🔥 Add Extra Workout"
icon: "plus-circle"
style: primary
actions:
  - type: runTemplaterFile
    templateFile: "zData/3snippets/add-extra-fitness.md"
```
