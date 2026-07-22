<%-*
// 🔱 1. ROUTER-DATEN ABFANGEN
if (!tp.variables) tp.variables = {};
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const dateStr = targetMoment.format("YYYY-MM-DD");
const year = tp.variables.planYear || targetMoment.format("YYYY");
const kw = tp.variables.planKw || targetMoment.format("WW");
const energy = tp.variables.energy || "3";
const displayTitle = tp.variables.displayTitle || `${year}-W${kw}_fitness`;

// 🔱 2. AUTOMATISCHE TRAININGS-WOCHE ERKENNUNG
let currentWeek = 1;

// Suche alle vorherigen Fitness-Pläne
const allFit = app.vault.getMarkdownFiles().filter(f => f.name.includes("_fitness") && f.name !== tp.file.title);

if (allFit.length > 0) {
    // Sortiere nach Name absteigend (damit die neueste Woche ganz oben steht)
    allFit.sort((a, b) => b.name.localeCompare(a.name));
    const lastFile = allFit[0];
    
    // Lies die Daten der letzten Woche aus
    const cache = app.metadataCache.getFileCache(lastFile);
    if (cache && cache.frontmatter && cache.frontmatter.training_week) {
        currentWeek = Number(cache.frontmatter.training_week) + 1;
    }
}
-%>
---
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/fitness"
fileTitle: "<%- displayTitle %>"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
frozen: false
plan_type: fitness
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
training_week: <%- currentWeek %>

---

# 💪 Fitness: <%- displayTitle %>

> [!body] 🎒 **NEXUS ARSENAL & STATUS**
> **Phase:** `$= const w = dv.current().training_week || 1; const cw = ((w - 1) % 4) + 1; cw === 1 ? "🌱 Foundation (70%)" : cw === 2 ? "⚙️ Volume (80%)" : cw === 3 ? "🔥 Overreach (90%)" : "🔋 Deload (60%)"`
> **Current Cycle Week:** `INPUT[number:training_week]`

> **Actions:** `BUTTON[setup-fitness]` `BUTTON[generate-workout]`  `BUTTON[edit-fitness]` 

## 📋 1. The Master Plan (Overview)
`BUTTON[generate-workout-log]`
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

`BUTTON[reset-schedule]` `BUTTON[plan-replicator]` 
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

if (trackerHtml === "") dv.paragraph("_No training planned this week yet — use Setup above, or the day's region isn't assigned an exercise._");
else dv.paragraph(trackerHtml);
```



---

`BUTTON[freeze-week]` `BUTTON[archive]` `BUTTON[archive-month]`
