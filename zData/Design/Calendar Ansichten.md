---
cssclasses:
  - wide-page
  - dashboard-no-border
aliases:
---





```dataviewjs
// 1. INITIALISIERUNG
if (window.studOffset === undefined) window.studOffset = 0;

// Filter: Student-Mode ODER Disziplin vorhanden ODER Anki-Type
const studFiles = dv.pages()
    .where(p => p.persona === "student" || (p.discipline && String(p.discipline).trim() !== "") || String(p.archtype).includes("anki"));

const config = {
    anki: { icon: "🎴", color: "#a6e3a1" },  // Grün
    exam: { icon: "🔥", color: "#ff5555" },  // Rot
    study: { icon: "🎓", color: "#89dceb" }, // Blau
    note: { icon: "📝", color: "#bd93f9" }   // Lila
};

// 2. NAVIGATION
const nav = dv.el('div', '');
const currM = moment().add(window.studOffset, 'months');
nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevS" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 4px 12px;">⬅️</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent); letter-spacing: 1px;">🎓 STUDENT CALENDAR: ${currM.format('MMMM YYYY').toUpperCase()}</b>
    <button id="nextS" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 4px 12px;">➡️</button>
</div>`;

// 3. GRID BAUEN
const startM = moment(currM).startOf('month');
const daysM = startM.daysInMonth();
let gridH = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 2px;">';

for (let i = 0; i < daysM; i++) {
    const mDate = moment(startM).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = studFiles.filter(p => 
        p.file.name.includes(dStr) || 
        (p.due && moment(p.due.toString()).format('YYYY-MM-DD') === dStr) ||
        (p['cal-date'] === dStr) ||
        (p.nextstudy && moment(p.nextstudy.toString()).format('YYYY-MM-DD') === dStr)
    );

    let grads = [];
    let labels = [];
    let hasHammer = dayFiles.some(p => p.file.tasks && p.file.tasks.some(t => !t.completed));
    
    dayFiles.forEach(p => {
        let d = p.discipline;
        let dTxt = d ? String(d).replace("#disc/", "").substring(0, 3).toUpperCase() : "";
        
        let type = "study";
        if(String(p.archtype).includes("anki")) type = "anki";
        if(String(p.archtype).includes("exam") || String(p.archtype).includes("test")) type = "exam";
        if(String(p.arch).includes("#5note") && type === "study") type = "note";
        
        if(dTxt && !labels.some(l => l.name === dTxt)) labels.push({name: dTxt, color: config[type].color});
        grads.push(`linear-gradient(135deg, ${config[type].color}12 0%, transparent 55%)`);
    });

    const finalBg = grads.length > 0 ? grads.join(', ') + ', var(--background-secondary-alt)' : 'var(--background-secondary-alt)';

    gridH += `<div style="background: ${finalBg}; border: 1px solid rgba(255,255,255,0.05); padding: 5px; border-radius: 6px; min-height: 110px; display: flex; flex-direction: column; overflow: hidden; ${isToday ? 'outline: 1.5px solid var(--interactive-accent);' : ''}">`;
    
    // Header (Datum & Hammer)
    gridH += `<div style="display: flex; justify-content: space-between; font-size: 0.5em; opacity: 0.4; font-weight: 800; margin-bottom: 4px;">
        <span>${mDate.format('DD')}</span>
        <span style="font-size: 1.2em; opacity: 0.8;">${hasHammer ? "🔨" : ""}</span>
        <span>${mDate.format('dd').toUpperCase()}</span>
    </div>`;

    // 🏷️ SUBJECT LABELS (Mit Umbruch-Schutz)
    gridH += `<div style="display: flex; flex-wrap: wrap; gap: 2px; align-content: flex-start;">`;
    labels.slice(0, 4).forEach(l => {
        gridH += `<div style="font-size: 0.55em; background: ${l.color}15; color: ${l.color}; padding: 1px 3px; border-radius: 3px; border-left: 1.5px solid ${l.color}; font-weight: bold; flex: 1 1 30%; text-align: center;">${l.name}</div>`;
    });
    gridH += `</div>`;

    // 🔍 STATUS ICONS
    gridH += `<div style="margin-top: auto; display: flex; justify-content: center; gap: 3px; font-size: 0.75em; opacity: 0.6;">`;
    if(dayFiles.some(p => String(p.archtype).includes("anki"))) gridH += `<span>🎴</span>`;
    if(dayFiles.some(p => String(p.archtype).includes("exam"))) gridH += `<span>🔥</span>`;
    if(dayFiles.some(p => p.persona === "student")) gridH += `<span>🎓</span>`;
    gridH += `</div>`;

    gridH += `</div>`;
}

const target = dv.el('div', gridH + '</div>');

// Events
nav.querySelector('#prevS').onclick = () => { window.studOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextS').onclick = () => { window.studOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

```
```dataviewjs
// 🔱 NEXUS MINERVA: COMPACT WRAP EDITION
const today = moment();

// 1. DATA PULL
const studyPages = dv.pages()
    .where(p => 
        (p.persona === "student" || 
         (p.archtype && String(p.archtype).includes("tostudy")) ||
         (p.archtype && String(p.archtype).includes("anki"))) &&
        p.status !== "done" && p.status !== "archive"
    );

// 2. LOGIK-ENGINE
const processed = studyPages.map(p => {
    const nextDate = p.nextstudy ? moment(p.nextstudy.toString()) : (p.due ? moment(p.due.toString()) : null);
    const diff = nextDate ? nextDate.diff(today, 'days') : null;
    
    let typeIcon = "📖"; 
    if (String(p.archtype).includes("anki")) typeIcon = "🎴";
    if (String(p.archtype).includes("exam")) typeIcon = "🔥";
    if (String(p.archtype).includes("test")) typeIcon = "📝";

    let urgency = "☁️ Later";
    if (diff === null) urgency = "⚡ FOCUS";
    else if (diff < 0) urgency = "🚨 OVERDUE";
    else if (diff === 0) urgency = "🟢 TODAY";
    else if (diff <= 3) urgency = "🕒 SOON";

    return {
        link: p.file.link,
        subject: p.discipline ? String(p.discipline).replace("#disc/", "") : "GEN",
        type: typeIcon,
        urgency: urgency,
        date: nextDate ? nextDate.format("DD.MM.") : "---",
        rank: p.spacelvl !== undefined ? "Lvl " + p.spacelvl : (p.priority ? "P" + p.priority : ""),
        diff: diff === null ? 999 : diff
    };
});

// 3. CSS FIX FÜR UMBRUCH (Wichtig!)
// Dies zwingt die Tabelle dazu, schmal zu bleiben und Text umzubrechen
const style = document.createElement('style');
style.innerHTML = `
    .nexus-table table { width: 100% !important; table-layout: fixed !important; }
    .nexus-table th:nth-child(1) { width: 90px; } /* Urgency */
    .nexus-table th:nth-child(2) { width: 45px; } /* Type */
    .nexus-table th:nth-child(3) { width: 65px; } /* Subject */
    .nexus-table th:nth-child(4) { width: auto; } /* Topic (FLIEßEND) */
    .nexus-table th:nth-child(5) { width: 75px; } /* Date */
    .nexus-table td { white-space: normal !important; overflow-wrap: break-word !important; }
`;
document.head.appendChild(style);

// 4. DISPLAY
dv.el("div", "", { cls: "nexus-table" }); // Container mit unserer CSS-Klasse
dv.header(1, "🔱 Nexus Minerva: Strategic Student Queue");

dv.table(["Urgency", "Type", "Sub", "Topic", "Due", "Rank"], 
    processed
    .sort(n => n.diff, "asc")
    .map(n => {
        const color = n.urgency.includes("🚨") ? "#ff5555" : (n.urgency.includes("🟢") ? "#50fa7b" : "var(--text-muted)");
        return [
            `<span style="color:${color}; font-weight:bold; font-size: 0.85em;">${n.urgency}</span>`,
            n.type,
            `<span style="font-size: 0.85em;">${n.subject}</span>`,
            n.link, // HIER PASSIERT JETZT DER UMBRUCH
            `<span style="font-size: 0.85em;">${n.date}</span>`,
            `<span style="font-size: 0.8em; opacity: 0.6;">${n.rank}</span>`
        ];
    })
);

````


```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#a6e3a1' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#89dceb' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION
const nav = dv.el('div', '');
const currentMoment = moment().add(window.nexusOffset, 'months');
const currentMonthStr = currentMoment.format('MMMM YYYY');

nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <button id="prevM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold;">⬅️</button>
    <b style="font-size: 1.3em; color: var(--interactive-accent); letter-spacing: 2px; text-shadow: 0 0 10px var(--interactive-accent)44;">🔱 ${currentMonthStr.toUpperCase()}</b>
    <button id="nextM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold;">➡️</button>
</div>`;

// 3. GRID BAUEN
const startOfMonth = moment(currentMoment).startOf('month');
const daysInMonth = startOfMonth.daysInMonth();
let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">';
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const fitLog = dayFiles.find(p => p['mobility_am'] !== undefined || p['mobility_pm'] !== undefined);
    const fitTotal = (fitLog ? (Number(fitLog['mobility_am']) || 0) + (Number(fitLog['mobility_pm']) || 0) : 0);
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    dayData.push({ dStr, mDate });

    // 🎨 ALL-OVER-FADE DESIGN (Wie der Weekend-Look)
    let gradients = [];
    const hasJou = dayFiles.find(p => p.file.name.includes(config.jou.suffix));
    const hasLog = dayFiles.find(p => p.file.name.includes(config.log.suffix));
    const hasStudy = dayFiles.find(p => p.file.name.includes(config.study.suffix));

    if (hasJou) gradients.push(`linear-gradient(90deg, ${config.jou.color}20 0%, transparent 55%)`);
    if (hasLog) gradients.push(`linear-gradient(180deg, ${config.log.color}20 0%, transparent 55%)`);
    if (hasStudy) gradients.push(`linear-gradient(270deg, ${config.study.color}20 0%, transparent 55%)`);
    
    // Die Basis ist jetzt für alle Tage die dezente Weekend-Optik
    const baseColor = 'rgba(255,255,255,0.03)'; 
    const finalBg = gradients.length > 0 ? gradients.join(', ') + ', ' + baseColor : baseColor;

    gridHTML += `<div style="background: ${finalBg}; border: 1px solid rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 10px; display: flex; flex-direction: column; min-height: 135px; ${isToday ? 'outline: 1.5px solid var(--interactive-accent); box-shadow: 0 0 15px var(--interactive-accent)22;' : ''}">`;
    
    // Header
    gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; opacity: 0.4;">
        <span style="font-size: 0.55em; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">${mDate.format('ddd')}</span>
        <span style="font-size: 0.95em; font-weight: 800;">${mDate.format('DD')}</span>
    </div>`;

    // BLUMEN
    gridHTML += `<div style="display: flex; justify-content: space-around; margin: 4px 0 10px 0;">`;
    ['jou', 'log', 'study'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = ex ? `opacity: 1; filter: drop-shadow(0 0 5px ${config[k].color}); transform: scale(1.05);` : `opacity: 0.08; filter: grayscale(1);`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.5em; cursor: pointer;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // PROJEKTE
    gridHTML += `<div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 6px;">`;
    ['prolog', 'proto', 'rev'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = ex ? `opacity: 0.9; filter: drop-shadow(0 0 3px ${config[k].color});` : `opacity: 0.12; filter: grayscale(1);`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.15em; cursor: pointer;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // FOOTER
    gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 5px;">`;
    gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; min-height: 18px;">`;
    gridHTML += fitTotal > 0 ? `<span style="font-size: 0.65em; color: ${config.rev.color}; font-weight: 800; opacity: 0.7;">🏃 ${fitTotal}m</span>` : `<span></span>`;
    gridHTML += tasks > 0 ? `<span style="font-size: 0.8em; filter: drop-shadow(0 0 3px #ff5555); font-weight: 900;">🔨 ${tasks}</span>` : `<span></span>`;
    gridHTML += `</div>`;
    
    if (energy) {
        gridHTML += `<div style="width: 100%; height: 3.5px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : '#ff5555')}; opacity: 0.8;"></div></div>`;
    }
    gridHTML += `</div></div>`;
}

const renderTarget = dv.el('div', gridHTML + '</div>');

// 4. KLICK-LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

// Event-Binding
nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```


```dataviewjs

```




```dataviewjs

```



```dataviewjs

```



```dataviewjs
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#a6e3a1' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#89dceb' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 1. NAVIGATION
const nav = dv.el('div', '');
const curM = moment().add(window.nexusOffset, 'months').format('MMMM YYYY');
nav.innerHTML = `<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;'>
    <button id='prevM' style='cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 6px 15px;'>⬅️</button>
    <b style='font-size: 1.3em; color: var(--interactive-accent); text-shadow: 0 0 8px var(--interactive-accent)44;'>🔱 ${curM.toUpperCase()}</b>
    <button id='nextM' style='cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 6px 15px;'>➡️</button>
</div>`;

// 2. GRID BAUEN
const startM = moment().add(window.nexusOffset, 'months').startOf('month');
const daysInM = startM.daysInMonth();
let html = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; padding: 5px;'>";
const dayData = [];

for (let i = 0; i < daysInM; i++) {
    const mDate = moment(startM).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);
    const fitLog = dayFiles.find(p => p['mobility_am'] !== undefined || p['mobility_pm'] !== undefined);
    const fitTotal = (fitLog ? (Number(fitLog['mobility_am']) || 0) + (Number(fitLog['mobility_pm']) || 0) : 0);

    dayData.push({ dStr, mDate });

    // 🎨 TRIPLE AURORA GLOW (Überlagernd)
    let gradients = [];
    if (hasPLM) gradients.push("linear-gradient(90deg, " + config.jou.color + "18 0%, transparent 60%)");
    if (hasPPM) gradients.push("linear-gradient(180deg, " + config.log.color + "18 0%, transparent 60%)");
    if (hasPKM) gradients.push("linear-gradient(270deg, " + config.study.color + "18 0%, transparent 60%)");
    
    const bgStyle = gradients.length > 0 ? gradients.join(", ") + ", var(--background-secondary-alt)" : "var(--background-secondary-alt)";

    html += "<div style='background: " + bgStyle + "; border: 1px solid rgba(255,255,255,0.05); padding: 12px 10px; border-radius: 8px; display: flex; flex-direction: column; min-height: 150px; position: relative; " + (isToday ? "border: 2px solid var(--interactive-accent); box-shadow: inset 0 0 10px var(--interactive-accent)22;" : "") + "'>";
    
    // Header
    html += "<div style='display: flex; justify-content: space-between; opacity: 0.4; font-size: 0.55em; font-weight: 900;'><span>" + mDate.format('ddd').toUpperCase() + "</span><span style='font-size: 1.4em;'>" + mDate.format('DD') + "</span></div>";

    // Haupt-Icons (Big Flowers)
    html += "<div style='display: flex; justify-content: space-around; margin: 15px 0 10px 0;'>";
    ['jou', 'log', 'study'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const st = ex ? "opacity: 1; filter: drop-shadow(0 0 8px " + config[k].color + "); transform: scale(1.15);" : "opacity: 0.05; grayscale(1);";
        html += "<span class='" + k + "-btn' data-idx='" + i + "' style='" + st + " font-size: 1.9em; cursor: pointer;'>" + config[k].icon + "</span>";
    });
    html += "</div>";

    // Neben-Icons (Größer als vorher)
    html += "<div style='display: flex; justify-content: center; gap: 12px; margin-bottom: 8px; opacity: 0.7;'>";
    ['prolog', 'proto', 'rev'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const st = ex ? "opacity: 1; filter: drop-shadow(0 0 4px " + config[k].color + ");" : "opacity: 0.12; grayscale(1);";
        html += "<span class='" + k + "-btn' data-idx='" + i + "' style='" + st + " font-size: 1.25em; cursor: pointer;'>" + config[k].icon + "</span>";
    });
    html += "</div>";

    // Footer: Fitness & Green Tasks
    html += "<div style='margin-top: auto; display: flex; flex-direction: column; gap: 5px;'>";
    html += "<div style='display: flex; justify-content: space-between; align-items: center;'>";
    html += fitTotal > 0 ? "<span style='font-size: 0.75em; color: " + config.rev.color + "; font-weight: 800;'>🏋️ " + fitTotal + "m</span>" : "<span></span>";
    html += tasks > 0 ? "<span style='font-size: 0.9em; color: #50fa7b; font-weight: 900; filter: drop-shadow(0 0 3px #50fa7b66);'>✔ " + tasks + "</span>" : "<span></span>";
    html += "</div>";

    // Matte Energy Leiste
    if (energy) {
        let eCol = energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : "#ff5555");
        html += "<div style='width: 100%; height: 5px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;'><div style='width: " + (energy/5)*100 + "%; height: 100%; background: " + eCol + "; opacity: 0.45;'></div></div>";
    }
    html += "</div></div>";
}

const target = dv.el('div', html + "</div>");

// Click Handler
const handleBtn = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folder = cfg.folder + "/" + data.mDate.format('YYYY') + "/" + data.mDate.format('MM');
    const path = folder + "/" + data.dStr + " " + cfg.suffix + ".md";
    let file = app.vault.getAbstractFileByPath(path);
    if (!file) {
        let curr = "";
        for (const seg of folder.split('/')) {
            curr = curr === "" ? seg : curr + "/" + seg;
            if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
        }
        file = await app.vault.create(path, "");
        await new Promise(r => setTimeout(r, 200)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(t => {
    target.querySelectorAll("." + t + "-btn").forEach(b => {
        b.onclick = (e) => { e.preventDefault(); handleBtn(t, b.getAttribute("data-idx")); };
    });
});

```



```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#a6e3a1' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#89dceb' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION UI
const nav = dv.el('div', '');
const curM = moment().add(window.nexusOffset, 'months').format('MMMM YYYY');
nav.innerHTML = `<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;'>
    <button id='prevM' style='cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; padding: 4px 12px;'>⬅️</button>
    <b style='font-size: 1.2em; color: var(--interactive-accent); opacity: 0.8;'>🔱 ${curM.toUpperCase()}</b>
    <button id='nextM' style='cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; padding: 4px 12px;'>➡️</button>
</div>`;

// 3. GRID BAUEN
const startM = moment().add(window.nexusOffset, 'months').startOf('month');
const daysInM = startM.daysInMonth();
let html = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;'>";
const dayData = [];

for (let i = 0; i < daysInM; i++) {
    const mDate = moment(startM).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);
    const fitLog = dayFiles.find(p => p['mobility_am'] !== undefined || p['mobility_pm'] !== undefined);
    const fitTotal = (fitLog ? (Number(fitLog['mobility_am']) || 0) + (Number(fitLog['mobility_pm']) || 0) : 0);

    dayData.push({ dStr, mDate });

    // 🎨 Aurora Glow (Box-Shadow für Weichheit)
    let shadows = [];
    if (hasPLM) shadows.push("-3px 0 12px -2px " + config.jou.color + "44");
    if (hasPPM) shadows.push("0 -3px 12px -2px " + config.log.color + "44");
    if (hasPKM) shadows.push("3px 0 12px -2px " + config.study.color + "44");
    let shadowStyle = shadows.length > 0 ? shadows.join(", ") : "none";

    html += "<div style='background: var(--background-secondary-alt); box-shadow: " + shadowStyle + "; border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; display: flex; flex-direction: column; min-height: 140px; position: relative; " + (isToday ? "border: 1.5px solid var(--interactive-accent);" : "") + "'>";
    
    html += "<div style='display: flex; justify-content: space-between; opacity: 0.4; font-size: 0.5em; font-weight: 800;'><span>" + mDate.format('ddd').toUpperCase() + "</span><span style='font-size: 1.3em;'>" + mDate.format('DD') + "</span></div>";

    // Big Icons
    html += "<div style='display: flex; justify-content: space-around; margin: 15px 0 10px 0;'>";
    ['jou', 'log', 'study'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const st = ex ? "opacity: 1; filter: drop-shadow(0 0 6px " + config[k].color + ");" : "opacity: 0.08; grayscale(1);";
        html += "<span class='" + k + "-btn' data-idx='" + i + "' style='" + st + " font-size: 1.8em; cursor: pointer;'>" + config[k].icon + "</span>";
    });
    html += "</div>";

    // Small Icons
    html += "<div style='display: flex; justify-content: center; gap: 10px; opacity: 0.5; margin-bottom: 8px;'>";
    ['prolog', 'proto', 'rev'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const st = ex ? "opacity: 1; filter: drop-shadow(0 0 3px " + config[k].color + ");" : "opacity: 0.12; grayscale(1);";
        html += "<span class='" + k + "-btn' data-idx='" + i + "' style='" + st + " font-size: 1.1em; cursor: pointer;'>" + config[k].icon + "</span>";
    });
    html += "</div>";

    // Footer
    html += "<div style='margin-top: auto; display: flex; flex-direction: column; gap: 4px;'>";
    html += "<div style='display: flex; justify-content: space-between; align-items: center; font-size: 0.68em; font-weight: 800;'>";
    html += fitTotal > 0 ? "<span style='color: " + config.rev.color + ";'>🏋️ " + fitTotal + "m</span>" : "<span></span>";
    html += tasks > 0 ? "<span style='color: #ff7070;'>✔ " + tasks + "</span>" : "<span></span>";
    html += "</div>";

    if (energy) {
        let eCol = energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : "#ff7070");
        html += "<div style='width: 100%; height: 5px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;'><div style='width: " + (energy/5)*100 + "%; height: 100%; background: " + eCol + "; opacity: 0.7;'></div></div>";
    }
    html += "</div></div>";
}

const target = dv.el('div', html + "</div>");

// 4. FIX: ROBUSTER CLICK HANDLER
const handleBtn = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    
    // Pfade sauber zusammensetzen
    const year = data.mDate.format('YYYY');
    const month = data.mDate.format('MM');
    const folder = cfg.folder + "/" + year + "/" + month;
    const fileName = data.dStr + " " + cfg.suffix + ".md";
    const fullPath = folder + "/" + fileName;

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // Ordnerstruktur rekursiv anlegen
        const segments = folder.split('/');
        let currentPath = "";
        for (const seg of segments) {
            currentPath += (currentPath ? "/" : "") + seg;
            if (!app.vault.getAbstractFileByPath(currentPath)) {
                await app.vault.createFolder(currentPath);
            }
        }
        // Datei erstellen
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 200)); 
    }
    
    // Datei öffnen
    await app.workspace.getLeaf('tab').openFile(file);
    
    // Template anwenden falls neu
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await new Promise(r => setTimeout(r, 100));
        await templater.templater.append_template_to_active_file(tFile);
    }
};

