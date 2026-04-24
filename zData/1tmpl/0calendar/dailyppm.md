<%-*
// 🔱 1. INITIALIZATION & DATA SYNC
if (!tp.variables) tp.variables = {};
const dv = app.plugins.plugins.dataview.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. SMART CLEAN & FALLBACK (Für Direkt-Start ohne Prompt)
// Erkennt "Untitled" oder den "Entry-..." Platzhalter vom Router
let currentFileTitle = tp.variables.title || tp.file.title;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [year, month] = dateStr.split("-");

const isPlaceholder = currentFileTitle.toLowerCase().includes(defaultName.toLowerCase()) || /Entry-\d{2}-\d{2}/.test(currentFileTitle);

let cleanPart = "";

if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanPart = tp.variables.title; // Übernahme vom Router/Prompt
} else {
    const untitledPattern = new RegExp(defaultName + "(\\s\\d+)?", "i");
    // Manueller Fallback: Wir filtern Platzhalter, "plm" und das Datum heraus
    cleanPart = currentFileTitle.replace(/Entry-\d{2}-\d{2}/i, "")
                                .replace(untitledPattern, "")
                                .replace(new RegExp(defaultName, "i"), "")
                                .replace(/^\d{4}-\d{2}-\d{2}/, "")
                                .replace(/ppm/i, "")
                                .replace(/^- /, "")
                                .trim();
}

// 🔱 2.1 PPM-SPEZIFIKUM: Falls leer, fragen wir nach dem strategischen Fokus
if (!cleanPart || cleanPart.toLowerCase() === "daily log") {
    const focus = await tp.system.prompt("🌻 Nexus PPM: Strategic Focus for today?", "");
}

// Finalen Titel konstruieren
let finalTitle = `${dateStr} ppm${cleanPart ? " - " + cleanPart : ""}`;
const pureFocus = cleanPart || "";
// 🔱 3. DATEI-STABILISIERUNG (Physisches Umbenennen)
// Bei manuellem Start wird die Datei hier korrekt umbenannt.
if (currentFileTitle !== finalTitle) {
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

// 🔱 5. SYNC: VERBUNDENE FOCI (PLM & PKM)
const [y, m] = dateStr.split("-");
const plmPath = `0_Calendar/1_PLM/${y}/${m}/${dateStr} plm`;
const pkmPath = `0_Calendar/3_PKM/${y}/${m}/${dateStr} pkm`;

const plmPage = dv ? dv.page(plmPath) : null; const pkmPage = dv ? dv.page(pkmPath) : null; 

const aim1Focus = plmPage ? (plmPage.focusD_plm || "") : "";
const aim3Focus = pkmPage ? (pkmPage.focusD_pkm || "") : "";

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
        focusM_Date = lastLog.focusMdate || lastLog["cal_date"] || dateStr;
    }
}
// 🧹 5.4 FINAL NEXUS HOUSEHOLD ENGINE (Weekend Lockdown Edition)
const dayOfWeek = moment(dateStr).format("dddd"); 

const chores = {
    "Monday":    ["Weekly Grocery Run 🛒", "Floor (Vacuum & Mop) 🧼"], // Power-Start
    "Tuesday":   ["Bathroom (Toilet & Sink)", "Mirror Polish"],
    "Wednesday": ["Kitchen Deep Clean", "Fridge Check"],
    "Thursday":  ["Fresh Supply Refill 🛒", "Floor (Vacuum & Mop) 🧼"], // Weekend-Vorbereitung
    "Friday":    ["Bathroom (Shower & Floor)", "Laundry Day 🧺"],    // Letzte Tasks vor dem Weekend
    "Saturday":  ["OFF - System Idle 💠", "Rest & Recharge"],         // Absolutes Minimum / Nichts
    "Sunday":    ["Selfcare Sanctuary 🧘", "Mental Alignment 💎"]     // Nur Fokus auf dich
};

const taskPair = chores[dayOfWeek] || ["Maintenance", "Idle"];

// Variablen für Frontmatter setzen
tp.variables.maintask5 = taskPair[0];
tp.variables.maintask6 = taskPair[1];

