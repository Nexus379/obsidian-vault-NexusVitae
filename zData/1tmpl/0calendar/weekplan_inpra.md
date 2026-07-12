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
  - "#0cal/7plan/inpra"
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
> > **Avg. Mastery:** `$= const c = dv.current(); const vals = [c.inpra_mon_lvl_1, c.inpra_mon_lvl_2, c.inpra_mon_lvl_3, c.inpra_tue_lvl_1, c.inpra_tue_lvl_2, c.inpra_tue_lvl_3, c.inpra_wed_lvl_1, c.inpra_wed_lvl_2, c.inpra_wed_lvl_3, c.inpra_thu_lvl_1, c.inpra_thu_lvl_2, c.inpra_thu_lvl_3, c.inpra_fri_lvl_1, c.inpra_fri_lvl_2, c.inpra_fri_lvl_3, c.inpra_sat_lvl_1, c.inpra_sat_lvl_2, c.inpra_sat_lvl_3, c.inpra_sun_lvl_1, c.inpra_sun_lvl_2, c.inpra_sun_lvl_3].map(Number).filter(n => n > 0); vals.length > 0 ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) + " / 5" : "—"`

---

## 🎼 Practice Log (Live Tracker)

| Day | Exercise / Page / Piece | Mastery (1-5) |
| :--- | :--- | :--- |
| **Mon (1)** | `INPUT[text:inpra_mon_ex_1]` | `INPUT[slider:inpra_mon_lvl_1]` |
| **Mon (2)** | `INPUT[text:inpra_mon_ex_2]` | `INPUT[slider:inpra_mon_lvl_2]` |
| **Mon (3)** | `INPUT[text:inpra_mon_ex_3]` | `INPUT[slider:inpra_mon_lvl_3]` |
| **Tue (1)** | `INPUT[text:inpra_tue_ex_1]` | `INPUT[slider:inpra_tue_lvl_1]` |
| **Tue (2)** | `INPUT[text:inpra_tue_ex_2]` | `INPUT[slider:inpra_tue_lvl_2]` |
| **Tue (3)** | `INPUT[text:inpra_tue_ex_3]` | `INPUT[slider:inpra_tue_lvl_3]` |
| **Wed (1)** | `INPUT[text:inpra_wed_ex_1]` | `INPUT[slider:inpra_wed_lvl_1]` |
| **Wed (2)** | `INPUT[text:inpra_wed_ex_2]` | `INPUT[slider:inpra_wed_lvl_2]` |
| **Wed (3)** | `INPUT[text:inpra_wed_ex_3]` | `INPUT[slider:inpra_wed_lvl_3]` |
| **Thu (1)** | `INPUT[text:inpra_thu_ex_1]` | `INPUT[slider:inpra_thu_lvl_1]` |
| **Thu (2)** | `INPUT[text:inpra_thu_ex_2]` | `INPUT[slider:inpra_thu_lvl_2]` |
| **Thu (3)** | `INPUT[text:inpra_thu_ex_3]` | `INPUT[slider:inpra_thu_lvl_3]` |
| **Fri (1)** | `INPUT[text:inpra_fri_ex_1]` | `INPUT[slider:inpra_fri_lvl_1]` |
| **Fri (2)** | `INPUT[text:inpra_fri_ex_2]` | `INPUT[slider:inpra_fri_lvl_2]` |
| **Fri (3)** | `INPUT[text:inpra_fri_ex_3]` | `INPUT[slider:inpra_fri_lvl_3]` |
| **Sat (1)** | `INPUT[text:inpra_sat_ex_1]` | `INPUT[slider:inpra_sat_lvl_1]` |
| **Sat (2)** | `INPUT[text:inpra_sat_ex_2]` | `INPUT[slider:inpra_sat_lvl_2]` |
| **Sat (3)** | `INPUT[text:inpra_sat_ex_3]` | `INPUT[slider:inpra_sat_lvl_3]` |
| **Sun (1)** | `INPUT[text:inpra_sun_ex_1]` | `INPUT[slider:inpra_sun_lvl_1]` |
| **Sun (2)** | `INPUT[text:inpra_sun_ex_2]` | `INPUT[slider:inpra_sun_lvl_2]` |
| **Sun (3)** | `INPUT[text:inpra_sun_ex_3]` | `INPUT[slider:inpra_sun_lvl_3]` |

> [!note]- 🧠 Mastery Scale
> - **1 - Beginner:** Lots of pausing, hands/fingers still searching, unsteady rhythm.
> - **2 - Familiar:** Working slowly, but requires 100% cognitive effort.
> - **3 - Solid:** Plays smoothly at a moderate tempo. Few mistakes.
> - **4 - Flow:** The piece almost plays itself. Dynamics are naturally added.
> - **5 - Mastery:** Perfect. You no longer think about notes, but about expression and feeling.