// Event-Binding fixen
nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(t => {
    target.querySelectorAll("." + t + "-btn").forEach(b => {
        b.onclick = (e) => {
            e.preventDefault();
            handleBtn(t, b.getAttribute("data-idx"));
        };
    });
});

```

```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#a6e3a1' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#89dceb' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION
const nav = dv.el('div', '');
const currentMoment = moment().add(window.nexusOffset, 'months');
const currentMonthStr = currentMoment.format('MMMM YYYY');

nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <button id="prevM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">⬅️</button>
    <b style="font-size: 1.3em; color: var(--interactive-accent); letter-spacing: 2px; text-shadow: 0 0 10px var(--interactive-accent)44;">🔱 ${currentMonthStr.toUpperCase()}</b>
    <button id="nextM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">➡️</button>
</div>`;

// 3. GRID BAUEN
const startOfMonth = moment(currentMoment).startOf('month');
const daysInMonth = startOfMonth.daysInMonth();
let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">';
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));
    const isWeekend = (mDate.day() === 0 || mDate.day() === 6);

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const fitLog = dayFiles.find(p => p['mobility_am'] !== undefined || p['mobility_pm'] !== undefined);
    const fitTotal = (fitLog ? (Number(fitLog['mobility_am']) || 0) + (Number(fitLog['mobility_pm']) || 0) : 0);
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    dayData.push({ dStr, mDate });

    // 🎨 MULTI-FADE LOGIK
    let gradients = [];
    const hasJou = dayFiles.find(p => p.file.name.includes(config.jou.suffix));
    const hasLog = dayFiles.find(p => p.file.name.includes(config.log.suffix));
    const hasStudy = dayFiles.find(p => p.file.name.includes(config.study.suffix));

    if (hasJou) gradients.push(`linear-gradient(90deg, ${config.jou.color}25 0%, transparent 50%)`);
    if (hasLog) gradients.push(`linear-gradient(180deg, ${config.log.color}25 0%, transparent 50%)`);
    if (hasStudy) gradients.push(`linear-gradient(270deg, ${config.study.color}25 0%, transparent 50%)`);
    
    const baseColor = isWeekend ? 'rgba(255,255,255,0.02)' : 'var(--background-secondary-alt)';
    const finalBg = gradients.length > 0 ? gradients.join(', ') + ', ' + baseColor : baseColor;

    gridHTML += `<div style="background: ${finalBg}; border: 1px solid rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 10px; display: flex; flex-direction: column; min-height: 135px; transition: transform 0.2s; ${isToday ? 'outline: 1.5px solid var(--interactive-accent); box-shadow: 0 0 15px var(--interactive-accent)33;' : ''}">`;
    
    // Header
    gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; opacity: 0.5;">
        <span style="font-size: 0.55em; font-weight: 900; text-transform: uppercase;">${mDate.format('ddd')}</span>
        <span style="font-size: 0.95em; font-weight: 800; ${isToday ? 'color: var(--interactive-accent);' : ''}">${mDate.format('DD')}</span>
    </div>`;

    // BLUMEN (🌷🌻🌼)
    gridHTML += `<div style="display: flex; justify-content: space-around; margin: 4px 0 10px 0;">`;
    ['jou', 'log', 'study'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = ex ? `opacity: 1; filter: drop-shadow(0 0 5px ${config[k].color}); transform: scale(1.1);` : `opacity: 0.1; filter: grayscale(1);`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.5em; cursor: pointer;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // PROJEKTE (🧩📜🛰️)
    gridHTML += `<div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 6px;">`;
    ['prolog', 'proto', 'rev'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = ex ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color});` : `opacity: 0.15; filter: grayscale(1);`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.15em; cursor: pointer;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // FOOTER
    gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 5px;">`;
    gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; min-height: 18px;">`;
    gridHTML += fitTotal > 0 ? `<span style="font-size: 0.65em; color: ${config.rev.color}; font-weight: 800; opacity: 0.8;">🏃 ${fitTotal}m</span>` : `<span></span>`;
    gridHTML += tasks > 0 ? `<span style="font-size: 0.8em; filter: drop-shadow(0 0 3px #ff5555); font-weight: 900;">🔨 ${tasks}</span>` : `<span></span>`;
    gridHTML += `</div>`;
    
    if (energy) {
        gridHTML += `<div style="width: 100%; height: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : '#ff5555')}; box-shadow: 0 0 5px currentColor;"></div></div>`;
    }
    gridHTML += `</div></div>`;
}

const renderTarget = dv.el('div', gridHTML + '</div>');

// 4. KLICK-LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

// Event-Binding
nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```

```dataview
TABLE without ID
	key as "Kategorie", 
	rows.file.link[0] as "Letzter Log", 
	rows.energy[0] as "⚡",
	rows.aim1[0] as "Aim I",
	slice(rows[0].file.tasks.text, 0, 3) as "Top Tasks"
FROM "0_Calendar"
WHERE archtype
GROUP BY archtype
SORT rows.file.mtime desc

```


```dataviewjs
const container = this.container;

// 1. DATEN HOLEN
const pages = dv.pages('"0_Calendar"')
    .where(p => p.archtype)
    .sort(p => p.file.mtime, "desc");

// 2. GRUPPIERUNG (Smarte Suche in der Liste)
const groups = pages.groupBy(p => {
    const a = String(dv.array(p.archtype)); 
    if (a.includes("1plm")) return "🌷 LIFE (PLM)";
    if (a.includes("2ppm")) return "🌻 MANAGE (PPM)";
    if (a.includes("3pkm")) return "🌼 KNOWLEDGE (PKM)";
    return "🧩 OTHER";
});

let html = `<div style="display: flex; flex-direction: column; gap: 12px; padding: 5px;">`;

groups.sort(g => g.key, "asc").forEach(group => {
    // Kategorie Header
    html += `<div style="font-size: 0.65em; font-weight: 900; color: var(--text-muted); opacity: 0.5; letter-spacing: 2px; margin: 10px 0 2px 10px;">${group.key}</div>`;

    group.rows.limit(3).forEach(p => {
        let color = "#89dceb"; 
        if (group.key.includes("LIFE")) color = "#ff79c6";
        if (group.key.includes("MANAGE")) color = "#f1fa8c";
        if (group.key.includes("KNOWLEDGE")) color = "#bd93f9";

        const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
        const cleanName = p.file.name.replace(/\.md$/gi, "").replace(/\.md$/gi, "");

        // Karte bauen
        html += `
        <div style="background: ${auroraBg}; border-left: 3px solid ${color}; padding: 8px 12px; border-radius: 6px; margin-bottom: 4px; box-shadow: -2px 0 8px ${color}22;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
                    <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.85em; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cleanName}</a>
                </div>
                <div style="font-size: 0.55em; color: var(--text-faint); white-space: nowrap; margin-left: 10px;">${moment(p.file.mtime.toString()).fromNow()}</div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; font-size: 0.62em; opacity: 0.8;">
                <span>⚡ Energy: <b>${p.energy || '—'}</b></span>
                ${p.mood ? `<span>🌈 Mood: <b>${p.mood}</b></span>` : ''}
                ${p.sleep ? `<span>💤 Sleep: <b>${p.sleep}h</b></span>` : ''}
            </div>`;

            // TASKS (falls vorhanden)
            const openTasks = p.file.tasks.where(t => !t.completed);
            if (openTasks.length > 0) {
                html += `<div style="margin-top: 6px; border-top: 1px solid ${color}22; padding-top: 5px;">`;
                openTasks.limit(2).forEach(t => {
                    html += `
                    <div style="font-size: 0.62em; color: var(--text-muted); display: flex; gap: 6px; align-items: center; margin-bottom: 2px;">
                        <span style="color: ${color}; font-size: 1.1em; line-height: 1;">○</span> 
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.text}</span>
                    </div>`;
                });
                html += `</div>`;
            }

        html += `</div>`;
    });
});

dv.el("div", html + `</div>`);

```


```dataviewjs
const allLogs = dv.pages('"0_Calendar"');
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();

const config = {
    jou: { suffix: "plm", folder: "0_Calendar/1_PLM", template: "zData/1temp/0cal/dailyplm", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "ppm", folder: "0_Calendar/2_PPM", template: "zData/1temp/0cal/dailyppm", icon: "🌻", color: "#a6e3a1" },
    study: { suffix: "pkm", folder: "0_Calendar/3_PKM", template: "zData/1temp/0cal/dailypkm", icon: "🌼", color: "#89dceb" },
    prolog: { suffix: "prjlog", folder: "0_Calendar/4_Projectlog", template: "zData/1temp/0cal/projectlog", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "prtcl", folder: "0_Calendar/5_Protocol", template: "zData/1temp/0cal/protocol", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0_Calendar/6_Review", template: "zData/1temp/0cal/revweekly", icon: "🛰️", color: "#50fa7b" }
};

let html = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;'>";
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    let mDate = moment(startOfMonth).add(i, 'days');
    let dStr = mDate.format("YYYY-MM-DD");
    let isToday = (dStr === moment().format("YYYY-MM-DD"));

    let files = {};
    for (let k in config) {
        files[k] = allLogs.find(p => p.file.name.includes(dStr) && p.file.name.includes(config[k].suffix));
    }
    dayData.push({ dStr, mDate });

    // 🎨 Aurora-Glow Berechnung (Strings einzeln zusammenbauen)
    let gLeft = files.jou ? "linear-gradient(90deg, " + config.jou.color + "22 0%, transparent 40%)" : "";
    let gTop = files.log ? "linear-gradient(180deg, " + config.log.color + "22 0%, transparent 40%)" : "";
    let gRight = files.study ? "linear-gradient(270deg, " + config.study.color + "22 0%, transparent 40%)" : "";
    
    let combinedGradients = [gLeft, gTop, gRight].filter(g => g !== "").join(", ");
    let finalBg = combinedGradients !== "" ? combinedGradients + ", var(--background-secondary-alt)" : "var(--background-secondary-alt)";

    // Border-Styles
    let bL = files.jou ? "3px solid " + config.jou.color : "1px solid var(--background-modifier-border)";
    let bT = files.log ? "3px solid " + config.log.color : "1px solid var(--background-modifier-border)";
    let bR = files.study ? "3px solid " + config.study.color : "1px solid var(--background-modifier-border)";

    html += "<div style='background: " + finalBg + "; border-left: " + bL + "; border-top: " + bT + "; border-right: " + bR + "; border-bottom: 1px solid var(--background-modifier-border); padding: 5px; border-radius: 4px; text-align: center; min-height: 85px; display: flex; flex-direction: column; " + (isToday ? "outline: 2px solid var(--interactive-accent);" : "") + "'>";
    
    html += "<div style='display: flex; justify-content: space-between; font-size: 0.45em; opacity: 0.5; font-weight: 800; margin-bottom: 4px;'><span>" + mDate.format("dd").toUpperCase() + "</span><span>" + mDate.format("DD") + "</span></div>";
    
    html += "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin: auto 0;'>";
    for (let k in config) {
        let exists = !!files[k];
        let op = exists ? "1" : "0.1";
        let glow = exists ? "filter: drop-shadow(0 0 2px " + config[k].color + ");" : "filter: grayscale(1);";
        html += "<span class='" + k + "-btn' data-idx='" + i + "' style='opacity: " + op + "; " + glow + " cursor: pointer; font-size: 0.9em;'>" + config[k].icon + "</span>";
    }
    html += "</div>";
    
    // Energie-Balken
    html += "<div style='margin-top: auto; height: 2px;'>";
    if (files.jou && files.jou.energy) {
        let eW = (files.jou.energy / 5) * 100;
        html += "<div style='width: 100%; height: 100%; background: rgba(0,0,0,0.2);'><div style='width: " + eW + "%; height: 100%; background: " + config.log.color + ";'></div></div>";
    }
    html += "</div></div>";
}

const target = dv.el("div", html + "</div>");

// Click-Logik
const handleBtn = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folder = cfg.folder + "/" + data.mDate.format("YYYY") + "/" + data.mDate.format("MM");
    const path = folder + "/" + data.dStr + " " + cfg.suffix + ".md";
    
    let file = app.vault.getAbstractFileByPath(path);
    if (!file) {
        let curr = "";
        for (const seg of folder.split('/')) {
            curr = curr === "" ? seg : curr + "/" + seg;
            if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
        }
        file = await app.vault.create(path, "");
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(t => {
    target.querySelectorAll("." + t + "-btn").forEach(b => b.onclick = () => handleBtn(t, b.getAttribute("data-idx")));
});

```

```dataviewjs
const allLogs = dv.pages('"0_Calendar"');

// 1. MONATS-KONFIGURATION
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();

// 2. KREIDE-FARBEN (Sanft & Matt)
const colors = {
    plm: '#f4b0d1', // Soft Pink
    ppm: '#c7e5c4', // Soft Sage
    pkm: '#b0d6f4', // Soft Blue
    bg: '#1a1a1a'   // Tiefes Matt-Grau/Schwarz (Tafel-Look)
};

let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 10px;">';

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    // 3. VERWISCHTER GLOW (Schatten statt harter Linien)
    let shadows = [];
    if (hasPLM) shadows.push('-3px 0 10px -2px ' + colors.plm + '33'); 
    if (hasPPM) shadows.push('0 -3px 10px -2px ' + colors.ppm + '33');  
    if (hasPKM) shadows.push('3px 0 10px -2px ' + colors.pkm + '33');   
    let shadowStyle = shadows.length > 0 ? shadows.join(', ') : 'none';

    // 4. KACHEL-DESIGN (Dunkel & Matt)
    html += '<div style="background: ' + colors.bg + '; border: 1px solid rgba(255,255,255,0.03); box-shadow: ' + shadowStyle + '; padding: 6px 8px 0 8px; border-radius: 6px; display: flex; flex-direction: column; min-height: 75px; position: relative; overflow: hidden; ' + (isToday ? 'border: 1px solid var(--text-accent);' : '') + '">';
    
    // Header
    html += '<div style="display: flex; justify-content: space-between; opacity: 0.3;">';
    html += '<span style="font-size: 0.45em; letter-spacing: 1px;">' + mDate.format('ddd').toUpperCase() + '</span>';
    html += '<span style="font-size: 0.65em; font-weight: 600;">' + mDate.format('DD') + '</span>';
    html += '</div>';

    // Icons
    html += '<div style="display: flex; justify-content: center; gap: 6px; margin: 8px 0 4px 0; font-size: 0.85em;">';
    html += '<span style="opacity: ' + (hasPLM ? '0.8' : '0.03') + '; filter: saturate(0.5);">🌷</span>';
    html += '<span style="opacity: ' + (hasPPM ? '0.8' : '0.03') + '; filter: saturate(0.5);">🌻</span>';
    html += '<span style="opacity: ' + (hasPKM ? '0.8' : '0.03') + '; filter: saturate(0.5);">🌼</span>';
    html += '</div>';

    // Tasks (Info über dem Balken)
    if (tasks > 0) {
        html += '<div style="font-size: 0.48em; color: #ff9e9e; text-align: center; opacity: 0.6; font-weight: 500; margin-top: auto; margin-bottom: 6px;">' + tasks + ' OPEN</div>';
    } else {
        html += '<div style="margin-top: auto; height: 10px;"></div>';
    }

    // Energy-Balken AM UNTERSTEN RAND
    if (energy) {
        const eColor = energy >= 4 ? colors.ppm : (energy >= 3 ? '#f1fa8c' : '#ff9e9e');
        html += '<div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.02);">';
        html += '<div style="width: ' + (energy/5)*100 + '%; height: 100%; background: ' + eColor + '; opacity: 0.5; filter: blur(0.3px);"></div></div>';
    }

    html += '</div>';
}

html += '</div>';
dv.el('div', html);

```







```dataviewjs
const calContainer = this.container;
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();
const allLogs = dv.pages('"0_Calendar"'); 

