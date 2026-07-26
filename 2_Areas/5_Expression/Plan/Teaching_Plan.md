---
banner: "![[xAttachment/Images/Banner/study, blau.jpg]]"
banner_y: 0.5
banner_icon: 📖
arch:
  - "#2area"
archtype:
  - "#2area/5expression"
status: 1active
area2: 5_Expression
teach_subject: ""
teach_source: ""
cssclasses:
  - wide-page
---

# 📖 Master Teaching Plan (TEACH)

> [!quote] "While we teach, we learn." — *Seneca*

> [!multi-column]
>
> > [!info] 📖 **Subject Setup**
> > **Subject:** `INPUT[text:teach_subject]`
> > **Source / Curriculum:** `INPUT[text:teach_source]`
>
> > [!abstract] 📊 **Weekly Load**
> > **Planned Time:** `$= const c = dv.current(); const d = ["mon","tue","wed","thu","fri","sat","sun"]; d.reduce((sum, x) => sum + [1,2].reduce((s, i) => s + (Number(c["teach_" + x + "_len_" + i]) || 0), 0), 0)` min
> > **Grasp:** `$= "Comprehension is rated inside the daily PPM logs."`

---

## 📖 Curriculum (Live Planner)
`BUTTON[snapshot-week-teach]`

Link a **Lesson note** `[[…]]` (it holds the real material) or type the topic, then set planned minutes and difficulty.

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
> - Plan lessons here — link a Lesson note (`[[…]]`) so the material lives in a real file, not just metadata.
> - Snapshot the week; the daily PPM log surfaces today's lesson and lets you log **actual time** and **comprehension** (1–5).
> - Average comprehension 4 or higher means the topic is understood — advance manually.
