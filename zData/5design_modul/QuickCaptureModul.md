### Quick Capture
`BUTTON[stars-btn]` `BUTTON[a-btn]` `BUTTON[p-btn]` `BUTTON[t-btn]` `BUTTON[n-btn]` `BUTTON[r-btn]`

> [!blank]
> ### 🌙 Last Logs
>
> ```dataviewjs
> {
>     const logContainer = this.container;
>     if (logContainer.innerHTML.length < 50) {
>         // 🔱 FIX 1: Wir laden ALLE relevanten Seiten, ohne sie vorher voreilig rauszuwerfen
>         const allLogs = dv.pages('!"zData" AND -"yArchive"');
>         
>         const config = [
>             { label: 'JOURNAL', archtype: '1plm', color: '#ff79c6', icon: '🌷' },
>             { label: 'DAILY LOG', archtype: '2ppm', color: '#f1fa8c', icon: '🌻' },
>             { label: 'STUDYLOG', archtype: '3pkm', color: '#bd93f9', icon: '🌼' },
>             { label: 'PROJECTLOG', archtype: 'projectlog', color: '#ffb86c', icon: '🧩' }, 
>             { label: 'PROTOCOL', archtype: 'protocol', color: '#8be9fd', icon: '📜' },
>             { label: 'REVIEW', archtype: 'review', color: '#50fa7b', icon: '🛰️' }
>         ];
>
>         let html = '<div style="display: flex; flex-direction: column; gap: 3px; padding: 5px 0;">';
>         
>         config.forEach(cfg => {
>             // 🔱 FIX 2: Der Meta-Scanner. Sucht jetzt verlässlich in allen Feldern!
>             const file = allLogs
>                 .filter(p => {
>                     const meta = (p.file.path + " " + String(p.archtype || "") + " " + String(p.arch || "") + " " + String(p.file.etags || "")).toLowerCase();
>                     return meta.includes(cfg.archtype);
>                 })
>                 .sort(p => p.file.name, 'desc')
>                 .first();
>             
>             const exists = file !== undefined;
>             const auroraBg = "var(--background-secondary-alt)";
>             const dotStyle = exists ? `background-color: ${cfg.color}; box-shadow: 0 0 6px ${cfg.color};` : `background-color: var(--background-modifier-border);`;
>
>             html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px;">';
>             html += '<div style="display: flex; align-items: center; gap: 12px;"><div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
>             html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
>             html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span></div>';
>             html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 170px;">';
>             
>             if (exists) { 
>                 // Nutzt auch displayTitle, falls dein Projectlog so eins hat!
>                 const titleToDisplay = file.displayTitle || file.file.name;
>                 html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.7;">' + titleToDisplay + '</a>'; 
>             } else { 
>                 html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>'; 
>             }
>             
>             html += '</div></div>';
>         });
>         
>         dv.el('div', html + '</div>');
>     }
> }
> ```