// Falls im aktuellen Frontmatter schon was steht (manuelle Änderung), behalten wir das
if (tp.frontmatter && tp.frontmatter.focusM_ppm) {
    focusM_ppm = tp.frontmatter.focusM_ppm;
}
// 🔱 6. FINAL LOGISTICS (Folder-Check & Move)
const targetFolder = `0_Calendar/2_PPM/${y}/${m}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;

// Monthly Focus Start (falls nicht gesetzt)
const focusStart = (tp.frontmatter && tp.frontmatter.focusM_start) ? tp.frontmatter.focusM_start : dateStr;

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
area2: ["4_Organize"]
project3:
task4:
note5: []
resource6:
focusD_plm: "<%- aim1Focus %>"
focusD_ppm: "<%- pureFocus %>"
focusD_pkm: "<%- aim3Focus %>"
focusM_ppm: "<%- focusM_ppm %>"
focusM_start: "<%- focusStart %>"
maintask1: ""
maintask2: ""
maintask3: ""
maintask4: ""
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
> > > <small>Monthly Cycle:</small>
> > > `INPUT[text:focusM_ppm]` `BUTTON[reset-focus]` <small style="opacity:0.5;">`$= Math.max(0,30 - moment().diff(moment(dv.current().focusM_start),"days"))`d left</small>
> > > 
> > > ---
> > > ```dataviewjs
> > > const curr = dv.current();
> > > const logDate = curr.file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
> > > const [yy, mm] = logDate.split("-");
> > > 
> > > const plm = dv.page(`0_Calendar/1_PLM/${yy}/${mm}/${logDate} plm`);
> > > const pkm = dv.page(`0_Calendar/3_PKM/${yy}/${mm}/${logDate} pkm`);
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
> > > 1. **`INPUT[text:maintask1]`**
> > > 2. **`INPUT[text:maintask2]`**
> > > 3. `INPUT[text:maintask3]`
> > > 4. `INPUT[text:maintask4]`
> > > 5. <small>🧹</small> `INPUT[text:maintask5]`
> > > 6. <small>🧹</small> `INPUT[text:maintask6]`


##### Sidequest /Braindump
- 



