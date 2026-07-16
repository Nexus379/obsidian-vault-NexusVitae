---
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_y: 0.5
banner_icon: 🧩
fileTitle: "{{YEAR}}-W{{KW}}_routine"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/routine"
frozen: false
plan_year: "{{YEAR}}"
plan_kw: "{{KW}}"
---

# 🧩 Nexus Timeblocking (Routines): {{YEAR}}-W{{KW}}

`BUTTON[setup-routine]` `BUTTON[edit-routine]` `BUTTON[sync-timetable]`

```dataviewjs
const c = dv.current();

const startTime = c.rt_start || "07:00";
const classDuration = Number(c.rt_duration) || 60;
const totalPeriods = Number(c.rt_periods) || 14;
const breaksStr = String(c.rt_breaks || "");

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

const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

const getD = (key) => {
    if (Array.isArray(key)) return key.map(k => getD(k)).join("<br><br>");
    if (!key || key === "free") return "—";
    if (key === "break") return "☕ **BUFFER**";

    let parts = String(key).split("|");
    let baseKey = parts[0];
    let detail = parts.length > 1 ? parts.slice(1).join(" ") : "";

    if (baseKey === "custom") return `🔸 **${detail}**`;

    if (baseKey === "am_routine") {
        return `<div style="padding: 6px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.15); box-shadow: 0 0 8px rgba(128, 128, 128, 0.15); text-align: center;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">[[2_Areas/1_Selfcare/Plan/AM_Routine|🌅 AM Protocol]]</span></div>`;
    }
    if (baseKey === "pm_routine") {
        return `<div style="padding: 6px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.15); box-shadow: 0 0 8px rgba(128, 128, 128, 0.15); text-align: center;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">[[2_Areas/1_Selfcare/Plan/PM_Routine|🌙 PM Protocol]]</span></div>`;
    }

    if (engine && engine.all && engine.all[baseKey]) {
        const r = engine.all[baseKey];
        const bgColor = r.color || "transparent";
        let html = `<div style="padding: 6px; border-radius: 8px; background-color: ${bgColor}; box-shadow: 0 0 8px ${bgColor}; text-align: center;">`;
        html += `${r.icon} <span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">${r.label}</span>`;
        if (detail) {
            html += `<br><span style="font-size: 0.9em; font-weight: bold;">${detail}</span>`;
        }
        html += `</div>`;
        return html;
    }
    return `❓ ${key}`;
};

let current = moment(startTime, ["HH:mm", "h:mm A", "h:mma"]);
let slots = [];
for (let i = 1; i <= totalPeriods; i++) {
    let end = moment(current).add(classDuration, 'minutes');
    slots.push({ id: String(i), time: `${current.format("HH:mm")}`, isBreak: false });
    current = end;
    if (customBreaks[i] && i !== totalPeriods) {
        let bDur = customBreaks[i];
        let breakEnd = moment(current).add(bDur, 'minutes');
        slots.push({ id: `break${i}`, time: `Buffer`, isBreak: true });
        current = breakEnd;
    }
}

const cf = (t) => `<span style="font-family: 'Courier New', Courier, monospace; font-weight: bold;">${t}</span>`;
const headers = ["⌚ Time", cf("Mon"), cf("Tue"), cf("Wed"), cf("Thu"), cf("Fri"), cf("Sat"), cf("Sun")];
const rows = slots.map(s => {
    if(s.isBreak) {
        return [cf(s.time), getD("break"), getD("break"), getD("break"), getD("break"), getD("break"), getD("break"), getD("break")];
    }
    return [
        cf(s.time) + `<br><small style="opacity: 0.5;">[${s.id}]</small>`,
        getD(c[`rt_mon_${s.id}`]),
        getD(c[`rt_tue_${s.id}`]),
        getD(c[`rt_wed_${s.id}`]),
        getD(c[`rt_thu_${s.id}`]),
        getD(c[`rt_fri_${s.id}`]),
        getD(c[`rt_sat_${s.id}`]),
        getD(c[`rt_sun_${s.id}`])
    ];
});

dv.table(headers, rows);
```


`BUTTON[reset-schedule]`
