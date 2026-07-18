<%-*
// 🔱 1. INITIALIZATION & DATA SYNC
if (!tp.variables) tp.variables = {};
const dv = app.plugins.plugins.dataview?.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. SMART CLEAN & FALLBACK (Für Direkt-Start ohne Prompt)
// Erkennt "Untitled" oder den "Entry-..." Platzhalter vom Router
let currentFileTitle = tp.variables.title || tp.file.title;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [year, month] = dateStr.split("-");

const isPlaceholder = currentFileTitle.toLowerCase().includes(defaultName.toLowerCase()) || /Entry-\d{2}-\d{2}/.test(currentFileTitle);

let cleanPart = "";

if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanPart = tp.variables.title.replace(/plm/i, "").replace(/ppm/i, "").replace(/pkm/i, "").replace(/^- /, "").trim(); // Übernahme vom Router/Prompt
} else {
    const untitledPattern = new RegExp(defaultName + "(\\s\\d+)?", "i");
    // Manueller Fallback: Wir filtern Platzhalter, "plm" und das Datum heraus
    cleanPart = currentFileTitle.replace(/Entry-\d{2}-\d{2}/i, "")
                                .replace(untitledPattern, "")
                                .replace(new RegExp(defaultName, "i"), "")
                                .replace(/^\d{4}-\d{2}-\d{2}/, "")
                                .replace(/plm/i, "")
                                .replace(/ppm/i, "")
                                .replace(/pkm/i, "")
                                .replace(/^- /, "")
                                .trim();
}

// 🔱 2.1 PPM-SPEZIFIKUM: Falls leer, fragen wir nach dem strategischen Fokus
if (!tp.variables.finalTitle && (!cleanPart || cleanPart.toLowerCase() === "daily log")) {
    const focus = await tp.system.prompt("🌻 Nexus PPM: Strategic Focus for today?", "");
    if (focus) cleanPart = focus;
}

// Finalen Titel konstruieren
let finalTitle = `${dateStr} ppm${cleanPart ? " - " + cleanPart : ""}`;
const pureFocus = cleanPart || "";

// 🔱 3. DATEI-STABILISIERUNG (Physisches Umbenennen)
if (!tp.variables.finalTitle && currentFileTitle !== finalTitle) {
    await tp.file.rename(finalTitle);
    await new Promise(r => setTimeout(r, 200)); 
}

// Variablen für das restliche Template festschreiben
tp.variables.title = finalTitle;
tp.variables.targetDate = dateStr;
const displayTitle = cleanPart || "Daily Strategy";

// 🔱 4. LINKED FOCI (PLM/PPM)
// Hinweis: Aim-Fields werden hier nicht benötigt, PPM zieht sich PKM-Fokus später selbst.
const energy = tp.variables.energy || tp.frontmatter?.energy || "3";
tp.variables.energy = energy;

// 🔱 5. SYNC: VERBUNDENE FOCI (PLM & PKM) - ROBUST EDITION
const [y, m] = dateStr.split("-");

let aim1Focus = "";
let aim3Focus = "";

if (dv) {
    // Wir suchen in den entsprechenden Ordnern nach einer Datei, 
    // die mit dem Datum beginnt, egal was danach im Namen steht.
    const plmPage = dv.pages(`"0_Calendar/1_PLM/${y}/${m}"`).find(p => p.file.name.startsWith(`${dateStr} plm`));
    const pkmPage = dv.pages(`"0_Calendar/3_PKM/${y}/${m}"`).find(p => p.file.name.startsWith(`${dateStr} pkm`));
    
    aim1Focus = plmPage ? (plmPage.focusD_plm || "") : "";
    aim3Focus = pkmPage ? (pkmPage.focusD_pkm || "") : "";
}

// 🔱 5.1 MONTHLY STRATEGY SYNC (Pulls the last set monthly focus)
let focusM_ppm = "";
let focusM_Date = dateStr; // Fallback auf heute

if (dv) {
    // Suche alle PPMs im aktuellen Monatsordner
    const monthlyLogs = dv.pages(`"0_Calendar/2_PPM/${year}/${month}"`)
        .where(p => p.focusM_ppm && p.focusM_ppm !== "")
        .sort(p => p.file.name, "desc");

    if (monthlyLogs.length > 0) {
        const lastLog = monthlyLogs.first();
        focusM_ppm = lastLog.focusM_ppm;
        focusM_Date = lastLog.focusM_start || lastLog["cal_date"] || dateStr;
    }
}