// 🔱 KONFIGURATION (Pfade & Style)
const config = {
    jou: { suffix: "plm", folder: "0_Calendar/1_PLM", template: "zData/1temp/0cal/dailyplm", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "ppm", folder: "0_Calendar/2_PPM", template: "zData/1temp/0cal/dailyppm", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0_Calendar/3_PKM", template: "zData/1temp/0cal/dailypkm", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prjlog", folder: "0_Calendar/4_Projectlog", template: "zData/1temp/0cal/projectlog", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "prtcl", folder: "0_Calendar/5_Protocol", template: "zData/1temp/0cal/protocol", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0_Calendar/6_Review", template: "zData/1temp/0cal/revweekly", icon: "🛰️", color: "#50fa7b" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">`;
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    let mDate = moment(startOfMonth).add(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    // 🎨 AURORA LOGIC: Strahlen basierend auf Existenz
    let accent = "transparent";
    if (files.jou) accent = config.jou.color;
    else if (files.log) accent = config.log.color;
    else if (files.study) accent = config.study.color;

    const auroraStyle = accent !== "transparent" 
        ? `background: linear-gradient(270deg, ${accent}15 0%, transparent 95%); border-left: 3px solid ${accent};` 
        : `border-left: 1px solid var(--background-modifier-border);`;

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.1; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="${auroraStyle} padding: 5px; border-radius: 4px; background-color: var(--background-secondary-alt); text-align: center; min-height: 80px; display: flex; flex-direction: column; border-top: 1px solid var(--background-modifier-border); border-bottom: 1px solid var(--background-modifier-border); border-right: 1px solid var(--background-modifier-border); ${isToday ? 'outline: 1.5px solid var(--interactive-accent);' : ''}">
        <div style="display: flex; justify-content: space-between; font-size: 0.45em; opacity: 0.5; font-weight: 800; margin-bottom: 4px;">
            <span>${mDate.format("dd").toUpperCase()}</span>
            <span>${mDate.format("DD")}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 0.9em; margin: auto 0;">
            <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">${config.jou.icon}</span>
            <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">${config.log.icon}</span>
            <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">${config.study.icon}</span>
            <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">${config.prolog.icon}</span>
            <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">${config.proto.icon}</span>
            <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">${config.rev.icon}</span>
        </div>
        <div style="margin-top: auto; height: 3px;">
            ${files.jou?.energy ? `<div style="width: 100%; height: 100%; background: var(--background-modifier-border); border-radius: 1px; overflow: hidden;"><div style="width: ${(files.jou.energy/5)*100}%; height: 100%; background: ${config.rev.color};"></div></div>` : ''}
        </div>
    </div>`;
}

const renderTarget = dv.el("div", tableHTML + `</div>`);

const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250)); 
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```




```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#f1fa8c' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#bd93f9' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION
const nav = dv.el('div', '');
const currentMonthName = moment().add(window.nexusOffset, 'months').format('MMMM YYYY');
nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">⬅️</button>
    <b style="font-size: 1.2em; color: var(--interactive-accent); letter-spacing: 1px;">🔱 ${currentMonthName.toUpperCase()}</b>
    <button id="nextW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">➡️</button>
</div>`;

// 3. MONATS-GRID GENERIEREN
const startOfMonth = moment().add(window.nexusOffset, 'months').startOf('month');
const daysInMonth = startOfMonth.daysInMonth();

let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 5px;">';
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    // Akzentfarbe bestimmen (Dein "Strahlen"-Fokus)
    let accent = '#444'; 
    if (dayFiles.find(p => p.file.name.includes('plm'))) accent = config.jou.color;
    else if (dayFiles.find(p => p.file.name.includes('ppm'))) accent = config.log.color;
    else if (dayFiles.find(p => p.file.name.includes('pkm'))) accent = config.study.color;

    dayData.push({ dStr, mDate });

    // Kachel-Bau mit deinem gewünschten "Strahlen" (Gradient + Border-Left)
    gridHTML += `<div style="background: linear-gradient(270deg, ${accent}25 0%, transparent 95%); border-left: 4px solid ${accent}; background-color: var(--background-secondary-alt); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; min-height: 100px; position: relative; ${isToday ? 'outline: 1px solid var(--interactive-accent); shadow: 0 0 10px ' + accent + '33;' : ''}">`;
    
    // Header
    gridHTML += `<div style="display: flex; justify-content: space-between; opacity: 0.5; font-size: 0.5em; font-weight: 900;"><span>${mDate.format('ddd').toUpperCase()}</span><span>${mDate.format('DD')}</span></div>`;

    // Icons Grid (Klickbar)
    gridHTML += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 8px 0;">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color}); cursor: pointer;` : `opacity: 0.1; filter: grayscale(1); cursor: pointer;`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.1em; text-align: center;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // Data: Tasks & Energy-Balken ganz unten
    gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 3px;">`;
    if (tasks > 0) gridHTML += `<div style="font-size: 0.55em; color: #ff5555; text-align: right; font-weight: bold;">🔴 ${tasks} T</div>`;
    if (energy) {
        const eColor = energy >= 4 ? '#50fa7b' : (energy >= 3 ? '#f1fa8c' : '#ff5555');
        gridHTML += `<div style="width: 100%; height: 3px; background: rgba(0,0,0,0.2); border-radius: 1px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${eColor};"></div></div>`;
    }
    gridHTML += `</div></div>`;
}

const renderTarget = dv.el('div', gridHTML + '</div>');

// 4. KLICK-LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

// Listener binden
nav.querySelector('#prevW').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextW').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```



```dataviewjs
const allLogs = dv.pages('"0_Calendar"');

// 1. MONATS-KONFIGURATION
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();

// 2. KREIDE-FARBEN (Soft Pastels)
const colors = {
    plm: '#f4b0d1', // Soft Pink
    ppm: '#c7e5c4', // Soft Sage Green
    pkm: '#b0d6f4', // Soft Sky Blue
    accent: 'var(--background-modifier-border)'
};

let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 10px;">';

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    // 3. CHALK-GLOW LOGIK (Verwischte Kanten)
    let shadows = [];
    if (hasPLM) shadows.push('-4px 0 8px -2px ' + colors.plm + '44'); // Links Pink
    if (hasPPM) shadows.push('0 -4px 8px -2px ' + colors.ppm + '44');  // Oben Grün
    if (hasPKM) shadows.push('4px 0 8px -2px ' + colors.pkm + '44');   // Rechts Blau
    
    let shadowStyle = shadows.length > 0 ? shadows.join(', ') : 'none';

    // 4. KACHEL-DESIGN
    html += '<div style="background: var(--background-primary); border: 1px solid rgba(255,255,255,0.05); box-shadow: ' + shadowStyle + '; padding: 6px 8px 0 8px; border-radius: 6px; display: flex; flex-direction: column; min-height: 75px; position: relative; overflow: hidden; ' + (isToday ? 'border-color: var(--text-accent);' : '') + '">';
    
    // Header (Tag & Nummer)
    html += '<div style="display: flex; justify-content: space-between; align-items: baseline; opacity: 0.5;">';
    html += '<span style="font-size: 0.45em; letter-spacing: 1px;">' + mDate.format('ddd').toUpperCase() + '</span>';
    html += '<span style="font-size: 0.65em; font-weight: 600;">' + mDate.format('DD') + '</span>';
    html += '</div>';

    // Icons (Sanft ausgeblichen)
    html += '<div style="display: flex; justify-content: center; gap: 6px; margin: 8px 0 4px 0; font-size: 0.9em;">';
    html += '<span style="opacity: ' + (hasPLM ? '0.9' : '0.05') + '; filter: saturate(0.6); text-shadow: 0 0 5px ' + (hasPLM ? colors.plm : 'transparent') + ';">🌷</span>';
    html += '<span style="opacity: ' + (hasPPM ? '0.9' : '0.1') + '; filter: saturate(0.6); text-shadow: 0 0 5px ' + (hasPPM ? colors.ppm : 'transparent') + ';">🌻</span>';
    html += '<span style="opacity: ' + (hasPKM ? '0.9' : '0.1') + '; filter: saturate(0.6); text-shadow: 0 0 5px ' + (hasPKM ? colors.pkm : 'transparent') + ';">🌼</span>';
    html += '</div>';

    // Tasks (Dezente Info)
    if (tasks > 0) {
        html += '<div style="font-size: 0.5em; color: #ff9e9e; text-align: center; opacity: 0.8; font-weight: 500; margin-bottom: 4px;">' + tasks + ' OPEN</div>';
    } else {
        html += '<div style="height: 12px;"></div>'; // Platzhalter
    }

    // Energy-Balken ganz unten am Rand
    if (energy) {
        const eColor = energy >= 4 ? colors.ppm : (energy >= 3 ? '#f1fa8c' : '#ff9e9e');
        html += '<div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.03);">';
        html += '<div style="width: ' + (energy/5)*100 + '%; height: 100%; background: ' + eColor + '; opacity: 0.6; filter: blur(0.5px);"></div></div>';
    }

    html += '</div>';
}

html += '</div>';
dv.el('div', html);

```



```dataviewjs
const allLogs = dv.pages('"0_Calendar"');

// 1. MONATS-DATEN
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();

// 2. GRID START (7 Spalten)
let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">';

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    // Daten für den Tag suchen
    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    // 3. AURORA LOGIK (Die Linien gehen nur an, wenn das Log existiert)
    let bLeft = hasPLM ? '3px solid #ff79c6' : '1px solid var(--background-modifier-border)';
    let bTop = hasPPM ? '3px solid #50fa7b' : '1px solid var(--background-modifier-border)';
    let bRight = hasPKM ? '3px solid #8be9fd' : '1px solid var(--background-modifier-border)';
    
    // Dezentere Schatten/Glow (15% Deckkraft)
    let glow = 'background: ';
    glow += 'linear-gradient(90deg, ' + (hasPLM ? '#ff79c615' : 'transparent') + ' 0%, transparent 50%, ' + (hasPKM ? '#8be9fd15' : 'transparent') + ' 100%), ';
    glow += 'linear-gradient(180deg, ' + (hasPPM ? '#50fa7b15' : 'transparent') + ' 0%, transparent 100%);';

    // 4. KACHEL BAUEN
    html += '<div style="' + glow + ' border-left: ' + bLeft + '; border-top: ' + bTop + '; border-right: ' + bRight + '; border-bottom: 1px solid var(--background-modifier-border); padding: 5px; border-radius: 4px; display: flex; flex-direction: column; min-height: 80px; ' + (isToday ? 'box-shadow: inset 0 0 5px var(--interactive-accent);' : '') + '">';
    
    // Datum oben
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">';
    html += '<span style="font-size: 0.45em; opacity: 0.4;">' + mDate.format('dd').toUpperCase() + '</span>';
    html += '<span style="font-size: 0.65em; font-weight: 800;">' + mDate.format('DD') + '</span>';
    html += '</div>';

    // Mini-Icons (Center)
    html += '<div style="display: flex; justify-content: center; gap: 3px; margin: 2px 0;">';
    html += '<span style="font-size: 0.8em; opacity: ' + (hasPLM ? '1' : '0.1') + ';">🌷</span>';
    html += '<span style="font-size: 0.8em; opacity: ' + (hasPPM ? '1' : '0.1') + ';">🌻</span>';
    html += '<span style="font-size: 0.8em; opacity: ' + (hasPKM ? '1' : '0.1') + ';">🌼</span>';
    html += '</div>';

    // Daten (Energy & Tasks) unten
    html += '<div style="margin-top: auto; display: flex; flex-direction: column; gap: 1px;">';
    if (energy) {
        const eColor = energy >= 4 ? '#50fa7b' : '#f1fa8c';
        html += '<div style="width: 100%; height: 2px; background: rgba(0,0,0,0.1); border-radius: 1px; overflow: hidden;"><div style="width: ' + (energy/5)*100 + '%; height: 100%; background: ' + eColor + ';"></div></div>';
    }
    if (tasks > 0) {
        html += '<div style="font-size: 0.5em; color: #ff5555; text-align: right; font-weight: bold;">🔴 ' + tasks + '</div>';
    }
    html += '</div>';

    html += '</div>';
}

html += '</div>';
dv.el('div', html);

```

```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#f1fa8c' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#bd93f9' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION
const nav = dv.el('div', '');
nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">⬅️</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent);">🔱 NEXUS MONAT (Shift: ${window.nexusOffset})</b>
    <button id="nextW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">➡️</button>
</div>`;

// 3. MONATS-GRID
const startOfMonth = moment().add(window.nexusOffset, 'months').startOf('month');
const daysInMonth = startOfMonth.daysInMonth();

let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">';
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    dayData.push({ dStr, mDate });

    // Aurora Logic: Sanfte Ränder nur wenn Log existiert
    let bL = hasPLM ? `2px solid ${config.jou.color}` : '1px solid var(--background-modifier-border)';
    let bT = hasPPM ? `2px solid ${config.rev.color}` : '1px solid var(--background-modifier-border)';
    let bR = hasPKM ? `2px solid ${config.study.color}` : '1px solid var(--background-modifier-border)';
    
    // Hintergrund-Schimmer
    let glow = `linear-gradient(90deg, ${hasPLM ? config.jou.color+'10' : 'transparent'} 0%, transparent 50%, ${hasPKM ? config.study.color+'10' : 'transparent'} 100%)`;

    gridHTML += `<div style="background: var(--background-secondary-alt); ${glow} border-left: ${bL}; border-top: ${bT}; border-right: ${bR}; border-bottom: 1px solid var(--background-modifier-border); padding: 5px; border-radius: 4px; display: flex; flex-direction: column; min-height: 85px; position: relative; ${isToday ? 'outline: 2px solid var(--interactive-accent);' : ''}">`;
    
    gridHTML += `<div style="display: flex; justify-content: space-between; opacity: 0.4; font-size: 0.45em; font-weight: 800;"><span>${mDate.format('ddd').toUpperCase()}</span><span>${mDate.format('DD')}</span></div>`;

    // Icons Grid
    gridHTML += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 6px 0;">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 2px ${config[k].color}); cursor: pointer;` : `opacity: 0.1; filter: grayscale(1); cursor: pointer;`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1em; text-align: center;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // Tasks & Energy (Unten)
    gridHTML += `<div style="margin-top: auto;">`;
    if (tasks > 0) gridHTML += `<div style="font-size: 0.5em; color: #ff5555; text-align: right; font-weight: bold; margin-bottom: 2px;">🔴 ${tasks}</div>`;
    if (energy) {
        const eColor = energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : '#ff5555');
        gridHTML += `<div style="width: 100%; height: 3px; background: var(--background-modifier-border); border-radius: 1px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${eColor};"></div></div>`;
    }
    gridHTML += `</div></div>`;
}

const renderTarget = dv.el('div', gridHTML + '</div>');

// 4. CLICK LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

nav.querySelector('#prevW').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextW').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```

```dataviewjs
// 1. INITIALISIERUNG & NAV-STATE
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#f1fa8c' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#bd93f9' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. NAVIGATION UI
const nav = dv.el('div', '');
nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">⬅️</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent);">🔱 NEXUS MONAT (Shift: ${window.nexusOffset})</b>
    <button id="nextW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">➡️</button>
</div>`;

// 3. GRID BAUEN (Monats-Raster)
const startOfMonth = moment().add(window.nexusOffset, 'months').startOf('month');
const daysInMonth = startOfMonth.daysInMonth();

let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 5px;">';
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    const mDate = moment(startOfMonth).add(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const hasPLM = dayFiles.find(p => p.file.name.includes('plm'));
    const hasPPM = dayFiles.find(p => p.file.name.includes('ppm'));
    const hasPKM = dayFiles.find(p => p.file.name.includes('pkm'));
    
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    dayData.push({ dStr, mDate });

    // Styles für den Aurora-Glow
    let bLeft = hasPLM ? `3px solid ${config.jou.color}` : '1px solid #333';
    let bTop = hasPPM ? `3px solid ${config.rev.color}` : '1px solid #333';
    let bRight = hasPKM ? `3px solid ${config.study.color}` : '1px solid #333';
    
    let glowBg = `linear-gradient(90deg, ${hasPLM ? config.jou.color+'15' : 'transparent'} 0%, transparent 50%, ${hasPKM ? config.study.color+'15' : 'transparent'} 100%)`;

    gridHTML += `<div style="background: #111; ${glowBg}; border-left: ${bLeft}; border-top: ${bTop}; border-right: ${bRight}; border-bottom: 1px solid #333; padding: 6px; border-radius: 4px; display: flex; flex-direction: column; min-height: 90px; ${isToday ? 'outline: 1px solid var(--interactive-accent);' : ''}">`;
    
    // Header
    gridHTML += `<div style="display: flex; justify-content: space-between; opacity: 0.4; font-size: 0.5em; font-weight: 800;"><span>${mDate.format('ddd').toUpperCase()}</span><span>${mDate.format('DD')}</span></div>`;

    // Icons (Clickable)
    gridHTML += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 6px 0;">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color}); cursor: pointer;` : `opacity: 0.1; grayscale(1); cursor: pointer;`;
        gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.1em; text-align: center;">${config[k].icon}</span>`;
    });
    gridHTML += `</div>`;

    // Tasks & Energy (Ganz unten)
    gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 2px;">`;
    if (tasks > 0) gridHTML += `<div style="font-size: 0.5em; color: #ff5555; text-align: right; font-weight: bold;">🔴 ${tasks}</div>`;
    if (energy) {
        const eColor = energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : '#ff5555');
        gridHTML += `<div style="width: 100%; height: 3px; background: #222; border-radius: 1px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${eColor};"></div></div>`;
    }
    gridHTML += `</div></div>`;
}

const renderTarget = dv.el('div', gridHTML + '</div>');

// 4. EVENT LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

// Listener binden
nav.querySelector('#prevW').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextW').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```




```dataviewjs
const allLogs = dv.pages('"0_Calendar"');

// 1. Farben & Icons definieren
const styles = {
    plm: { icon: '🌷', color: '#ff79c6' },
    ppm: { icon: '🌻', color: '#f1fa8c' },
    pkm: { icon: '🌼', color: '#bd93f9' }
};

// 2. Container erstellen
let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">';

// 3. Letzte 7 Tage durchlaufen
for (let i = 6; i >= 0; i--) {
    const mDate = moment().subtract(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (i === 0);

    // Daten sammeln
    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    // Akzentfarbe bestimmen (Priorität: plm > ppm > pkm)
    let accent = '#444'; 
    if (dayFiles.find(p => p.file.name.includes('plm'))) accent = '#ff79c6';
    else if (dayFiles.find(p => p.file.name.includes('ppm'))) accent = '#f1fa8c';
    else if (dayFiles.find(p => p.file.name.includes('pkm'))) accent = '#bd93f9';

    // Kachel bauen (Aurora-Style)
    gridHTML += '<div style="background: linear-gradient(270deg, ' + accent + '15 0%, transparent 95%); border-left: 3px solid ' + accent + '; padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 4px; min-height: 100px; ' + (isToday ? 'border: 1px solid var(--interactive-accent);' : '') + '">';
    
    gridHTML += '<div style="font-size: 0.5em; opacity: 0.5;">' + mDate.format('ddd').toUpperCase() + '</div>';
    gridHTML += '<div style="font-size: 0.8em; font-weight: 800;">' + mDate.format('DD.MM.') + '</div>';
    
    // Icons
    gridHTML += '<div style="display: flex; gap: 4px; margin: 4px 0;">';
    ['plm', 'ppm', 'pkm'].forEach(k => {
        const ex = dayFiles.find(p => p.file.name.toLowerCase().includes(k));
        gridHTML += '<span style="opacity: ' + (ex ? '1' : '0.1') + '; filter: ' + (ex ? 'drop-shadow(0 0 2px ' + styles[k].color + ')' : 'none') + ';">' + styles[k].icon + '</span>';
    });
    gridHTML += '</div>';

    // Daten (Energy & Tasks)
    gridHTML += '<div style="margin-top: auto; font-size: 0.55em; display: flex; flex-direction: column; gap: 2px;">';
    if (energy) gridHTML += '<span style="color: ' + accent + ';">⚡ <b>' + energy + '</b></span>';
    if (tasks > 0) gridHTML += '<span style="color: #ff5555;">🔴 <b>' + tasks + ' T</b></span>';
    gridHTML += '</div>';

    gridHTML += '</div>';
}

gridHTML += '</div>';

// 4. In Obsidian ausgeben
dv.el('div', gridHTML);

```


```dataviewjs
// 1. INITIALISIERUNG
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou: { suffix: 'plm', folder: '0_Calendar/1_PLM', template: 'zData/1temp/0cal/dailyplm', icon: '🌷', color: '#ff79c6' },
    log: { suffix: 'ppm', folder: '0_Calendar/2_PPM', template: 'zData/1temp/0cal/dailyppm', icon: '🌻', color: '#f1fa8c' },
    study: { suffix: 'pkm', folder: '0_Calendar/3_PKM', template: 'zData/1temp/0cal/dailypkm', icon: '🌼', color: '#bd93f9' },
    prolog: { suffix: 'prjlog', folder: '0_Calendar/4_Projectlog', template: 'zData/1temp/0cal/projectlog', icon: '🧩', color: '#ffb86c' },
    proto: { suffix: 'prtcl', folder: '0_Calendar/5_Protocol', template: 'zData/1temp/0cal/protocol', icon: '📜', color: '#8be9fd' },
    rev: { suffix: 'rev', folder: '0_Calendar/6_Review', template: 'zData/1temp/0cal/revweekly', icon: '🛰️', color: '#50fa7b' }
};

// 2. STYLES
const s = {
    card: 'padding: 10px; border: 1px solid var(--background-modifier-border); border-radius: 12px; background: var(--background-secondary-alt); text-align: center; display: flex; flex-direction: column; gap: 8px; min-height: 110px;',
    today: 'border: 2px solid var(--interactive-accent); background: var(--background-primary-alt); box-shadow: 0 4px 10px rgba(0,0,0,0.15);',
    iconGrid: 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 1.2em;',
    barBg: 'width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden; margin-top: auto;',
    task: 'font-size: 0.55em; color: #ff5555; font-weight: bold; margin-top: 2px;'
};

// 3. NAVIGATION UI
const nav = dv.el('div', '');
nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">⬅️</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent);">🔱 NEXUS (Woche ${window.nexusOffset})</b>
    <button id="nextW" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal); padding: 4px 12px;">➡️</button>
</div>`;

// 4. GRID BAUEN
let html = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

for (let i = 6; i >= 0; i--) {
    const mDate = moment().add(window.nexusOffset, 'weeks').subtract(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = (dStr === moment().format('YYYY-MM-DD'));

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    dayData.push({ dStr, mDate });

    html += `<div style="${s.card} ${isToday ? s.today : ''}">`;
    html += `<div><div style="font-size: 0.5em; opacity: 0.6; text-transform: uppercase;">${mDate.format('ddd')}</div>`;
    html += `<div style="font-size: 0.8em; font-weight: 800;">${mDate.format('DD.MM.')}</div></div>`;

    // ICONS (Klickbar)
    html += `<div style="${s.iconGrid}">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(config[k].suffix));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color}); cursor: pointer;` : `opacity: 0.15; filter: grayscale(1); cursor: pointer;`;
        html += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style}">${config[k].icon}</span>`;
    });
    html += `</div>`;

    // ENERGY & TASKS
    if (energy || tasks > 0) {
        html += `<div style="${s.barBg}">`;
        if (energy) {
            const width = (energy / 5) * 100;
            const color = energy >= 4 ? '#50fa7b' : (energy >= 3 ? '#f1fa8c' : '#ff5555');
            html += `<div style="width: ${width}%; height: 100%; background: ${color};"></div>`;
        }
        html += `</div>`;
        if (tasks > 0) html += `<div style="${s.task}">🔴 ${tasks}</div>`;
    }
    html += `</div>`;
}

const renderTarget = dv.el('div', html + `</div>`);

// 5. EVENT LOGIK
const handleBtnClick = async (type, idx) => {
    const data = dayData[idx];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format('YYYY')}/${data.mDate.format('MM')}`;
    const fullPath = `${folderPath}/${data.dStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = '';
        for (const seg of folderPath.split('/')) {
            current = current === '' ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, '');
        await new Promise(r => setTimeout(r, 200)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins['templater-obsidian'];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + '.md');
    if (tFile && templater && file.stat.size === 0) await templater.templater.append_template_to_active_file(tFile);
};

// Listener binden
nav.querySelector('#prevW').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
nav.querySelector('#nextW').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

Object.keys(config).forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
    });
});

```



```dataviewjs
const allLogs = dv.pages('"0_Calendar"');

// 1. STYLES (Timeline-Look)
const s = {
    container: 'display: flex; flex-direction: column; gap: 10px; padding: 5px;',
    row: 'display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; background: var(--background-secondary-alt); border-radius: 10px; border-left: 5px solid var(--background-modifier-border); border: 1px solid var(--background-modifier-border);',
    today: 'border-left: 5px solid var(--interactive-accent); background: var(--background-primary-alt); box-shadow: 0 2px 10px rgba(0,0,0,0.1);',
    dateBox: 'display: flex; flex-direction: column; min-width: 60px;',
    iconGrid: 'display: flex; gap: 12px; font-size: 1.3em;',
    dataBox: 'display: flex; flex-direction: column; align-items: flex-end; gap: 4px; min-width: 80px;'
};

const config = {
    plm: { icon: '🌷', color: '#ff79c6' },
    ppm: { icon: '🌻', color: '#f1fa8c' },
    pkm: { icon: '🌼', color: '#bd93f9' },
    prj: { icon: '🧩', color: '#ffb86c' },
    prt: { icon: '📜', color: '#8be9fd' },
    rev: { icon: '🛰️', color: '#50fa7b' }
};

// 2. TIMELINE BAUEN
let html = `<div style="${s.container}">`;

// Zeigt die letzten 7 Tage untereinander
for (let i = 0; i < 7; i++) {
    const mDate = moment().subtract(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = i === 0;

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    html += `<div style="${s.row} ${isToday ? s.today : ''}">`;
    
    // LINKS: Datum
    html += `<div style="${s.dateBox}">`;
    html += `<div style="font-size: 0.6em; opacity: 0.5; text-transform: uppercase;">${mDate.format('dddd')}</div>`;
    html += `<div style="font-size: 0.9em; font-weight: 800;">${mDate.format('DD. MMM')}</div>`;
    html += `</div>`;

    // MITTE: Icons
    html += `<div style="${s.iconGrid}">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(k));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color});` : `opacity: 0.1; grayscale(1);`;
        html += `<span title="${k}">${config[k].icon}</span>`;
    });
    html += `</div>`;

    // RECHTS: Energy & Tasks
    html += `<div style="${s.dataBox}">`;
    if (energy) {
        const width = (energy / 5) * 60; // Max 60px breit
        const color = energy >= 4 ? '#50fa7b' : (energy >= 3 ? '#f1fa8c' : '#ff5555');
        html += `<div style="width: 60px; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden;">`;
        html += `<div style="width: ${width}px; height: 100%; background: ${color};"></div></div>`;
    }
    if (tasks > 0) {
        html += `<div style="font-size: 0.65em; color: #ff5555; font-weight: bold;">🔴 ${tasks} Tasks</div>`;
    } else if (dayFiles.length > 0) {
        html += `<div style="font-size: 0.65em; color: #50fa7b; opacity: 0.7;">✅ Clear</div>`;
    }
    html += `</div>`;

    html += `</div>`;
}

html += `</div>`;
dv.el('div', html);

```

```dataviewjs
const container = this.container;
const allLogs = dv.pages('"0_Calendar"');

// 1. STYLES DEFINIEREN (Vermeidet Inline-Chaos)
const s = {
    card: 'padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 10px; background: var(--background-secondary-alt); text-align: center; display: flex; flex-direction: column; gap: 5px;',
    today: 'border: 2px solid var(--interactive-accent);',
    iconGrid: 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 1.1em;',
    barBg: 'width: 100%; height: 3px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden; margin-top: 4px;',
    task: 'font-size: 0.55em; color: #ff5555; font-weight: bold; margin-top: 2px;'
};

const config = {
    plm: { icon: '🌷', color: '#ff79c6' },
    ppm: { icon: '🌻', color: '#f1fa8c' },
    pkm: { icon: '🌼', color: '#bd93f9' },
    prj: { icon: '🧩', color: '#ffb86c' },
    prt: { icon: '📜', color: '#8be9fd' },
    rev: { icon: '🛰️', color: '#50fa7b' }
};

// 2. GRID BAUEN
let html = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">`;

