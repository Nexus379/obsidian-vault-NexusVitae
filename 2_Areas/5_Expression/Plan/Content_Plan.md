---
banner: "![[xAttachment/Images/Banner/office-supplies.jpg]]"
banner_y: 0.5
banner_icon: ✍️
arch:
  - "#2area"
archtype:
  - "#2area/5expression"
status: 1active
area2: 5_Expression
concraft_channel: ""
concraft_active: ""
cssclasses:
  - wide-page
---

# ✍️ Master Content Creator Plan (CONCRAFT)

> [!quote] "You can't use up creativity. The more you use, the more you have." — *Maya Angelou*

> [!multi-column]
>
> > [!info] ✍️ **Channel Setup**
> > **Channel / Platform:** `INPUT[text:concraft_channel]`
> > **Active Series / Project:** `INPUT[text:concraft_active]`
>
> > [!abstract] 📊 **Weekly Output**
> > **Planned Effort:** `$= const c = dv.current(); const d = ["mon","tue","wed","thu","fri","sat","sun"]; d.reduce((sum, x) => sum + (Number(c["concraft_" + x + "_len"]) || 0), 0)` min
> > **Resonance:** `$= "Resonance is rated inside the daily PPM logs after publishing."`

---

## ✍️ Publishing Pipeline (What goes up, when)
`BUTTON[snapshot-week-concraft]`

Link a **Content note** `[[…]]` (draft / script / idea) — it holds the actual piece; the plan schedules **when it goes live**.

| Day | Piece | Format | Effort (min) | Publish @ |
| :--- | :--- | :--- | :---: | :--- |
| **Monday** | `INPUT[text:concraft_mon_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_mon_format]` | `INPUT[number:concraft_mon_len]` | `INPUT[text:concraft_mon_publish]` |
| **Tuesday** | `INPUT[text:concraft_tue_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_tue_format]` | `INPUT[number:concraft_tue_len]` | `INPUT[text:concraft_tue_publish]` |
| **Wednesday** | `INPUT[text:concraft_wed_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_wed_format]` | `INPUT[number:concraft_wed_len]` | `INPUT[text:concraft_wed_publish]` |
| **Thursday** | `INPUT[text:concraft_thu_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_thu_format]` | `INPUT[number:concraft_thu_len]` | `INPUT[text:concraft_thu_publish]` |
| **Friday** | `INPUT[text:concraft_fri_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_fri_format]` | `INPUT[number:concraft_fri_len]` | `INPUT[text:concraft_fri_publish]` |
| **Saturday** | `INPUT[text:concraft_sat_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_sat_format]` | `INPUT[number:concraft_sat_len]` | `INPUT[text:concraft_sat_publish]` |
| **Sunday** | `INPUT[text:concraft_sun_piece]` | `INPUT[inlineSelect(option(Video),option(Short),option(Blog),option(Post),option(Podcast),option(Newsletter)):concraft_sun_format]` | `INPUT[number:concraft_sun_len]` | `INPUT[text:concraft_sun_publish]` |

> [!note]- Content Flow
> - Link a Content note (`[[…]]`) so the draft/script lives in a real file; set format, effort and the publish slot.
> - Snapshot the week; the daily PPM log surfaces today's piece and lets you log **actual effort** and **resonance** (1–5) after publishing.
> - Resonance tracks how well it landed — feed it back into what you make next.
