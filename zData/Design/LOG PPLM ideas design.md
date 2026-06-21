

# ⚜️🔱⚡ 2026-03-14 ⚡🔱⚜️

```dataviewjs
// 1. STATE-MANAGEMENT
if (window.nexusOffset === undefined) window.nexusOffset = 0;

const allLogs = dv.pages('"0_Calendar"');
const config = {
    jou: { suffix: "plm", folder: "0_Calendar/1_Logs", template: "zData/1temp/0cal/dailyplm", icon: "🌷", color: "#ff79c6" },
    log: { suffix: "ppm", folder: "0_Calendar/1_Logs", template: "zData/1temp/0cal/dailyppm", icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "pkm", folder: "0_Calendar/1_Logs", template: "zData/1temp/0cal/dailypkm", icon: "🌼", color: "#bd93f9" },
    prolog: { suffix: "prjlog", folder: "0_Calendar/2_Projectlogs", template: "zData/1temp/0cal/projectlog", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "prtcl", folder: "0_Calendar/3_Protocols", template: "zData/1temp/0cal/protocol", icon: "📜", color: "#8be9fd" },
    rev: { suffix: "rev", folder: "0_Calendar/4_Reviews", template: "zData/1temp/0cal/revweekly", icon: "🛰️", color: "#50fa7b" }
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

// 6. NEXUS-OPTIMIERTER KLICK-HANDLER
const handleBtnClick = async (type, btn) => {
    const data = dayData[btn.getAttribute('data-idx')];
    const cfg = config[type];
    
    // 1. PFAD BAUEN
    const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
    const fullPath = `${folderPath}/${data.dateStr} ${cfg.suffix}.md`;

    let file = app.vault.getAbstractFileByPath(fullPath);
    
    if (!file) {
        // A: LEERE DATEI ERSTELLEN
        file = await app.vault.create(fullPath, "");
        
        // B: DATEI ÖFFNEN (Muss aktiv sein!)
        await app.workspace.getLeaf('tab').openFile(file);
        
        // C: TEMPLATER-PLUGINS LADEN
        const tPlugin = app.plugins.plugins["templater-obsidian"];
        
        // D: VARIABLEN FÜTTERN (Damit das Template das Datum kennt)
        if (!tPlugin.templater.variables) tPlugin.templater.variables = {};
        tPlugin.templater.variables.targetDate = data.dateStr;

        // E: DAS SPEZIFISCHE TEMPLATE LADEN (z.B. dailyplm.md)
        // Wir nehmen den Pfad aus deinem 'config' Objekt oben
        const templateFile = app.vault.getAbstractFileByPath(cfg.template + ".md");

        if (templateFile) {
            // KURZE PAUSE (Ganz wichtig für Obsidian!)
            await new Promise(r => setTimeout(r, 200));
            
            // 🚀 DER ZÜNDFUNKE: Template auf die aktive Datei anwenden
            await tPlugin.templater.append_template_to_active_file(templateFile);
        } else {
            new Notice("❌ Template nicht gefunden: " + cfg.template);
        }
        
    } else {
        // Falls Datei existiert: Einfach öffnen
        await app.workspace.getLeaf('tab').openFile(file);
    }
};


const types = ['jou', 'log', 'study', 'prolog', 'proto', 'rev'];
types.forEach(type => {
    mainContainer.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
});

```


## Untitled 4