for (let i = 6; i >= 0; i--) {
    const mDate = moment().subtract(i, 'days');
    const dStr = mDate.format('YYYY-MM-DD');
    const isToday = i === 0;

    const dayFiles = allLogs.filter(p => p.file.name.includes(dStr));
    const energy = dayFiles.find(p => p.energy)?.energy || null;
    const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

    html += `<div style="${s.card} ${isToday ? s.today : ''}">`;
    html += `<div style="font-size: 0.5em; opacity: 0.6;">${mDate.format('ddd').toUpperCase()}</div>`;
    html += `<div style="font-size: 0.75em; font-weight: 800;">${mDate.format('DD.MM.')}</div>`;
    
    // ICONS
    html += `<div style="${s.iconGrid}">`;
    Object.keys(config).forEach(k => {
        const exists = dayFiles.find(p => p.file.name.toLowerCase().includes(k));
        const style = exists ? `opacity: 1; filter: drop-shadow(0 0 2px ${config[k].color});` : `opacity: 0.15; filter: grayscale(1);`;
        html += `<span style="${style}">${config[k].icon}</span>`;
    });
    html += `</div>`;

    // DATA (Energy & Tasks)
    if (energy || tasks > 0) {
        html += `<div style="margin-top: auto; border-top: 1px solid var(--background-modifier-border); padding-top: 4px;">`;
        if (energy) {
            const width = (energy / 5) * 100;
            const color = energy >= 4 ? '#50fa7b' : (energy >= 3 ? '#f1fa8c' : '#ff5555');
            html += `<div style="${s.barBg}"><div style="width: ${width}%; height: 100%; background: ${color};"></div></div>`;
        }
        if (tasks > 0) html += `<div style="${s.task}">🔴 ${tasks}</div>`;
        html += `</div>`;
    }
    
    html += `</div>`;
}

html += `</div>`;

// 3. FINALER OUTPUT
dv.el('div', html);

```



```dataviewjs
const container = this.container;
const allLogs = dv.pages('"0_Calendar"');

// 1. KONFIGURATION
const config = {
    jou: { suffix: "plm", folder: "0_Calendar/1_PLM", template: "zData/1temp/0cal/dailyplm", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "ppm", folder: "0_Calendar/2_PPM", template: "zData/1temp/0cal/dailyppm", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0_Calendar/3_PKM", template: "zData/1temp/0cal/dailypkm", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prjlog", folder: "0_Calendar/4_Projectlog", template: "zData/1temp/0cal/projectlog", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "prtcl", folder: "0_Calendar/5_Protocol", template: "zData/1temp/0cal/protocol", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0_Calendar/6_Review", template: "zData/1temp/0cal/revweekly", icon: "🛰️", color: "#50fa7b" }
};

// --- TEIL A: DAS KALENDER-GRID ---
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();
let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px; margin-bottom: 20px;">`;
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    let mDate = moment(startOfMonth).add(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }
    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 5px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 8px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.5em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.7em; font-weight: 800; margin-bottom: 4px;">${mDate.format("DD.")}</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 1em;">
            <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
            <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
            <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
        </div>
    </div>`;
}

// --- TEIL B: DAS AURORA-DETAILS-DASHBOARD ---
const recentPages = allLogs.where(p => p.archtype).sort(p => p.file.mtime, "desc").limit(10);
const groups = recentPages.groupBy(p => {
    const a = String(dv.array(p.archtype));
    if (a.includes("1plm")) return "🌷 LIFE (PLM)";
    if (a.includes("2ppm")) return "🌻 MANAGE (PPM)";
    if (a.includes("3pkm")) return "🌼 KNOWLEDGE (PKM)";
    return "🧩 OTHER";
});

let auroraHTML = `<div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px;">`;

groups.sort(g => g.key, "asc").forEach(group => {
    auroraHTML += `<div style="font-size: 0.65em; font-weight: 900; color: var(--text-muted); opacity: 0.5; letter-spacing: 2px; margin-left: 10px;">${group.key}</div>`;
    group.rows.limit(2).forEach(p => {
        let color = "#89dceb"; 
        if (group.key.includes("LIFE")) color = "#ff79c6";
        if (group.key.includes("MANAGE")) color = "#f1fa8c";
        if (group.key.includes("KNOWLEDGE")) color = "#bd93f9";

        auroraHTML += `
        <div style="background: linear-gradient(270deg, ${color}15 0%, transparent 95%); border-left: 3px solid ${color}; padding: 10px; border-radius: 6px; box-shadow: -2px 0 8px ${color}22;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.85em; font-weight: 600;">${p.file.name.replace(/\.md/g, "")}</a>
                <span style="font-size: 0.55em; color: var(--text-faint);">${moment(p.file.mtime.toString()).fromNow()}</span>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 4px; font-size: 0.62em; opacity: 0.8;">
                <span>⚡ Energy: <b>${p.energy || '—'}</b></span>
                ${p.mood ? `<span>🌈 Mood: <b>${p.mood}</b></span>` : ''}
            </div>`;

        // TASKS AUSLESEN
        const openTasks = p.file.tasks.where(t => !t.completed);
        if (openTasks.length > 0) {
            auroraHTML += `<div style="margin-top: 6px; border-top: 1px solid ${color}22; padding-top: 4px;">`;
            openTasks.limit(2).forEach(t => {
                auroraHTML += `<div style="font-size: 0.62em; color: var(--text-muted); display: flex; gap: 6px; align-items: center;">
                    <span style="color: ${color};">○</span> <span>${t.text}</span>
                </div>`;
            });
            auroraHTML += `</div>`;
        }
        auroraHTML += `</div>`;
    });
});

// RENDERING
const renderTarget = dv.el("div", tableHTML + `</div>` + auroraHTML + `</div>`);

// CLICK HANDLER LOGIK
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = `${folderPath}/${data.dateStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250)); 
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(type => {
    renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```

##### Doughnut blank code
{ 
    const nexusContainer = this.container;
    
    // --- GRÖSSE HIER ANPASSEN ---
    nexusContainer.style.width = "160px"; 
    nexusContainer.style.margin = "0 auto"; 

    if (nexusContainer.innerHTML.length < 50) {
        const entries = dv.pages('!"z-Data"');

        // Deine Filter-Logik (Beispiel)
        const val1 = entries.filter(p => String(p.persona).includes("healer")).length;
        const val2 = entries.filter(p => String(p.persona).includes("worker")).length;

        const chartData = {
            type: 'doughnut',
            data: {
                labels: ['Label A', 'Label B'],
                datasets: [{
                    data: [val1, val2],
                    backgroundColor: ['#f5c2e7', '#a6e3a1'],
                    borderWidth: 0
                }]
            },
            options: {
                animation: false, // <--- STOPPT DAS ZUCKEN
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 9 } } }
                }
            }
        };

        const attemptRender = setInterval(() => {
            if (window.renderChart) {
                window.renderChart(chartData, nexusContainer);
                clearInterval(attemptRender);
            }
        }, 150);
        setTimeout(() => clearInterval(attemptRender), 5000);
    }
}




```dataviewjs
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '🌷' },
            { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '🌻' },
            { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '🌼' },
            { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '🧩' },
            { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '📜' },
            { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '🛰️' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 3px; padding: 5px 0;">';

        config.forEach(cfg => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
            const exists = !!file;
            
            const dotStyle = exists 
                ? 'background: ' + cfg.color + '; box-shadow: 0 0 8px ' + cfg.color + ';' 
                : 'border: 1px solid var(--text-faint); opacity: 0.2;';
            
            // 🎨 REVERSE AURORA: Nur Schimmer, keine Linien.
            // 270deg = Startet rechts mit der Farbe (1a = 10% Deckkraft) und fadet nach links auf transparent (00).
            const auroraBg = exists 
                ? 'linear-gradient(270deg, ' + cfg.color + '1a 0%, transparent 95%)' 
                : 'transparent';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px;">';
            
            // LINKS: Status-Dot | Icon | Label (Im transparenten Bereich)
            html += '<div style="display: flex; align-items: center; gap: 12px;">';
            html += '<div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
            html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
            html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span>';
            html += '</div>';

            // RECHTS: Der Link (Hier sitzt der Ursprung des Glows)
            html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 170px;">';
            if (exists) {
                html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.7;">' + file.file.name + '</a>';
            } else {
                html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>';
            }
            html += '</div>';
            
            html += '</div>';
        });

        html += '</div>';
        dv.el('div', html);
    }
}

```

```dataviewjs
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '🌷' },
            { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '🌻' },
            { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '🌼' },
            { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '🧩' },
            { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '📜' },
            { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '🛰️' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">';

        config.forEach(cfg => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
            const exists = !!file;
            
            // Punkt leuchtet weiterhin als Anker
            const dotStyle = exists 
                ? 'background: ' + cfg.color + '; box-shadow: 0 0 8px ' + cfg.color + ';' 
                : 'border: 1px solid var(--text-faint); opacity: 0.2;';
            
            // 🎨 REVERSE AURORA: Farbe rechts kräftig, links (zur Blume hin) ausfaded/weißlich
            // 270deg dreht den Verlauf um (startet rechts)
            const auroraBg = exists 
                ? 'linear-gradient(270deg, ' + cfg.color + '26 0%, transparent 90%)' 
                : 'transparent';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px; border-right: 2px solid ' + (exists ? cfg.color : 'transparent') + ';">';
            
            // LINKS: Status-Dot | Icon | Label (Hier ist es jetzt "weiß/transparent")
            html += '<div style="display: flex; align-items: center; gap: 12px;">';
            html += '<div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
            html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
            html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span>';
            html += '</div>';

            // RECHTS: Der Link (Hier ist die Farbe am stärksten)
            html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 170px;">';
            if (exists) {
                html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.8;">' + file.file.name + '</a>';
            } else {
                html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>';
            }
            html += '</div>';
            
            html += '</div>';
        });

        html += '</div>';
        dv.el('div', html);
    }
}

```

```dataviewjs
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '🌷' },
            { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '🌻' },
            { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '🌼' },
            { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '🧩' },
            { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '📜' },
            { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '🛰️' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 3px; padding: 5px 0;">';

        config.forEach(cfg => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
            const exists = !!file;
            
            // 🎨 MISCH-LOGIK: Status-Dot + Aurora Gradient
            const dotStyle = exists 
                ? 'background: ' + cfg.color + '; box-shadow: 0 0 8px ' + cfg.color + ';' 
                : 'border: 1px solid var(--text-faint); opacity: 0.2;';
            
            // Der Aurora-Schimmer: Nutzt die Chakra-Farbe mit sehr hoher Transparenz (0.1)
            const auroraBg = exists 
                ? 'linear-gradient(90deg, ' + cfg.color + '1a 0%, transparent 80%)' 
                : 'transparent';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px; transition: 0.3s;">';
            
            // LINKS: Status-Dot | Icon | Label
            html += '<div style="display: flex; align-items: center; gap: 12px;">';
            html += '<div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
            html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
            html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span>';
            html += '</div>';

            // RECHTS: Der Link (Dezent & Sauber)
            html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 160px;">';
            if (exists) {
                html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.6;">' + file.file.name + '</a>';
            } else {
                html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>';
            }
            html += '</div>';
            
            html += '</div>';
        });

        html += '</div>';
        dv.el('div', html);
    }
}

```


```dataviewjs
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: 'JOURNAL', suffix: 'jou', color: 'rgba(245, 194, 231, 0.15)', icon: '🌷' },
            { label: 'DAILY', suffix: 'log', color: 'rgba(249, 226, 175, 0.15)', icon: '🌻' },
            { label: 'STUDY', suffix: 'study', color: 'rgba(203, 166, 247, 0.15)', icon: '🌼' },
            { label: 'PROJ', suffix: 'prolog', color: 'rgba(250, 179, 135, 0.15)', icon: '🧩' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 4px;">';
        config.forEach(cfg => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
            const exists = !!file;
            // Sanfter Schimmer-Hintergrund nur wenn Datei da ist
            const bg = exists ? 'linear-gradient(90deg, ' + cfg.color + ' 0%, transparent 100%)' : 'transparent';
            
            html += '<div style="display:flex; align-items:center; justify-content:space-between; background:' + bg + '; padding:4px 10px; border-radius:8px;">';
            html += '<div style="display:flex; align-items:center; gap:8px;">';
            html += '<span style="font-size:1em; opacity:' + (exists ? '1' : '0.2') + '">' + cfg.icon + '</span>';
            html += '<span style="font-size:0.6em; font-weight:800; color:var(--text-muted); opacity:0.5;">' + cfg.label + '</span>';
            html += '</div>';
            html += '<div style="text-align:right;">';
            if (exists) {
                html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration:none; color:var(--text-normal); font-size:0.75em; font-weight:500;">' + file.file.name + '</a>';
            } else {
                html += '<span style="font-size:0.65em; color:var(--text-faint);">---</span>';
            }
            html += '</div></div>';
        });
        html += '</div>';
        dv.el('div', html);
    }
}

```



```dataviewjs
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '🌷' },
            { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '🌻' },
            { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '🌼' },
            { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '🧩' },
            { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '📜' },
            { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '🛰️' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 2px; padding: 5px 0;">';

        config.forEach(cfg => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
            const exists = !!file;
            
            // Punkt-Style: Leuchtend oder matter Ring
            const dotStyle = exists 
                ? 'background: ' + cfg.color + '; box-shadow: 0 0 6px ' + cfg.color + ';' 
                : 'border: 1px solid var(--text-faint); opacity: 0.3;';

            html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: transparent;">';
            
            // LINKS: Status-Dot | Icon | Label
            html += '<div style="display: flex; align-items: center; gap: 12px;">';
            html += '<div style="width: 6px; height: 6px; border-radius: 50%; ' + dotStyle + '"></div>';
            html += '<span style="font-size: 1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
            html += '<span style="font-size: 0.6em; font-weight: 800; color: var(--text-muted); opacity: 0.5; letter-spacing: 0.5px; width: 60px;">' + cfg.label + '</span>';
            html += '</div>';

            // RECHTS: Der Link (Das "Etikett")
            html += '<div style="text-align: right; flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px;">';
            if (exists) {
                html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.7;">' + file.file.name + '</a>';
            } else {
                html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.4;">pending...</span>';
            }
            html += '</div>';
            
            html += '</div>';
        });

        html += '</div>';
        dv.el('div', html);
    }
}

```





```dataviewjs
// 🔱 NEXUS SLIM LOG SCANNER
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: "JOURNAL", suffix: "jou", color: "#ff79c6", icon: "🌷" },
            { label: "DAILY LOG", suffix: "log", color: "#f1fa8c", icon: "🌻" },
            { label: "STUDYLOG", suffix: "study", color: "#bd93f9", icon: "🌼" },
            { label: "PROJECTLOG", suffix: "prolog", color: "#ffb86c", icon: "🧩" },
            { label: "PROTOCOL", suffix: "proto", color: "#8be9fd", icon: "📜" },
            { label: "REVIEW", suffix: "rev", color: "#50fa7b", icon: "🛰️" }
        ];

        const createRow = (cfg) => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, "desc").first();
            const exists = !!file;
            const borderColor = exists ? cfg.color : "var(--background-modifier-border)";
            
            // Kompaktes Flex-Layout: Icon | Label | Link
            return `<div style="display: flex; align-items: center; gap: 10px; background: var(--background-secondary-alt); padding: 4px 10px; border-radius: 6px; border-left: 3px solid ${borderColor}; margin-bottom: 4px;">
                <span style="font-size: 0.9em; ${exists ? '' : 'filter:grayscale(1);opacity:0.2;'}">${cfg.icon}</span>
                <span style="font-size: 0.65em; font-weight: 800; color: var(--text-muted); width: 65px; opacity: 0.7;">${cfg.label}</span>
                <div style="flex-grow: 1; text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    ${exists 
                        ? `<a class="internal-link" href="${file.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500;">${file.file.name}</a>` 
                        : `<span style="font-size: 0.7em; color: var(--text-faint); font-style: italic;">none</span>`
                    }
                </div>
            </div>`;
        };

        let html = `<div style="display: flex; flex-direction: column; padding: 2px;">`;
        config.forEach(cfg => { html += createRow(cfg); });
        html += `</div>`;

        dv.el("div", html);
    }
}

```


```dataviewjs
// 🔱 NEXUS LITE LOG SCANNER
{
    const logContainer = this.container;
    if (logContainer.innerHTML.length < 50) {
        const allLogs = dv.pages('"0-Calendar"'); 
        const config = [
            { label: "JOU", suffix: "jou", color: "#ff79c6", icon: "🌷" },
            { label: "LOG", suffix: "log", color: "#f1fa8c", icon: "🌻" },
            { label: "STUDY", suffix: "study", color: "#bd93f9", icon: "🌼" },
            { label: "PROJ", suffix: "prolog", color: "#ffb86c", icon: "🧩" },
            { label: "PROT", suffix: "proto", color: "#8be9fd", icon: "📜" },
            { label: "REV", suffix: "rev", color: "#50fa7b", icon: "🛰️" }
        ];

        const createRow = (cfg) => {
            const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, "desc").first();
            const exists = !!file;
            const borderColor = exists ? cfg.color : "transparent";
            
            return `<div style="display: flex; align-items: center; gap: 6px; background: var(--background-secondary); padding: 4px 8px; border-radius: 4px; border-left: 2px solid ${borderColor}; min-width: 120px;">
                <span style="font-size: 0.9em; ${exists ? '' : 'filter:grayscale(1);opacity:0.3;'}">${cfg.icon}</span>
                <div style="display: flex; flex-direction: column; overflow: hidden;">
                    <span style="font-size: 0.6em; font-weight: bold; color: ${cfg.color}; opacity: 0.8; line-height: 1;">${cfg.label}</span>
                    ${exists 
                        ? `<a class="internal-link" href="${file.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.7em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${file.file.name.split('-').slice(-1)}</a>` 
                        : `<span style="font-size: 0.6em; color: var(--text-faint);">---</span>`
                    }
                </div>
            </div>`;
        };

        // Das Grid-Layout: 3 Spalten, 2 Zeilen (oder automatisch)
        let html = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 5px;">`;
        config.forEach(cfg => { html += createRow(cfg); });
        html += `</div>`;

        dv.el("div", html);
    }
}
```


doughnut
```dataviewjs
{ 
    const nexusContainer = this.container;
    
    // Prüft, ob der Container leer ist (verhindert Verschwinden beim Seitenwechsel)
    if (nexusContainer.innerHTML.length < 50) {
        
        const entries = dv.pages('!"z-Data"');

        // Daten für Life, Manage, Knowledge berechnen
        const plm = entries.filter(p => (p.archtype && String(p.archtype).includes("journal")) || (p.persona && String(p.persona).includes("healer"))).length;
        const ppm = entries.filter(p => (p.archtype && String(p.archtype).includes("log") && !String(p.archtype).includes("study")) || (p.persona && String(p.persona).includes("manager"))).length;
        const pkm = entries.filter(p => (p.archtype && String(p.archtype).includes("study")) || (p.persona && String(p.persona).includes("student"))).length;

        const chartData = {
            type: 'doughnut',
            data: {
                labels: ['🌷 Life', '🌻 Manage', '🌼 Knowledge'],
                datasets: [{
                    data: [plm, ppm, pkm],
                    backgroundColor: ['#f5c2e7', '#a6e3a1', '#89dceb'], // Deine Originalfarben
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#a6adc8', font: { size: 10 } } }
                }
            }
        };

        // Render-Loop: Wartet kurz, bis Obsidian bereit ist
        const attemptRender = setInterval(() => {
            if (window.renderChart) {
                window.renderChart(chartData, nexusContainer);
                clearInterval(attemptRender);
            }
        }, 150);
        
        setTimeout(() => clearInterval(attemptRender), 5000);
    }
}
```


calendar einmaliges laden::

```dataviewjs
{
    const calContainer = this.container;

    // Prüft, ob der Container wirklich leer ist oder noch keine Kinder-Elemente hat
    if (calContainer.innerHTML.length < 50) {
        
        const startOfMonth = moment().startOf('month');
        const daysInMonth = moment().daysInMonth();
        const allLogs = dv.pages('"0-Calendar"'); 

        const config = {
            jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
            log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
            study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
            prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
            proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
            rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
        };

        let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">`;
        const dayData = [];

        for (let i = 0; i < daysInMonth; i++) {
            let mDate = moment(startOfMonth).add(i, 'days');
            let dateStr = mDate.format("YYYY-MM-DD");
            let isToday = (dateStr === moment().format("YYYY-MM-DD"));

            let files = {};
            for (let key in config) {
                files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
            }

            dayData.push({ dateStr, mDate });

            const getStyle = (exists, color) => exists 
                ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
                : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

            tableHTML += `
            <div style="padding: 5px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 8px; background-color: var(--background-secondary-alt); text-align: center;">
                <div style="font-size: 0.5em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
                <div style="font-size: 0.7em; font-weight: 800; margin-bottom: 4px;">${mDate.format("DD.")}</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 1em;">
                    <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
                    <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">🌻</span>
                    <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">🌼</span>
                    <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
                    <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
                    <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
                </div>
            </div>`;
        }

        const renderTarget = dv.el("div", tableHTML + `</div>`);

        const handleBtnClick = async (type, btn) => {
            const data = dayData[btn.getAttribute('data-idx')];
            const cfg = config[type];
            const fileName = data.dateStr + " " + cfg.suffix;
            const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
            const fullPath = folderPath + "/" + fileName + ".md";

            let file = app.vault.getAbstractFileByPath(fullPath);
            if (!file) {
                let current = "";
                for (const seg of folderPath.split('/')) {
                    current = current === "" ? seg : `${current}/${seg}`;
                    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
                }
                file = await app.vault.create(fullPath, "");
            }

            await app.workspace.getLeaf('tab').openFile(file);
            const templater = app.plugins.plugins["templater-obsidian"];
            const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
            if (tFile && templater && file.stat.size === 0) {
                await templater.templater.append_template_to_active_file(tFile);
            }
        };

        ['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(type => {
            renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
        });
    }
}

