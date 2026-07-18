<%-*
// 🔱 1. ROUTER DATA INTERCEPTION
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const energy = tp.variables.energy || "3";
const displayTitle = tp.variables.displayTitle || tp.file.title;
-%>
---
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/music"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
instr_active: ""
instr_book: ""
---
# <%- displayTitle %>

> [!quote] "I’m still learning." — *Michelangelo (at age 87)*

> [!multi-column]
>
> > [!info] 🎸 **Instrument Setup**
> > **Instrument:** `INPUT[suggestList("Piano", "Guitar", "Violin", "Flute", "Vocals", Other):instr_active]`
> > **Practice Book / Course:** `INPUT[text:instr_book]`
>
> > [!abstract] 📊 **Weekly Resonance**
> > **Total Time:** `$= const c = dv.current(); (Number(c.mus_mon_min)||0) + (Number(c.mus_tue_min)||0) + (Number(c.mus_wed_min)||0) + (Number(c.mus_thu_min)||0) + (Number(c.mus_fri_min)||0) + (Number(c.mus_sat_min)||0) + (Number(c.mus_sun_min)||0)` minutes
> > **Avg. Mastery:** `$= const c = dv.current(); const vals = [c.mus_mon_lvl, c.mus_tue_lvl, c.mus_wed_lvl, c.mus_thu_lvl, c.mus_fri_lvl, c.mus_sat_lvl, c.mus_sun_lvl].map(Number).filter(n => n > 0); vals.length > 0 ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) + " / 5" : "—"`

---

## 🎼 Practice Log (Live Tracker)
`BUTTON[generate-inpra-log]` 

| Day | Exercise / Page / Piece | Duration (Min) | Mastery (1-5) |
| :--- | :--- | :--- | :--- |
| **Monday** | `INPUT[text:mus_mon_ex]` | `INPUT[number:mus_mon_min]` | `INPUT[slider:mus_mon_lvl]` |
| **Tuesday** | `INPUT[text:mus_tue_ex]` | `INPUT[number:mus_tue_min]` | `INPUT[slider:mus_tue_lvl]` |
| **Wednesday** | `INPUT[text:mus_wed_ex]` | `INPUT[number:mus_wed_min]` | `INPUT[slider:mus_wed_lvl]` |
| **Thursday** | `INPUT[text:mus_thu_ex]` | `INPUT[number:mus_thu_min]` | `INPUT[slider:mus_thu_lvl]` |
| **Friday** | `INPUT[text:mus_fri_ex]` | `INPUT[number:mus_fri_min]` | `INPUT[slider:mus_fri_lvl]` |
| **Saturday** | `INPUT[text:mus_sat_ex]` | `INPUT[number:mus_sat_min]` | `INPUT[slider:mus_sat_lvl]` |
| **Sunday** | `INPUT[text:mus_sun_ex]` | `INPUT[number:mus_sun_min]` | `INPUT[slider:mus_sun_lvl]` |

> [!note]- 🧠 Mastery Scale
> - **1 - Beginner:** Lots of pausing, hands/fingers still searching, unsteady rhythm.
> - **2 - Familiar:** Working slowly, but requires 100% cognitive effort.
> - **3 - Solid:** Plays smoothly at a moderate tempo. Few mistakes.
> - **4 - Flow:** The piece almost plays itself. Dynamics are naturally added.
> - **5 - Mastery:** Perfect. You no longer think about notes, but about expression and feeling.



---
`BUTTON[freeze-week]` `BUTTON[archive]`