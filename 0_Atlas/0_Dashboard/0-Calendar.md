---
cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
---
# 🗒️ Logs
| [[0_Atlas/0_Dashboard/0-Calendar|📅Calendar]] | [[0_Atlas/Bases/Calendarbase.base|⚙️Calendarbase]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM|🌷PLM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM|🌻PPM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM|🌼PKM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard|🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard|🪙Finance]] | [[0_Atlas/0_Dashboard/7-Reviews|🛰️Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---
[[0_Atlas/Bases/Calendarbase.base|Calendarbase]] |
> [!multi-column]
> > [!blank|wide-0]
> > ### 🔱 **NEXUS NAVIGATOR**
> > 
> > ```dataviewjs
> > // 🔱 NEXUS DOUGHNUT: Kleiner & Kompakter
> > { 
> >     const nexusContainer = this.container;
> >     
> >     // Setzt die Größe des Containers (hier kannst du die px anpassen)
> >     nexusContainer.style.width = "300px";
> >     nexusContainer.style.margin = "0 auto"; // Zentriert den Chart
> >     
> >     if (nexusContainer.innerHTML.length < 50) {
> >         const entries = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > 
> >         const plm = entries.filter(p => dv.array(p.persona).some(m => ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun"].some(tag => String(m).includes(tag))) || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("plm"))).length;
> >         const ppm = entries.filter(p => dv.array(p.persona).some(m => ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic"].some(tag => String(m).includes(tag))) || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("ppm") && !String(t).toLowerCase().includes("study")))).length;
> >         const pkm = entries.filter(p => dv.array(p.persona).some(m => String(m).toLowerCase().includes("student") || String(m).toLowerCase().includes("analyst") || String(m).toLowerCase().includes("creator") || String(m).toLowerCase().includes("teacher") || String(m).toLowerCase().includes("author") || String(m).toLowerCase().includes("speaker") || String(m).toLowerCase().includes("explorer") || String(m).toLowerCase().includes("alchemist") || String(m).toLowerCase().includes("seeker") || String(m).toLowerCase().includes("mystic") || String(m).toLowerCase().includes("researcher") || String(m).toLowerCase().includes("archivist") || String(m).toLowerCase().includes("technician")) || dv.array(p.archtype).some(t => ["3pkm", "pkm", "study"].some(tag => String(t).toLowerCase().includes(tag)))).length;
> > 
> >         const dataValues = [plm, ppm, pkm];
> >         const hasData = dataValues.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: hasData ? ['Life', 'Manage', 'Knowledge'] : ['Empty Orbit'],
> >                 datasets: [{
> >                     data: hasData ? dataValues : [1],
> >                     backgroundColor: hasData ? ['#f5c2e7', '#a6e3a1', '#89dceb'] : ['var(--background-modifier-border)'],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: {
> >                 cutout: '75%',
> >                 maintainAspectRatio: true, // Behält die Form bei
> >                 plugins: {
> >                     legend: { 
> >                         position: 'bottom', 
> >                         labels: { color: textColor, font: { size: 9 } } // Kleinere Schrift für kleine Anzeige
> >                     }
> >                 }
> >             }
> >         };
> > 
> >         const attemptRender = setInterval(() => {
> >             if (window.renderChart) {
> >                 window.renderChart(chartData, nexusContainer);
> >                 clearInterval(attemptRender);
> >             }
> >         }, 150);
> >         
> >         setTimeout(() => clearInterval(attemptRender), 5000);
> >     }
> > }
> > 
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] 📊 Status & Records
> > ```dataviewjs
> > // 1. INITIALISIERUNG
> > if (window.nexusOffset === undefined) window.nexusOffset = 0;
> > const allLogs = dv.pages('!"zData" AND -"yArchive"')
> >     .where(p => p.inbox !== true)
> >     .where(p => p.cal_date || p.rev_end)
> >     .where(p => p.file.path.startsWith("0_Calendar/") || String(p.archtype || "").includes("projectlog"));
> > 
> > const config = {
> >     jou:    { trigger: 'plm',  fileSuffix: 'plm',  icon: '🌷', color: '#ff79c6' },
> >     log:    { trigger: 'ppm',  fileSuffix: 'ppm',  icon: '🌻', color: '#a6e3a1' },
> >     study:  { trigger: 'pkm',  fileSuffix: 'pkm',  icon: '🌼', color: '#89dceb' },
> >     prolog: { trigger: 'proj', fileSuffix: 'proj', icon: '🧩', color: '#ffb86c' },
> >     proto:  { trigger: 'prot', fileSuffix: 'prot', icon: '📜', color: '#8be9fd' },
> >     rev:    { trigger: 'rev',  fileSuffix: 'rev',  icon: '🛰️', color: '#50fa7b' }
> > };
> > const routerPath = 'zData/1tmpl/0calendarprompt.md';
> > 
> > const matchesType = (page, type, dateStr) => {
> >     const name = page.file.name.toLowerCase();
> >     const archtype = String(page.archtype || "").toLowerCase();
> >     const pageDate = String(page.cal_date || page.rev_end || "").substring(0, 10);
> >     if (pageDate !== dateStr && !name.startsWith(dateStr)) return false;
> >     if (type === 'prolog') return archtype.includes('projectlog') || name.startsWith(`${dateStr} proj`);
> >     if (type === 'proto') return archtype.includes('protocol') || name.startsWith(`${dateStr} prot`);
> >     if (type === 'rev') return archtype.includes('review') || name.includes('rev');
> >     return name.startsWith(`${dateStr} ${config[type].fileSuffix}`);
> > };
> > 
> > // 2. NAVIGATION
> > const nav = dv.el('div', '');
> > const currentMoment = moment().add(window.nexusOffset, 'months');
> > const currentMonthStr = currentMoment.format('MMMM YYYY');
> > 
> > nav.innerHTML = `
> > <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
> >     <button id="prevM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">⬅️</button>
> >     <b style="font-size: 1.3em; color: var(--interactive-accent); letter-spacing: 2px; text-shadow: 0 0 10px var(--interactive-accent)44;">🔱 ${currentMonthStr.toUpperCase()}</b>
> >     <button id="nextM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">➡️</button>
> > </div>`;
> > 
> > // 3. GRID BAUEN
> > const startOfMonth = moment(currentMoment).startOf('month');
> > const daysInMonth = startOfMonth.daysInMonth();
> > let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">';
> > const dayData = [];
> > 
> > for (let i = 0; i < daysInMonth; i++) {
> >     const mDate = moment(startOfMonth).add(i, 'days');
> >     const dStr = mDate.format('YYYY-MM-DD');
> >     const isToday = (dStr === moment().format('YYYY-MM-DD'));
> >     const isWeekend = (mDate.day() === 0 || mDate.day() === 6);
> > 
> >     const dayFiles = allLogs.filter(p =>
> >         p.file.name.includes(dStr) ||
> >         String(p.cal_date || "").substring(0, 10) === dStr ||
> >         String(p.rev_end || "").substring(0, 10) === dStr
> >     );
> >     const fitLog = dayFiles.find(p => p.mobility_am !== undefined || p.mobility_pm !== undefined);
> >     const fitTotal = (fitLog ? (Number(fitLog.mobility_am) || 0) + (Number(fitLog.mobility_pm) || 0) : 0);
> >     const energy = dayFiles.find(p => p.energy)?.energy || null;
> >     const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);
> > 
> >     const files = {};
> >     Object.keys(config).forEach(type => files[type] = dayFiles.find(p => matchesType(p, type, dStr)));
> >     dayData.push({ dStr, mDate, files });
> > 
> >     // 🎨 MULTI-FADE LOGIK
> >     let gradients = [];
> >     const hasJou = files.jou;
> >     const hasLog = files.log;
> >     const hasStudy = files.study;
> > 
> >     if (hasJou) gradients.push(`linear-gradient(90deg, ${config.jou.color}25 0%, transparent 50%)`);
> >     if (hasLog) gradients.push(`linear-gradient(180deg, ${config.log.color}25 0%, transparent 50%)`);
> >     if (hasStudy) gradients.push(`linear-gradient(270deg, ${config.study.color}25 0%, transparent 50%)`);
> >     
> >     const baseColor = isWeekend ? 'rgba(255,255,255,0.02)' : 'var(--background-secondary-alt)';
> >     const finalBg = gradients.length > 0 ? gradients.join(', ') + ', ' + baseColor : baseColor;
> > 
> >     gridHTML += `<div style="background: ${finalBg}; border: 1px solid rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 10px; display: flex; flex-direction: column; min-height: 135px; transition: transform 0.2s; ${isToday ? 'outline: 1.5px solid var(--interactive-accent); box-shadow: 0 0 15px var(--interactive-accent)33;' : ''}">`;
> >     
> >     // Header
> >     gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; opacity: 0.5;">
> >         <span style="font-size: 0.55em; font-weight: 900; text-transform: uppercase;">${mDate.format('ddd')}</span>
> >         <span style="font-size: 0.95em; font-weight: 800; ${isToday ? 'color: var(--interactive-accent);' : ''}">${mDate.format('DD')}</span>
> >     </div>`;
> > 
> >     // BLUMEN (🌷🌻🌼)
> >     gridHTML += `<div style="display: flex; justify-content: space-around; margin: 4px 0 10px 0;">`;
> >     ['jou', 'log', 'study'].forEach(k => {
> >         const ex = files[k];
> >         const style = ex ? `opacity: 1; filter: drop-shadow(0 0 5px ${config[k].color}); transform: scale(1.1);` : `opacity: 0.1; filter: grayscale(1);`;
> >         gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.5em; cursor: pointer;">${config[k].icon}</span>`;
> >     });
> >     gridHTML += `</div>`;
> > 
> >     // PROJEKTE (🧩📜🛰️)
> >     gridHTML += `<div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 6px;">`;
> >     ['prolog', 'proto', 'rev'].forEach(k => {
> >         const ex = files[k];
> >         const style = ex ? `opacity: 1; filter: drop-shadow(0 0 3px ${config[k].color});` : `opacity: 0.15; filter: grayscale(1);`;
> >         gridHTML += `<span class="${k}-btn" data-idx="${dayData.length-1}" style="${style} font-size: 1.15em; cursor: pointer;">${config[k].icon}</span>`;
> >     });
> >     gridHTML += `</div>`;
> > 
> >     // FOOTER
> >     gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 5px;">`;
> >     gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; min-height: 18px;">`;
> >     gridHTML += fitTotal > 0 ? `<span style="font-size: 0.65em; color: ${config.rev.color}; font-weight: 800; opacity: 0.8;">🏃 ${fitTotal}m</span>` : `<span></span>`;
> >     gridHTML += tasks > 0 ? `<span style="font-size: 0.8em; filter: drop-shadow(0 0 3px #ff5555); font-weight: 900;">🔨 ${tasks}</span>` : `<span></span>`;
> >     gridHTML += `</div>`;
> >     
> >     if (energy) {
> >         gridHTML += `<div style="width: 100%; height: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden;"><div style="width: ${(energy/5)*100}%; height: 100%; background: ${energy >= 4 ? config.rev.color : (energy >= 3 ? config.log.color : '#ff5555')}; box-shadow: 0 0 5px currentColor;"></div></div>`;
> >     }
> >     gridHTML += `</div></div>`;
> > }
> > 
> > const renderTarget = dv.el('div', gridHTML + '</div>');
> > 
> > // 4. KLICK-LOGIK
> > const handleBtnClick = async (type, idx) => {
> >     if (window._nexusCalendarRunning) return;
> >     window._nexusCalendarRunning = true;
> > 
> >     try {
> >     const data = dayData[idx];
> >     const existing = data.files[type];
> >     if (existing) {
> >         const file = app.vault.getAbstractFileByPath(existing.file.path);
> >         if (file) await app.workspace.getLeaf('tab').openFile(file);
> >         return;
> >     }
> > 
> >     const plugin = app.plugins.plugins['templater-obsidian'];
> >     const routerFile = app.vault.getAbstractFileByPath(routerPath);
> >     const inbox = app.vault.getAbstractFileByPath('0_Inbox');
> >     if (!plugin || !routerFile || !inbox) {
> >         new Notice('Calendar UI: Templater, Router oder 0_Inbox fehlt.');
> >         return;
> >     }
> > 
> >     const vars = plugin.templater.variables || (plugin.templater.variables = {});
> >     ['preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule','energy']
> >         .forEach(key => delete vars[key]);
> >     vars.targetDate = data.dStr;
> >     vars.activeTrigger = config[type].trigger;
> >     vars.title = '';
> > 
> >     try {
> >         await plugin.templater.create_new_note_from_template(
> >             routerFile,
> >             inbox,
> >             `${data.dStr} ${config[type].trigger}`,
> >             true
> >         );
> >     } finally {
> >         ['targetDate','activeTrigger','title','preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule']
> >             .forEach(key => delete vars[key]);
> >     }
> >     } catch (error) {
> >         console.error('Calendar UI Error:', error);
> >         new Notice('Calendar UI: Erstellung fehlgeschlagen. Details stehen in der Konsole.');
> >     } finally {
> >         window._nexusCalendarRunning = false;
> >     }
> > };
> > 
> > // Event-Binding
> > nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
> > nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
> > 
> > Object.keys(config).forEach(type => {
> >     renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
> >         btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
> >     });
> > });
> > 
> > ```



> [!multi-column]
> > [!calendar|wide-0] ** Week**
> > ```dataviewjs
> > await dv.view("zData/tasksCalendar", {pages: "", view: "week", firstDayOfWeek: "0", options: "style1"})
> > ```
> 
> > [!calendar|wide-5] **Month**
> > ```dataviewjs
> > await dv.view("zData/tasksCalendar", {pages: "", view: "month", firstDayOfWeek: "0", options: "style2"})
> > ```
