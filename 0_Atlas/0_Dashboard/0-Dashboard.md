---
banner: "![[xAttachment/Images/Banner/violet sky ocean.jpg]]"
banner_y: 0.316
banner_icon: 💫
status:
cssclasses:
  - wide-page
  - dashboard-no-border
---

# 💫 Dashboard
| [[0_Atlas/0_Dashboard/0-Dashboard|💫 Dashy]] | [[0_Atlas/0_Dashboard/0-Inbox|💌 Inbox]] | [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] |[[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard-PKM| 🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard| 🪙 Finance]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Review|🔭 Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

--- 
>[!multi-column]
> 
> > [!blank|wide-0] 
> > ### 🔱 **NEXUS NAVIGATOR**
> > 
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     const REFRESH_COOLDOWN = 30000; // 30 Sekunden Sperre gegen Tipp-Aktualisierung
> >     const now = Date.now();
> > 
> >     // 🔱 1. PERFORMANCE-CHECK
> >     // Wir speichern den Zeitstempel des letzten Renders global im Fenster
> >     if (!window.lastNexusChartRender) window.lastNexusChartRender = 0;
> >     
> >     // Setzt die Größe des Containers (hier kannst du die px anpassen)
> >     chartContainer.style.width = "300px";
> >     chartContainer.style.margin = "0 auto"; // Zentriert den Chart
> >    
> >     // Nur ausführen, wenn kein Chart da ist ODER die Sperrzeit abgelaufen ist
> >     const shouldRender = !chartContainer.querySelector('canvas') || (now - window.lastNexusChartRender > REFRESH_COOLDOWN);
> > 
> >     if (shouldRender) {
> >         window.lastNexusChartRender = now; // Zeitstempel setzen
> > 
> >         const CACHE_KEY = "nexus-pie-cache";
> >         const CACHE_TIME = 60 * 60 * 1000; 
> >         const lastUpdate = localStorage.getItem(CACHE_KEY + "-time");
> >         let cachedData = localStorage.getItem(CACHE_KEY);
> > 
> >         const getFreshData = () => {
> >             const start = moment().subtract(7, 'days').startOf('day');
> >             const entries = dv.pages('!"zData"').where(p => 
> >                 p.file.ctime >= start || (p['cal-date'] && moment(p['cal-date'].toString()).isAfter(start))
> >             );
> > 
> >             const plm = entries.filter(p => 
> >                 dv.array(p.persona).some(m => ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun"].some(tag => String(m).toLowerCase().includes(tag))) || 
> >                 dv.array(p.archtype).some(t => ["1plm", "plm"].some(tag => String(t).toLowerCase().includes(tag)))
> >             ).length;
> > 
> >             const ppm = entries.filter(p => 
> >                 dv.array(p.persona).some(m => ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic"].some(tag => String(m).toLowerCase().includes(tag))) || 
> >                 dv.array(p.archtype).some(t => ["2ppm", "ppm"].some(tag => String(t).toLowerCase().includes(tag)))
> >             ).length;
> > 
> >             const pkm = entries.filter(p => 
> >                 dv.array(p.persona).some(m => String(m).toLowerCase().includes("student") || String(m).toLowerCase().includes("analyst") || String(m).toLowerCase().includes("creator") || String(m).toLowerCase().includes("teacher") || String(m).toLowerCase().includes("author") || String(m).toLowerCase().includes("speaker") || String(m).toLowerCase().includes("explorer") || String(m).toLowerCase().includes("alchemist") || String(m).toLowerCase().includes("seeker") || String(m).toLowerCase().includes("mystic") || String(m).toLowerCase().includes("researcher") || String(m).toLowerCase().includes("archivist") || String(m).toLowerCase().includes("technician")) || 
> >                 dv.array(p.archtype).some(t => ["3pkm", "pkm", "study"].some(tag => String(t).toLowerCase().includes(tag)))
> >             ).length;
> >             
> >             const data = [plm, ppm, pkm];
> >             localStorage.setItem(CACHE_KEY, JSON.stringify(data));
> >             localStorage.setItem(CACHE_KEY + "-time", now.toString());
> >             return data;
> >         };
> > 
> >         const dataToRender = (cachedData && lastUpdate && (now - lastUpdate < CACHE_TIME)) 
> >             ? JSON.parse(cachedData) 
> >             : getFreshData();
> > 
> >         const hasData = dataToRender.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: hasData ? ['Life', 'Manage', 'Knowledge'] : ['Empty Orbit'],
> >                 datasets: [{
> >                     data: hasData ? dataToRender : [1],
> >                     backgroundColor: hasData ? ['#f5c2e7', '#a6e3a1', '#89dceb'] : ['var(--background-modifier-border)'],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: { 
> >                 cutout: '75%', 
> >                 animation: false, // Animation aus, damit es beim Tippen nicht springt
> >                 plugins: { 
> >                     legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } 
> >                 } 
> >             }
> >         };
> > 
> >         const renderInterval = setInterval(() => {
> >             if (window.renderChart) {
> >                 const oldCanvas = chartContainer.querySelector('canvas');
> >                 if (oldCanvas) oldCanvas.remove();
> >                 
> >                 window.renderChart(chartData, chartContainer);
> >                 clearInterval(renderInterval);
> >             }
> >         }, 150);
> >         setTimeout(() => clearInterval(renderInterval), 5000);
> >     }
> > }
> > 
> > ``` 
> > ---
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5] 📊 Status & Records
> > > [!multi-column]
> > > 
> > > > [!pink] **🌷 LIFE (PLM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar"')
> > > >             .where(p => dv.array(p.persona).some(m => ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun"].some(tag => String(m).includes(tag))) 
> > > >                      || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("plm")))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             const color = "#ff79c6";
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌷</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PLM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > > 
> > > > [!success] **🌻 MANAGE (PPM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar"')
> > > >             .where(p => dv.array(p.persona).some(m => ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic"].some(tag => String(m).includes(tag))) 
> > > >                      || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("ppm") && !String(t).toLowerCase().includes("study"))))
> > > >             .where(p => !dv.array(p.status).includes("done"))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             const color = "#a6e3a1";
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌻</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PPM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > > 
> > > > [!info] **🌼 KNOWLEDGE (PKM)**  
> > > > ```dataviewjs
> > > > {
> > > >     const container = this.container;
> > > >     if (container.innerHTML.length < 50) {
> > > >         const pages = dv.pages('!"zData" and !"0_Calendar"')
> > > >             .where(p => dv.array(p.persona).some(m => String(m).includes("study")) 
> > > >                      || (p.discipline && dv.array(p.discipline).length > 0) 
> > > >                      || dv.array(p.archtype).some(t => ["3pkm", "pkm", "study"].some(tag => String(t).toLowerCase().includes(tag)))
> > > >                      || dv.array(p.arch).includes("#5✏"))
> > > >             .sort(p => p.file.mtime, "desc").limit(5);
> > > > 
> > > >         let html = `<div style="display: flex; flex-direction: column; gap: 4px; padding: 5px 0;">`;
> > > >         pages.forEach(p => {
> > > >             let color = "#89dceb"; 
> > > >             if (p.file.path.includes("Permanent")) color = "#ffd700";
> > > >             if (p.file.path.includes("Literatur")) color = "#4169e1";
> > > >             if (p.file.path.includes("Evergreen")) color = "#228b22";
> > > >             
> > > >             const auroraBg = `linear-gradient(270deg, ${color}15 0%, transparent 95%)`;
> > > >             
> > > >             html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px; box-shadow: -2px 0 8px ${color}33;">
> > > >                 <div style="display: flex; align-items: center; gap: 10px;">
> > > >                     <span style="font-size: 1.1em;">🌼</span>
> > > >                     <span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px;">PKM</span>
> > > >                 </div>
> > > >                 <div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px;">
> > > >                     <a class="internal-link" href="${p.file.path}" style="text-decoration: none; color: var(--text-normal); font-size: 0.78em; font-weight: 500; opacity: 0.9;">${p.file.name}</a>
> > > >                     <div style="font-size: 0.52em; color: var(--text-faint); margin-top: -1px; opacity: 0.6;">${moment(p.file.mtime.toString()).fromNow()}</div>
> > > >                 </div>
> > > >             </div>`;
> > > >         });
> > > >         dv.el("div", html + `</div>`);
> > > >     }
> > > > }
> > > > ```
> > 
> > 
> > 
> > > > 
> > > > 
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     const REFRESH_COOLDOWN = 30000; // 30 Sekunden Sperre gegen Flackern
> >     const now = Date.now();
> > 
> >     if (!window.lastHeatmapRender) window.lastHeatmapRender = 0;
> >     const shouldRender = !chartContainer.querySelector('.heatmap-grid') || (now - window.lastHeatmapRender > REFRESH_COOLDOWN);
> > 
> >     if (shouldRender) {
> >         window.lastHeatmapRender = now;
> > 
> >         const days = 14; 
> >         const allPages = dv.pages('!"zData"'); 
> > 
> >         const getNoteDate = (p) => {
> >             if (p.file.path.includes("0_Calendar")) {
> >                 if (/^\d{4}-\d{2}-\d{2}/.test(p.file.name)) return p.file.name.substring(0, 10);
> >                 if (p['cal-date']) return String(p['cal-date']).substring(0, 10);
> >             }
> >             return moment(p.file.cday.toString()).format("YYYY-MM-DD");
> >         };
> > 
> >         const checkYaml = (p, field, value) => {
> >             if (!p || !p[field]) return false;
> >             const val = p[field];
> >             return Array.isArray(val) 
> >                 ? val.some(v => String(v).toLowerCase().includes(value.toLowerCase())) 
> >                 : String(val).toLowerCase().includes(value.toLowerCase());
> >         };
> > 
> >         const getIcon = (icon, exists) => `<span style='opacity: ${exists ? "1" : "0.12"}; filter: ${exists ? "none" : "grayscale(100%)"}; margin: 0 1px;'>${icon}</span>`;
> > 
> >         // 🔱 GRID-CONTAINER (7 Spalten für 14 Tage)
> >         let tableHTML = "<div class='heatmap-grid' style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; width: 100%;'>";
> > 
> >         for (let i = days - 1; i >= 0; i--) {
> >             let mDate = moment().subtract(i, 'days');
> >             let dateStr = mDate.format("YYYY-MM-DD");
> >             let isToday = (dateStr === moment().format("YYYY-MM-DD"));
> >             let dayPages = allPages.filter(p => getNoteDate(p) === dateStr);
> > 
> >             tableHTML += `<div style='padding: 6px 2px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
> >             tableHTML += `<div style='font-size: 0.5em; color: var(--text-muted);'>${mDate.format("ddd")}</div>`;
> >             tableHTML += `<div style='font-size: 0.75em; font-weight: 800; margin-bottom: 2px;'>${mDate.format("DD.MM.")}</div>`;
> >             
> >             // ROW 1: CALENDAR (Journal, Log, Study)
> >             tableHTML += "<div>" + 
> >                 getIcon("🌷", dayPages.some(p => checkYaml(p, 'archtype', 'plm'))) + 
> >                 getIcon("🌻", dayPages.some(p => checkYaml(p, 'archtype', 'ppm') && !checkYaml(p, 'archtype', 'studylog'))) + 
> >                 getIcon("🌼", dayPages.some(p => checkYaml(p, 'archtype', 'pkm'))) + 
> >             "</div>";
> > 
> >             // ROW 2: STARS (Purpose, Vision, Goals)
> >             tableHTML += "<div>" + 
> >                 getIcon("🌟", dayPages.some(p => checkYaml(p, 'archtype', '1purpose'))) + 
> >                 getIcon("🧭", dayPages.some(p => checkYaml(p, 'archtype', '2vision'))) + 
> >                 getIcon("🎯", dayPages.some(p => checkYaml(p, 'archtype', '3goals'))) + 
> >             "</div>";
> > 
> >             // ROW 3: AREAS (Chakren 1-7)
> >             tableHTML += "<div style='font-size: 0.75em;'>" + 
> >                 getIcon("🌸", dayPages.some(p => checkYaml(p, 'archtype', '1selfcare'))) + 
> >                 getIcon("🦄", dayPages.some(p => checkYaml(p, 'archtype', '2relationship'))) + 
> >                 getIcon("🧠", dayPages.some(p => checkYaml(p, 'archtype', '3mind'))) + 
> >                 getIcon("🧩", dayPages.some(p => checkYaml(p, 'archtype', '4organize'))) + 
> >                 getIcon("🎨", dayPages.some(p => checkYaml(p, 'archtype', '5creativity'))) + 
> >                 getIcon("🚵🏽", dayPages.some(p => checkYaml(p, 'archtype', '6activity'))) + 
> >                 getIcon("🕹️", dayPages.some(p => checkYaml(p, 'archtype', '7entertain'))) + 
> >             "</div>";
> > 
> >             // ROW 4: ACTION (Projects, Tasks, Notes)
> >             tableHTML += "<div style='margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>" + 
> >                 getIcon("🚧", dayPages.some(p => checkYaml(p, 'arch', '#3project'))) + 
> >                 getIcon("🛠️", dayPages.some(p => checkYaml(p, 'arch', '#4task'))) + 
> >                 getIcon("✏️", dayPages.some(p => checkYaml(p, 'arch', '#5note'))) + 
> >             "</div>";
> > 
> >             tableHTML += "</div>"; // Schließt Tages-Box
> >         }
> > 
> >         tableHTML += "</div>";
> >         dv.el("div", tableHTML);
> >     }
> > }
> > 
> > ```
>   