**Selfcare:** [[0_Calendar/1_Logs/2026/03/2026-03-14 plm|🌷 Go to today's Journal (PLM)]]
**Knowledge:** [[0_Calendar/1_Logs/2026/03/2026-03-14 pkm|🌼 Go to today's Study-Log (PKM)]]

---

> [!summary] 🎯 Consilium diurnum (Strategie)
> > [!multi-column] 
> > > [!blank]
> > > **Strategie & Fokus**
> > > 
> > > **Fokus:** `INPUT[text:focus]`
> > > 
> > >**Aim I:** `INPUT[text:aim1]`
> > >
> > >**Aim II:** `INPUT[text:aim2]`
> > >
> > >**Aim III:** `INPUT[text:aim3]`
> > 
> > > [!blank] 
> > > **6 Maintasks (Operative Ebene)**
> > > 
> > > 1. `INPUT[text:maintask1]`
> > > 
> > > 2. `INPUT[text:maintask2]`
> > >  
> > > 3. `INPUT[text:maintask3]`
> > >  
> > > 4. `INPUT[text:maintask4]`
> > >  
> > > 5. `INPUT[text:maintask5]`
> > >  
> > > 6. `INPUT[text:maintask6]`
> 

## Sidequest /Braindump
- 
> [!multi-column]
> > [!log|wide-0]
> > ### ⏳ Zeit-Matrix
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0]; 
> > let items = [];
> > 
> > dv.pages('"4_Tasks"').forEach(p => {
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, time: String(p.due || p.do), icon: p.banner_icon || "📝" });
> >     }
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && (String(t.due).includes(logDate) || String(t.do).includes(logDate))).forEach(t => {
> >             items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), time: String(t.due || t.do), icon: "✅" });
> >         });
> >     }
> > });
> > 
> > const timedRows = hours.map(h => [
> >    `**${h}:00**`, 
> >    items.filter(i => i.time.includes('T' + h + ':')).map(i => `${i.icon} ${i.link}`).join('<br>')
> > ]);
> > dv.table(['Time', 'Tasks'], timedRows);
> > ```
>
> > [!todo|wide-5]
> > ### 🎯 Management & Fokus (Energy: <%- energy %>)
> > ```dataviewjs
> > // 1. BASIS-DATEN (Einmalig beim Laden)
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> > const today = moment(logDate);
> > const nextWeek = moment(logDate).add(7, 'days');
> > const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> > 
> > // 2. SAMMLUNG (Optimierte Schleife)
> > let allItems = [];
> > const sources = dv.pages('"4_Tasks" or #4task');
> > 
> > // Tasks & Pages kombinieren
> > sources.file.tasks.where(t => !t.completed).forEach(t => {
> >     allItems.push({ text: t.text, date: t.due || t.do, priority: t.priority || "0", link: dv.sectionLink(t.path, t.section.subpath, false, t.text), isTask: true });
> > });
> > sources.where(p => (p.due || p.do) && !p.completed).forEach(p => {
> >     allItems.push({ text: p.file.name, date: p.due || p.do, priority: p.priority || p.prio || "0", link: p.file.link, isTask: false });
> > });
> > 
> > // 3. FILTER
> > const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
> > const todayItems = allItems.filter(t => String(t.date).includes(logDate));
> > const radar = allItems.filter(t => {
> >     const d = moment(String(t.date));
> >     return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day');
> > });
> > 
> > // 4. RENDERING (Als einfache Liste)
> > const renderList = (items, title, color) => {
> >     dv.header(4, `${color} ${title}`);
> >     if (items.length === 0) {
> >         dv.paragraph("_Alles erledigt!_");
> >     } else {
> >         items.forEach(t => {
> >             dv.paragraph(`- [ ] ${getPrioIcon(t.priority)} ${t.link}`);
> >         });
> >     }
> > };
> > 
> > renderList(overdue, "Overdue", "⚠️");
> > renderList(todayItems, "Today", "⚡");
> > renderList(radar, "Radar", "📅");
> > ```

```dataviewjs
// 1. DUAL-SECTION RENDERING: Nexus-Matrix & Fokus-Liste
let hubContent = "> [!multi-column]\n";

// --- LEFT SIDE: NEXUS-MATRIX ---
// (Your existing Nexus Matrix logic remains here, rendered into the left column)
hubContent += "> > ⏳ **Zeit-Matrix**\n> > (Matrix rendered via your existing logic...)\n>\n";

// --- RIGHT SIDE: MANAGEMENT & FOKUS (The filtered version) ---
hubContent += "> > 🎯 **Management & Fokus**\n";

const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
const today = moment(logDate);
const nextWeek = moment(logDate).add(7, 'days');
const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");

// Strictly target files with arch: #4task metadata
let allItems = [];
dv.pages().where(p => p.arch && String(p.arch).includes("#4task") && !p.completed).forEach(p => {
    allItems.push({
        text: p.file.name,
        date: p.due || p.do,
        priority: p.priority || p.prio || "0",
        link: p.file.link
    });
});

const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
const focus = allItems.filter(t => String(t.date).includes(logDate));
const radar = allItems.filter(t => { 
    const d = moment(String(t.date)); 
    return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day'); 
});

// Build the right-side list
const format = (t) => `- [ ] ${getPrioIcon(t.priority)} ${t.link}`;
hubContent += "> > \n> > ⚠️ **Overdue**\n> > " + (overdue.length ? overdue.map(t => format(t)).join("\n> > ") : "_Clear!_") + "\n>\n";
hubContent += "> > ⚡ **Today**\n> > " + (focus.length ? focus.map(t => format(t)).join("\n> > ") : "_All done!_") + "\n>\n";
hubContent += "> > 📅 **Radar**\n> > " + (radar.length ? radar.map(t => format(t)).join("\n> > ") : "_Nothing._");

