---
banner: "![[xAttachment/Images/Banner/anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_y: 0.5%
banner_icon: 🧩
inbox: true
persona: ""
arch:
  - "#2area"
archtype:
  - "#2area/4organize"
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
area2: 4_Organize
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
rt_start: 04:00
rt_duration: 60
rt_periods: 20
rt_breaks: ""
rt_end: 00:00
cssclasses:
  - wide-page
---

# 🧩 Nexus Timeblocking (Routines)

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

// --- SMART GET-D FUNCTION (With Details Integration) ---
// --- SMART GET-D FUNCTION (With Engine Colors & Embedding) ---
const getD = (key) => {
    if (Array.isArray(key)) return key.map(k => getD(k)).join("<br><br>");
    if (!key || key === "free") return "—";
    if (key === "break") return "☕ **BUFFER**";
    
    let parts = String(key).split("|");
    let baseKey = parts[0];
    
    // Details auslesen und Klammern entfernen (z.B. "Breakfast")
    let detail = parts.length > 1 ? parts.slice(1).join(" ") : ""; 
    
    if (baseKey === "custom") return `🔸 **${detail}**`;

    // 💡 AM/PM Routinen als anklickbare Links (Hover für Mini-Vorschau!)
    if (baseKey === "am_routine") {
        return `<div style="padding: 6px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.15); box-shadow: 0 0 8px rgba(128, 128, 128, 0.15); text-align: center;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">[[2_Areas/1_Selfcare/Plan/AM_Routine|🌅 AM Protocol]]</span></div>`;
    }
    if (baseKey === "pm_routine") {
        return `<div style="padding: 6px; border-radius: 8px; background-color: rgba(128, 128, 128, 0.15); box-shadow: 0 0 8px rgba(128, 128, 128, 0.15); text-align: center;"><span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">[[2_Areas/1_Selfcare/Plan/PM_Routine|🌙 PM Protocol]]</span></div>`;
    }
    
    if (engine && engine.all && engine.all[baseKey]) {
        const r = engine.all[baseKey];
        // Zieht die Farbe direkt aus der Engine
        const bgColor = r.color || "transparent"; 
        
        // HTML für Styling (Pastell, Glow)
        let html = `<div style="padding: 6px; border-radius: 8px; background-color: ${bgColor}; box-shadow: 0 0 8px ${bgColor}; text-align: center;">`;
        
        // Haupt-Label (Courier/Monospace, kleiner, fett)
        html += `${r.icon} <span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">${r.label}</span>`;
        
        // Detail-Text (Normaler Font, fett, etwas kleiner, ohne Klammern)
        if (detail) {
            html += `<br><span style="font-size: 0.9em; font-weight: bold;">${detail}</span>`;
        }
        
        html += `</div>`;
        return html;
    }
    return `❓ ${key}`;
};

// --- TIME CALCULATION ---
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

// --- RENDER TABLE ---
const headers = ["⌚ Time", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const rows = slots.map(s => {
    if(s.isBreak) {
        return [`*${s.time}*`, getD("break"), getD("break"), getD("break"), getD("break"), getD("break"), getD("break"), getD("break")];
    }
    return [
        `**${s.time}**<br><small style="opacity: 0.5;">[${s.id}]</small>`,
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