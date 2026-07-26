<%-*
// 🔱 1. ROUTER DATA INTERCEPTION
if (!tp.variables) tp.variables = {};
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const dateStr = targetMoment.format("YYYY-MM-DD");
const year = tp.variables.planYear || targetMoment.format("YYYY");
const kw = tp.variables.planKw || targetMoment.format("WW");
const energy = tp.variables.energy || "3";
const displayTitle = tp.variables.displayTitle || `${year}-W${kw}_teach`;
-%>
---
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/teach"
fileTitle: "<%- displayTitle %>"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
frozen: false
plan_type: teach
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
teach_subject: ""
teach_source: ""
---
# <%- displayTitle %>

> [!quote] "While we teach, we learn." — *Seneca*

> [!multi-column]
>
> > [!info] 📖 **Subject Setup**
> > **Subject:** `INPUT[text:teach_subject]`
> > **Source / Curriculum:** `INPUT[text:teach_source]`
>
> > [!abstract] 📊 **Weekly Load**
> > **Planned Time:** `$= const c = dv.current(); const d = ["mon","tue","wed","thu","fri","sat","sun"]; d.reduce((sum, x) => sum + [1,2].reduce((s, i) => s + (Number(c["teach_" + x + "_len_" + i]) || 0), 0), 0)` min

---

## 📖 Curriculum (Live Planner)
`BUTTON[plan-replicator]`

| Day | Lesson 1 | Min | Diff | Lesson 2 | Min | Diff |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **Monday** | `INPUT[text:teach_mon_topic_1]` | `INPUT[number:teach_mon_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_mon_diff_1]` | `INPUT[text:teach_mon_topic_2]` | `INPUT[number:teach_mon_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_mon_diff_2]` |
| **Tuesday** | `INPUT[text:teach_tue_topic_1]` | `INPUT[number:teach_tue_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_tue_diff_1]` | `INPUT[text:teach_tue_topic_2]` | `INPUT[number:teach_tue_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_tue_diff_2]` |
| **Wednesday** | `INPUT[text:teach_wed_topic_1]` | `INPUT[number:teach_wed_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_wed_diff_1]` | `INPUT[text:teach_wed_topic_2]` | `INPUT[number:teach_wed_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_wed_diff_2]` |
| **Thursday** | `INPUT[text:teach_thu_topic_1]` | `INPUT[number:teach_thu_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_thu_diff_1]` | `INPUT[text:teach_thu_topic_2]` | `INPUT[number:teach_thu_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_thu_diff_2]` |
| **Friday** | `INPUT[text:teach_fri_topic_1]` | `INPUT[number:teach_fri_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_fri_diff_1]` | `INPUT[text:teach_fri_topic_2]` | `INPUT[number:teach_fri_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_fri_diff_2]` |
| **Saturday** | `INPUT[text:teach_sat_topic_1]` | `INPUT[number:teach_sat_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_sat_diff_1]` | `INPUT[text:teach_sat_topic_2]` | `INPUT[number:teach_sat_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_sat_diff_2]` |
| **Sunday** | `INPUT[text:teach_sun_topic_1]` | `INPUT[number:teach_sun_len_1]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_sun_diff_1]` | `INPUT[text:teach_sun_topic_2]` | `INPUT[number:teach_sun_len_2]` | `INPUT[inlineSelect(option(1),option(2),option(3),option(4),option(5)):teach_sun_diff_2]` |

> [!note]- Teaching Flow
> - Link a Lesson note (`[[…]]`) so the material lives in a real file.
> - The daily PPM log surfaces today's lesson and logs actual time & comprehension (1–5).
> - Comprehension 4+ means the topic is understood — advance manually.