```



<div style="display: flex; justify-content: center; gap: 25px; background: var(--background-secondary-alt); padding: 12px; border-radius: 15px; border-bottom: 3px solid #f5c2e7; margin-bottom: 20px;">

<div style="display: flex; align-items: center; gap: 5px;">
	<span>🏠</span> <a class="internal-link" href="💫 Dashboard" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Home</a>
</div>

<div style="display: flex; align-items: center; gap: 5px;">
	<span>📅</span> <a class="internal-link" href="📅 Calendar" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Calendar</a>
</div>

<div style="display: flex; align-items: center; gap: 5px;">
	<span>🌟</span> <a class="internal-link" href="✨ Stars" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Stars</a>
</div>

<div style="display: flex; align-items: center; gap: 5px;">
	<span>💠</span> <a class="internal-link" href="💠 Areas" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Areas</a>
</div>

<div style="display: flex; align-items: center; gap: 5px;">
	<span>✏️</span> <a class="internal-link" href="✏️ Notes" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Notes</a>
</div>

<div style="display: flex; align-items: center; gap: 5px;">
	<span>🔖</span> <a class="internal-link" href="🔖 Resources" style="text-decoration: none; color: var(--text-normal); font-weight: bold;">Resources</a>
</div>

</div>

```dataviewjs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. DATA SYNC ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale("en").format("dddd"); 
    const key = tageMap[heuteFull];
    
    // Check meals (Breakfast, Bento, Cena, Snack oder Masterplan)
    const hasMeals = (c["meal-breakfast"]?.length > 0 || c["meal-bento"]?.length > 0 || c["meal-cena"]?.length > 0 || (plan && plan[key]?.length > 0));
    const p1 = hasMeals ? 20 : 0; 
    
    // Check Journal & Selfcare (Alle 4 müssen TRUE sein für die Säule)
    const journalDone = (String(c["journal-am"]) === "true" && String(c["journal-pm"]) === "true");
    const selfcareDone = (String(c["selfcare-am"]) === "true" && String(c["selfcare-pm"]) === "true");
    const p2 = (journalDone && selfcareDone) ? 20 : 0; 
    
    // Check Fitness (AM + PM zusammen min. 30)
    const totalSport = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0);
    const p3 = totalSport >= 30 ? 20 : 0; 
    
    // Check Sleep (min. 7h)
    const p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    
    // Check Vitamins (Alles im Tracker erledigt)
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 20 : 0; 

    const basisPflicht = p1 + p2 + p3 + p4 + p5; // Max 100%

    // --- 2. ASCENSION (Bonus - 120% Ziel) ---
    let bonus = 0;
    if (totalSport >= 45) bonus += 10;
    if (totalSport >= 60) bonus += 10;
    if (Number(c.mood) >= 4) bonus += 5;
    if (Number(c.energy) >= 4) bonus += 5;

    const gesamtProzent = basisPflicht + bonus;

    // --- 3. SYMBOL EVOLUTION ---
    let icon = "🌸"; 
    let status = "Foundation";
    if (gesamtProzent >= 100) { icon = "💖"; status = "SYNC COMPLETE"; }
    if (basisPflicht >= 100 && gesamtProzent >= 120) { icon = "🐦‍🔥"; status = "PHOENIX ASCENSION"; }

    // --- 4. OUTPUT ---
    const gefüllt = Math.min(12, Math.floor(gesamtProzent / 10)); 
    let balken = icon.repeat(Math.min(gefüllt, 10)) + (gesamtProzent > 100 ? "✨".repeat(Math.max(0, gefüllt - 10)) : "🤍".repeat(Math.max(0, 10 - gefüllt)));
    
    dv.paragraph(balken + " **" + gesamtProzent + "%** " + status); 

    if (basisPflicht < 100) {
        let offen = [];
        if(!p1) offen.push("Nutrition"); 
        if(!p2) offen.push("Journal/Selfcare"); 
        if(totalSport < 30) offen.push("Sport (30m)"); 
        if(!p4) offen.push("Sleep (7h)"); 
        if(!p5) offen.push("Vitamins");
        dv.paragraph("> [!caution] **Pending:** " + offen.join(" • "));
    }
})()

```


```dataviewjs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. DATA SYNC ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale("en").format("dddd"); 
    const key = tageMap[heuteFull];
    
    // Check meals (Breakfast, Bento, Cena, Snack oder Masterplan)
    const hasMeals = (c["meal-breakfast"]?.length > 0 || c["meal-bento"]?.length > 0 || c["meal-cena"]?.length > 0 || (plan && plan[key]?.length > 0));
    const p1 = hasMeals ? 20 : 0; 
    
    // Check Journal & Selfcare (Alle 4 müssen TRUE sein für die Säule)
    const journalDone = (String(c["journal-am"]) === "true" && String(c["journal-pm"]) === "true");
    const selfcareDone = (String(c["selfcare-am"]) === "true" && String(c["selfcare-pm"]) === "true");
    const p2 = (journalDone && selfcareDone) ? 20 : 0; 
    
    // Check Fitness (AM + PM zusammen min. 30)
    const totalSport = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0);
    const p3 = totalSport >= 30 ? 20 : 0; 
    
    // Check Sleep (min. 7h)
    const p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    
    // Check Vitamins (Alles im Tracker erledigt)
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 20 : 0; 

    const basisPflicht = p1 + p2 + p3 + p4 + p5; // Max 100%

    // --- 2. ASCENSION (Bonus) ---
    let bonus = 0;
    if (totalSport >= 45) bonus += 10;
    if (totalSport >= 60) bonus += 10;
    if (Number(c.mood) >= 4) bonus += 10;
    if (Number(c.energy) >= 4) bonus += 10;

    const gesamtProzent = basisPflicht + bonus;

    // --- 3. SYMBOL EVOLUTION ---
    let icon = "🌸"; 
    let status = "Building Foundation...";
    if (gesamtProzent >= 100) { icon = "💖"; status = "⚡ SYNC COMPLETE"; }
    if (gesamtProzent >= 120) { icon = "🔥"; status = "⚡ OVERCHARGE"; }
    if (basisPflicht >= 100 && gesamtProzent >= 140) { icon = "🐦‍🔥"; status = "🔥 PHOENIX ASCENSION"; }

    // --- 4. OUTPUT ---
    const gefüllt = Math.min(15, Math.floor(gesamtProzent / 10)); 
    let balken = icon.repeat(Math.min(gefüllt, 10)) + (gesamtProzent > 100 ? "✨".repeat(Math.max(0, gefüllt - 10)) : "🤍".repeat(Math.max(0, 10 - gefüllt)));
    
    dv.paragraph(balken + " **" + gesamtProzent + "%** " + status); 

    if (basisPflicht < 100) {
        let offen = [];
        if(!p1) offen.push("Nutrition"); 
        if(!p2) offen.push("Selfcare/Journal (AM+PM)"); 
        if(totalSport < 30) offen.push("Sport (30m)"); 
        if(!p4) offen.push("Sleep (7h)"); 
        if(!p5) offen.push("Vitamins");
        dv.paragraph("> [!caution] **Pending Basics:** " + offen.join(" • "));
    }
})()
```


```dataviewjs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. MEAL-ERKENNUNG (Zusammenführung Plan + Spontan) ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    // Erzwingt Englisch, damit "Monday" rauskommt, auch wenn dein System Deutsch ist
const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    const key = tageMap[heuteFull];
    
    const planned = (plan && plan[key]) ? plan[key] : [];
    const spontaneous = (plan && plan["spont-meals"]) ? plan["spont-meals"] : [];
    const allMeals = [...planned, ...spontaneous];

    // --- 2. BASIS CHECK (Die 5 Säulen) ---
    const p1 = (allMeals.length > 0 || (c.meal && c.meal.length > 2)) ? 1 : 0; 
    const p2 = (String(c["journal-am"]) == "true" || String(c["journal-pm"]) == "true") ? 1 : 0; 
    const sport = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0); 
    const p3 = sport >= 30 ? 1 : 0; 
    const p4 = (Number(c.sleep) || 0) >= 7 ? 1 : 0; 
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 1 : 0; 

    const basisProzent = Math.round(((p1 + p2 + p3 + p4 + p5) / 5) * 100); 

    // --- 3. BONUS (Energie & Stimmung) ---
    let bonus = 0;
    if (Number(c.mood) >= 4) bonus += 10;
    if (Number(c.energy) >= 4) bonus += 10;

    const gesamtProzent = basisProzent + bonus;
    const gefüllt = Math.min(12, Math.floor(gesamtProzent / 10)); 
    let balken = "🌸".repeat(gefüllt) + "🤍".repeat(Math.max(0, 10 - gefüllt));
    
    let status = (basisProzent >= 100 && gesamtProzent >= 120) ? " ⚡ 🐦‍🔥 **PHOENIX**" : (gesamtProzent > 100 ? " ⚡ **OVERCHARGE**" : "");
    dv.paragraph(balken + " **" + gesamtProzent + "% SYNC**" + status); 

    // Feedback-Zeile falls noch was offen ist
    if (basisProzent < 100) {
        let offen = [];
        if(!p1) offen.push("Meal"); if(!p2) offen.push("Journal"); if(!p3) offen.push("Sport"); if(!p4) offen.push("Sleep"); if(!p5) offen.push("Vitamins");
        dv.paragraph("> <small>Open: " + offen.join(", ") + "</small>");
    }
})()

```

```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Full Ascension - No Backticks)
(function(){ 
    var c = dv.current(); 
    var v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    var plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. CORE LOGIC (30/45/60m Sport) ---
    var tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    var heuteFull = moment(c.file.name, "YYYY-MM-DD").locale("en").format("dddd"); 
    var key = tageMap[heuteFull];
    
    // Die 4 Pflicht-Säulen (je 20%)
    var p1 = ((plan && plan[key] && plan[key].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
    var p2 = (String(c["selfcare-am"]) == "true" && String(c["selfcare-pm"]) == "true") ? 20 : 0; 
    var p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    var p5 = (v && v.file.tasks && v.file.tasks.filter(function(t){ return t.completed }).length === v.file.tasks.length) ? 20 : 0; 
    var basicPflicht = p1 + p2 + p4 + p5;

    // Der Sport-Turbo (30m=20%, 45m=30%, 60m=40%)
    var sportMin = (Number(c["fitness-min"]) || 0);
    var sportScore = Math.round((sportMin / 30) * 20); 

    // Der Bonus (Kreativität & Mood)
    var creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
    var totalScore = basicPflicht + sportScore + creativeScore;

    // --- 2. THE PHOENIX VISUALS ---
    var accent = "var(--text-faint)";
    var icon = "🌱";
    var status = "Building Foundation...";
    var glow = "none";

    if (totalScore >= 100) { 
        accent = "#ff9e00"; 
        icon = "🦅"; 
        status = "SYNC COMPLETE";
    }
    if (totalScore >= 120) { 
        accent = "#f97316"; 
        status = "OVERCHARGE (60m Mode)";
    }
    if (totalScore >= 150 && basicPflicht >= 80 && sportMin >= 30) { 
        accent = "#f43f5e"; 
        icon = "🔥 🐦‍F"; 
        status = "PHOENIX ASCENSION";
        glow = "0 0 15px #f43f5e";
    }

    // --- 3. RENDERING (High-End Cockpit) ---
    var html = "<div style=\"padding: 10px 0; font-family: var(--font-interface);\">" +
        "<div style=\"display: flex; justify-content: space-between; margin-bottom: 6px;\">" +
            "<span style=\"font-size: 0.85em; font-weight: 800; letter-spacing: 0.1em; color: " + accent + "; text-shadow: " + glow + ";\">" + icon + " " + status + "</span>" +
            "<span style=\"font-size: 1.1em; font-weight: 900; color: var(--text-normal);\">" + totalScore + "%</span>" +
        "</div>" +
        "<div style=\"width: 100%; background: var(--background-modifier-border); height: 5px; border-radius: 3px; overflow: hidden;\">" +
            "<div style=\"width: " + Math.min(totalScore, 100) + "%; background: " + accent + "; height: 100%; transition: width 1s ease-in-out;\"></div>" +
        "</div>";
    
    // Die zweite Linie für Overcharge (Phönix-Feuer)
    if (totalScore > 100) {
        html += "<div style=\"width: " + Math.min(totalScore - 100, 50) + "%; background: #f43f5e; height: 3px; margin-top: 3px; border-radius: 2px; opacity: 0.8; box-shadow: 0 0 8px #f43f5e;\"></div>";
    }
    html += "</div>";

    dv.paragraph(html);

    // Feedback-Warnung nur wenn Basics fehlen
    if (basicPflicht < 80 || sportMin < 30) {
        var missing = [];
        if(!p1) missing.push("Food"); if(!p2) missing.push("Care"); if(sportMin < 30) missing.push("Sport (30m)"); if(!p4) missing.push("Sleep"); if(!p5) missing.push("Vitamins");
        dv.paragraph("> [!caution] **Pending Basics:** " + missing.join(" · "));
    }
})()

```
```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Double-Quote Stability Version)
(function(){ 
    var c = dv.current(); 
    var v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    var plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. CORE LOGIC ---
    var tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    var heuteFull = moment(c.file.name, "YYYY-MM-DD").locale("en").format("dddd"); 
    var key = tageMap[heuteFull];
    
    var p1 = ((plan && plan[key] && plan[key].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
    var p2 = (String(c["selfcare-am"]) == "true" && String(c["selfcare-pm"]) == "true") ? 20 : 0; 
    var p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    var p5 = (v && v.file.tasks && v.file.tasks.filter(function(t){ return t.completed }).length === v.file.tasks.length) ? 20 : 0; 

    var sportMin = (Number(c["fitness-min"]) || 0);
    var sportScore = Math.round((sportMin / 30) * 20); 
    var creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
    var totalScore = p1 + p2 + p4 + p5 + sportScore + creativeScore;

    // --- 2. THE VISUALS (Double-Quotes only) ---
    var accent = "var(--text-faint)";
    var barGradient = "linear-gradient(90deg, var(--text-faint), var(--text-muted))";
    var icon = "🌱";

    if (totalScore >= 100) { 
        accent = "#ff9e00"; 
        barGradient = "linear-gradient(90deg, #ff9e00, #f97316)"; 
        icon = "🦅";
    }
    if (totalScore >= 150) { 
        accent = "#f43f5e"; 
        barGradient = "linear-gradient(90deg, #f97316, #f43f5e)"; 
        icon = "🔥";
    }

    // --- 3. RENDERING ---
    var html = "<div style=\"padding: 10px 0; font-family: var(--font-interface);\">" +
        "<div style=\"display: flex; justify-content: space-between; margin-bottom: 6px;\">" +
            "<span style=\"font-size: 0.85em; font-weight: 600; color: " + accent + "; opacity: 0.8;\">" + icon + " SYNC STATUS</span>" +
            "<span style=\"font-size: 1.1em; font-weight: 700;\">" + totalScore + "%</span>" +
        "</div>" +
        "<div style=\"width: 100%; background: var(--background-modifier-border); height: 4px; border-radius: 2px; overflow: hidden;\">" +
            "<div style=\"width: " + Math.min(totalScore, 100) + "%; background: " + barGradient + "; height: 100%; transition: width 1s ease-in-out;\"></div>" +
        "</div>";
    
    if (totalScore > 100) {
        html += "<div style=\"width: " + Math.min(totalScore - 100, 50) + "%; background: #f43f5e; height: 2px; margin-top: 2px; border-radius: 1px; opacity: 0.6;\"></div>";
    }
    html += "</div>";

    dv.paragraph(html);

    if (totalScore < 100) {
        var missing = [];
        if(!p1) missing.push("Food"); if(!p2) missing.push("Care"); if(sportMin < 30) missing.push("Sport"); if(!p4) missing.push("Sleep"); if(!p5) missing.push("Vits");
        dv.paragraph("<small style=\"color: var(--text-faint);\">Pending: " + missing.join(" · ") + "</small>");
    }
})()
```


```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Direct DOM Version)
const c = dv.current(); 
const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");

// 1. LOGIK (Bleibt stabil)
const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
const key = tageMap[heuteFull];

const p1 = ((plan && plan[key] && plan[key].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
const p2 = (String(c["selfcare-am"]) == "true" && String(c["selfcare-pm"]) == "true") ? 20 : 0; 
const p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 20 : 0; 

const sportMin = (Number(c["fitness-min"]) || 0);
const sportScore = Math.round((sportMin / 30) * 20); 
const creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
const totalScore = p1 + p2 + p4 + p5 + sportScore + creativeScore;

// 2. STYLING VARS
let accent = totalScore >= 150 ? "#f43f5e" : (totalScore >= 100 ? "#ff9e00" : "var(--text-faint)");
let icon = totalScore >= 150 ? "🔥" : (totalScore >= 100 ? "🦅" : "🌱");

// 3. DIRECT DOM RENDERING (Sicher vor Fehlern)
const container = dv.el("div", "", { attr: { style: "padding: 10px 0; font-family: var(--font-interface);" }});

// Header-Zeile (Status & Prozent)
const header = container.createEl("div", { attr: { style: "display: flex; justify-content: space-between; margin-bottom: 6px;" }});
header.createEl("span", { text: `${icon} SYNC STATUS`, attr: { style: `font-size: 0.85em; font-weight: 600; color: ${accent}; opacity: 0.8;` }});
header.createEl("span", { text: `${totalScore}%`, attr: { style: "font-size: 1.1em; font-weight: 700; color: var(--text-normal);" }});

// Background Bar
const barBg = container.createEl("div", { attr: { style: "width: 100%; background: var(--background-modifier-border); height: 4px; border-radius: 2px; overflow: hidden;" }});

// Progress Fill (Gradient)
const gradient = totalScore >= 100 ? `linear-gradient(90deg, #ff9e00, ${accent})` : "var(--text-faint)";
barBg.createEl("div", { attr: { style: `width: ${Math.min(totalScore, 100)}%; background: ${gradient}; height: 100%; transition: width 1s ease-in-out;` }});

// Ascension Line (Extra Power)
if (totalScore > 100) {
    container.createEl("div", { attr: { style: `width: ${Math.min(totalScore - 100, 50)}%; background: #f43f5e; height: 2px; margin-top: 2px; opacity: 0.6; border-radius: 1px;` }});
}

// 4. FEEDBACK CALLOUT (Falls Basics fehlen)
if (totalScore < 100) {
    let missing = [];
    if(!p1) missing.push("Food"); if(!p2) missing.push("Care"); if(sportMin < 30) missing.push("Sport"); if(!p4) missing.push("Sleep"); if(!p5) missing.push("Vits");
    dv.paragraph(`<small style="color: var(--text-faint); italic">Pending: ${missing.join(" · ")}</small>`);
}

```

```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Diagnostic Version)
(function(){ 
    const c = dv.current(); 
    const trackerPath = "z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md";
    const planPath = "2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md";
    
    const v = dv.page(trackerPath); 
    const plan = dv.page(planPath);
    
    // --- DIAGNOSE-CHECK ---
    if (!v) { dv.paragraph("⚠️ Tracker nicht gefunden: " + trackerPath); return; }
    if (!plan) { dv.paragraph("⚠️ Planer nicht gefunden: " + planPath); return; }

    // --- 1. CORE LOGIC ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    const key = tageMap[heuteFull];
    
    // Check: Mahlzeiten (P1)
    const p1 = ((plan[key] && plan[key].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
    
    // Check: Selfcare (P2) - Wir wandeln sicherheitshalber in String um
    const p2 = (String(c["selfcare-am"]) === "true" && String(c["selfcare-pm"]) === "true") ? 20 : 0; 
    
    // Check: Schlaf (P4)
    const p4 = (Number(c.sleep) >= 7) ? 20 : 0; 
    
    // Check: Vitamine (P5) - Alle erledigt?
    const allVits = v.file.tasks ? v.file.tasks.length : 0;
    const doneVits = v.file.tasks ? v.file.tasks.filter(t => t.completed).length : 0;
    const p5 = (allVits > 0 && doneVits === allVits) ? 20 : 0; 

    // Check: Sport (30/45/60)
    const sportMin = Number(c["fitness-min"]) || 0;
    const sportScore = Math.round((sportMin / 30) * 20); 
    
    // Bonus
    const creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
    
    const totalScore = p1 + p2 + p4 + p5 + sportScore + creativeScore;

    // --- 2. VISUALS ---
    let accent = "var(--text-faint)";
    let barGradient = "linear-gradient(90deg, var(--text-faint), var(--text-muted))";
    let icon = "🌱";

    if (totalScore >= 100) { 
        accent = "#ff9e00"; 
        barGradient = "linear-gradient(90deg, #ff9e00, #f97316)"; 
        icon = "🦅";
    }
    if (totalScore >= 150) { 
        accent = "#f43f5e"; 
        barGradient = "linear-gradient(90deg, #f97316, #f43f5e)"; 
        icon = "🔥";
    }

    // RENDERING
    dv.paragraph(`
    <div style="padding: 10px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 0.85em; font-weight: 600; color: ${accent}; opacity: 0.8;">${icon} SYNC STATUS</span>
            <span style="font-size: 1.1em; font-weight: 700;">${totalScore}%</span>
        </div>
        <div style="width: 100%; background: var(--background-modifier-border); height: 4px; border-radius: 2px; overflow: hidden;">
            <div style="width: ${Math.min(totalScore, 100)}%; background: ${barGradient}; height: 100%; transition: width 1s ease-in-out;"></div>
        </div>
        ${totalScore > 100 ? `<div style="width: ${Math.min(totalScore - 100, 50)}%; background: #f43f5e; height: 2px; margin-top: 2px; opacity: 0.6;"></div>` : ""}
    </div>
    `);

    // DEBUG INFO (Nur wenn < 100%)
    if (totalScore < 100) {
        let debug = [];
        if(!p1) debug.push("Food"); if(!p2) debug.push("Care"); if(sportMin < 30) debug.push("Sport"); if(!p4) debug.push("Sleep"); if(!p5) debug.push("Vits");
        dv.paragraph("<small style='opacity:0.5'>Missing: " + debug.join(" · ") + "</small>");
    }
})()

```
```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Aesthetic & Lean)
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. CORE LOGIC (30/45/60m Sport) ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    
    const p1 = ((plan && plan[tageMap[heuteFull]] && plan[tageMap[heuteFull]].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
    const p2 = (String(c["selfcare-am"]) == "true" && String(c["selfcare-pm"]) == "true") ? 20 : 0; 
    const p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 20 : 0; 

    const sportMin = (Number(c["fitness-min"]) || 0);
    const sportScore = Math.round((sportMin / 30) * 20); 
    const creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
    const totalScore = p1 + p2 + p4 + p5 + sportScore + creativeScore;

    // --- 2. THE LEAN VISUALS ---
    let accent = "var(--text-faint)"; // Dezent im Normalzustand
    let barGradient = "linear-gradient(90deg, var(--text-faint), var(--text-muted))";
    let icon = "🌱";

    if (totalScore >= 100) { 
        accent = "var(--text-accent)"; 
        barGradient = "linear-gradient(90deg, #eab308, #f97316)"; // Gold zu Orange
        icon = "🦅";
    }
    if (totalScore >= 150) { 
        accent = "#f43f5e"; // Sanftes Phönix-Rot
        barGradient = "linear-gradient(90deg, #f97316, #f43f5e)"; 
        icon = "🔥";
    }

    // --- 3. UI RENDERING (Minimalist) ---
    dv.paragraph(`
    <div style="font-family: var(--font-interface); padding: 10px 0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <span style="font-size: 0.85em; font-weight: 600; letter-spacing: 0.1em; color: ${accent}; opacity: 0.8;">${icon} SYNC STATUS</span>
            <span style="font-size: 1.1em; font-weight: 700; color: var(--text-normal);">${totalScore}%</span>
        </div>
        <div style="width: 100%; background: var(--background-modifier-border); height: 4px; border-radius: 2px; overflow: hidden;">
            <div style="width: ${Math.min(totalScore, 100)}%; background: ${barGradient}; height: 100%; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
        ${totalScore > 100 ? `<div style="width: ${Math.min(totalScore - 100, 50)}%; background: #f43f5e; height: 2px; margin-top: 2px; border-radius: 1px; opacity: 0.6;"></div>` : ""}
    </div>
    `);

    // --- 4. DISKRETE INFO ---
    if (totalScore < 100) {
        let missing = [];
        if(p1==0) missing.push("Food"); if(p2==0) missing.push("Care"); if(sportMin<30) missing.push("Sport"); if(p4==0) missing.push("Sleep"); if(p5==0) missing.push("Vits");
        dv.paragraph(`<small style="color: var(--text-faint); italic">Pending: ${missing.join(" · ")}</small>`);
    }
})()

```



```dataviewjs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. MEAL-ERKENNUNG (Zusammenführung Plan + Spontan) ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    // Erzwingt Englisch, damit "Monday" rauskommt, auch wenn dein System Deutsch ist
const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    const key = tageMap[heuteFull];
    
    const planned = (plan && plan[key]) ? plan[key] : [];
    const spontaneous = (plan && plan["spont-meals"]) ? plan["spont-meals"] : [];
    const allMeals = [...planned, ...spontaneous];

    // --- 2. BASIS CHECK (Die 5 Säulen) ---
    const p1 = (allMeals.length > 0 || (c.meal && c.meal.length > 2)) ? 1 : 0; 
    const p2 = (String(c["journal-am"]) == "true" || String(c["journal-pm"]) == "true") ? 1 : 0; 
    const sport = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0); 
    const p3 = sport >= 30 ? 1 : 0; 
    const p4 = (Number(c.sleep) || 0) >= 7 ? 1 : 0; 
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 1 : 0; 

    const basisProzent = Math.round(((p1 + p2 + p3 + p4 + p5) / 5) * 100); 

    // --- 3. BONUS (Energie & Stimmung) ---
    let bonus = 0;
    if (Number(c.mood) >= 4) bonus += 10;
    if (Number(c.energy) >= 4) bonus += 10;

    const gesamtProzent = basisProzent + bonus;
    const gefüllt = Math.min(12, Math.floor(gesamtProzent / 10)); 
    let balken = "🌸".repeat(gefüllt) + "🤍".repeat(Math.max(0, 10 - gefüllt));
    
    let status = (basisProzent >= 100 && gesamtProzent >= 120) ? " ⚡ 🐦‍🔥 **PHOENIX**" : (gesamtProzent > 100 ? " ⚡ **OVERCHARGE**" : "");
    dv.paragraph(balken + " **" + gesamtProzent + "% SYNC**" + status); 

    // Feedback-Zeile falls noch was offen ist
    if (basisProzent < 100) {
        let offen = [];
        if(!p1) offen.push("Meal"); if(!p2) offen.push("Journal"); if(!p3) offen.push("Sport"); if(!p4) offen.push("Sleep"); if(!p5) offen.push("Vitamins");
        dv.paragraph("> <small>Open: " + offen.join(", ") + "</small>");
    }
})()

```
```
```

```dataviewjs
// 🔱 NEXUS PHOENIX RADAR (Aesthetic & Uncapped)
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. CORE LOGIC (30/45/60m Sport) ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    
    const p1 = ((plan && plan[tageMap[heuteFull]] && plan[tageMap[heuteFull]].length > 0) || (c.meal && c.meal.length >= 1)) ? 20 : 0; 
    const p2 = (String(c["selfcare-am"]) == "true" && String(c["selfcare-pm"]) == "true") ? 20 : 0; 
    const p4 = (Number(c.sleep) || 0) >= 7 ? 20 : 0; 
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 20 : 0; 

    const sportMin = (Number(c["fitness-min"]) || 0);
    const sportScore = Math.round((sportMin / 30) * 20); 
    const creativeScore = (Number(c["creativity-pts"]) || 0) * 10;
    const totalScore = p1 + p2 + p4 + p5 + sportScore + creativeScore;

    // --- 2. VISUAL STYLING ---
    let themeColor = "var(--text-accent)";
    let glow = "";
    let phoenixIcon = "🦅";

    if (totalScore >= 100) { themeColor = "#ff7b00"; glow = "text-shadow: 0 0 10px #ff7b00;"; }
    if (totalScore >= 150) { themeColor = "#ff4500"; glow = "text-shadow: 0 0 20px #ff4500; font-weight: bold;"; phoenixIcon = "🔥 🐦‍🔥"; }

    // --- 3. THE RADAR DISPLAY ---
    dv.paragraph(`<div style="padding: 15px; border-radius: 12px; background: var(--background-secondary); border: 1px solid ${themeColor}; box-shadow: ${glow.replace("text-shadow", "box-shadow")}">
        <h2 style="margin: 0; color: ${themeColor}; ${glow}">${phoenixIcon} SYNC STATUS: ${totalScore}%</h2>
        <div style="width: 100%; background: var(--background-modifier-border); height: 12px; border-radius: 6px; margin-top: 10px; overflow: hidden;">
            <div style="width: ${Math.min(totalScore, 100)}%; background: linear-gradient(90deg, #ff9e00, ${themeColor}); height: 100%; transition: width 1s ease-in-out;"></div>
        </div>
    </div>`);

    // --- 4. MULTI-COLUMN FEEDBACK ---
    if (totalScore < 100 || sportMin < 30) {
        let missing = [];
        if(p1==0) missing.push("🍎 Food"); if(p2==0) missing.push("🧘 Care"); if(sportMin<30) missing.push("🏃 Sport (30m)"); if(p4==0) missing.push("🌙 Sleep"); if(p5==0) missing.push("💊 Vits");
        dv.paragraph(`> [!caution] **Pending Basics:** ${missing.join(" | ")}`);
    } else if (totalScore >= 150) {
        dv.paragraph(`> [!success] **PHOENIX ASCENSION**\n> Limits broken. Flow state active. You are the fire. 🔥`);
    }
})()