## 🛠️ Management & Fokus
> [!multi-column]
> > [!calendar|wide-0] ⏳ Zeit-Matrix
> > ```dataviewjs
> > (() => {
> >   if (dv.viewCount && dv.viewCount > 1) return; // ruhig bleiben
> >   const hours = ['08','09','10','11','12','13','14','15','16','17','18','19','20'];
> >   const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dv.current().file.name;
> >   const archIcons = { "#0cal":"📅", "#1stars":"✨", "#2area":"💠", "#3project":"🚧", "#4task":"🛠️", "#5note":"✏️", "#6resou":"🔖" };
> >   const items = [];
> >   dv.pages('"4_Tasks"').forEach(p => {
> >     let typeIcon = "";
> >     const archTags = Array.isArray(p.arch) ? p.arch : [p.arch];
> >     for (const tag of archTags) { if (archIcons[tag]) { typeIcon = archIcons[tag] + " "; break; } }
> >     const finalIcon = p.banner_icon ? p.banner_icon + " " : typeIcon;
> >     if ((p.due && String(p.due).includes(logDate)) || (p.do && String(p.do).includes(logDate))) {
> >         items.push({ link: p.file.link, due: p.due, do: p.do, arch: p.arch, icon: finalIcon, origin: null });
> >     }
> >     if (p.file.tasks) {
> >         p.file.tasks.filter(t => !t.completed && t.due && String(t.due).includes(logDate)).forEach(t => {
> >             items.push({ link: dv.sectionLink(p.file.path, t.section.subpath, false, t.text), due: t.due, do: null, arch: p.arch, icon: finalIcon, origin: p.file.link });
> >         });
> >     }
> >   });
> >   const getArchTag = (item) => {
> >      if (!item.arch) return '4_Tasks';
> >      const a = Array.isArray(item.arch) ? item.arch.find(t => String(t).includes("4task")) : item.arch;
> >      return a ? String(a).replace("#","") : '4_Tasks';
> >   };
> >   const archs = [...new Set(items.map(i => getArchTag(i)))].sort();
> >   const formatItem = (i, colName) => {
> >       const icon = (colName === "4_Tasks") ? "" : i.icon;
> >       let text = icon + i.link;
> >       if (i.origin) text += ` <small style="opacity:0.4;font-style:italic;">(${i.origin})</small>`;
> >       return text;
> >   };
> >   const untimedRow = [
> >      `*All-day*`,
> >      ...archs.map(a => {
> >         const matches = items.filter(i => {
> >            const hasNoTime = !String(i.due || i.do).includes('T');
> >            const isMidnight = String(i.due || i.do).includes('T00:00');
> >            return getArchTag(i) === a && (hasNoTime || isMidnight);
> >         });
> >         return matches.length ? matches.map(i => formatItem(i, a)).join('<br>') : '';
> >      })
> >   ];
> >   const timedRows = hours.map(h => [
> >      `**${h}:00**`,
> >      ...archs.map(a => {
> >         const matches = items.filter(i => getArchTag(i) === a &&
> >            ((i.due && String(i.due).includes('T'+h+':')) || (i.do && String(i.do).includes('T'+h+':')))
> >         );
> >         return matches.length ? matches.map(i => formatItem(i, a)).join('<br>') : '';
> >      })
> >   ]);
> >   dv.table(['Time', ...archs], [untimedRow, ...timedRows]);
> >   const style = document.createElement('style');
> >   style.innerHTML = `
> >   .dataview.table-view-table thead th { display: table-cell !important; border-bottom: 1px solid var(--background-modifier-border) !important; font-weight: normal; opacity: 0.4; font-size: 0.75em; text-transform: uppercase; }
> >   .dataview.table-view-table td { border-bottom: 0.5px solid var(--background-modifier-border-soft) !important; padding: 6px 4px !important; border-left: none !important; border-right: none !important; }
> >   .dataview.table-view-table td:first-child { font-size: 1.05em !important; opacity: 0.7; width: 75px; vertical-align: top; }
> >   `;
> >   dv.container.appendChild(style);
> > })();
> > ```
>
> > [!decent|wide-4]
> > ```dataviewjs
> > (() => {
> >   if (dv.viewCount && dv.viewCount > 1) return; // ruhig bleiben
> >   const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0] || moment().format("YYYY-MM-DD");
> >   const today = moment(logDate);
> >   const nextWeek = moment(logDate).add(7,'days');
> >   const getPrioIcon = (p) => ({"1":"🔴","2":"🟠","3":"🟡","4":"🔵"}[p] || "⚪");
> >   const allItems = [];
> >   dv.pages().where(p => p.arch && String(p.arch).includes("#4task") && !p.completed).forEach(p => {
> >       allItems.push({ text: p.file.name, date: p.due || p.do, priority: p.priority || p.prio || "0", link: p.file.link });
> >   });
> >   const overdue = allItems.filter(t => t.date && moment(String(t.date)).isBefore(today,'day'));
> >   const focus   = allItems.filter(t => String(t.date).includes(logDate));
> >   const radar   = allItems.filter(t => { const d = moment(String(t.date)); return d.isAfter(today,'day') && d.isSameOrBefore(nextWeek,'day'); });
> >   const format = (t) => `- [ ] ${getPrioIcon(t.priority)} ${t.link}`;
> >   const hub = [
> >     "> [!multi-column]",
> >     "> > [!danger|flat] ⚠️ Overdue",
> >     (overdue.length ? overdue.map(t => "> > " + format(t)).join("\n") : "> > _Clear!_"),
> >     ">",
> >     "> > [!task|flat] ⚡ Today",
> >     (focus.length ? focus.map(t => "> > " + format(t)).join("\n") : "> > _All done!_"),
> >     ">",
> >     "> > [!abstract|flat] 📅 Radar",
> >     (radar.length ? radar.map(t => "> > " + format(t)).join("\n") : "> > _Nothing._")
> >   ].join("\n");
> >   dv.paragraph(hub);
> > })();
> > ```

