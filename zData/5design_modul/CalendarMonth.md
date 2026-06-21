---
cssclasses:
  - no-line-numbers
---

```dataviewjs
// 🔱 1. CONFIG & INITIALISIERUNG (Manuelle Pfade für Dataview-Kontext)
if (window.nexusMonthOffset === undefined) window.nexusMonthOffset = 0;

// Hier definieren wir die Pfade einmal fest, da DV keinen Zugriff auf tp.variables hat
const CONFIG_PATHS = {
    calFolder: "0_Calendar",
    tempFolder: "zData/1tmpl/0calendar"
};

const allLogs = dv.pages(`"${CONFIG_PATHS.calFolder}"`);

// 🔱 2. DYNAMISCHES MAPPING
const config = {
    plm: { trigger: "plm", fileSuffix: "plm", icon: "🌷", color: "#ff79c6" },
    ppm: { trigger: "ppm", fileSuffix: "ppm", icon: "🌻", color: "#f1fa8c" },
    pkm: { trigger: "pkm", fileSuffix: "pkm", icon: "🌼", color: "#bd93f9" }
};
const routerPath = "zData/1tmpl/0calendarprompt.md";

// 🔱 3. NAVIGATION (Month View)
const startM = moment().add(window.nexusMonthOffset, 'months').startOf('month');
const daysInM = startM.daysInMonth();
const curM = startM.format('MMM YY');

const navHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0 4px;">
    <button id="prevM" style="cursor: pointer; background: none; border: none; color: var(--text-muted); padding: 2px 5px;"><-</button>
    <b style="font-size: 0.75em; color: var(--interactive-accent); text-transform: uppercase; letter-spacing: 1px;">🔱 ${curM}</b>
    <button id="nextM" style="cursor: pointer; background: none; border: none; color: var(--text-muted); padding: 2px 5px;">-></button>
</div>`;

// 🔱 4. GRID
let html = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;'>";
const dayData = [];

for (let i = 0; i < daysInM; i++) {
    const mDate = moment(startM).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format("YYYY-MM-DD"));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    const files = {};
    ['plm', 'ppm', 'pkm'].forEach(k => {
        files[k] = dayFiles.find(p => p.file.name.toLowerCase().startsWith(`${dStr} ${config[k].fileSuffix}`));
    });
    dayData.push({ dStr, mDate, files });

    html += `<div style='border: none; padding: 3px; display: flex; flex-direction: column; min-height: 85px; position: relative; ${isToday ? "background: var(--background-modifier-hover); border-radius: 4px;" : ""}'>`;
    html += `<div style='display: flex; justify-content: center; opacity: 0.3; font-size: 0.5em; font-weight: 800; margin-bottom: 2px;'>${mDate.format('DD')}</div>`;

    html += "<div style='display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 2px;'>";
    ['plm', 'ppm', 'pkm'].forEach(k => {
        const ex = files[k];
        const st = ex ? `opacity: 1; filter: drop-shadow(0 0 2px ${config[k].color});` : "opacity: 0.05; filter: grayscale(1);";
        html += `<span class='${k}-btn' data-idx='${i}' style='${st} font-size: 0.9em; cursor: pointer;'>${config[k].icon}</span>`;
    });
    html += "</div>";

    html += "<div style='margin-top: auto; padding-top: 2px;'>";
    if (tasks > 0) html += `<div style='font-size: 0.5em; color: #50fa7b; opacity: 0.8; text-align: center;'>${tasks}t</div>`;
    if (energy) {
        let eCol = (energy >= 4) ? "#50fa7b" : ((energy >= 3) ? config.ppm.color : "#ff5555");
        html += `<div style='width: 100%; height: 2px; background: rgba(0,0,0,0.1); border-radius: 1px;'><div style='width: ${(energy/5)*100}%; height: 100%; background: ${eCol}; opacity: 0.5;'></div></div>`;
    }
    html += "</div></div>";
}

const container = dv.el('div', navHTML + html + "</div>");

// 🔱 5. HANDLER
const handleBtn = async (type, idx) => {
    if (window._nexusMonthRunning) return;
    window._nexusMonthRunning = true;

    try {
    const data = dayData[idx];
    const cfg = config[type];
    const existing = data.files[type];
    if (existing) {
        const file = app.vault.getAbstractFileByPath(existing.file.path);
        if (file) await app.workspace.getLeaf('tab').openFile(file);
        return;
    }

    const plugin = app.plugins.plugins['templater-obsidian'];
    const routerFile = app.vault.getAbstractFileByPath(routerPath);
    const inbox = app.vault.getAbstractFileByPath("0_Inbox");
    if (!plugin || !routerFile || !inbox) {
        new Notice("CalendarMonth: Templater, Router oder 0_Inbox fehlt.");
        return;
    }

    const vars = plugin.templater.variables || (plugin.templater.variables = {});
    ['preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule','energy']
        .forEach(key => delete vars[key]);
    vars.targetDate = data.dStr;
    vars.activeTrigger = cfg.trigger;
    vars.title = "";

    try {
        await plugin.templater.create_new_note_from_template(
            routerFile,
            inbox,
            `${data.dStr} ${cfg.trigger}`,
            true
        );
    } finally {
        ['targetDate','activeTrigger','title','preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule']
            .forEach(key => delete vars[key]);
    }
    } catch (error) {
        console.error("CalendarMonth Error:", error);
        new Notice("CalendarMonth: Erstellung fehlgeschlagen. Details stehen in der Konsole.");
    } finally {
        window._nexusMonthRunning = false;
    }
};

container.querySelector('#prevM').onclick = () => { window.nexusMonthOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
container.querySelector('#nextM').onclick = () => { window.nexusMonthOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

['plm', 'ppm', 'pkm'].forEach(t => {
    container.querySelectorAll(`.${t}-btn`).forEach(b => {
        b.onclick = (e) => { e.preventDefault(); handleBtn(t, b.getAttribute("data-idx")); };
    });
});

```