// 💼 5.4 WORK & PROJECT SYNC (PPM Auto-Fill Main Tasks)
const dayMap = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
const momentDay = moment(dateStr);
const todayPrefix = dayMap[momentDay.day()]; 

let workTasks = [];

if (dv) {
    const pYear = momentDay.format("YYYY");
    const pKw = momentDay.format("WW");
    const pMonth = momentDay.format("MM");
    const weeklyRoutinePath = `0_Calendar/7_Plan/${pYear}/${pMonth}/${pYear}-W${pKw}_routine.md`;
    
    let routinePage = dv.page(weeklyRoutinePath);
    if (!routinePage) {
        routinePage = dv.page("2_Areas/4_Organize/Plan/Routine_Timeblocking.md");
    }
    if (routinePage) {
        const enginePath = "zData/2scripts/routineEngine.js";
        let engineData = {};
        try { 
            const eFile = app.vault.getAbstractFileByPath(enginePath);
            if (eFile) {
                const code = await app.vault.read(eFile);
                const module = { exports: {} };
                new Function("module", "exports", code)(module, module.exports);
                engineData = typeof module.exports === "function" ? module.exports().all : {};
            }
        } catch(e) { console.error("Engine Load Error", e); }

        // persona → axis bridge (same load pattern): pull ALL PPM-axis routines, not just "worker"
        let getAxis = (p) => "Unknown";
        try {
            const pFile = app.vault.getAbstractFileByPath("zData/2scripts/personaEngine.js");
            if (pFile) {
                const pcode = await app.vault.read(pFile);
                const pmod = { exports: {} };
                new Function("module", "exports", pcode)(pmod, pmod.exports);
                if (typeof pmod.exports === "function") getAxis = pmod.exports().getAxis;
            }
        } catch(e) { console.error("Persona Engine Load Error", e); }

        const totalPeriods = Number(routinePage.rt_periods) || 14;
        
        for (let i = 1; i <= totalPeriods; i++) {
            let slotValue = String(routinePage[`rt_${todayPrefix}_${i}`] || "");
            if (slotValue && slotValue !== "free" && slotValue !== "break") {
                let parts = slotValue.split("|");
                let baseKey = parts[0];
                let detail = parts.length > 1 ? ` (${parts.slice(1).join(" ")})` : "";
                
                // 🔥 DER FILTER: Zieht NUR PPM/Arbeits-Aufgaben (Kein Haushalt, kein Studium!)
                if (engineData && engineData[baseKey] && getAxis(engineData[baseKey].persona) === "PPM") {
                    let label = engineData[baseKey].label; 
                    let icon = engineData[baseKey].icon || "💼";
                    workTasks.push(`${icon} ${label}${detail}`);
                }
            }
        }
    }
}

// Deduplizierung: Fasst direkt aufeinanderfolgende gleiche Blöcke zusammen
let uniqueWorkTasks = [];
workTasks.forEach(t => {
    if(uniqueWorkTasks[uniqueWorkTasks.length - 1] !== t) {
        uniqueWorkTasks.push(t);
    }
});

tp.variables.maintask1 = uniqueWorkTasks[0] || "";
tp.variables.maintask2 = uniqueWorkTasks[1] || "";
tp.variables.maintask3 = uniqueWorkTasks[2] || "";
tp.variables.maintask4 = uniqueWorkTasks[3] || "";
tp.variables.maintask5 = uniqueWorkTasks[4] || "";
tp.variables.maintask6 = uniqueWorkTasks[5] || "";