dv.paragraph(hubContent);
```



> [!multi-column]
> > [!log|wide-0]
> > ### ⏳ Zeit-Matrix
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0]; 
> > 
> > let items = [];
> > 
> > // 1. DATEIEN SAMMELN (Due/Do in YAML)
> > dv.pages('"4_Tasks"').forEach(p => {
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ 
> >             link: p.file.link, 
> >             time: String(p.due || p.do), 
> >             icon: p.banner_icon || "📝" 
> >         });
> >     }
> >     
> >     // 2. INLINE TASKS SAMMELN (Due/Do in Zeile)
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && (String(t.due).includes(logDate) || String(t.do).includes(logDate))).forEach(t => {
> >             items.push({ 
> >                 link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), 
> >                 time: String(t.due || t.do), 
> >                 icon: "✅" 
> >             });
> >         });
> >     }
> > });
> > 
> > // 3. MATRIX RENDERN
> > const timedRows = hours.map(h => [
> >    `**${h}:00**`, 
> >    items.filter(i => i.time.includes('T' + h + ':'))
> >         .map(i => `${i.icon} ${i.link}`).join('<br>')
> > ]);
> > 
> > dv.table(['Time', 'Tasks'], timedRows);
> > ```
>
> > [!todo|wide-5]
> > ### 🎯 Management & Fokus (Energy: 5)
> > ```dataviewjs
> > const energy = Number(dv.current().energy) || 3;
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0];
> > const today = moment(logDate);
> > 
> > // 1. DATEN HOLEN
> > const allTasks = dv.pages('"4_Tasks" or #4task').file.tasks.where(t => !t.completed);
> > const allPages = dv.pages('"4_Tasks" or #4task').where(p => (p.due || p.do) && !p.completed);
> > 
> > // 2. FILTERN
> > const focus = allPages.filter(p => String(p.due || p.do).includes(logDate));
> > const radar = allPages.filter(p => {
> >     const d = moment(String(p.due || p.do));
> >     return d.isAfter(today, 'day') && d.isSameOrBefore(moment(today).add(energy >= 5 ? 7 : 3, 'days'), 'day');
> > });
> > 
> > // 3. RENDERING (ADAPTIV)
> > dv.header(5, "⚡ Today");
> > dv.list(focus.map(p => p.file.link));
> > 
> > if (energy >= 3) {
> >     dv.header(5, "📅 Radar");
> >     dv.list(radar.map(p => p.file.link));
> > }
> > 
> > if (energy >= 5) {
> >     dv.header(5, "🚧 Active Projects");
> >     dv.list(dv.pages('#3project').where(p => p.status == "active").file.link);
> > }
> > 
> > if (energy === 1) {
> >     dv.paragraph("> [!danger] **Notfall-Modus:** Erledige nur deine **Prio 1** Aufgaben!");
> >     dv.taskList(dv.pages().file.tasks.where(t => !t.completed && t.prio == "1"));
> > }
> > ```



