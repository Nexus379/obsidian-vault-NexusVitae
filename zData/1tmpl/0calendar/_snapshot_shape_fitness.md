---
banner_icon: 💪
fileTitle: "{{YEAR}}-W{{KW}}_fitness"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/fitness"
frozen: false
plan_year: "{{YEAR}}"
plan_kw: "{{KW}}"
training_week: 1
---
# 💪 Fitness: {{YEAR}}-W{{KW}}

> [!abstract] 🎒 **NEXUS ARSENAL & STATUS**
> **Phase:** `$= const w = dv.current().training_week || 1; const cw = ((w - 1) % 4) + 1; cw === 1 ? "🌱 Foundation (70%)" : cw === 2 ? "⚙️ Volume (80%)" : cw === 3 ? "🔥 Overreach (90%)" : "🔋 Deload (60%)"`
> **Current Cycle Week:** `INPUT[number:training_week]`

> ---
> **Actions:** `BUTTON[setup-fitness]` `BUTTON[generate-workout]` `BUTTON[generate-workout-log]` `BUTTON[edit-fitness]` `BUTTON[reset-schedule]` `BUTTON[plan-replicator]`

## 📋 1. The Master Plan (Overview)
```dataviewjs
const c = dv.current();
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
let engine = null;
try { delete require.cache[require.resolve(enginePath)]; engine = require(enginePath)(); } catch(e) {}

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
    {l: "🤸 Warmup", v: "mobility"}, {l: "💪 Upper", v: "upper"}, 
    {l: "🦵 Lower", v: "lower"}, {l: "🪨 Core", v: "core"}, {l: "🔥 Cardio", v: "cardio"}
];

const headers = ["🎯 Region", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const rows = regions.map(r => [
    `**${r.l}**`,
    getD(c[`fit_mon_${r.v}`]), getD(c[`fit_tue_${r.v}`]), getD(c[`fit_wed_${r.v}`]),
    getD(c[`fit_thu_${r.v}`]), getD(c[`fit_fri_${r.v}`]), getD(c[`fit_sat_${r.v}`]), getD(c[`fit_sun_${r.v}`])
]);
dv.table(headers, rows);
``` 


```dataviewjs
const c = dv.current();
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/fitnessEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

const days = [
    {id: "mon", label: "Montag"}, {id: "tue", label: "Dienstag"}, {id: "wed", label: "Mittwoch"},
    {id: "thu", label: "Donnerstag"}, {id: "fri", label: "Freitag"}, {id: "sat", label: "Samstag"}, {id: "sun", label: "Sonntag"}
];
const regions = [{id: "mobility", l: "Warmup"}, {id: "upper", l: "Upper Body"}, {id: "lower", l: "Lower Body"}, {id: "core", l: "Core"}, {id: "cardio", l: "Cardio"}];

let trackerHtml = "";

days.forEach(day => {
    let dayHasTraining = false;
    let dayHtml = `> [!example]- 📅 **${day.label}**\n`;
    
    regions.forEach(reg => {
        let planned = c[`fit_${day.id}_${reg.id}`];
        if (planned && planned !== "free") {
            dayHasTraining = true;
            let arr = Array.isArray(planned) ? planned : [planned];
            
            dayHtml += `> **${reg.l}:**\n`;
            arr.forEach(k => {
                let parts = String(k).split("|");
                let baseKey = parts[0];
                let target = parts[1] || "Max reps";
                
                let iconName = baseKey;
                if (baseKey === "custom") iconName = "🔸 " + parts.slice(1).join(" ");
                else if (engine && engine.all[baseKey]) iconName = `${engine.all[baseKey].icon} ${engine.all[baseKey].label}`;
                
                dayHtml += `> - ${iconName} _(Target: ${target})_\n`;
            });
            dayHtml += `> \n`;
        }
    });
    
    if (dayHasTraining) {
        dayHtml += `> ➤ \`BUTTON[generate-workout-log]\`\n`;
        trackerHtml += dayHtml + "\n";
    }
});

if (trackerHtml === "") dv.paragraph("_No training planned for this week yet. Use the setup button above!_");
else dv.paragraph(trackerHtml);
```
