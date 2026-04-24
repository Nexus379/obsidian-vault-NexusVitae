### Quick Capture
`BUTTON[stars-btn]` `BUTTON[a-btn]` `BUTTON[p-btn]` `BUTTON[t-btn]` `BUTTON[n-btn]` `BUTTON[r-btn]`

> [!blank]
> ### &#127769; Last Logs
>
> ```dataviewjs
> {
>     const logContainer = this.container;
>     if (logContainer.innerHTML.length < 50) {
>         const allLogs = dv.pages('"0_Calendar"');
>         const config = [
>             { label: 'JOURNAL', suffix: 'jou', color: '#ff79c6', icon: '&#127799;' },
>             { label: 'DAILY LOG', suffix: 'log', color: '#f1fa8c', icon: '&#127803;' },
>             { label: 'STUDYLOG', suffix: 'study', color: '#bd93f9', icon: '&#127804;' },
>             { label: 'PROJECTLOG', suffix: 'prolog', color: '#ffb86c', icon: '&#129513;' },
>             { label: 'PROTOCOL', suffix: 'proto', color: '#8be9fd', icon: '&#128220;' },
>             { label: 'REVIEW', suffix: 'rev', color: '#50fa7b', icon: '&#128752;' }
>         ];
>
>         let html = '<div style="display: flex; flex-direction: column; gap: 3px; padding: 5px 0;">';
>         config.forEach(cfg => {
>             const file = allLogs.filter(p => p.file.name.includes(cfg.suffix)).sort(p => p.file.name, 'desc').first();
>             const exists = !!file;
>             const auroraBg = exists ? 'linear-gradient(270deg, ' + cfg.color + '1a 0%, transparent 95%)' : 'transparent';
>             const dotStyle = exists ? 'background: ' + cfg.color + '; box-shadow: 0 0 8px ' + cfg.color + ';' : 'border: 1px solid var(--text-faint); opacity: 0.2;';
>
>             html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 12px; background: ' + auroraBg + '; border-radius: 6px;">';
>             html += '<div style="display: flex; align-items: center; gap: 12px;"><div style="width: 5px; height: 5px; border-radius: 50%; ' + dotStyle + '"></div>';
>             html += '<span style="font-size: 1.1em; opacity: ' + (exists ? '1' : '0.15') + ';">' + cfg.icon + '</span>';
>             html += '<span style="font-size: 0.55em; font-weight: 900; color: var(--text-muted); opacity: 0.4; letter-spacing: 1px; width: 60px;">' + cfg.label + '</span></div>';
>             html += '<div style="text-align: right; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 170px;">';
>             if (exists) { html += '<a class="internal-link" href="' + file.file.path + '" style="text-decoration: none; color: var(--text-normal); font-size: 0.75em; font-weight: 500; opacity: 0.7;">' + file.file.name + '</a>'; }
>             else { html += '<span style="font-size: 0.65em; color: var(--text-faint); font-style: italic; opacity: 0.3;">pending...</span>'; }
>             html += '</div></div>';
>         });
>         dv.el('div', html + '</div>');
>     }
> }
> ```