```



```dataviwejs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("z-Data/1-temp/0-cal/1-jou/Vitamin-Tracker.md"); 
    const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
    
    // --- 1. MEAL-ERKENNUNG (Zusammenführung Plan + Spontan) ---
    const tageMap = { "Monday": "mon-meals", "Tuesday": "tue-meals", "Wednesday": "wed-meals", "Thursday": "thu-meals", "Friday": "fri-meals", "Saturday": "sat-meals", "Sunday": "sun-meals" };
    // Erzwingt Englisch, damit "Monday" rauskommt, auch wenn dein System Deutsch ist
const heuteFull = moment(c.file.name, "YYYY-MM-DD").locale('en').format("dddd"); 
    const key = tageMap[heuteFull];
    
    const planned = (plan && plan[key]) ? plan[key] : [];
    const spontaneous = (plan && plan["spont-meals"]) ? plan["spont-meals"] : [];
    const allMeals = [...planned, ...spontaneous];

    // --- 2. BASIS CHECK (Die 5 Säulen) ---
    const p1 = (allMeals.length > 0 || (c.meal && c.meal.length > 2)) ? 1 : 0; 
    const p2 = (String(c["journal-am"]) == "true" || String(c["journal-pm"]) == "true") ? 1 : 0; 
    const sport = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0); 
    const p3 = sport >= 30 ? 1 : 0; 
    const p4 = (Number(c.sleep) || 0) >= 7 ? 1 : 0; 
    const p5 = (v && v.file.tasks && v.file.tasks.filter(t => t.completed).length === v.file.tasks.length) ? 1 : 0; 

    const basisProzent = Math.round(((p1 + p2 + p3 + p4 + p5) / 5) * 100); 

    // --- 3. BONUS (Energie & Stimmung) ---
    let bonus = 0;
    if (Number(c.mood) >= 4) bonus += 10;
    if (Number(c.energy) >= 4) bonus += 10;

    const gesamtProzent = basisProzent + bonus;
    const gefüllt = Math.min(12, Math.floor(gesamtProzent / 10)); 
    let balken = "🌸".repeat(gefüllt) + "🤍".repeat(Math.max(0, 10 - gefüllt));
    
    let status = (basisProzent >= 100 && gesamtProzent >= 120) ? " ⚡ 🐦‍🔥 **PHOENIX**" : (gesamtProzent > 100 ? " ⚡ **OVERCHARGE**" : "");
    dv.paragraph(balken + " **" + gesamtProzent + "% SYNC**" + status); 

    // Feedback-Zeile falls noch was offen ist
    if (basisProzent < 100) {
        let offen = [];
        if(!p1) offen.push("Meal"); if(!p2) offen.push("Journal"); if(!p3) offen.push("Sport"); if(!p4) offen.push("Sleep"); if(!p5) offen.push("Vitamins");
        dv.paragraph("> <small>Open: " + offen.join(", ") + "</small>");
    }
})()

```




```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0-Calendar"');
const config = {
    jou: { suffix: "plm", folder: "0-Calendar/1-Journal", color: "#ff79c6" },
    log: { suffix: "", folder: "0-Calendar/2-Log", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0-Calendar/3-Studylog", color: "#bd93f9" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 10px 0;">`;

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let journalFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    let logFile = allLogs.find(p => p.file.name === dateStr);
    let studyFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));
    
    // VITAL-RADAR DATA
    let moodDisplay = journalFile?.mood ? journalFile.mood : "--";
    let energyDisplay = journalFile?.energy ? journalFile.energy.split(" ")[0] : "";

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 8px; border: ${isToday ? '2px solid #a6e3a1' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary); text-align: center;">
        <div style="font-size: 0.6em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("ddd")}</div>
        <div style="font-size: 0.8em; font-weight: 800; margin-bottom: 8px;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; justify-content: center; gap: 8px; font-size: 1.2em; margin-bottom: 5px;">
            <span title="Journal" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span title="Log" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span title="Study" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
        <!-- VITAL LINE -->
        <div style="font-size: 0.75em; display: flex; flex-direction: column; align-items: center; gap: 1px; color: var(--text-muted);">
            <span>${moodDisplay} <small>mood</small></span>
            <span style="font-size: 0.9em;">${energyDisplay}</span>
        </div>
    </div>`;
}
tableHTML += `</div>`;
dv.el("div", tableHTML);

```


```dataviewjs
// 1. STATE-MANAGEMENT
if (window.nexusOffset === undefined) window.nexusOffset = 0;

const allLogs = dv.pages('"0-Calendar"');
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

// 2. NAVIGATION UI
const navHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevWeek" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal);">⬅️ Zurück</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent);">🔱 NEXUS CHRONOS (Week: ${window.nexusOffset})</b>
    <button id="nextWeek" style="cursor: pointer; background: none; border: 1px solid var(--background-modifier-border); border-radius: 4px; color: var(--text-normal);">Vor ➡️</button>
</div>`;

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

// 3. GENERIERUNG (7 Tage Fokus)
for (let i = 6; i >= 0; i--) {
    let mDate = moment().add(window.nexusOffset, 'weeks').subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.6em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.8em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center; font-size: 1.2em;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
                <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(files.log, config.log.color)}">🌻</span>
                <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <span class="prolog-btn" data-idx="${dayData.length-1}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
                <span class="proto-btn" data-idx="${dayData.length-1}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
                <span class="rev-btn" data-idx="${dayData.length-1}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
            </div>
        </div>
    </div>`;
}

const mainContainer = dv.el("div", navHTML + tableHTML + `</div>`);

// 5. NAVIGATION REFRESH (Ohne dv.view Fehler!)
mainContainer.querySelector("#prevWeek").onclick = () => { 
    window.nexusOffset--; 
    app.commands.executeCommandById("dataview:dataview-force-refresh-views"); 
};
mainContainer.querySelector("#nextWeek").onclick = () => { 
    window.nexusOffset++; 
    app.commands.executeCommandById("dataview:dataview-force-refresh-views"); 
};

// 6. KLICK-HANDLER
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    mainContainer.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```



```dataviewjs
// 1. STATE-MANAGEMENT (Merkt sich, wo wir in der Zeit sind)
if (!window.nexusOffset) window.nexusOffset = 0;

const allLogs = dv.pages('"0-Calendar"');
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

// 2. NAVIGATION BUTTONS
const navHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
    <button id="prevWeek" style="cursor: pointer;">⬅️ Woche zurück</button>
    <b style="font-size: 1.1em; color: var(--interactive-accent);">🔱 NEXUS CHRONOS</b>
    <button id="nextWeek" style="cursor: pointer;">Woche vor ➡️</button>
</div>`;

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

// 3. ZEIT-BERECHNUNG (7 Tage basierend auf Offset)
for (let i = 6; i >= 0; i--) {
    let mDate = moment().add(window.nexusOffset, 'weeks').subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    // 4. DESIGN: ZWEI SPALTEN MODEL (3 links, 3 rechts)
    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.6em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.8em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: center; font-size: 1.3em;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
                <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(files.log, config.log.color)}">🌻</span>
                <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <span class="prolog-btn" data-idx="${dayData.length-1}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
                <span class="proto-btn" data-idx="${dayData.length-1}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
                <span class="rev-btn" data-idx="${dayData.length-1}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
            </div>
        </div>
    </div>`;
}

const mainContainer = dv.el("div", navHTML + tableHTML + `</div>`);

// 5. NAVIGATION LOGIK
mainContainer.querySelector("#prevWeek").onclick = () => { window.nexusOffset--; dv.view(dv.current().file.path); };
mainContainer.querySelector("#nextWeek").onclick = () => { window.nexusOffset++; dv.view(dv.current().file.path); };

// 6. KLICK-HANDLER (Manager-Logik)
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }
    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    mainContainer.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```





```dataviewjs
// 1. WOCHEN-LOGIK (7 Tage bis heute)
const days = 14; 
const allLogs = dv.pages('"0-Calendar"');

// 2. DEINE KONFIGURATION (Alle 6 Kategorien)
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

// 3. GENERIERUNG
for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche Files für alle 6 Typen
    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    // 4. HTML DESIGN (7 Spalten, Emojis in 2 Reihen à 3)
    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.85em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; align-items: center; font-size: 1.2em;">
            <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(files.log, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            <span class="prolog-btn" data-idx="${dayData.length-1}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
            <span class="proto-btn" data-idx="${dayData.length-1}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
            <span class="rev-btn" data-idx="${dayData.length-1}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

// 5. KLICK-HANDLER (Sync mit Templater)
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // Ordner-Bot
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        
        // 🔱 NEXUS-SYNC: Datum an Templater übergeben
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        // Erstellt Datei mit korrektem Namen (verhindert Untitled-Glitch)
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    // Wendet Template nur an, wenn Datei leer ist (verhindert Doppel-Inhalt)
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

// Event-Listener binden
const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    container.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```



```dataviewjs
// 1. WOCHEN-LOGIK (7 Tage bis heute)
const days = 7; 
const allLogs = dv.pages('"0-Calendar"');

// 2. KONFIGURATION (Alle 6 Kategorien - Pfade penibel geprüft)
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

// 3. GENERIERUNG
for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche Files
    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    // 4. HTML DESIGN (6 Emojis in einer vertikalen Spalte)
    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.85em; font-weight: 800; margin: 4px 0 12px 0;">${mDate.format("DD.MM.")}</div>
        
        <!-- Die vertikale Spalte -->
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; font-size: 1.4em;">
            <span class="jou-btn" data-idx="${dayData.length-1}" title="Journal" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${dayData.length-1}" title="Log" style="${getStyle(files.log, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${dayData.length-1}" title="Study" style="${getStyle(files.study, config.study.color)}">🌼</span>
            <span class="prolog-btn" data-idx="${dayData.length-1}" title="Projectlog" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
            <span class="proto-btn" data-idx="${dayData.length-1}" title="Protocol" style="${getStyle(files.proto, config.proto.color)}">📜</span>
            <span class="rev-btn" data-idx="${dayData.length-1}" title="Review" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

// 5. KLICK-HANDLER (Manager-Logik)
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    container.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```


funktioniert:
```dataviewjs
// 1. MONATS-LOGIK
const startOfMonth = moment().startOf('month');
const daysInMonth = moment().daysInMonth();
const allLogs = dv.pages('"0-Calendar"');

// 2. DEINE CONFIG (Erweitert um alle 6)
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">`;
const dayData = [];

for (let i = 0; i < daysInMonth; i++) {
    let mDate = moment(startOfMonth).add(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche Files
    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    // DESIGN: Kompakt & 2 Reihen
    tableHTML += `
    <div style="padding: 5px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 8px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.5em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.7em; font-weight: 800; margin-bottom: 4px;">${mDate.format("DD.")}</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 1em;">
            <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
            <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
            <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

// UNIVERSALER HANDLER
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

// Listener binden
['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(type => {
    container.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});
```



# 📅 Calendar
```dataviewjs
// 1. SETUP (Monats-Logik)
const startOfMonth = moment().startOf('month');
const endOfMonth = moment().endOf('month');
const daysInMonth = moment().daysInMonth();
const allLogs = dv.pages('"0-Calendar"');

// 2. KONFIGURATION (Alle 6 Kategorien)
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prolog", folder: "0-Calendar/4-Projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "proto", folder: "0-Calendar/5-Protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0-Calendar/6-Review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 5px;">`;
const dayData = [];

// 3. GENERIERUNG (Schleife über alle Tage des Monats)
for (let i = 0; i < daysInMonth; i++) {
    let mDate = moment(startOfMonth).add(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche Files für alle 6 Typen
    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    // 4. HTML DESIGN (Kompakt & 2 Reihen Emojis)
    tableHTML += `
    <div style="padding: 6px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 10px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.75em; font-weight: 800; margin: 2px 0 6px 0;">${mDate.format("DD.")}</div>
        
        <!-- Emoji Grid: 2 Reihen à 3 Emojis -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; align-items: center; font-size: 1.1em;">
            <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">🌼</span>
            <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
            <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
            <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

// 5. KLICK-LOGIK (Universell)
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        
        // Datum an Templater übergeben
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

// Event Listener binden
const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    container.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```

funktionierend:
```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0-Calendar"');

const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/0-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/0-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/0-studylog/studylog-", icon: "🌼", color: "#bd93f9" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let journalFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    let logFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.log.suffix));
    let studyFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.85em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; font-size: 1.4em;">
            <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // Ordner-Bot (YYYY/MM)
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        // 🔱 NEXUS-SYNC: Datum an Templater übergeben
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

container.querySelectorAll(".jou-btn").forEach(btn => btn.onclick = () => handleBtnClick("jou", btn));
container.querySelectorAll(".log-btn").forEach(btn => btn.onclick = () => handleBtnClick("log", btn));
container.querySelectorAll(".study-btn").forEach(btn => btn.onclick = () => handleBtnClick("study", btn));
```



```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0-Calendar"');

const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/0-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/0-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/0-studylog/studylog-", icon: "🌼", color: "#bd93f9" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let journalFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    let logFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.log.suffix));
    let studyFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.85em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; font-size: 1.4em;">
            <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
    </div>`;
}

const container = dv.el("div", tableHTML + `</div>`);

const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + " " + cfg.suffix;
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = folderPath + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // Ordner-Bot (YYYY/MM)
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        // 🔱 NEXUS-SYNC: Datum an Templater übergeben
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    await app.workspace.getLeaf('tab').openFile(file);
    const templater = app.plugins.plugins["templater-obsidian"];
    const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (tFile && templater && file.stat.size === 0) {
        await templater.templater.append_template_to_active_file(tFile);
    }
};

container.querySelectorAll(".jou-btn").forEach(btn => btn.onclick = () => handleBtnClick("jou", btn));
container.querySelectorAll(".log-btn").forEach(btn => btn.onclick = () => handleBtnClick("log", btn));
container.querySelectorAll(".study-btn").forEach(btn => btn.onclick = () => handleBtnClick("study", btn));

```
```dataviewjs
for (let i = 1; i <= daysInMonth; i++) {
    const mDate = moment([year, month, i]);
    const dateStr = mDate.format("YYYY-MM-DD");
    const isToday = (dateStr === moment().format("YYYY-MM-DD"));

    const pJou = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    const pLog = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.log.suffix));
    const pStudy = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));
    
    const dayBox = container.createEl("div");
    dayBox.style = `padding: 8px; border: ${isToday ? '2px solid var(--text-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 10px; background-color: var(--background-secondary-alt); text-align: center; min-height: 60px;`;

    // Hilfsfunktion zum Erstellen/Öffnen
    const openOrCreate = async (existingFile, typeCfg) => {
        if (existingFile) {
            app.workspace.getLeaf('tab').openFile(existingFile.file);
        } else {
            const fileName = `${dateStr} ${typeCfg.suffix}`;
            const folderPath = `${typeCfg.folder}/${year}/${mDate.format("MM")}`;
            const fullPath = `${folderPath}/${fileName}.md`;
            
            // Ordner-Check
            let folder = app.vault.getAbstractFileByPath(folderPath);
            if (!folder) await app.vault.createFolder(folderPath);
            
            // File erstellen & Templater triggern
            let newFile = await app.vault.create(fullPath, "");
            const leaf = app.workspace.getLeaf('tab');
            await leaf.openFile(newFile);
            
            const templater = app.plugins.plugins["templater-obsidian"];
            const tFile = app.vault.getAbstractFileByPath(typeCfg.template + ".md");
            if (tFile && templater) {
                // Kurze Pause für den File-Index
                await new Promise(r => setTimeout(r, 200));
                await templater.templater.append_template_to_active_file(tFile);
            }
        }
    };

    // Titel (Zahl)
    dayBox.createEl("div", { text: i }).style = `font-size: 0.9em; font-weight: ${isToday ? '800' : '400'}; margin-bottom: 5px;`;

    // Icon-Container
    const iconCont = dayBox.createEl("div");
    iconCont.style = "display: flex; justify-content: center; gap: 5px; font-size: 1em;";

    // Einzelne Icons mit eigenen Klicks
    const createIcon = (existing, cfg) => {
        const span = iconCont.createEl("span", { text: cfg.icon });
        span.style = `cursor: pointer; opacity: ${existing ? '1' : '0.15'}; transition: transform 0.1s;`;
        span.onmouseenter = () => span.style.transform = "scale(1.3)";
        span.onmouseleave = () => span.style.transform = "scale(1)";
        span.onclick = (e) => {
            e.stopPropagation(); // Verhindert Klick auf die Box
            openOrCreate(existing, cfg);
        };
    };

    createIcon(pJou, config.jou);
    createIcon(pLog, config.log);
    createIcon(pStudy, config.study);
}
```
```dataviewjs
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
let firstDay = new Date(year, month, 1).getDay();
if (firstDay === 0) firstDay = 7; 

