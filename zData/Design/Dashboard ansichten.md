



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
> >         const entries = dv.pages('!"z-Data"');
> > 
> >         const plm = entries.filter(p => dv.array(p.persona).some(m => ["healer", "selfcare", "mother-father", "partner", "friend", "traveler"].some(tag => String(m).includes(tag))) || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("journal"))).length;
> >         const ppm = entries.filter(p => dv.array(p.persona).some(m => ["worker", "trainer", "queen-king", "organizer", "manager"].some(tag => String(m).includes(tag))) || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("log") && !String(t).toLowerCase().includes("study")))).length;
> >         const pkm = entries.filter(p => dv.array(p.persona).some(m => String(m).includes("student") || String(m).includes("study")) || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("study"))).length;
> > 
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: ['🌷 Life', '🌻 Manage', '🌼 Knowledge'],
> >                 datasets: [{
> >                     data: [plm, ppm, pkm],
> >                     backgroundColor: ['#f5c2e7', '#a6e3a1', '#89dceb'],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: {
> >                 cutout: '75%',
> >                 maintainAspectRatio: true, // Behält die Form bei
> >                 plugins: {
> >                     legend: { 
> >                         position: 'bottom', 
> >                         labels: { color: '#a6adc8', font: { size: 9 } } // Kleinere Schrift für kleine Anzeige
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
> > ### Quick Capture
> > 
> > `BUTTON[stars-btn]` `BUTTON[a-btn]` `BUTTON[p-btn]` `BUTTON[t-btn]` `BUTTON[n-btn]` `BUTTON[r-btn]` 
> > 
> >
> > > [!blank]
> > > ### 🌙 Last Logs
> > >
> > > ```dataviewjs
> > > {
> > >     const logContainer = this.container;
> > >     if (logContainer.innerHTML.length < 50) {
> > >         const allLogs = dv.pages('"0-Calendar"'); 
> > >         const config = [
> > >             { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '🌷' },
> > >             { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '🌻' },
> > >             { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '🌼' },
> > >             { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '🧩' },
> > >             { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '📜' },
> > >             { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '🛰️' }
> > >         ];
> > > 
> > >         let html = '<div style="display: flex; flex-direction: column; gap: 3px; padding: 5px 0;">';
> > > 
> > >         config.forEach(cfg => {
> > >             const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
> > >             const exists = !!file;
> > >             
> > >             const dotStyle = exists 
> > >                 ? 'background: ' + cfg.color + '; box-shadow: 0 0 8px ' + cfg.color + ';' 
> > >                 : 'border: 1px solid var(--text-faint); opacity: 0.2;';
> > >             
> > >             // 🎨 REVERSE AURORA: Nur Schimmer, keine Linien.
> > >             // 270deg = Startet rechts mit der Farbe (1a = 10% Deckkraft) und fadet nach links auf transparent (00).
> > >             const auroraBg = exists 
> > >                 ? 'linear-gradient(270deg, ' + cfg.color + '1a 0%, transparent 95%)' 
> > >                 : 'transparent';
> > > 
> > >             html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px;">';
> > >             
> > >             // LINKS: Status-Dot | Icon | Label (Im transparenten Bereich)
> > >             html += '<div style="display: flex; align-items: center; gap: 12px;">';
> > >             html += '<div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
> > >             html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
> > >             html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span>';
> > >             html += '</div>';
> > > 
> > >             // RECHTS: Der Link (Hier sitzt der Ursprung des Glows)
> > >             html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 170px;">';
> > >             if (exists) {
> > >                 html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.7;">' + file.file.name + '</a>';
> > >             } else {
> > >                 html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>';
> > >             }
> > >             html += '</div>';
> > >             
> > >             html += '</div>';
> > >         });
> > > 
> > >         html += '</div>';
> > >         dv.el('div', html);
> > >     }
> > > }
> > > 
> > > ```
>  
> >[!blank|wide-5] 📊 Status & Records
> > ```dataviewjs
> > {
> >     const calContainer = this.container;
> > 
> >     // Prüft, ob der Container wirklich leer ist oder noch keine Kinder-Elemente hat
> >     if (calContainer.innerHTML.length < 50) {
> >         
> >         const startOfMonth = moment().startOf('month');
> >         const daysInMonth = moment().daysInMonth();
> >         const allLogs = dv.pages('"0-Calendar"'); 
> > 
> >         const config = {
> >             jou: { suffix: "jou", folder: "0-Calendar/1-Journal", template: "z-Data/1-temp/0-cal/1-jou/dailyjou-", icon: "🌷", color: "#ff79c6" },
> >             log: { suffix: "log", folder: "0-Calendar/2-Log", template: "z-Data/1-temp/0-cal/2-log/dailylog-", icon: "🌻", color: "#f1fa8c" },
> >             study: { suffix: "study", folder: "0-Calendar/3-Studylog", template: "z-Data/1-temp/0-cal/3-studylog/studylog-", icon: "🌼", color: "#bd93f9" },
> >             prolog: { suffix: "prolog", folder: "0-Calendar/4-projectlog", template: "z-Data/1-temp/0-cal/4-projectlog/prolog-", icon: "🧩", color: "#ffb86c" },
> >             proto: { suffix: "proto", folder: "0-Calendar/5-protocoll", template: "z-Data/1-temp/0-cal/5-protocoll/protocoll-", icon: "📜", color: "#8be9fd" },
> >             rev: { suffix: "rev", folder: "0-Calendar/6-review", template: "z-Data/1-temp/0-cal/6-review/review-", icon: "🛰️", color: "#50fa7b" }
> >         };
> > 
> >         let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; padding: 5px;">`;
> >         const dayData = [];
> > 
> >         for (let i = 0; i < daysInMonth; i++) {
> >             let mDate = moment(startOfMonth).add(i, 'days');
> >             let dateStr = mDate.format("YYYY-MM-DD");
> >             let isToday = (dateStr === moment().format("YYYY-MM-DD"));
> > 
> >             let files = {};
> >             for (let key in config) {
> >                 files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.includes(config[key].suffix));
> >             }
> > 
> >             dayData.push({ dateStr, mDate });
> > 
> >             const getStyle = (exists, color) => exists 
> >                 ? `opacity: 1; filter: drop-shadow(0 0 2px ${color}); cursor: pointer;` 
> >                 : `opacity: 0.15; filter: grayscale(100%); cursor: pointer;`;
> > 
> >             tableHTML += `
> >             <div style="padding: 5px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 8px; background-color: var(--background-secondary-alt); text-align: center;">
> >                 <div style="font-size: 0.5em; color: var(--text-muted); text-transform: uppercase;">${mDate.format("dd")}</div>
> >                 <div style="font-size: 0.7em; font-weight: 800; margin-bottom: 4px;">${mDate.format("DD.")}</div>
> >                 <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 1em;">
> >                     <span class="jou-btn" data-idx="${i}" style="${getStyle(files.jou, config.jou.color)}">🌷</span>
> >                     <span class="log-btn" data-idx="${i}" style="${getStyle(files.log, config.log.color)}">🌻</span>
> >                     <span class="study-btn" data-idx="${i}" style="${getStyle(files.study, config.study.color)}">🌼</span>
> >                     <span class="prolog-btn" data-idx="${i}" style="${getStyle(files.prolog, config.prolog.color)}">🧩</span>
> >                     <span class="proto-btn" data-idx="${i}" style="${getStyle(files.proto, config.proto.color)}">📜</span>
> >                     <span class="rev-btn" data-idx="${i}" style="${getStyle(files.rev, config.rev.color)}">🛰️</span>
> >                 </div>
> >             </div>`;
> >         }
> > 
> >         const renderTarget = dv.el("div", tableHTML + `</div>`);
> > 
> >         const handleBtnClick = async (type, btn) => {
> >             const data = dayData[btn.getAttribute('data-idx')];
> >             const cfg = config[type];
> >             const fileName = data.dateStr + " " + cfg.suffix;
> >             const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
> >             const fullPath = folderPath + "/" + fileName + ".md";
> > 
> >             let file = app.vault.getAbstractFileByPath(fullPath);
> >             if (!file) {
> >                 let current = "";
> >                 for (const seg of folderPath.split('/')) {
> >                     current = current === "" ? seg : `${current}/${seg}`;
> >                     if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
> >                 }
> >                 file = await app.vault.create(fullPath, "");
> >                  await new Promise(r => setTimeout(r, 250)); 
> >             }
> > 
> >             await app.workspace.getLeaf('tab').openFile(file);
> >             const templater = app.plugins.plugins["templater-obsidian"];
> >             const tFile = app.vault.getAbstractFileByPath(cfg.template + ".md");
> >             if (tFile && templater && file.stat.size === 0) {
> >                 await templater.templater.append_template_to_active_file(tFile);
> >             }
> >         };
> > 
> >         ['jou', 'log', 'study', 'prolog', 'proto', 'rev'].forEach(type => {
> >             renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => btn.onclick = () => handleBtnClick(type, btn));
> >         });
> >     }
> > }
> > 
> > ```