> [!multi-column]
> > [!log|wide-0]
> > ### ⏳ Zeit-Matrix
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0];
> > let items = [];
> > 
> > dv.pages('"4_Tasks"').forEach(p => {
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, time: String(p.due || p.do), icon: p.banner_icon || "📝" });
> >     }
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && (String(t.due).includes(logDate) || String(t.do).includes(logDate))).forEach(t => {
> >             items.push({ link: dv.sectionLink(t.path, t.section.subpath, false, t.text), time: String(t.due || t.do), icon: "✅" });
> >         });
> >     }
> > });
> > 
> > const timedRows = hours.map(h => [
> >    `**${h}:00**`, 
> >    items.filter(i => i.time.includes('T' + h + ':')).map(i => `${i.icon} ${i.link}`).join('<br>')
> > ]);
> > dv.table(['Time', 'Tasks'], timedRows);
> > ```
>
> > [!hub|wide-5]
> > ```dataviewjs
> > // 1. BASIS-DATEN
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> > const today = moment(logDate);
> > const nextWeek = moment(logDate).add(7, 'days');
> > const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> > 
> > // 2. SAMMLUNG
> > let allItems = [];
> > // Inline Tasks
> > dv.pages('"4_Tasks" or #4task').file.tasks.where(t => !t.completed).forEach(t => {
> >     allItems.push({
> >         text: t.text,
> >         date: t.due || t.do,
> >         priority: t.priority || "0",
> >         link: dv.sectionLink(t.path, t.section.subpath, false, t.text)
> >     });
> > });
> > // Pages (Projekte/Notizen)
> > dv.pages('"4_Tasks" or #4task').where(p => (p.due || p.do) && !p.completed).forEach(p => {
> >     allItems.push({
> >         text: p.file.name,
> >         date: p.due || p.do,
> >         priority: p.priority || p.prio || "0",
> >         link: p.file.link
> >     });
> > });
> > 
> > // 3. FILTER
> > const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
> > const focus = allItems.filter(t => String(t.date).includes(logDate));
> > const radar = allItems.filter(t => {
> >     const d = moment(String(t.date));
> >     return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day');
> > });
> > 
> > // 4. FORMATIERUNG (Die Checkbox ist hier integriert)
> > const format = (t) => `- [ ] ${getPrioIcon(t.priority)} ${t.link}`;
> > 
> > // 5. RENDERING (MCL Design)
> > let hubContent = `> [!multi-column]\n`;
> > hubContent += `> > [!danger|flat] ⚠️ Overdue\n> > ${overdue.length ? overdue.map(t => format(t)).join("\n> > ") : "_Clear!_"}\n>\n`;
> > hubContent += `> > [!todo|flat] ⚡ Today\n> > ${focus.length ? focus.map(t => format(t)).join("\n> > ") : "_All done!_"}\n>\n`;
> > hubContent += `> > [!info|flat] 📅 Radar\n> > ${radar.length ? radar.map(t => format(t)).join("\n> > ") : "_Nothing._"}`;
> > 
> > dv.paragraph(hubContent);
> > ```




> [!multi-column]
> > [!log|wide-0]
> > **⏳ Zeit-Matrix**
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0]; 
> > let items = [];
> > dv.pages('"4_Tasks"').forEach(p => {
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, time: String(p.due || p.do), icon: p.banner_icon || "📝" });
> >     }
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && (String(t.due).includes(logDate) || String(t.do).includes(logDate))).forEach(t => {
> >             items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), time: String(t.due || t.do), icon: "✅" });
> >         });
> >     }
> > });
> > const timedRows = hours.map(h => [`**${h}:00**`, items.filter(i => i.time.includes('T' + h + ':')).map(i => `${i.icon} ${i.link}`).join('<br>')]);
> > dv.table(['Time', 'Tasks'], timedRows);
> > ```
>
> > [!todo|wide-5]
> > **🎯 Management & Fokus**
> > ```dataviewjs
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> > const today = moment(logDate);
> > const nextWeek = moment(logDate).add(7, 'days');
> > const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> > 
> > let allItems = [];
> > const sources = dv.pages('"4_Tasks" or #4task');
> > sources.file.tasks.where(t => !t.completed).forEach(t => { allItems.push({ text: t.text, date: t.due || t.do, priority: t.priority || "0", link: dv.sectionLink(t.path, t.section.subpath, false, t.text) }); });
> > sources.where(p => (p.due || p.do) && !p.completed).forEach(p => { allItems.push({ text: p.file.name, date: p.due || p.do, priority: p.priority || p.prio || "0", link: p.file.link }); });
> > 
> > const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
> > const focus = allItems.filter(t => String(t.date).includes(logDate));
> > const radar = allItems.filter(t => { const d = moment(String(t.date)); return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day'); });
> > 
> > const printList = (list, title, icon) => {
> >     dv.paragraph(`<b>${icon} ${title}</b>`);
> >     if (list.length === 0) dv.paragraph(`<small>_Keine_</small>`);
> >     else list.forEach(t => dv.paragraph(`- [ ] ${getPrioIcon(t.priority)} ${t.link}`));
> > };
> > 
> > printList(overdue, "Overdue", "⚠️");
> > printList(focus, "Today", "⚡");
> > printList(radar, "Radar", "📅");
> > ```


```dataviewjs
const energy = Number(dv.current().energy) || 3;

// Nur ausführen, wenn Energie >= 4 (wie gewünscht)
if (energy >= 4) {
    // 1. Alle Tasks sammeln und Arch-Tag bestimmen
    const allTasks = dv.pages('-"zData" and -"0_Atlas" and -"5_Notes"').file.tasks.where(t => !t.completed);
    
    // Gruppierung nach Arch-Tag (fallback auf "Unsortiert")
    const grouped = allTasks.groupBy(t => {
        const page = dv.page(t.path);
        // Nimmt das erste Arch-Tag oder "Unsortiert"
        return page.arch ? (Array.isArray(page.arch) ? page.arch[0] : page.arch) : "Unsortiert";
    }).sort(g => g.key);

    // 2. Rendering in Multi-Column
    let archContent = `> [!multi-column]\n`;
    
    grouped.forEach(group => {
        // Tag säubern für Anzeige
        const tagName = String(group.key).replace("#", "").toUpperCase();
        
        // Spalten-Content aufbauen
        archContent += `> > [!check|flat] 📂 ${tagName}\n`;
        archContent += `> > ` + group.rows.map(t => `- ${t.text} ${dv.sectionLink(t.path, t.section.subpath, false, "↗️")}`).join("\n> > ") + `\n>\n`;
    });

    dv.paragraph(archContent);
} else {
    dv.paragraph("> [!info] Energielevel zu niedrig für Open Tasks Übersicht (benötigt 4+).");
}
```