const monthName = moment().format("MMMM");

// 🔱 NEXUS CONFIG
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", icon: "🌷", template: "z-Data/1-temp/0-cal/0-jou/dailyjou-" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", icon: "🌻", template: "z-Data/1-temp/0-cal/0-log/dailylog-" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", icon: "🌼", template: "z-Data/1-temp/0-cal/0-studylog/studylog-" }
};

dv.header(2, "📅 " + monthName + " " + year);
const container = dv.el("div", "");
container.style = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 10px 0;";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
weekDays.forEach(day => { 
    container.createEl("div", { text: day }).style = "text-align: center; font-weight: bold; opacity: 0.5; font-size: 0.7em; text-transform: uppercase;"; 
});

for (let i = 1; i < firstDay; i++) { container.createEl("div", ""); }

const allPages = dv.pages('"0-Calendar"'); 

// --- HILFSFUNKTION FÜR DEN ICON-KLICK ---
const openOrCreate = async (existingFile, typeCfg, targetDateStr) => {
    const templaterPlugin = app.plugins.plugins["templater-obsidian"];
    const mDate = moment(targetDateStr);
    
    if (existingFile) {
        app.workspace.getLeaf('tab').openFile(existingFile.file);
    } else {
        // 🔱 FIX: Zugriff auf Templater-Variablen über das Plugin-Objekt
        if (!templaterPlugin.templater.variables) templaterPlugin.templater.variables = {};
        templaterPlugin.templater.variables.targetDate = targetDateStr; 

        const fileName = `${targetDateStr} ${typeCfg.suffix}`;
        const folderPath = `${typeCfg.folder}/${mDate.format("YYYY")}/${mDate.format("MM")}`;
        const fullPath = `${folderPath}/${fileName}.md`;
        
        // Ordner-Bot
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        
        // Erstellen
        let newFile = await app.vault.create(fullPath, "");
        const leaf = app.workspace.getLeaf('tab');
        await leaf.openFile(newFile);
        
        // Template anwenden
        const tFile = app.vault.getAbstractFileByPath(typeCfg.template + ".md");
        if (tFile && templaterPlugin) {
            await new Promise(r => setTimeout(r, 450)); // Stabilisierungs-Pause
            await templaterPlugin.templater.append_template_to_active_file(tFile);
        }
    }
};

for (let i = 1; i <= daysInMonth; i++) {
    const mDate = moment([year, month, i]);
    const dateStr = mDate.format("YYYY-MM-DD");
    const isToday = (dateStr === moment().format("YYYY-MM-DD"));

    const pJou = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.jou.suffix));
    const pLog = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.log.suffix));
    const pStudy = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.study.suffix));
    
    const dayBox = container.createEl("div");
    dayBox.style = `padding: 8px; border: ${isToday ? '2px solid var(--text-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 10px; background-color: var(--background-secondary-alt); text-align: center; min-height: 60px;`;

    dayBox.createEl("div", { text: i }).style = `font-size: 0.9em; font-weight: ${isToday ? '800' : '400'}; margin-bottom: 5px;`;

    const iconCont = dayBox.createEl("div");
    iconCont.style = "display: flex; justify-content: center; gap: 5px; font-size: 1.1em;";

    const addIcon = (existing, cfg) => {
        const span = iconCont.createEl("span", { text: cfg.icon });
        span.style = `cursor: pointer; opacity: ${existing ? '1' : '0.15'}; transition: transform 0.1s;`;
        span.onmouseenter = () => span.style.transform = "scale(1.3)";
        span.onmouseleave = () => span.style.transform = "scale(1)";
        span.onclick = (e) => {
            e.stopPropagation();
            openOrCreate(existing, cfg, dateStr);
        };
    };

    addIcon(pJou, config.jou);
    addIcon(pLog, config.log);
    addIcon(pStudy, config.study);
}
```

```dataviewjs
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
let firstDay = new Date(year, month, 1).getDay();
if (firstDay === 0) firstDay = 7; 

const monthName = moment().format("MMMM");

// 🔱 NEXUS CONFIG (Pfade & Templates)
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", icon: "🌷", template: "z-Data/1-temp/0-cal/0-jou/dailyjou-" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", icon: "🌻", template: "z-Data/1-temp/0-cal/0-log/dailylog-" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", icon: "🌼", template: "z-Data/1-temp/0-cal/0-studylog/studylog-" }
};

dv.header(2, "📅 " + monthName + " " + year);
const container = dv.el("div", "");
container.style = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 10px 0;";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
weekDays.forEach(day => { 
    container.createEl("div", { text: day }).style = "text-align: center; font-weight: bold; opacity: 0.5; font-size: 0.7em; text-transform: uppercase;"; 
});

for (let i = 1; i < firstDay; i++) { container.createEl("div", ""); }

const allPages = dv.pages('"0-Calendar"'); 

// --- HILFSFUNKTION FÜR DEN ICON-KLICK ---
const openOrCreate = async (existingFile, typeCfg, targetDateStr) => {
    const templater = app.plugins.plugins["templater-obsidian"];
    const mDate = moment(targetDateStr);
    
    if (existingFile) {
        app.workspace.getLeaf('tab').openFile(existingFile.file);
    } else {
        // Übergabe des Datums an Templater
        if (!tp.variables) tp.variables = {};
        tp.variables.targetDate = targetDateStr; 

        const fileName = `${targetDateStr} ${typeCfg.suffix}`;
        const folderPath = `${typeCfg.folder}/${mDate.format("YYYY")}/${mDate.format("MM")}`;
        const fullPath = `${folderPath}/${fileName}.md`;
        
        // Ordner-Bot (iterativ)
        let current = "";
        for (const seg of folderPath.split('/')) {
            current = current === "" ? seg : `${current}/${seg}`;
            if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
        }
        
        // Erstellen & Templater triggern
        let newFile = await app.vault.create(fullPath, "");
        const leaf = app.workspace.getLeaf('tab');
        await leaf.openFile(newFile);
        
        const tFile = app.vault.getAbstractFileByPath(typeCfg.template + ".md");
        if (tFile && templater) {
            await new Promise(r => setTimeout(r, 400));
            await templater.templater.append_template_to_active_file(tFile);
        }
    }
};

for (let i = 1; i <= daysInMonth; i++) {
    const mDate = moment([year, month, i]);
    const dateStr = mDate.format("YYYY-MM-DD");
    const isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche über cal-date Property ODER Dateinamen
    const pJou = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.jou.suffix));
    const pLog = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.log.suffix));
    const pStudy = allPages.find(p => (p["cal-date"] === dateStr || p.file.name.includes(dateStr)) && p.file.name.includes(config.study.suffix));
    
    const dayBox = container.createEl("div");
    dayBox.style = `padding: 8px; border: ${isToday ? '2px solid var(--text-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 10px; background-color: var(--background-secondary-alt); text-align: center; min-height: 60px;`;

    // Datum-Zahl
    dayBox.createEl("div", { text: i }).style = `font-size: 0.9em; font-weight: ${isToday ? '800' : '400'}; margin-bottom: 5px;`;

    // Icon-Leiste
    const iconCont = dayBox.createEl("div");
    iconCont.style = "display: flex; justify-content: center; gap: 5px; font-size: 1.1em;";

    const addIcon = (existing, cfg) => {
        const span = iconCont.createEl("span", { text: cfg.icon });
        span.style = `cursor: pointer; opacity: ${existing ? '1' : '0.15'}; transition: transform 0.1s;`;
        span.onmouseenter = () => span.style.transform = "scale(1.3)";
        span.onmouseleave = () => span.style.transform = "scale(1)";
        span.onclick = (e) => {
            e.stopPropagation();
            openOrCreate(existing, cfg, dateStr);
        };
    };

    addIcon(pJou, config.jou);
    addIcon(pLog, config.log);
    addIcon(pStudy, config.study);
}

```

```dataviewjs
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
let firstDay = new Date(year, month, 1).getDay();
if (firstDay === 0) firstDay = 7; 

const monthName = moment().format("MMMM");

// NEXUS CONFIG - Pfade ohne Emojis
const config = {
    jou: { suffix: "jou", folder: "0-Calendar/1-Journal", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "log", folder: "0-Calendar/2-Log", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "study", folder: "0-Calendar/3-Studylog", icon: "🌼", color: "#bd93f9" }
};

dv.header(2, "📅 " + monthName + " " + year);
const container = dv.el("div", "");
container.style = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 10px 0;";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
weekDays.forEach(day => { 
    container.createEl("div", { text: day }).style = "text-align: center; font-weight: bold; opacity: 0.5; font-size: 0.7em; text-transform: uppercase;"; 
});

for (let i = 1; i < firstDay; i++) { container.createEl("div", ""); }

const allPages = dv.pages('"0-Calendar"'); 

for (let i = 1; i <= daysInMonth; i++) {
    const mDate = moment([year, month, i]);
    const dateStr = mDate.format("YYYY-MM-DD");
    const isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche Files für diesen spezifischen Tag "i"
    const pJou = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    const pLog = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.log.suffix));
    const pStudy = allPages.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));
    
    const dayBox = container.createEl("div");
    dayBox.style = `padding: 8px; border: ${isToday ? '2px solid var(--text-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 10px; background-color: var(--background-secondary-alt); text-align: center; cursor: pointer; min-height: 60px; transition: transform 0.1s;`;
    
    // Hover-Effekt
    dayBox.onmouseenter = () => dayBox.style.transform = "scale(1.05)";
    dayBox.onmouseleave = () => dayBox.style.transform = "scale(1)";

    let icons = `<div style="font-size: 0.8em; margin-top: 5px; display: flex; justify-content: center; gap: 3px;">`;
    icons += `<span style="opacity: ${pJou ? '1' : '0.15'}">${config.jou.icon}</span>`;
    icons += `<span style="opacity: ${pLog ? '1' : '0.15'}">${config.log.icon}</span>`;
    icons += `<span style="opacity: ${pStudy ? '1' : '0.15'}">${config.study.icon}</span>`;
    icons += `</div>`;

    dayBox.innerHTML = `<div style="font-size: 0.9em; font-weight: ${isToday ? '800' : '400'}">${i}</div>${icons}`;
    
    // KLICK-LOGIK: Öffnet exakt das Datum des Feldes
    dayBox.onclick = async () => {
        // Wir suchen zuerst das Journal, wenn nicht da, das Log
        let targetPath = pJou ? pJou.file.path : (pLog ? pLog.file.path : null);
        
        if (targetPath) {
            app.workspace.openLinkText(targetPath, "/", true);
        } else {
            // Wenn keine Datei existiert: Erstelle eine im Log-Ordner für DIESEN Tag
            const newFileName = dateStr + " log";
            const folderPath = `${config.log.folder}/${year}/${mDate.format("MM")}`;
            const fullPath = `${folderPath}/${newFileName}.md`;
            
            // Ordner-Check & Create
            if (!app.vault.getAbstractFileByPath(folderPath)) {
                await app.vault.createFolder(folderPath);
            }
            
            let newFile = await app.vault.create(fullPath, "");
            await app.workspace.getLeaf('tab').openFile(newFile);
        }
    };
}
```

![[zData/5desgin_modul/NavigationModul]]

---
```dataviewjs
// Konfiguration
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth(); 
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDay = new Date(year, month, 1).getDay();

// Holt den Monatsnamen automatisch in der Systemsprache (z.B. February oder Februar)
const monthName = moment().format("MMMM");

const config = {
    jou: { suffix: "plm", folder: "0 📅 Calendar/🌷 Journal", template: "z 💾 Data/1 Temp/0 cal/0 jou/dailyjou-", icon: "🌷" },
    log: { suffix: "", folder: "0 📅 Calendar/🌻 Log", template: "z 💾 Data/1 Temp/0 cal/0 log/dailylog-", icon: "🌻" },
    study: { suffix: "pkm", folder: "0 📅 Calendar/🌼 Studylog", template: "z 💾 Data/1 Temp/0 cal/0 studylog/studylog-", icon: "🌼" }
};

dv.header(2, "📅 " + monthName + " " + year);

const container = dv.el("div", "");
container.style.display = "grid";
container.style.gridTemplateColumns = "repeat(7, 1fr)";
container.style.gap = "8px";

// Wochentage automatisch (Mo, Tu, We, Th, Fr, Sa, Su)
const weekDays = moment.weekdaysMin(true); // true = startet mit Montag
weekDays.forEach(day => {
    container.createEl("div", { text: day }).style.textAlign = "center";
});

for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) { container.createEl("div", ""); }

const allPages = dv.pages('"0 📅 Calendar"');

for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    const journalPage = allPages.find(p => p.file.name === dateStr + " " + config.jou.suffix);
    const logPage = allPages.find(p => p.file.name === dateStr);
    const studyPage = allPages.find(p => p.file.name === dateStr + " " + config.study.suffix);
    
    const dayBox = container.createEl("div");
    dayBox.style = "border: 1px solid var(--background-modifier-border); padding: 8px; border-radius: 8px; text-align: center; cursor: pointer; min-height: 55px;";
    
    let icons = `<div style="font-size: 0.65em; margin-top: 4px; display: flex; justify-content: center; gap: 2px;">`;
    icons += journalPage ? `<span>🌷</span>` : `<span style="opacity:0.1">🌷</span>`;
    icons += logPage ? `<span>🌻</span>` : `<span style="opacity:0.1">🌻</span>`;
    icons += studyPage ? `<span>🌼</span>` : `<span style="opacity:0.1">🌼</span>`;
    icons += `</div>`;

    dayBox.innerHTML = `<span style="font-weight: bold; font-size: 0.9em;">${i}</span>${icons}`;
    
    dayBox.onclick = async () => {
        const cfg = config.log; 
        const fileName = dateStr;
        const fullPath = cfg.folder + "/" + fileName + ".md";
        
        let file = app.vault.getAbstractFileByPath(fullPath);
        if (!file) {
            file = await app.vault.create(fullPath, "");
            await new Promise(r => setTimeout(r, 200));
        }
        
        const leaf = app.workspace.getLeaf('tab');
        await leaf.openFile(file);
        
        const templater = app.plugins.plugins["templater-obsidian"];
        const templateFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
        if (templateFile && templater && file.stat.size === 0) {
            await templater.templater.append_template_to_active_file(templateFile);
        }
    };
}

```
---
```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0 📅 Calendar"');

// Konfiguration der Pfade und Namen laut deinem Nexus Guide
const config = {
    jou: { 
        suffix: "plm", 
        folder: "0 📅 Calendar/🌷 Journal", 
        template: "z 💾 Data/1 Temp/0 cal/0 jou/dailyjou-",
        icon: "🌷", color: "#ff79c6" 
    },
    log: { 
        suffix: "", 
        folder: "0 📅 Calendar/🌻 Log", 
        template: "z 💾 Data/1 Temp/0 cal/0 log/dailylog-",
        icon: "🌻", color: "#f1fa8c" 
    },
    study: { 
        suffix: "pkm", 
        folder: "0 📅 Calendar/🌼 Studylog", 
        template: "z 💾 Data/1 Temp/0 cal/0 studylog/studylog-",
        icon: "🌼", color: "#bd93f9" 
    }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let journalFile = allLogs.find(p => p.file.name === dateStr + " " + config.jou.suffix);
    let logFile = allLogs.find(p => p.file.name === dateStr);
    let studyFile = allLogs.find(p => p.file.name === dateStr + " " + config.study.suffix);

    dayData.push({ dateStr, journalFile, logFile, studyFile });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
        <div style="font-size: 0.85em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; font-size: 1.4em;">
            <span class="jou-btn" data-idx="${dayData.length-1}" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span class="log-btn" data-idx="${dayData.length-1}" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
    </div>`;
}

tableHTML += `</div>`;
const container = dv.el("div", tableHTML);

// Event-Listener für Direkterstellung ohne Dashboard-Überschreibung
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    const fileName = data.dateStr + (cfg.suffix ? " " + cfg.suffix : "");
    const fullPath = cfg.folder + "/" + fileName + ".md";

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // SCHRITT 1: Direkt im Zielordner (z.B. 0 📅 Calendar/🌻 Log) leer erstellen
        // Das umgeht die Inbox und den automatischen Metatemp-Trigger dort
        file = await app.vault.create(fullPath, "");
        await new Promise(r => setTimeout(r, 250));
    }

    // SCHRITT 2: In einem neuen Tab öffnen, damit das Dashboard sicher ist
    const leaf = app.workspace.getLeaf('tab');
    await leaf.openFile(file);

    // SCHRITT 3: Template erst im neuen Tab anwenden
    const templater = app.plugins.plugins["templater-obsidian"];
    const templateFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
    
    if (templateFile && templater) {
        // Wendet das spezifische Template (z.B. dailylog-) direkt an
        await templater.templater.append_template_to_active_file(templateFile);
    }
};

container.querySelectorAll(".jou-btn").forEach(btn => btn.onclick = () => handleBtnClick("jou", btn));
container.querySelectorAll(".log-btn").forEach(btn => btn.onclick = () => handleBtnClick("log", btn));
container.querySelectorAll(".study-btn").forEach(btn => btn.onclick = () => handleBtnClick("study", btn));

```




## 🏗️ System Navigation

> [!multi-column]
> 
> > [!heart] 🌸 Selfcare & Mind  
> > _Dein aktueller Fokus in den Areas_
> > 
> > dataview
> > 
> > ```
> > LIST
> > FROM "2 💠 Areas"
> > WHERE contains(archtype, "#2💠/1🌸Selfcare") OR contains(archtype, "#2💠/3🧠Mind")
> > SORT file.mtime DESC
> > LIMIT 3
> > ```
> > 
> > Verwende Code mit Vorsicht.
> 
> > [!zap] 🚧 Active Projects  
> > _Woran du gerade arbeitest_
> > 
> > dataview
> > 
> > ```
> > LIST
> > FROM "3 🚧 Projects"
> > WHERE contains(status, "1⚡active")
> > SORT file.mtime DESC
> > LIMIT 5
> > ```
> > 
> > Verwende Code mit Vorsicht.
> 
> > [!timer] ⏳ Passive / Idea  
> > _Geparkt oder für später_
> > 
> > dataview
> > 
> > ```
> > LIST
> > FROM "3 🚧 Projects"
> > WHERE contains(status, "2⏳passive") OR contains(status, "3☁️idea")
> > SORT file.mtime DESC
> > LIMIT 3
> > ```
> 






```dataviewjs
const days = 14; 
// Wir scannen den gesamten Kalender-Ordner
const allLogs = dv.pages('"0 📅 Calendar"');

const config = {
    jou: { folder: "0 📅 Calendar/🌷 Journal", color: "#ff79c6", icon: "🌷" },
    log: { folder: "0 📅 Calendar/🌻 Log", color: "#f1fa8c", icon: "🌻" },
    study: { folder: "0 📅 Calendar/🌼 Studylog", color: "#bd93f9", icon: "🌼" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 10px 0;">`;

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche nach den Dateien (entweder Name ist das Datum oder cal-date Property passt)
    let journalFile = allLogs.find(p => (p.file.name.includes(dateStr) || p['cal-date'] === dateStr) && p.file.path.includes("Journal"));
    let logFile = allLogs.find(p => (p.file.name === dateStr || p['cal-date'] === dateStr) && p.file.path.includes("Log"));
    let studyFile = allLogs.find(p => (p.file.name.includes(dateStr) || p['cal-date'] === dateStr) && p.file.path.includes("Studylog"));
    
    // Daten für Mood & Energy extrahieren
    let moodDisplay = journalFile?.mood ? journalFile.mood : "--";
    let energyDisplay = journalFile?.energy ? journalFile.energy : "";

    // Hilfsfunktion für klickbare Icons
    const renderIcon = (file, cfg) => {
        const exists = !!file;
        const style = exists 
            ? `opacity: 1; filter: drop-shadow(0 0 2px ${cfg.color}); cursor: pointer; text-decoration: none;` 
            : `opacity: 0.15; filter: grayscale(100%); pointer-events: none;`;
        
        if (exists) {
            // Erstellt einen echten Obsidian-Link um das Icon
            return `<a class="internal-link" href="${file.file.path}" style="${style}">${cfg.icon}</a>`;
        } else {
            return `<span style="${style}">${cfg.icon}</span>`;
        }
    };

    tableHTML += `
    <div style="padding: 8px; border: ${isToday ? '2px solid #a6e3a1' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary); text-align: center;">
        <div style="font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("ddd")}</div>
        <div style="font-size: 0.75em; font-weight: 800; margin-bottom: 8px;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; justify-content: center; gap: 6px; font-size: 1.1em; margin-bottom: 5px;">
            ${renderIcon(journalFile, config.jou)}
            ${renderIcon(logFile, config.log)}
            ${renderIcon(studyFile, config.study)}
        </div>
        <!-- VITAL LINE -->
        <div style="font-size: 0.65em; display: flex; flex-direction: column; align-items: center; line-height: 1.2; color: var(--text-muted);">
            <span style="color: var(--text-normal);">${moodDisplay}</span>
            <span style="font-size: 0.85em; opacity: 0.8;">${energyDisplay}</span>
        </div>
    </div>`;
}
tableHTML += `</div>`;
dv.el("div", tableHTML);