// 🔱 6. FINAL LOGISTICS (Folder-Check & Move)
const targetFolder = `0_Calendar/2_PPM/${y}/${m}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;

// Monthly Focus Start (falls nicht gesetzt)
const focusStart = (tp.frontmatter && tp.frontmatter.focusM_start) ? tp.frontmatter.focusM_start : focusM_Date;

// Falls die Datei noch nicht am richtigen Ort liegt (z.B. nach Alt+E in der Inbox)
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    let currentPath = "";
    for (const seg of targetFolder.split('/')) {
        currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
    }
    await tp.file.move(finalDest);
}

// 🔱 7. CLEANUP
if (tp.variables && tp.variables.targetDate) delete tp.variables.targetDate;
tR = "---\n";
%>
banner_icon: 🌻
fileTitle: "<%- finalTitle %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/2ppm"
persona: organizer
energy: "<%- energy %>"
cal0: 
stars1:
area2: ["#2area/4organize"]
project3:
task4:
note5: []
resource6:
focusD_plm: "<%- aim1Focus %>"
focusD_ppm: "<%- pureFocus %>"
focusD_pkm: "<%- aim3Focus %>"
focusM_ppm: "<%- focusM_ppm %>"
focusM_start: "<%- focusStart %>"
maintask1: "<%- tp.variables.maintask1 %>"
maintask2: "<%- tp.variables.maintask2 %>"
maintask3: "<%- tp.variables.maintask3 %>"
maintask4: "<%- tp.variables.maintask4 %>"
maintask5: "<%- tp.variables.maintask5 %>"
maintask6: "<%- tp.variables.maintask6 %>"
cal_date: <%- dateStr %>

---

# ⚜️🔱⚡ <%- dateStr %> ⚡🔱⚜️

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>
## <%- displayTitle %>

<%-*
// 🔱 3. DYNAMISCHE LINKS ZU DEN ANDEREN LOGS

// Pfade zu den Schwester-Logs (Journal & Study)
const todayPLM = `0_Calendar/1_PLM/${year}/${month}/${dateStr} plm`;
const todayPKM = `0_Calendar/3_PKM/${year}/${month}/${dateStr} pkm`;
%>
**Selfcare:** [[<%- todayPLM %>|🌷 Go to today's Journal (PLM)]]
**Knowledge:** [[<%- todayPKM %>|🌼 Go to today's Study-Log (PKM)]]

---

> [!hub] 🎯 Daily Council (Strategy)
> > [!multi-column]
> >
> > > [!blank|wide-2] 
> > > **Strategic Focus**
> > > 
> > > <small>Monthly Cycle:</small>
> > > `INPUT[text:focusM_ppm]` `BUTTON[reset-focus]` <small style="opacity:0.5;">`$= const c = dv.current(); (c.focusM_ppm && c.focusM_start) ? Math.max(0, 30 - moment().startOf('day').diff(moment(String(c.focusM_start)).startOf('day'), 'days')) + "d left" : ""`</small>
> > > 
> > > ```dataviewjs
> > > const curr = dv.current();
> > > const logDate = curr.file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
> > > const [yy, mm] = logDate.split("-");
> > > 
> > > // Sucht gezielt nach "[Datum] plm" und "[Datum] pkm"
> > > const plm = dv.pages(`"0_Calendar/1_PLM/${yy}/${mm}"`).find(p => p.file.name.startsWith(`${logDate} plm`));
> > > const pkm = dv.pages(`"0_Calendar/3_PKM/${yy}/${mm}"`).find(p => p.file.name.startsWith(`${logDate} pkm`));
> > > 
> > > dv.paragraph(
> > >     "<small>🌷 Aim 1: PLM (Selfcare)</small><br>**" + (plm?.focusD_plm || "...") + "**<br><br>" +
> > >     "<small>🌻 Aim 2: PPM (Strategy)</small><br>`INPUT[text(placeholder(Strategic Focus...)):focusD_ppm]`<br><br>" +
> > >     "<small>🌼 Aim 3: PKM (Knowledge)</small><br>**" + (pkm?.focusD_pkm || "...") + "**"
> > > );
> > > ```
> >
> > > [!blank|wide-1] 
> > > **Main Tasks**
> > > <small style="opacity:0.45;font-style:italic;">(auto-filled from today's routine PPM blocks — empty = none scheduled, or the slot isn't tagged with a PPM persona)</small>
> > > 1. **`INPUT[text:maintask1]`** <span style="font-size: 0.79em; opacity: 0.7;">🎯</span>
> > > 2. **`INPUT[text:maintask2]`** <span style="font-size: 0.79em; opacity: 0.7;">🎯</span>
> > > 3. `INPUT[text:maintask3]`
> > > 4. `INPUT[text:maintask4]`
> > > 5. `INPUT[text:maintask5]`
> > > 6. `INPUT[text:maintask6]`
> > > ---
> > > ```dataviewjs
> > > const tFile = app.vault.getAbstractFileByPath(dv.current().file.path);
> > > const currentEnergy = dv.current().energy || "3";
> > > const eMap = {"5":"🔱 Amazing", "4":"🔋 High", "3":"🙂 Medium", "2":"🪫 Low", "1":"⭕ Empty"};
> > > 
> > > // Container für das Interface-Element erstellen
> > > const container = dv.container.createEl("div", { style: "font-size: 0.85em; font-family: var(--font-interface);" });
> > > 
> > > // Label und Status-Text-Element
> > > const label = container.createEl("small", { text: "⚡ Energy Level: ", style: "opacity: 0.8;" });
> > > const statusText = container.createEl("span", { 
> > >     text: eMap[String(currentEnergy)] || currentEnergy, 
> > >     style: "font-weight: bold; margin-left: 4px;" 
> > > });
> > > 
> > > container.createEl("br");
> > > 
> > > // Der HTML Slider (input type='range')
> > > const slider = container.createEl("input", {
> > >     type: "range",
> > >     attr: { min: "1", max: "5", value: String(currentEnergy), step: "1" },
> > >     style: "width: 100%; max-width: 150px; margin-top: 6px; cursor: pointer;"
> > > });
> > > 
> > > // Event-Listener für Interaktionen
> > > slider.addEventListener("input", async (e) => {
> > >     const val = e.target.value;
> > >     statusText.innerText = eMap[val] || val;
> > >     
> > >     // Schreibt den Wert direkt zurück in das YAML Frontmatter der aktuellen Datei
> > >     await app.fileManager.processFrontMatter(tFile, (fm) => {
> > >         fm["energy"] = Number(val);
> > >     });
> > > });
> > >```

##### Sidequest /Braindump
- 
> [!todo]- 📝 Open Ad-Hoc Tasks (Past PPMs)
> <small style="opacity:0.45;font-style:italic;">(unchecked tasks pulled from past PPM logs)</small>
> ```dataview
> TASK
> FROM "0_Calendar/2_PPM"
> WHERE !completed 
> AND file.name != this.file.name
> AND text != ""
> GROUP BY file.link
> ```

## 🛠️ Management & Focus
> [!multi-column]
> > [!calendar|wide-0] ⏳ Time Matrix
> > ```dataviewjs
> > (() => {
> >    if (dv.viewCount && dv.viewCount > 1) return; // ruhig bleiben
> >    const hours = ['08','09','10','11','12','13','14','15','16','17','18','19','20'];
> >    const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dv.current().file.name;
> >    const archIcons = { "#0cal":"📅", "#1stars":"✨", "#2area":"💠", "#3project":"🚧", "#4task":"🛠️", "#5note":"✏️", "#6resource":"🔖" };
> >    const items = [];
> >    
> >    // Logische Exklusion von archivierten, stornierten oder gelöschten Elementen
> >    dv.pages('!"zData" AND -"yArchive" AND -"0_Atlas"').where(p => {
> >        if (!p.arch || !String(p.arch).includes("#4task")) return false;
> >        const stat = String(p.status || "").toLowerCase();
> >        if (stat.includes("archive") || stat.includes("archived") || stat.includes("canceled") || stat.includes("bin") || p.completed) return false;
> >        return true;
> >    }).forEach(p => {
> >      let typeIcon = "";
> >      const archTags = Array.isArray(p.arch) ? p.arch : [p.arch];
> >      for (const tag of archTags) { if (archIcons[tag]) { typeIcon = archIcons[tag] + " "; break; } }
> >      const finalIcon = p.banner_icon ? p.banner_icon + " " : typeIcon;
> >      
> >      if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >          items.push({ link: p.file.link, due: p.due, do: p.do, arch: p.arch, icon: finalIcon, origin: null });
> >      }
> >      
> >      if (p.file.tasks) {
> >          p.file.tasks.filter(t => !t.completed && t.due && String(t.due).includes(logDate)).forEach(t => {
> >              items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), due: t.due, do: null, arch: p.arch, icon: finalIcon, origin: p.file.link });
> >          });
> >      }
> >    });
> >    
> >    const getArchTag = (item) => {
> >       if (!item.arch) return '4_Tasks';
> >       const a = Array.isArray(item.arch) ? item.arch.find(t => String(t).includes("4task")) : item.arch;
> >       return a ? String(a).replace("#","") : '4_Tasks';
> >    };
> >    const archs = [...new Set(items.map(i => getArchTag(i)))].sort();
> >    
> >    const formatItem = (i, colName) => {
> >        const icon = (colName === "4_Tasks") ? "" : i.icon;
> >        let text = icon + i.link;
> >        if (i.origin) text += ` <small style="opacity:0.4;font-style:italic;">(${i.origin})</small>`;
> >        return text;
> >    };
> >    
> >    const untimedRow = [
> >      `*All-day*`,
> >      ...archs.map(a => {
> >          const matches = items.filter(i => {
> >             const hasNoTime = !String(i.due || i.do).includes('T');
> >             const isMidnight = String(i.due || i.do).includes('T00:00');
> >             return getArchTag(i) === a && (hasNoTime || isMidnight);
> >          });
> >          return matches.length ? matches.map(i => formatItem(i, a)).join('<br>') : '';
> >      })
> >    ];
> >    
> >    const timedRows = hours.map(h => [
> >      `**${h}:00**`,
> >      ...archs.map(a => {
> >          const matches = items.filter(i => getArchTag(i) === a &&
> >            ((i.due && String(i.due).includes('T'+h+':')) || (i.do && String(i.do).includes('T'+h+':')))
> >          );
> >          return matches.length ? matches.map(i => formatItem(i, a)).join('<br>') : '';
> >      })
> >    ]);
> >    
> >    dv.table(['Time', ...archs], [untimedRow, ...timedRows]);
> >    
> >    const style = document.createElement('style');
> >    style.innerHTML = `
> >    .dataview.table-view-table thead th { display: table-cell !important; border-bottom: 1px solid var(--background-modifier-border) !important; font-weight: normal; opacity: 0.4; font-size: 0.75em; text-transform: uppercase; }
> >    .dataview.table-view-table td { border-bottom: 0.5px solid var(--background-modifier-border-soft) !important; padding: 6px 4px !important; border-left: none !important; border-right: none !important; }
> >    .dataview.table-view-table td:first-child { font-size: 1.05em !important; opacity: 0.7; width: 75px; vertical-align: top; }
> >    `;
> >    dv.container.appendChild(style);
> > })();
> > ```
>
> > [!decent|wide-4]
> > ```dataviewjs
> > (() => {
> >    if (dv.viewCount && dv.viewCount > 1) return; // ruhig bleiben
> >    const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> >    const today = moment(logDate);
> >    const nextWeek = moment(logDate).add(7,'days');
> >    const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> >    const allItems = [];
> >    
> >    dv.pages().where(p => {
> >        // 1. Basis-Prüfung: Ist es ein Task und unvollständig?
> >        if (!p.arch || !String(p.arch).includes("#4task") || p.completed) return false;
> >        
> >        // 2. Status-Exklusion: Archiviert, abgebrochen oder gelöscht ignorieren
> >        const stat = String(p.status || "").toLowerCase();
> >        if (stat.includes("archive") || stat.includes("archived") || stat.includes("canceled") || stat.includes("bin")) return false;
> >        
> >        return true;
> >    }).forEach(p => {
> >        allItems.push({ text: p.file.name, date: p.due || p.do, priority: p.priority || p.prio || "0", link: p.file.link });
> >    });
> >    
> >    const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today,'day'));
> >    const focus   = allItems.filter(t => String(t.date).includes(logDate));
> >    const radar   = allItems.filter(t => { const d = moment(String(t.date)); return d.isAfter(today,'day') && d.isSameOrBefore(nextWeek,'day'); });
> >    const format = (t) => `- [ ] ${getPrioIcon(t.priority)} ${t.link}`;
> >    const hub = [
> >      "> [!multi-column]",
> >      "> > [!danger|flat] ⚠️ Overdue",
> >      (overdue.length ? overdue.map(t => "> > " + format(t)).join("\n") : "> > _Clear!_"),
> >      ">",
> >      "> > [!task|flat] ⚡ Today",
> >      (focus.length ? focus.map(t => "> > " + format(t)).join("\n") : "> > _All done!_"),
> >      ">",
> >      "> > [!abstract|flat] 📅 Radar",
> >      (radar.length ? radar.map(t => "> > " + format(t)).join("\n") : "> > _Nothing._")
> >    ].join("\n");
> >    dv.paragraph(hub);
> > })();
> > ```

<%-* if (Number(energy) >= 5) { -%>

> [!project]- 🚀 Project Nexus (Level 5 Energy)
> ```dataviewjs
> const projs = dv.pages('#3project');
> 
> // ⚡ FIX: Sicherer Check für den Status (fängt Arrays und leere Felder ab)
> const active = projs.where(p => p.status && String(p.status).includes("1active")).limit(10).map(p => p.file.link);
> const passive = projs.where(p => p.status && String(p.status).includes("2passive")).limit(10).map(p => p.file.link);
> const idea = projs.where(p => p.status && String(p.status).includes("3idea")).limit(10).map(p => p.file.link);
> 
> const rows = [];
> const maxLen = Math.max(active.length, passive.length, idea.length);
> for(let i = 0; i < maxLen; i++) {
>     rows.push([active[i] || "", passive[i] || "", idea[i] || ""]);
> }
> 
> if (rows.length > 0) {
>     dv.table(["🟢 Active", "🟡 Passive", "💡 Idea"], rows);
>     
>     // ⚡ Design Fix: Forces the table to use 100% width and split columns equally
>     const style = document.createElement('style');
>     style.innerHTML = `
>     .dataview.table-view-table { table-layout: fixed; width: 100%; }
>     .dataview.table-view-table th { width: 33.33%; text-align: left; }
>     `;
>     dv.container.appendChild(style);
> } else {
>     dv.paragraph("_No projects found in these categories._");
> }
> ```
<%-* } %>

<%-* if (Number(energy) >= 4) { %>
> [!todo]- 📂 Open Task Matrix (Level 4+)
> ```dataviewjs
> const energy = Number(dv.current().energy) || 3;
> 
> if (energy >= 4) {
>     const allTasks = dv.pages('-"zData" and -"0_Atlas" and -"5_Notes"').file.tasks.where(t => !t.completed);
>     
>     const grouped = allTasks.groupBy(t => {
>         const page = dv.page(t.path);
>         return page.arch ? (Array.isArray(page.arch) ? page.arch[0] : page.arch) : "Unsorted";
>     }).sort(g => g.key);
> 
>     let archContent = `> [!multi-column]\n>\n`;
>     
>     grouped.forEach(group => {
>         const tagName = String(group.key).replace("#", "").toUpperCase();
>         
>         archContent += `> > [!todo|flat] 📂 ${tagName}\n`;
>         
>         // Limits to 7 tasks to prevent UI overload
>         const tasksToShow = group.rows.slice(0, 7);
>         archContent += tasksToShow.map(t => `> > - ${t.text} ${dv.sectionLink(t.path, t.section.subpath, false, "↗️")}`).join("\n");
>         
>         if (group.rows.length > 7) {
>             archContent += `\n> > - _+ ${group.rows.length - 7} more..._`;
>         }
>         
>         archContent += `\n>\n`;
>     });
> 
>     if (grouped.length === 0) {
>         archContent += `> > _No open tasks found._\n`;
>     }
> 
>     dv.paragraph(archContent);
> } else {
>     dv.paragraph("> [!info] Energy level too low for Open Tasks overview (requires 4+).");
> }
> ```
<%-* } %>

---

## 🛒 Strategic Procurement & Supply

> [!multi-column]
>
> > [!todo|flat] 💸 Horizon 0: To-Buy
> > <small style="opacity:0.45;font-style:italic;">(open #4task/tobuy items — empty = nothing queued, or tasks not tagged tobuy)</small>
> > ```dataview
> > TABLE WITHOUT ID
> >   file.link AS "Item",
> >   due AS "Deadline",
> >   parent AS "Project"
> > FROM #4task/tobuy
> > WHERE !completed
> > SORT due ASC
> > ```
>
> > [!money|flat] 💎 Horizon 1: Pro-Buy
> > <small style="opacity:0.45;font-style:italic;">(active #3project/probuy — empty = none active)</small>
> > ```dataview
> > TABLE WITHOUT ID
> >   file.link AS "Acquisition",
> >   amount AS "Budget",
> >   payee AS "Contact"
> > FROM #3project/probuy
> > WHERE status = "1active"
> > SORT due ASC
> > ```
>
>[[2_Areas/4_Organize/Plan/Shopping_Hub|➡️ Open Central Procurement Hub]]

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>


`BUTTON[freezer]`