```dataviewjs
// 1. Lokale Definition: Nur für diesen Block gültig
const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
const today = moment(logDate);
const nextWeek = moment(logDate).add(7, 'days');
const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");

// 2. Lokale Sammlung
let allItems = [];
const sources = dv.pages('"4_Tasks" or #4task');
sources.file.tasks.where(t => !t.completed).forEach(t => { 
    allItems.push({ text: t.text, date: t.due || t.do, priority: t.priority || "0", link: dv.sectionLink(t.path, t.section.subpath, false, t.text) }); 
});
sources.where(p => (p.due || p.do) && !p.completed).forEach(p => { 
    allItems.push({ text: p.file.name, date: p.due || p.do, priority: p.priority || p.prio || "0", link: p.file.link }); 
});

// 3. Lokale Filter
const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
const focus = allItems.filter(t => String(t.date).includes(logDate));
const radar = allItems.filter(t => { const d = moment(String(t.date)); return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day'); });

// 4. Lokale Funktion (gilt nur innerhalb dieses Blocks)
const printList = (list, title, icon) => {
    dv.header(4, icon + " " + title);
    if (list.length === 0) {
        dv.paragraph("_Keine_");
    } else {
        const listItems = list.map(t => "- [ ] " + getPrioIcon(t.priority) + " " + t.link).join("\n");
        dv.paragraph(listItems);
    }
};

// 5. Aufruf
printList(overdue, "Overdue", "⚠️");
printList(focus, "Today", "⚡");
printList(radar, "Radar", "📅");
```


> [!multi-column]
> > [!log|wide-0]
> > **⏳ Zeit-Matrix**
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dv.current().file.name;
> > const archIcons = { "#0cal": "📅", "#1stars": "✨", "#2area": "💠", "#3project": "🚧", "#4task": "🛠️", "#5note": "✏️", "#6resou": "🔖" };
> > 
> > let items = [];
> > dv.pages('"4_Tasks"').forEach(p => {
> >     // Icon-Logik: Erst Banner, dann Arch-Tag Mapping
> >     let typeIcon = "";
> >     const archTags = Array.isArray(p.arch) ? p.arch : [p.arch];
> >     for (const tag of archTags) { if (archIcons[tag]) { typeIcon = archIcons[tag] + " "; break; } }
> >     const finalIcon = p.banner_icon ? p.banner_icon + " " : (typeIcon || "📝 ");
> > 
> >     // Pages (Dateien)
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, time: String(p.due || p.do), icon: finalIcon });
> >     }
> >     // Tasks
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && (String(t.due).includes(logDate) || String(t.do).includes(logDate))).forEach(t => {
> >             items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), time: String(t.due || t.do), icon: "✅ " });
> >         });
> >     }
> > });
> > 
> > const timedRows = hours.map(h => [
> >    `**${h}:00**`, 
> >    items.filter(i => i.time.includes('T' + h + ':')).map(i => `${i.icon}${i.link}`).join('<br>')
> > ]);
> > dv.table(['Time', 'Tasks'], timedRows);
> > ```
>
> > [!todo|wide-5]
> > **🎯 Management & Fokus**
> > ```dataviewjs
> > // 1. BASIS-DATEN (Identisch)
> > // 1. BASIS-DATEN
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> > const today = moment(logDate);
> > const nextWeek = moment(logDate).add(7, 'days');
> > const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> > 
> > // 2. SAMMLUNG (Jetzt mit Datum im Objekt!)
> > let allItems = [];
> > const sources = dv.pages('"4_Tasks" or #4task');
> > 
> > // Inline Tasks (Datum aus t.due oder t.do)
> > sources.file.tasks.where(t => !t.completed).forEach(t => { 
> >     allItems.push({ 
> >         text: t.text, 
> >         date: t.due || t.do, 
> >         priority: t.priority || "0", 
> >         link: dv.sectionLink(t.path, t.section.subpath, false, t.text) 
> >     }); 
> > });
> > 
> > // Pages/Projekte (Datum aus p.due oder p.do)
> > sources.where(p => (p.due || p.do) && !p.completed).forEach(p => { 
> >     allItems.push({ 
> >         text: p.file.name, 
> >         date: p.due || p.do, 
> >         priority: p.priority || p.prio || "0", 
> >         link: p.file.link 
> >     }); 
> > });
> > 
> > // 3. FILTER
> > const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
> > const focus = allItems.filter(t => String(t.date).includes(logDate));
> > const radar = allItems.filter(t => { 
> >     const d = moment(String(t.date)); 
> >     return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day'); 
> > });
> > 
> > // 4. RENDERING (Als EIN großer String, statt vieler kleiner Absätze)
> > const renderTightList = (items, title, icon) => {
> >     let content = `> > [!todo|flat] ${icon} ${title}\n`;
> >     if (items.length === 0) {
> >         content += `> > <small style="opacity:0.6">_Alles erledigt!_</small>\n`;
> >     } else {
> >         // Hier bauen wir alles in einen String zusammen
> >         content += items.map(t => {
> >             const dateStr = t.date ? ` <i style="font-size:0.8em; opacity:0.6;">(${moment(String(t.date)).format("MM-DD")})</i>` : "";
> >             return `> > - [ ] ${getPrioIcon(t.priority)} ${t.link}${dateStr}`;
> >         }).join("\n");
> >     }
> >     return content + "\n>\n";
> > };
> > 
> > // Das Ganze in ein Multi-Column packen
> > let hubContent = `> [!multi-column]\n`;
> > hubContent += renderTightList(overdue, "Overdue", "⚠️");
> > hubContent += renderTightList(focus, "Today", "⚡");
> > hubContent += renderTightList(radar, "Radar", "📅");
> > 
> > dv.paragraph(hubContent);
> > ```


---
<%-* if (Number(energy) >= 5) { -%>
<%-* if (Number(energy) >= 5) { -%>
> [!project] 🚧 Project Nexus (High Energy Mode)
> | Active | Passive | Idea |
> | :--- | :--- | :--- |
> ```dataviewjs
> const projs = dv.pages('#3project');
> const active = projs.where(p => p.status == "active").limit(10).map(p => p.file.link);
> const passive = projs.where(p => p.status == "passive").limit(10).map(p => p.file.link);
> const idea = projs.where(p => p.status == "idea").limit(10).map(p => p.file.link);
> 
> const rows = [];
> for(let i = 0; i < 10; i++) {
>     if (active[i] || passive[i] || idea[i]) {
>         rows.push([active[i] || "", passive[i] || "", idea[i] || ""]);
>     }
> }
> dv.table(["Active", "Passive", "Idea"], rows);
> ```
<%-* } -%>
<%-* } -%>
```dataviewjs
// 1. BASIS-DATEN DEFINIEREN
const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
const today = moment(logDate);
const nextWeek = moment(logDate).add(7, 'days');

