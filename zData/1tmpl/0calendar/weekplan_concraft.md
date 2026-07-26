<%-*
// 🔱 1. ROUTER DATA INTERCEPTION
if (!tp.variables) tp.variables = {};
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const dateStr = targetMoment.format("YYYY-MM-DD");
const year = tp.variables.planYear || targetMoment.format("YYYY");
const kw = tp.variables.planKw || targetMoment.format("WW");
const energy = tp.variables.energy || "3";
const displayTitle = tp.variables.displayTitle || `${year}-W${kw}_concraft`;
-%>
---
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/concraft"
fileTitle: "<%- displayTitle %>"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
frozen: false
plan_type: concraft
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
concraft_channel: ""
concraft_active: ""
---
# <%- displayTitle %>

> [!quote] "You can't use up creativity. The more you use, the more you have." — *Maya Angelou*

> [!multi-column]
>
> > [!info] ✍️ **Channel Setup**
> > **Channel / Platform:** `INPUT[text:concraft_channel]`
> > **Active Series / Project:** `INPUT[text:concraft_active]`
>
> > [!abstract] 📊 **Weekly Output**
> > **Planned Effort:** `$= const c = dv.current(); const d = ["mon","tue","wed","thu","fri","sat","sun"]; d.reduce((sum, x) => sum + (Number(c["concraft_" + x + "_len"]) || 0), 0)` min

---

## ✍️ Publishing Pipeline (What goes up, when)
`BUTTON[plan-replicator]`

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
> - Link a Content note (`[[…]]`) so the draft/script lives in a real file.
> - The daily PPM log surfaces today's piece and logs actual effort & resonance (1–5) after publishing.
> - Resonance tracks how well it landed — feed it into the next piece.