<%-* if (Number(energy) >= 5) { -%>

> [!project] 🚀 Project Nexus (Level 5 Energy)
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
---
## 🛒 Procurement & Supply

> [!multi-column]
>
> > [!info|flat] 🧊 Nutrition Requirements (Batch Calculation)
> > ```dataviewjs
> > const planPath = "2_Areas/1_Selfcare/Nutrition/Meal_Plan.md";
> > const planPage = dv.page(planPath);
> > const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
> > let Nexus;
> > try { Nexus = await (require(enginePath))(app); } catch(e) {}
> > 
> > if (!planPage) {
> >     dv.paragraph("❌ _No meal plan found._");
> > } else {
> >     const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
> >     const slots = ["brk", "ben", "snk", "eve"];
> >     
> >     // 🔱 THE SHOPPING DAY LOGIC (Look-Ahead)
> >     const todayIdx = moment().day();
> >     let lookAhead = (todayIdx === 1) ? 3 : (todayIdx === 4 ? 4 : 1);
> >     let periodText = (todayIdx === 1) ? "Mon-Wed (3 Days)" : (todayIdx === 4 ? "Thu-Sun (4 Days)" : "Next 24h");
> >     
> >     let recipeCounts = {}; 
> > 
> >     // 1. Calculate Consumption Need for specific period
> >     for (let i = 0; i < lookAhead; i++) {
> >         const dayStr = days[(todayIdx + i) % 7];
> >         for (let slot of slots) {
> >             let meals = planPage[`${dayStr}_${slot}`];
> >             if (!meals) continue;
> >             let mealArray = Array.isArray(meals) ? meals : [meals];
> >             for (let m of mealArray) {
> >                 const cleanId = String(m).replace(/[\[\]"]/g, "").trim();
> >                 recipeCounts[cleanId] = (recipeCounts[cleanId] || 0) + 1;
> >             }
> >         }
> >     }
> > 
> >     let neededAtoms = {};
> > 
> >     // 2. Inventory & Batch Calculation
> >     for (let [recipeName, neededServings] of Object.entries(recipeCounts)) {
> >         const recipe = dv.page(recipeName);
> >         if (!recipe) continue;
> > 
> >         let stored = Number(recipe.portions_stored) || 0;
> >         let pDate = recipe.prep_date ? moment(String(recipe.prep_date)) : null;
> >         let shelfLife = Number(recipe.prep_shelf_life) || 4; 
> >         let isExpired = (stored > 0 && pDate && moment().diff(pDate, 'days') > shelfLife);
> >         
> >         if (isExpired) stored = 0; // Expired stock is ignored
> > 
> >         let deficit = neededServings - stored;
> >         let rYield = Number(recipe.portions) || 1; 
> > 
> >         if (deficit > 0) {
> >             let batchesToCook = Math.ceil(deficit / rYield);
> >             for (let key in recipe) {
> >                 if (key.startsWith("amt_")) {
> >                     const atomId = key.replace("amt_", "");
> >                     const amountPerBatch = Number(recipe[key]) || 0;
> >                     neededAtoms[atomId] = (neededAtoms[atomId] || 0) + (amountPerBatch * batchesToCook);
> >                 }
> >             }
> >         }
> >     }
> > 
> >     // 3. UI Generation (Clean Design & English)
> >     dv.paragraph(`<div style="font-size: 0.8em; opacity: 0.6; margin-bottom: 8px; text-transform: uppercase;">Scanning: <b>${periodText}</b></div>`);
> >     
> >     let html = `<div style="display: flex; flex-direction: column; gap: 6px;">`;
> >     const sortedAtoms = Object.entries(neededAtoms).sort();
> >     
> >     if (sortedAtoms.length > 0) {
> >         sortedAtoms.forEach(([id, amount]) => {
> >             const item = Nexus ? Nexus.find(id) : null;
> >             const label = item ? (item.label || id) : id.replace(/_/g, " ");
> >             const icon = item ? (item.icon || "📦") : "📦";
> >             const unit = item ? item.unit : "Stk";
> >             const val = Math.round(amount * 10) / 10;
> >             
> >             html += `<div style="display: flex; justify-content: space-between; padding: 6px 10px; background: var(--background-secondary-alt); border-radius: 6px; border-left: 3px solid var(--interactive-accent); font-size: 0.9em;">
> >                 <span>${icon} <b>${label}</b></span>
> >                 <span style="opacity:0.8; font-family: monospace;">${val} ${unit}</span>
> >             </div>`;
> >         });
> >     } else {
> >         html += `<div style="padding: 10px; opacity: 0.6; text-align: center; background: var(--background-secondary); border-radius: 6px;">_Inventory stable. No batch ingredients needed._</div>`;
> >     }
> >     html += `</div>`;
> >     dv.paragraph(html);
> > }
> > ```
> > <br>[[2_Areas/4_Organize/Shopping_Hub|➡️ Open Central Procurement Hub]]
>
> > [!todo|flat] 📝 Active Procurement (Manual)
> > **Household & Quick Extras:**
> > `INPUT[inlineListSuggester(optionQuery("")):shopping_extras]`
> > <br>
> > ```dataview
> > TABLE WITHOUT ID 
> >   text AS "Item", 
> >   link(file.path, file.name) AS "Origin / Project"
> > FROM #4task/tobuy
> > WHERE !completed
> > SORT due ASC
> > ```


<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>


`BUTTON[freezer]`



