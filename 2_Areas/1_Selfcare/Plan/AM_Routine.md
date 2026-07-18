---
am_start: 06:00
am_periods: 0
---

# 🌅 Morning Routine

> [!abstract] ⚙️ **Routine Settings**
> **Start Time:** `INPUT[text:am_start]` (Format: HH:mm) | **Total Duration:** `$= let c=dv.current(); let t=0; for(let i=1; i<=(c.am_periods||0); i++) t+=Number(c["am"+i+"dur"])||0; t;` min.

```dataviewjs
const c = dv.current();
const prefix = "am"; // IN DER ABEND-DATEI HIER "pm" EINTRAGEN!
const periods = Number(c[prefix + "_periods"]) || 0;
let current = moment(c[prefix + "_start"] || "06:00", ["HH:mm"]);

const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
let engine = null;
try { engine = require(enginePath)(); } catch(e) {}

// getD nimmt jetzt Routine und Detail als zwei getrennte Parameter!
const getD = (baseKey, detail) => {
    if (!baseKey || baseKey === "free" || baseKey === "undefined") return "—";
    
    if (baseKey === "custom") return `🔸 **${detail}**`;
    
    if (engine && engine.all && engine.all[baseKey]) {
        const r = engine.all[baseKey];
        const bgColor = r.color || "transparent"; 
        
        let html = `<div style="padding: 4px; border-radius: 6px; background-color: ${bgColor}; box-shadow: 0 0 6px${bgColor}; text-align: left; margin-bottom: 2px;">`;
        html += `${r.icon} <span style="font-family: 'Courier New', Courier, monospace; font-size: 0.85em; font-weight: bold;">${r.label}</span>`;
        if (detail) html += ` &nbsp;<span style="font-size: 0.85em; font-weight: bold; opacity: 0.8;">› ${detail}</span>`;
        html += `</div>`;
        return html;
    }
    return `❓ ${baseKey}`;
};

const rows = [];
for (let i = 1; i <= periods; i++) {
    // Hier werden jetzt alle drei separaten Felder abgerufen
    let val = String(c[prefix + i] || "");
    let det = c[prefix + i + "det"] ? String(c[prefix + i + "det"]) : "";
    let stepDur = Number(c[prefix + i + "dur"]) || 0; 
    
    let end = moment(current).add(stepDur, 'minutes');
    let timeBlock = `**${current.format("HH:mm")}** - ${end.format("HH:mm")}`;
    
    rows.push([timeBlock, getD(val, det)]);
    current = end;
}
dv.table(["⌚ Time", "Routine"], rows);
```
---
`BUTTON[routine-selector]`
---~Routines~--- 

---~End~---

---
```dataviewjs

```



