---
banner: "![[xAttachment/Images/Banner/kachelschwarz-lichtblau.jpg]]"
banner_y: 0.35
banner_icon: 🧠
inbox: true
persona: ""
arch:
  - "#2area"
archtype:
  - "#2area/3mind"
status: 1active
priority:
  - "4"
science:
  - ""
discipline:
  - ""
tt_start: 08:15
tt_duration: 45
tt_periods: 16
tt_breaks: 2:15, 4:15, 6:30
---

# 🗓️ Nexus Timetable

`BUTTON[setup-timetable]` `BUTTON[edit-timetable]`

```dataviewjs
// 1. DATEN AUS DEM YAML LESEN
const c = dv.current();
const startTime = c.tt_start || "08:00";     
const classDuration = Number(c.tt_duration) || 45;      
const totalPeriods = Number(c.tt_periods) || 8;        
const breaksStr = String(c.tt_breaks || "");

const customBreaks = {};
if (breaksStr) {
    breaksStr.split(",").forEach(b => {
        let parts = b.split(":");
        if(parts.length === 2) {
            let pIdx = parseInt(parts[0].trim());
            let pDur = parseInt(parts[1].trim());
            if(!isNaN(pIdx) && !isNaN(pDur)) customBreaks[pIdx] = pDur;
        }
    });
}

// 2. ENGINE LADEN
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/disciplineEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

const getD = (key) => {
    if (Array.isArray(key)) return key.map(k => getD(k)).join("<br>");
    if (!key || key === "free") return "—";
    if (key === "break") return "☕ **BREAK**";
    
    let parts = String(key).split("|");
    let baseKey = parts[0];
    let detail = parts.length > 1 ? ` _(${parts.slice(1).join(" ")})_` : "";

    if (baseKey === "custom") return `🔸 ${parts.slice(1).join(" ")}`;
    
    if (engine && engine.all && engine.all[baseKey]) {
        return `${engine.all[baseKey].icon} ${engine.all[baseKey].label}${detail}`;
    }
    return `❓ ${key}`;
};

// 3. ZEITEN AUTOMATISCH BERECHNEN
let current = moment(startTime, "HH:mm");
let slots = [];

for (let i = 1; i <= totalPeriods; i++) {
    let end = moment(current).add(classDuration, 'minutes');
    slots.push({ id: String(i), time: `${current.format("HH:mm")} - ${end.format("HH:mm")}`, isBreak: false });
    current = end;

    if (customBreaks[i] && i !== totalPeriods) {
        let currentBreakDuration = customBreaks[i];
        let breakEnd = moment(current).add(currentBreakDuration, 'minutes');
        slots.push({ id: `break${i}`, time: `${current.format("HH:mm")} - ${breakEnd.format("HH:mm")}`, isBreak: true });
        current = breakEnd;
    }
}

// 4. TABELLE ZEICHNEN
const headers = ["⌚ Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const rows = slots.map(s => {
    if(s.isBreak) {
        return [`**${s.time}**`, getD("break"), getD("break"), getD("break"), getD("break"), getD("break")];
    }
    return [
        `**${s.time}**`,
        getD(c[`tt_mon_${s.id}`]),
        getD(c[`tt_tue_${s.id}`]),
        getD(c[`tt_wed_${s.id}`]),
        getD(c[`tt_thu_${s.id}`]),
        getD(c[`tt_fri_${s.id}`])
    ];
});

dv.table(headers, rows);
```

`BUTTON[reset-schedule]`