const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");

// 2. SAMMLUNG (Die robuste Logik für beides: Tasks & Pages)
let allItems = [];

// A: Einzelne Tasks (Inline)
dv.pages('"4_Tasks" or #4task').file.tasks.where(t => !t.completed).forEach(t => {
    allItems.push({
        text: t.text,
        date: t.due || t.do,
        priority: t.priority || "0",
        link: dv.sectionLink(t.path, t.section.subpath, false, t.text),
        isTask: true
    });
});

// B: Ganze Dateien (Projekte)
dv.pages('"4_Tasks" or #4task').where(p => (p.due || p.do) && !p.completed).forEach(p => {
    allItems.push({
        text: p.file.name,
        date: p.due || p.do,
        priority: p.priority || p.prio || "0",
        link: p.file.link,
        isTask: false
    });
});

// 3. FILTER
const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today, 'day'));
const focus = allItems.filter(t => String(t.date).includes(logDate));
const radar = allItems.filter(t => {
    const d = moment(String(t.date));
    return d.isAfter(today, 'day') && d.isSameOrBefore(nextWeek, 'day');
});

// 4. FORMATIERUNG (Minimalistisches Design)
const format = (t) => `${getPrioIcon(t.priority)} ${t.link}`;

// 5. RENDERING (MCL Design)
let hubContent = `> [!multi-column]\n`;
hubContent += `> > [!danger|flat] ⚠️ Overdue\n> > ${overdue.length ? overdue.map(t => `- [ ] ${format(t)}`).join("\n> > ") : "_Clear!_"}\n>\n`;
hubContent += `> > [!todo|flat] ⚡ Today\n> > ${focus.length ? focus.map(t => `- [ ] ${format(t)}`).join("\n> > ") : "_All done!_"}\n>\n`;
hubContent += `> > [!info|flat] 📅 Radar\n> > ${radar.length ? radar.map(t => `- [ ] ${format(t)}`).join("\n> > ") : "_Nothing._"}`;

