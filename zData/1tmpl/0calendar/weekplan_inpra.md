<%-*
// 🔱 1. ROUTER DATA INTERCEPTION
if (!tp.variables) tp.variables = {};
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const dateStr = targetMoment.format("YYYY-MM-DD");
const year = tp.variables.planYear || targetMoment.format("YYYY");
const kw = tp.variables.planKw || targetMoment.format("WW");
const energy = tp.variables.energy || "3";
const displayTitle = tp.variables.displayTitle || `${year}-W${kw}_inpra`;
-%>
---
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/inpra"
fileTitle: "<%- displayTitle %>"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
frozen: false
plan_type: inpra
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
inpra_active: ""
inpra_book: ""
---
# <%- displayTitle %>

> [!quote] "I’m still learning." — *Michelangelo (at age 87)*

> [!multi-column]
>
> > [!info] 🎸 **Instrument Setup**
> > **Instrument:** `INPUT[suggestList("Piano", "Guitar", "Violin", "Flute", "Vocals", Other):inpra_active]`
> > **Practice Book / Course:** `INPUT[text:inpra_book]`
>
> > [!abstract] 📊 **Weekly Resonance**
> > **Total Time:** `$= const c = dv.current(); const days = ["mon","tue","wed","thu","fri","sat","sun"]; days.reduce((sum, d) => sum + [1,2,3].reduce((s, i) => s + (Number(c["inpra_" + d + "_min_" + i]) || 0), 0), 0)` minutes
> > **Log Rating:** `$= "Actual mastery is rated inside generated Inpra logs."`

---

## 🎼 Practice Log (Live Tracker)
`BUTTON[generate-inpra-log]` `BUTTON[plan-replicator]` 

| Day | Piece 1 | Min | Piece 2 | Min | Piece 3 | Min |
| :--- | :--- | :---: | :--- | :---: | :--- | :---: |
| **Monday** | `INPUT[text:inpra_mon_ex_1]` | `INPUT[number:inpra_mon_min_1]` | `INPUT[text:inpra_mon_ex_2]` | `INPUT[number:inpra_mon_min_2]` | `INPUT[text:inpra_mon_ex_3]` | `INPUT[number:inpra_mon_min_3]` |
| **Tuesday** | `INPUT[text:inpra_tue_ex_1]` | `INPUT[number:inpra_tue_min_1]` | `INPUT[text:inpra_tue_ex_2]` | `INPUT[number:inpra_tue_min_2]` | `INPUT[text:inpra_tue_ex_3]` | `INPUT[number:inpra_tue_min_3]` |
| **Wednesday** | `INPUT[text:inpra_wed_ex_1]` | `INPUT[number:inpra_wed_min_1]` | `INPUT[text:inpra_wed_ex_2]` | `INPUT[number:inpra_wed_min_2]` | `INPUT[text:inpra_wed_ex_3]` | `INPUT[number:inpra_wed_min_3]` |
| **Thursday** | `INPUT[text:inpra_thu_ex_1]` | `INPUT[number:inpra_thu_min_1]` | `INPUT[text:inpra_thu_ex_2]` | `INPUT[number:inpra_thu_min_2]` | `INPUT[text:inpra_thu_ex_3]` | `INPUT[number:inpra_thu_min_3]` |
| **Friday** | `INPUT[text:inpra_fri_ex_1]` | `INPUT[number:inpra_fri_min_1]` | `INPUT[text:inpra_fri_ex_2]` | `INPUT[number:inpra_fri_min_2]` | `INPUT[text:inpra_fri_ex_3]` | `INPUT[number:inpra_fri_min_3]` |
| **Saturday** | `INPUT[text:inpra_sat_ex_1]` | `INPUT[number:inpra_sat_min_1]` | `INPUT[text:inpra_sat_ex_2]` | `INPUT[number:inpra_sat_min_2]` | `INPUT[text:inpra_sat_ex_3]` | `INPUT[number:inpra_sat_min_3]` |
| **Sunday** | `INPUT[text:inpra_sun_ex_1]` | `INPUT[number:inpra_sun_min_1]` | `INPUT[text:inpra_sun_ex_2]` | `INPUT[number:inpra_sun_min_2]` | `INPUT[text:inpra_sun_ex_3]` | `INPUT[number:inpra_sun_min_3]` |

> [!note]- Inpra Flow
> - Plan pieces and minutes here.
> - Generate the daily Inpra log from the button.
> - Rate posture, rhythm, melody, and feeling in the log after playing.
> - Average rating 4 or higher means the piece is ready to advance manually.
