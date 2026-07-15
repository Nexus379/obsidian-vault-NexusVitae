---
am_start: "06:00"
am_duration: 15
am_periods: 6
am_step_1: mindfulness|Morning Meditation & Breathing
am_step_2: hygiene_basic|Teeth & Face
am_step_3: workout_stretch|Stretching (Yoga)
am_step_4: meal_prep|Coffee & Water Prep
am_step_5: journal_log|Daily Planning (Goals)
am_step_6: input_read|Read 10 Pages
am_step_7: free
am_step_8: free
---
# 🌅 Morning Routine
`BUTTON[routine-selector]`

> [!abstract] ⚙️ **Routine Settings**
> **Start Time:** `INPUT[text:am_start]` (Format: HH:mm)
> **Duration per block:** `INPUT[number:am_duration]` Min. | **Number of blocks:** `INPUT[number:am_periods]`

> [!note] 📝 **Adjust steps** 
> *Format: `routine_key|Optional Text` (e.g., `hygiene_basic|Shower`)*
> 1. `INPUT[text:am_step_1]`
> 2. `INPUT[text:am_step_2]`
> 3. `INPUT[text:am_step_3]`
> 4. `INPUT[text:am_step_4]`
> 5. `INPUT[text:am_step_5]`
> 6. `INPUT[text:am_step_6]`
> 7. `INPUT[text:am_step_7]`
> 8. `INPUT[text:am_step_8]`

---

```dataviewjs
const c = dv.current();

const startTime = c.am_start || "06:00";
const stepDuration = Number(c.am_duration) || 15;
const totalPeriods = Number(c.am_periods) || 6;

const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

// --- SMART GET-D FUNCTION ---
const getD = (key) => {
    if (!key || key === "free") return "—";
    
    let parts = String(key).split("|");
    let baseKey = parts[0].trim();
    let detail = parts.length > 1 ? parts.slice(1).join(" ").trim() : "";
    
    if (baseKey === "custom") return `🔸 **${detail}**`;
    
    if (engine && engine.all && engine.all[baseKey]) {
        const r = engine.all[baseKey];
        const bgColor = r.color || "transparent"; 
        
        let html = `<div style="padding: 4px; border-radius: 6px; background-color: ${bgColor}; box-shadow: 0 0 6px ${bgColor}; text-align: left; margin-bottom: 2px;">`;
        html += `${r.icon} <span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">${r.label}</span>`;
        if (detail) {
            html += ` &nbsp;<span style="font-size: 0.85em; font-weight: bold; opacity: 0.8;">› ${detail}</span>`;
        }
        html += `</div>`;
        return html;
    }
    return `❓ ${key}`;
};

// --- CALCULATION & TABLE ---
let current = moment(startTime, ["HH:mm"]);
const rows = [];

for (let i = 1; i <= totalPeriods; i++) {
    let end = moment(current).add(stepDuration, 'minutes');
    let timeBlock = `**${current.format("HH:mm")}** - ${end.format("HH:mm")}`;
    
    // Look for am_step_i
    let routineData = c[`am_step_${i}`]; 
    
    rows.push([timeBlock, getD(routineData)]);
    current = end;
}

dv.table(["⌚ Time", "Routine"], rows);
```