dv.paragraph(hubContent);
```


> [!multi-column]
> > [!log|wide-0]
> > ```dataviewjs
> > const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
> > const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dv.current().file.name; 
> >
> > const archIcons = { "#0cal": "📅", "#1stars": "✨", "#2area": "💠", "#3project": "🚧", "#4task": "🛠️", "#5note": "✏️", "#6resou": "🔖" };
> > 
> > let source = dv.pages('"4_Tasks"');
> > let items = [];
> > 
> > source.forEach(p => {
> >     // ICON-LOGIK: Erst Banner, dann Arch-Emoji
> >     let typeIcon = "";
> >     const archTags = Array.isArray(p.arch) ? p.arch : [p.arch];
> >     for (const tag of archTags) { if (archIcons[tag]) { typeIcon = archIcons[tag] + " "; break; } }
> >     const finalIcon = p.banner_icon ? p.banner_icon + " " : typeIcon;
> > 
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, due: p.due, do: p.do, arch: p.arch, icon: finalIcon, origin: null });
> >     }
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && t.due && String(t.due).includes(logDate)).forEach(t => {
> >             items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), due: t.due, do: null, arch: p.arch, icon: finalIcon, origin: p.file.link });
> >         });
> >     }
> > });
> > 
> > const getArchTag = (item) => {
> >    if (!item.arch) return '4_Tasks';
> >    const a = Array.isArray(item.arch) ? item.arch.find(t => String(t).includes("4task")) : item.arch;
> >    return a ? String(a).replace("#", "") : '4_Tasks';
> > };
> > 
> > const archs = [...new Set(items.map(i => getArchTag(i)))].sort();
> > 
> > const formatItem = (i, colName) => {
> >     // Emojis weg in '4_Tasks', sonst anzeigen
> >     let icon = (colName === "4_Tasks") ? "" : i.icon;
> >     let text = icon + i.link;
> >     if (i.origin) text += ` <small style="opacity: 0.4; font-style: italic;">(${i.origin})</small>`;
> >     return text;
> > };
> > 
> > const untimedRow = [
> >    `*All-day*`, 
> >    ...archs.map(a => {
> >       const matches = items.filter(i => {
> >          const hasNoTime = !String(i.due || i.do).includes('T');
> >          const isMidnight = String(i.due || i.do).includes('T00:00');
> >          return getArchTag(i) === a && (hasNoTime || isMidnight);
> >       });
> >       return matches.length > 0 ? matches.map(i => formatItem(i, a)).join('<br>') : '';
> >    })
> > ];
> > 
> > const timedRows = hours.map(h => [
> >    `**${h}:00**`, 
> >    ...archs.map(a => { 
> >       const matches = items.filter(i => getArchTag(i) === a && 
> >          ((i.due && String(i.due).includes('T' + h + ':')) || (i.do && String(i.do).includes('T' + h + ':')))
> >       ); 
> >       return matches.length > 0 ? matches.map(i => formatItem(i, a)).join('<br>') : ''; 
> >    }) 
> > ]);
> > 
> > dv.table(['Time', ...archs], [untimedRow, ...timedRows]);
> > 
> > const style = document.createElement('style');
> > style.innerHTML = `
> >     .dataview.table-view-table thead th { display: table-cell !important; border-bottom: 1px solid var(--background-modifier-border) !important; font-weight: normal; opacity: 0.4; font-size: 0.75em; text-transform: uppercase; }
> >     .dataview.table-view-table td { border-bottom: 0.5px solid var(--background-modifier-border-soft) !important; padding: 6px 4px !important; border-left: none !important; border-right: none !important; }
> >     .dataview.table-view-table td:first-child { font-size: 1.05em !important; opacity: 0.7; width: 75px; vertical-align: top; }
> > `;
> > dv.container.appendChild(style);
> > 
> > ```
> 
> >[!abstract|wide-5]
> > ### Open Tasks
> > ```dataviewjs
> > const tasks = dv.pages('-"zData" and -"0_Atlas" and -"5_Notes"')
> >     .file.tasks
> >     .where(t => !t.completed)
> >     .limit(20);
> > 
> > // Gruppieren nach dem Datei-Objekt für den Link
> > const grouped = tasks.groupBy(t => t.path);
> > 
> > grouped.forEach(group => {
> >     const file = dv.page(group.key).file;
> >     // Kleiner, grauer Link (Systemunabhängig durch file.link)
> >     dv.header(6, `*<small style="opacity: 0.5;">📂 ${file.link}</small>*`);
> >     dv.taskList(group.rows, false);
> > });
> > 
> > ```



```dataviewjs
const energy = Number(dv.current().energy) || 3;

// Nur ausführen, wenn Energie >= 4 (wie gewünscht)
if (energy >= 4) {
    // 1. Alle Tasks sammeln und Arch-Tag bestimmen
    const allTasks = dv.pages('-"zData" and -"0_Atlas" and -"5_Notes"').file.tasks.where(t => !t.completed);
    
    // Gruppierung nach Arch-Tag (fallback auf "Unsortiert")
    const grouped = allTasks.groupBy(t => {
        const page = dv.page(t.path);
        // Nimmt das erste Arch-Tag oder "Unsortiert"
        return page.arch ? (Array.isArray(page.arch) ? page.arch[0] : page.arch) : "Unsortiert";
    }).sort(g => g.key);

    // 2. Rendering in Multi-Column
    let archContent = `> [!multi-column]\n`;
    
    grouped.forEach(group => {
        // Tag säubern für Anzeige
        const tagName = String(group.key).replace("#", "").toUpperCase();
        
        // Spalten-Content aufbauen
        archContent += `> > [!check|flat] 📂 ${tagName}\n`;
        archContent += `> > ` + group.rows.map(t => `- ${t.text} ${dv.sectionLink(t.path, t.section.subpath, false, "↗️")}`).join("\n> > ") + `\n>\n`;
    });

    dv.paragraph(archContent);
} else {
    dv.paragraph("> [!info] Energielevel zu niedrig für Open Tasks Übersicht (benötigt 4+).");
}
```
<%-* if (Number(energy) >= 5) { -%>
> [!project] 🚧 Project Nexus (High Energy Mode)
> | Active | Passive | Idea |
> | :--- | :--- | :--- |
> ```dataviewjs
> const projs = dv.pages('#3project');
> const active = projs.where(p => p.status == "active").limit(10).map(p => p.file.link);
> const passive = projs.where(p => p.status == "passive").limit(10).map(p => p.file.link);
> const idea = projs.where(p => p.status == "idea").limit(10).map(p => p.file.link);
> 
> const rows = [];
> for(let i = 0; i < 10; i++) {
>     if (active[i] || passive[i] || idea[i]) {
>         rows.push([active[i] || "", passive[i] || "", idea[i] || ""]);
>     }
> }
> dv.table(["Active", "Passive", "Idea"], rows);
> ```
<%-* } -%>


### 🛠️ Management & Fokus
```dataviewjs
// 1. BASIS-DATEN DEFINIEREN
const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
const today = moment(logDate);
const nextWeek = moment(logDate).add(7, 'days');