```

```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0 📅 Calendar"');
const config = {
    jou: { suffix: "plm", folder: "0 📅 Calendar/🌷 Journal", color: "#ff79c6" },
    log: { suffix: "", folder: "0 📅 Calendar/🌻 Log", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0 📅 Calendar/🌼 Studylog", color: "#bd93f9" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 10px 0;">`;

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let journalFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    let logFile = allLogs.find(p => p.file.name === dateStr);
    let studyFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));
    
    // VITAL-RADAR DATA
    let moodDisplay = journalFile?.mood ? journalFile.mood : "--";
    let energyDisplay = journalFile?.energy ? journalFile.energy.split(" ")[0] : "";

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
        : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 8px; border: ${isToday ? '2px solid #a6e3a1' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary); text-align: center;">
        <div style="font-size: 0.6em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("ddd")}</div>
        <div style="font-size: 0.8em; font-weight: 800; margin-bottom: 8px;">${mDate.format("DD.MM.")}</div>
        <div style="display: flex; justify-content: center; gap: 8px; font-size: 1.2em; margin-bottom: 5px;">
            <span title="Journal" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span title="Log" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span title="Study" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
        <!-- VITAL LINE -->
        <div style="font-size: 0.75em; display: flex; flex-direction: column; align-items: center; gap: 1px; color: var(--text-muted);">
            <span>${moodDisplay} <small>mood</small></span>
            <span style="font-size: 0.9em;">${energyDisplay}</span>
        </div>
    </div>`;
}
tableHTML += `</div>`;
dv.el("div", tableHTML);

```




```dataviewjs
const days = 14; 
const allLogs = dv.pages('"0 📅 Calendar"');

// Konfiguration passend zu deiner Ordnerstruktur
const config = {
    jou: { suffix: "plm", folder: "0 📅 Calendar/🌷 Journal", color: "#ff79c6" },
    log: { suffix: "", folder: "0 📅 Calendar/🌻 Log", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0 📅 Calendar/🌼 Studylog", color: "#bd93f9" }
};

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    // Suche die Dateien
    let journalFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.jou.suffix));
    let logFile = allLogs.find(p => p.file.name === dateStr);
    let studyFile = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config.study.suffix));

    // VITAL-RADAR: Daten aus deinen Properties ziehen
    let moodDisplay = journalFile?.mood ? journalFile.mood : "";
    let energyDisplay = journalFile?.energy ? journalFile.energy.split(" ")[0] : ""; // Nur das Emoji 🔴/🟡/🟢
    let sleepDisplay = journalFile?.sleep ? `💤${journalFile.sleep}h` : "";

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 2px ${color});` 
        : `opacity: 0.15; filter: grayscale(100%);`;

    tableHTML += `
    <div style="padding: 8px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary); text-align: center; min-height: 100px;">
        <div style="font-size: 0.6em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("ddd")}</div>
        <div style="font-size: 0.8em; font-weight: 800; margin-bottom: 8px;">${mDate.format("DD.MM.")}</div>
        
        <div style="display: flex; justify-content: center; gap: 6px; font-size: 1.1em; margin-bottom: 6px;">
            <span title="Journal" style="${getStyle(journalFile, config.jou.color)}">🌷</span>
            <span title="Log" style="${getStyle(logFile, config.log.color)}">🌻</span>
            <span title="Study" style="${getStyle(studyFile, config.study.color)}">🌼</span>
        </div>
        
        <div style="font-size: 0.8em; display: flex; flex-direction: column; gap: 2px; line-height: 1.1;">
            <span>${moodDisplay} ${energyDisplay}</span>
            <span style="font-size: 0.7em; color: var(--text-faint);">${sleepDisplay}</span>
        </div>
    </div>`;
}

tableHTML += `</div>`;
dv.el("div", tableHTML);
```






```dataviewjs
const days = 14; 
const allPages = dv.pages('!"z 💾 Data"'); 
const frogCount = dv.pages('"4 🛠️ Tasks" OR "3 🚧 Projects"').where(p => p.priority == "🔴" && !p.completed).length;

const config = {
    stars: ["#1✨/1🌟purpose", "#1✨/2🧭vision", "#1✨/3🎯goals"],
    areas: ["#2💠/1🌸Selfcare", "#2💠/3🧠Mind", "#2💠/2🦄Relationship", "#2💠/4🧩Organize", "#2💠/5🎨Creativity", "#2💠/6🚵🏽Activity", "#2💠/7🕹️Entertain"]
};

let tableHTML = `<div style="margin-bottom: 10px; font-weight: bold; font-size: 0.9em; color: var(--text-accent);">🔱 STATUS: 🐸 ${frogCount} Frogs pending</div>`;
tableHTML += "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 5px 0;'>";

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    
    let dayPages = allPages.filter(p => {
        let d = p['cal-date'] || (p.file.cday ? moment(p.file.cday.toString()).format("YYYY-MM-DD") : null);
        return d === dateStr;
    });

    let journal = dayPages.find(p => p.file.path.includes("Journal"));
    let energyEmoji = journal?.energy ? journal.energy.split(" ")[0] : "";

    const getIcon = (icon, exists) => {
        const op = exists ? "1" : "0.12";
        return `<span style='opacity: ${op}; margin: 0 1px;'>${icon}</span>`;
    };

    tableHTML += `<div style='padding: 6px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 8px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: bold;'>${mDate.format("DD.MM.")}</div>`;
    
    // ENERGY DOT (Vital-Radar Ersatz)
    tableHTML += `<div style='font-size: 0.7em; height: 1.2em; margin-top: 2px;'>${energyEmoji}</div>`;
    
    // ROW 1: CALENDAR
    tableHTML += "<div style='font-size: 1.1em; line-height: 1.2;'>";
    tableHTML += getIcon("🌷", journal);
    tableHTML += getIcon("🌻", dayPages.some(p => p.file.path.includes("Log") && !p.file.path.includes("Study")));
    tableHTML += getIcon("🌼", dayPages.some(p => p.file.path.includes("Studylog")));
    tableHTML += "</div>";

    // ROW 2: STARS & AREAS (Kombiniert für Platz)
    tableHTML += "<div style='font-size: 0.8em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += ["🌟", "🎯"].map((icon, idx) => getIcon(icon, dayPages.some(p => dv.array(p.file.tags || []).some(t => t.includes(config.stars[idx+1]))))).join("");
    tableHTML += "</div>";

    // ROW 3: PROJECTS & NOTES
    tableHTML += "<div style='font-size: 0.9em; line-height: 1.2; margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>";
    tableHTML += getIcon("🚧", dayPages.some(p => dv.array(p.arch || []).includes("#3🚧")));
    tableHTML += getIcon("✏️", dayPages.some(p => dv.array(p.arch || []).includes("#5✏")));
    tableHTML += "</div></div>";
}

tableHTML += "</div>";
dv.el("div", tableHTML);

```


```dataviewjs
const days = 14; 
const allPages = dv.pages('!"z 💾 Data"'); 
const frogCount = dv.pages('"4 🛠️ Tasks" OR "3 🚧 Projects"').where(p => p.priority == "🔴" && !p.completed).length;

let tableHTML = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 5px;">
    <span style="font-weight: bold; font-size: 1.1em; color: var(--text-accent);">🔱 NEXUS STATUS</span>
    <span style="font-size: 0.9em; background: var(--background-secondary-alt); padding: 4px 10px; border-radius: 20px; border: 1px solid #f38ba8;">🐸 ${frogCount} Frogs pending</span>
</div>`;

tableHTML += "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;'>";

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    
    let dayPages = allPages.filter(p => {
        let d = p['cal-date'] || (p.file.cday ? moment(p.file.cday.toString()).format("YYYY-MM-DD") : null);
        return d === dateStr;
    });

    let journal = dayPages.find(p => p.file.path.includes("Journal"));
    let energyEmoji = journal?.energy ? journal.energy.split(" ")[0] : "▫️";
    let moodEmoji = journal?.mood ? journal.mood : "";

    const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.15"}; margin: 0 1px;'>${icon}</span>`;

    tableHTML += `<div style='padding: 8px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: 800;'>${mDate.format("DD.MM.")}</div>`;
    
    // VITAL LINE (Energy & Mood)
    tableHTML += `<div style='font-size: 0.8em; margin: 4px 0;'>${energyEmoji} ${moodEmoji}</div>`;
    
    // ARCH DOTS (Die Quintessenz deiner Arbeit)
    tableHTML += "<div style='font-size: 1.1em; line-height: 1.2; display: flex; justify-content: center; gap: 2px;'>";
    tableHTML += getIcon("🌷", journal);
    tableHTML += getIcon("🌻", dayPages.some(p => p.file.path.includes("Log")));
    tableHTML += "</div>";

    tableHTML += "<div style='font-size: 0.9em; margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>";
    tableHTML += getIcon("🎯", dayPages.some(p => dv.array(p.arch || []).includes("#1✨")));
    tableHTML += getIcon("🚧", dayPages.some(p => dv.array(p.arch || []).includes("#3🚧")));
    tableHTML += getIcon("✏️", dayPages.some(p => dv.array(p.arch || []).includes("#5✏")));
    tableHTML += "</div></div>";
}

tableHTML += "</div>";
dv.el("div", tableHTML);

```


```dataviewjs
const days = 14; 
const allPages = dv.pages('!"z 💾 Data"'); 
const frogCount = dv.pages('"4 🛠️ Tasks" OR "3 🚧 Projects"').where(p => p.priority == "🔴" && !p.completed).length;

const config = {
    stars: ["#1✨/1🌟purpose", "#1✨/2🧭vision", "#1✨/3🎯goals"],
    areas: ["#2💠/1🌸Selfcare", "#2💠/3🧠Mind", "#2💠/2🦄Relationship", "#2💠/4🧩Organize", "#2💠/5🎨Creativity", "#2💠/6🚵🏽Activity", "#2💠/7🕹️Entertain"]
};

let tableHTML = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 5px;">
    <span style="font-weight: bold; font-size: 1.1em; color: var(--text-accent);">🔱 NEXUS COMMAND CENTER</span>
    <span style="font-size: 0.9em; background: var(--background-secondary-alt); padding: 4px 10px; border-radius: 20px; border: 1px solid #f38ba8;">🐸 ${frogCount} Frogs pending</span>
</div>`;

tableHTML += "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;'>";

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    
    let dayPages = allPages.filter(p => {
        let d = p['cal-date'] || (p.file.cday ? moment(p.file.cday.toString()).format("YYYY-MM-DD") : null);
        return d === dateStr;
    });

    let journal = dayPages.find(p => p.file.path.includes("Journal"));
    let energyEmoji = journal?.energy ? journal.energy.split(" ")[0] : "▫️";
    let moodEmoji = journal?.mood ? journal.mood : "";

    const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.15"}; filter: ${exists ? "none" : "grayscale(100%)"}; margin: 0 1px;'>${icon}</span>`;

    tableHTML += `<div style='padding: 8px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: 800;'>${mDate.format("DD.MM.")}</div>`;
    
    // VITAL LINE (Energy & Mood)
    tableHTML += `<div style='font-size: 0.85em; margin: 4px 0;'>${energyEmoji} ${moodEmoji}</div>`;
    
    // ROW 1: CALENDAR (🌷🌻🌼)
    tableHTML += "<div style='font-size: 1.1em; line-height: 1.2;'>";
    tableHTML += getIcon("🌷", journal);
    tableHTML += getIcon("🌻", dayPages.some(p => p.file.path.includes("Log") && !p.file.path.includes("Study")));
    tableHTML += getIcon("🌼", dayPages.some(p => p.file.path.includes("Studylog")));
    tableHTML += "</div>";

    // ROW 2: STARS (🌟🧭🎯)
    tableHTML += "<div style='font-size: 0.85em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += ["🌟", "🧭", "🎯"].map((icon, idx) => getIcon(icon, dayPages.some(p => dv.array(p.file.tags || []).some(t => t.includes(config.stars[idx]))))).join("");
    tableHTML += "</div>";

    // ROW 3: AREAS (🌸🧠🦄🧩🎨🚵🏽🕹️)
    tableHTML += "<div style='font-size: 0.75em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += ["🌸", "🧠", "🦄", "🧩", "🎨", "🚵🏽", "🕹️"].map((icon, idx) => getIcon(icon, dayPages.some(p => dv.array(p.file.tags || []).some(t => t.includes(config.areas[idx]))))).join("");
    tableHTML += "</div>";

    // ROW 4: ACTION (🚧🛠️✏️)
    tableHTML += "<div style='font-size: 1em; line-height: 1.2; margin-top: 6px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>";
    tableHTML += getIcon("🚧", dayPages.some(p => dv.array(p.arch || []).includes("#3🚧")));
    tableHTML += getIcon("🛠️", dayPages.some(p => dv.array(p.arch || []).includes("#4🛠️")));
    tableHTML += getIcon("✏️", dayPages.some(p => dv.array(p.arch || []).includes("#5✏")));
    tableHTML += "</div></div>";
}

tableHTML += "</div>";
dv.el("div", tableHTML);

```







```dataviewjs
const days = 14; 
const allPages = dv.pages('!"z 💾 Data"'); 

const getNoteDate = (p) => {
    if (p.file.name.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(p.file.name)) {
        return p.file.name.substring(0, 10);
    }
    if (p['cal-date']) return String(p['cal-date']);
    return null;
};

let tableHTML = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;'>";

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    let dayPages = allPages.filter(p => getNoteDate(p) === dateStr);

    const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.15"}; filter: ${exists ? "none" : "grayscale(100%)"}; margin: 0 1px;'>${icon}</span>`;
    
    const hasTag = (tag) => dayPages.some(p => {
        const tags = dv.array(p.archtype || p.arch || []);
        return tags.some(t => String(t).toLowerCase().includes(tag.toLowerCase()));
    });

    tableHTML += `<div style='padding: 8px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted); text-transform: uppercase;'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: 800; margin-bottom: 5px;'>${mDate.format("DD.MM.")}</div>`;
    
    // ROW 1: CALENDAR
    tableHTML += "<div style='font-size: 1.1em; line-height: 1.2;'>";
    tableHTML += getIcon("🌷", hasTag("journal"));
    tableHTML += getIcon("🌻", hasTag("log") && !hasTag("studylog"));
    tableHTML += getIcon("🌼", hasTag("studylog"));
    tableHTML += "</div>";

    // ROW 2: STARS
    tableHTML += "<div style='font-size: 0.85em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += getIcon("🌟", hasTag("purpose"));
    tableHTML += getIcon("🧭", hasTag("vision"));
    tableHTML += getIcon("🎯", hasTag("goals"));
    tableHTML += "</div>";

    // ROW 3: ALL 7 AREAS (Vollständig)
    tableHTML += "<div style='font-size: 0.7em; line-height: 1.1; margin-top: 4px; display: flex; justify-content: center; flex-wrap: wrap;'>";
    tableHTML += getIcon("🌸", hasTag("selfcare"));
    tableHTML += getIcon("🧠", hasTag("mind"));
    tableHTML += getIcon("🦄", hasTag("relationship"));
    tableHTML += getIcon("🧩", hasTag("organize"));
    tableHTML += getIcon("🎨", hasTag("creativity"));
    tableHTML += getIcon("🚵🏽", hasTag("activity"));
    tableHTML += getIcon("🕹️", hasTag("entertain"));
    tableHTML += "</div>";

    // ROW 4: ACTION
    tableHTML += "<div style='font-size: 1em; line-height: 1.2; margin-top: 6px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>";
    tableHTML += getIcon("🚧", hasTag("#3🚧"));
    tableHTML += getIcon("🛠️", hasTag("#4🛠️"));
    tableHTML += getIcon("✏️", hasTag("#5✏"));
    tableHTML += "</div></div>";
}

tableHTML += "</div>";
dv.el("div", tableHTML);

```



```dataviewjs
const days = 14;
const allPages = dv.pages('!"z 💾 Data"'); 

// 1. FROG COUNT (Priority 🔴)
const frogCount = dv.pages('"4 🛠️ Tasks" OR "3 🚧 Projects"').where(p => {
    const prio = p.priority;
    if (!prio) return false;
    return Array.isArray(prio) ? prio.includes("🔴") : String(prio).includes("🔴");
}).where(p => !p.completed).length;

let tableHTML = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 5px;">
    <span style="font-weight: bold; font-size: 1.1em; color: var(--text-accent);">🔱 NEXUS STATUS</span>
    <span style="font-size: 0.9em; background: var(--background-secondary-alt); padding: 4px 10px; border-radius: 20px; border: 1px solid #f38ba8;">🐸 ${frogCount} Frogs pending</span>
</div>`;

tableHTML += "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;'>";

// Hilfsfunktion für peniblen YAML-Check
const checkYaml = (page, field, value) => {
    if (!page || !page[field]) return false;
    const val = page[field];
    if (Array.isArray(val)) return val.some(v => String(v).toLowerCase() === value.toLowerCase());
    return String(val).toLowerCase() === value.toLowerCase();
};

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    
    let dayPages = allPages.filter(p => {
        let d = p['cal-date'] || (p.file.name.length >= 10 ? p.file.name.substring(0,10) : null);
        return d === dateStr;
    });

    let journal = dayPages.find(p => checkYaml(p, 'archtype', '#0📅/🌷journal'));
    let energy = journal && journal.energy ? String(journal.energy).split(",")[0] : "▫️";
    let mood = journal && journal.mood ? journal.mood : "";

    const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.12"}; filter: ${exists ? "none" : "grayscale(100%)"};'>${icon}</span>`;

    tableHTML += `<div style='padding: 8px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted);'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: 800;'>${mDate.format("DD.MM.")}</div>`;
    tableHTML += `<div style='font-size: 0.85em; margin: 4px 0;'>${energy} ${mood}</div>`;
    
    // ROW 1: CALENDAR
    tableHTML += "<div style='font-size: 1.1em; line-height: 1.2;'>";
    tableHTML += getIcon("🌷", journal);
    tableHTML += getIcon("🌻", dayPages.some(p => checkYaml(p, 'archtype', '#0📅/🌻log')));
    tableHTML += getIcon("🌼", dayPages.some(p => checkYaml(p, 'archtype', '#0📅/🌼studylog')));
    tableHTML += "</div>";

    // ROW 2: STARS
    tableHTML += "<div style='font-size: 0.85em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += getIcon("🌟", dayPages.some(p => checkYaml(p, 'archtype', '#1✨/1🌟purpose')));
    tableHTML += getIcon("🧭", dayPages.some(p => checkYaml(p, 'archtype', '#1✨/2🧭vision')));
    tableHTML += getIcon("🎯", dayPages.some(p => checkYaml(p, 'archtype', '#1✨/3🎯goals')));
    tableHTML += "</div>";

    // ROW 3: AREAS (Penibel kleingeschrieben wie in deinem YAML)
    tableHTML += "<div style='font-size: 0.75em; line-height: 1.1; margin-top: 4px;'>";
    tableHTML += getIcon("🌸", dayPages.some(p => checkYaml(p, 'archtype', '#2💠/1🌸selfcare')));
    tableHTML += getIcon("🧠", dayPages.some(p => checkYaml(p, 'archtype', '#2💠/3🧠mind')));
    tableHTML += getIcon("🦄", dayPages.some(p => checkYaml(p, 'archtype', '#2💠/2🦄relationship')));
    tableHTML += "</div>";

    // ROW 4: ACTION (ARCH YAML)
    tableHTML += "<div style='font-size: 1em; line-height: 1.2; margin-top: 6px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>";
    tableHTML += getIcon("🚧", dayPages.some(p => checkYaml(p, 'arch', '#3🚧')));
    tableHTML += getIcon("🛠️", dayPages.some(p => checkYaml(p, 'arch', '#4🛠️')));
    tableHTML += getIcon("✏️", dayPages.some(p => checkYaml(p, 'arch', '#5✏')));
    tableHTML += "</div></div>";
}

tableHTML += "</div>";
dv.el("div", tableHTML);

```







hybri


```dataviewjs
const days = 14; 
const allPages = dv.pages('!"z 💾 Data"'); 

// PENIBLER HYBRID-CHECK (Name für Logs, ctime für den Rest)
const getNoteDate = (p) => {
    if (p.file.path.includes("0 📅 Calendar")) {
        if (/^\d{4}-\d{2}-\d{2}/.test(p.file.name)) return p.file.name.substring(0, 10);
        if (p['cal-date']) return String(p['cal-date']).substring(0, 10);
    }
    return moment(p.file.cday.toString()).format("YYYY-MM-DD");
};

const checkYaml = (p, field, value) => {
    if (!p || !p[field]) return false;
    const val = p[field];
    return Array.isArray(val) ? val.some(v => String(v).toLowerCase().includes(value.toLowerCase())) : String(val).toLowerCase().includes(value.toLowerCase());
};

let tableHTML = "<div style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;'>";

for (let i = days - 1; i >= 0; i--) {
    let mDate = moment().subtract(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));
    let dayPages = allPages.filter(p => getNoteDate(p) === dateStr);

    const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.12"}; filter: ${exists ? "none" : "grayscale(100%)"}; margin: 0 1px;'>${icon}</span>`;

    tableHTML += `<div style='padding: 8px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
    tableHTML += `<div style='font-size: 0.55em; color: var(--text-muted);'>${mDate.format("ddd")}</div>`;
    tableHTML += `<div style='font-size: 0.8em; font-weight: 800;'>${mDate.format("DD.MM.")}</div>`;
    
    // ROW 1: CALENDAR
    tableHTML += "<div>" + getIcon("🌷", dayPages.find(p => checkYaml(p, 'archtype', 'journal'))) + getIcon("🌻", dayPages.some(p => checkYaml(p, 'archtype', 'log') && !checkYaml(p, 'archtype', 'studylog'))) + getIcon("🌼", dayPages.some(p => checkYaml(p, 'archtype', 'studylog'))) + "</div>";
    // ROW 2: STARS
    tableHTML += "<div>" + getIcon("🌟", dayPages.some(p => checkYaml(p, 'archtype', 'purpose'))) + getIcon("🧭", dayPages.some(p => checkYaml(p, 'archtype', 'vision'))) + getIcon("🎯", dayPages.some(p => checkYaml(p, 'archtype', 'goals'))) + "</div>";
    // ROW 3: AREAS
    tableHTML += "<div style='font-size: 0.75em;'>" + ["🌸","🧠","🦄","🧩","🎨","🚵🏽","🕹️"].map(icon => getIcon(icon, dayPages.some(p => checkYaml(p, 'archtype', icon)))).join("") + "</div>";
    // ROW 4: ACTION
    tableHTML += "<div style='margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>" + getIcon("🚧", dayPages.some(p => checkYaml(p, 'arch', '#3🚧'))) + getIcon("🛠️", dayPages.some(p => checkYaml(p, 'arch', '#4🛠️'))) + getIcon("✏️", dayPages.some(p => checkYaml(p, 'arch', '#5✏'))) + "</div>";
    tableHTML += "</div>";
}
tableHTML += "</div>";
dv.el("div", tableHTML);

```
