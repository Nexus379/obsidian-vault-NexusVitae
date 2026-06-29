---
banner: "![[xAttachment/Images/Banner/street gif.gif]]"
banner_y: 0.5
banner_icon: 🚵🏽
inbox: true
persona: ""
arch:
  - "#2area"
archtype:
  - "#2area/6activity"
status: 1active
priority:
  - "4"
science:
  - ""
discipline:
  - ""
balance_focus: "null"
cal0:
stars1:
area2: 6_Activity
project3:
task4:
note5:
  - "[[0_Inbox/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:
parent: ""
sibling: []
child: []
summary:
review:
training_week: 1
---

# 💪 Nexus Fitness Routine

`BUTTON[setup-fitness]`  `BUTTON[generate-workout]` `BUTTON[edit-fitness]` `BUTTON[reset-schedule]`

```dataviewjs
// 🎒 NEXUS ARSENAL CALLOUT
const profile = dv.page("zData/4values/Fitness_Profile.md");

if (profile) {
    const phase = profile.training_phase || "Unknown";
    const focus = profile.focus_metric || "Flow";
    const weight = profile.weight;
    const height = profile.height;
    
    let bmiStr = "";
    if (weight && height) {
        let bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
        bmiStr = ` | **BMI:** ${bmi}`;
    }
    
    const getList = (key) => Array.isArray(profile[key]) ? profile[key] : (profile[key] ? [profile[key]] : []);
    
    const wearables = getList("equipment_wearable").map(w => `> - 🥋 ${w}`).join("\n");
    const weights = getList("equipment_weights").map(w => `> - 🪨 ${w}`).join("\n");
    
    let callout = `> [!abstract] 🎒 **NEXUS ARSENAL & STATUS**\n`;
    callout += `> **Phase:** ${phase} | **Focus:** ${focus}${bmiStr}\n>\n`;
    if (wearables) callout += `> **Wearables (On Body):**\n${wearables}\n>\n`;
    if (weights) callout += `> **External Weights:**\n${weights}`;
    
    if (!wearables && !weights) callout += `> *Bodyweight Only Training*`;
    
    dv.paragraph(callout);
}
```

> [!info] 📈 **Progressive Overload Tracker**
> **Current Cycle Week:** `INPUT[number:training_week]`
> ```dataviewjs
> const w = dv.current().training_week || 1;
> const cycleWeek = ((w - 1) % 4) + 1; // 4-Week Cycles
> 
> let status = "";
> let intensity = "";
> let setsReps = "";
> 
> if (cycleWeek === 1) { status = "🌱 Foundation Phase"; intensity = "70% (RIR: 3)"; setsReps = "3 sets x 8-10 reps"; }
> else if (cycleWeek === 2) { status = "⚙️ Volume Phase"; intensity = "80% (RIR: 2)"; setsReps = "4 sets x 8-10 reps"; }
> else if (cycleWeek === 3) { status = "🔥 Overreach Phase"; intensity = "90% (RIR: 1)"; setsReps = "4 sets x 10-12 reps"; }
> else if (cycleWeek === 4) { status = "🔋 Deload Phase"; intensity = "60% (RIR: 4)"; setsReps = "2 sets x 10 reps (Recovery)"; }
> 
> dv.paragraph(`**Phase:** ${status} &nbsp;&nbsp;|&nbsp;&nbsp; **Intensity:** ${intensity} &nbsp;&nbsp;|&nbsp;&nbsp; **Target:** ${setsReps}`);
> ```


```dataviewjs
const c = dv.current();
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
let engine = null;
try { delete require.cache[require.resolve(enginePath)]; } catch(e) {}
try { engine = require(enginePath)(); } catch(e) {}

const getD = (key) => {
    if (!key || key === "free" || key.length === 0) return "—";
    
    let arr = Array.isArray(key) ? key : [key];
    
    return arr.map(k => {
        let parts = String(k).split("|");
        let baseKey = parts[0];
        
        if (baseKey === "custom") return `❓ ${parts.slice(1).join(" ")}`;
        
        if (engine && engine.all && engine.all[baseKey]) {
            let nameStr = `${engine.all[baseKey].icon} ${engine.all[baseKey].label}`;
            let details = parts.slice(1).join(" | ");
            return details ? `${nameStr} _(${details})_` : nameStr;
        }
        return `❓ ${k}`; 
    }).join("<br>");
};

const regions = [
    {l: "🤸 Warmup", v: "mobility"},
    {l: "💪 Upper Body", v: "upper"},
    {l: "🦵 Lower Body", v: "lower"},
    {l: "🪨 Core", v: "core"},
    {l: "🔥 Cardio", v: "cardio"}
];

const headers = ["🎯 Region", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const rows = regions.map(r => [
    `**${r.l}**`,
    getD(c[`fit_mon_${r.v}`]), getD(c[`fit_tue_${r.v}`]), getD(c[`fit_wed_${r.v}`]),
    getD(c[`fit_thu_${r.v}`]), getD(c[`fit_fri_${r.v}`]), getD(c[`fit_sat_${r.v}`]), getD(c[`fit_sun_${r.v}`])
]);

dv.table(headers, rows);
```



### The 3 Pillars of Training

**1. Maximal Strength**

- **Schema:** 3 to 5 sets of 3 to 6 reps (e.g., 5x5).
    
- **Focus:** The central nervous system (CNS) learns to fire as many muscle fibers simultaneously as possible. Rest periods are long (2-3 min). Focus on heavy weights or advanced bodyweight moves (e.g., Pistol Squats).
    

**2. Muscle Growth (Hypertrophy)**

- **Schema:** 3 to 4 sets of 8 to 12 reps (e.g., 3x10 or 4x8).
    
- **Focus:** The muscle gets fatigued, creating micro-tears that rebuild thicker and stronger during the recovery phase (fueled by your protein intake). Moderate rest periods (60-90 sec).
    

**3. Muscular Endurance (Endurance & Definition)**

- **Schema:** 2 to 3 sets of 15 to 20 reps (e.g., 3x15).
    
- **Focus:** Enhances oxygen supply to the muscle (capillarization) and improves lactate tolerance. Short rest periods (30-45 sec). High calorie burn.