const getPrioIcon = (p) => {
    if (p == "1") return "🔴";
    if (p == "2") return "🟠";
    if (p == "3") return "🟡";
    if (p == "4") return "🔵";
    return "⚪";
};

// 2. ALLE QUELLEN SAMMELN
const checklistTasks = dv.pages('"4_Tasks" or #4task').file.tasks.where(t => !t.completed);

const pageTasks = dv.pages('"4_Tasks" or #4task')
    .where(p => (p.due || p.do) && !p.completed)
    .map(p => ({
        text: p.file.name,
        due: p.due,
        do: p.do,
        priority: p.priority || p.prio || "0",
        path: p.file.path
    }));

const allItems = [...checklistTasks, ...pageTasks];

// 3. FILTER LOGIK
const overdue = allItems.filter(t => t.due && moment(String(t.due)).isBefore(today, 'day'));
const focus = allItems.filter(t => String(t.due || t.do).includes(logDate));
const radar = allItems.filter(t => {
    const d = t.due || t.do;
    if (!d) return false;
    const m = moment(String(d));
    return m.isAfter(today, 'day') && m.isSameOrBefore(nextWeek, 'day');
});

// 4. FORMATIERUNG
const format = (t) => {
    const prio = t.priority || t.prio || "0";
    const cleanPath = (t.path || "").replace(".md","");
    return getPrioIcon(prio) + " " + (t.text || "Task") + ` [[${cleanPath}|↗️]]`;
};

// Hilfsfunktion für die Listen-Inhalte
const getListMd = (list, emptyMsg) => {
    if (list.length === 0) return `_${emptyMsg}_`;
    return list.map(t => `- [ ] ${format(t)}`).join("\n");
};
// 5. RENDERING (MCL Syntax)
// Das Haupt-Callout hat ein ">", die inneren Boxen müssen mit "> >" starten
let hubContent = `> [!multi-column]\n`;

// Spalte 1: Overdue
hubContent += `> > [!danger] ⚠️ Overdue\n`;
hubContent += `> > ${overdue.length > 0 ? overdue.map(t => "- [ ] " + format(t)).join("\n> > ") : "_Clear!_"}\n>\n`;

// Spalte 2: Today
hubContent += `> > [!todo] ⚡ Today\n`;
hubContent += `> > ${focus.length > 0 ? focus.map(t => "- [ ] " + format(t)).join("\n> > ") : "_All done!_"}\n>\n`;

// Spalte 3: Radar
hubContent += `> > [!info] 📅 Radar\n`;
hubContent += `> > ${radar.length > 0 ? radar.map(t => "- [ ] " + format(t)).join("\n> > ") : "_Nothing on radar._"}`;

dv.paragraph(hubContent);

```


## 🛒 Shopping & Supply
> [!shopping]- Nexus Shopping Hub (Vorausplanung ab 2026-03-14)
> - [ ] 🛒 Keine Einkäufe geplant.








---
#### 🔱 Connexio
> [!link]- Nexus
>>[!multi-column]
>>>[!todo] 🛠️ Tasks
>>>##### Adveniens (Inbound)
>>>```dataview
>>>LIST FROM #4task WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>>[!caution] 🚧 Projects
>>>##### Adveniens (Inbound)
>>>```dataview
>>>LIST FROM #3project WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>> [!edit] ✏️ Notes
>>>##### Nexus (Linked)
>>>```dataview
>>>LIST FROM #5note WHERE contains(this.file.inlinks, file.link) OR contains(this.file.outlinks, file.link)
>>>```
>
>> [!bookmark]- 🔖 Fontes (Sources)
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resou AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!layers]- 💠 Area Supra
>>>```dataview
>>>LIST FROM #2area WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>>
>>> [!star]- ✨ Stella Supra
>>>```dataview
>>>LIST FROM #1stars WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>
>> [!info]- 🔙 Backlinks & Hub
>> ```dataview
>> LIST FROM [[#]]
>> ```

---

```meta-bind-button
label: "Archivieren"
icon: "archive"
style: primary
actions:
  - type: runTemplaterFile
    # Nutze den kompletten Pfad ohne führenden Slash
    templateFile: "zData/1temp/archiveall.md" 

```




`BUTTON[freezer]`