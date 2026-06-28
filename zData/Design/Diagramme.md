



> > > [!note] ✍️ Letzte Notizen
> > > ```dataviewjs
> > > const notes = dv.pages('"5 ✏️ Notes"').sort(p => p.file.mtime, "desc").limit(5);
> > > let html = `<div style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">`;
> > > notes.forEach(n => {
> > >     let color = "#999999";
> > >     if (n.file.path.includes("Permanent")) color = "#ffd700";
> > >     if (n.file.path.includes("Literatur")) color = "#4169e1";
> > >     if (n.file.path.includes("Evergreen")) color = "#228b22";
> > >     html += `<div style="display: flex; align-items: center; justify-content: space-between; background: var(--background-secondary-alt); padding: 8px 12px; border-radius: 8px; border-left: 3px solid ${color};">
> > >         <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap;">
> > >             <span style="font-size: 0.8em;">✏️</span>
> > >             <a class="internal-link" href="${n.file.path}">${n.file.name}</a>
> > >         </div>
> > >         <div style="font-size: 0.65em; color: var(--text-faint);">${moment(n.file.mtime.toString()).fromNow()}</div>
> > >     </div>`;
> > > });
> > > html += `</div>`;
> > > dv.el("div", html);
> > > ```






> [!multi-column]
> 
> > [!pink] **🌷 LIFE (PLM)**  
> > ```dataviewjs
> > const pages = dv.pages('!"z 💾 Data"')
> >     .where(p => dv.array(p.persona).some(m => ["🌈", "🌸", "💜", "💚", "🤗", "🚄"].some(icon => String(m).includes(icon))) 
> >              || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("journal")))
> >     .sort(p => p.file.mtime, "desc").limit(5);
> > 
> > let html = `<div style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">`;
> > pages.forEach(p => {
> >     html += `<div style="display: flex; align-items: center; justify-content: space-between; background: var(--background-secondary-alt); padding: 8px 12px; border-radius: 8px; border-left: 4px solid #ff79c6;">
> >         <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap;">
> >             <span>🌷</span>
> >             <a class="internal-link" href="${p.file.path}" style="color: var(--text-normal); text-decoration: none; font-size: 0.85em; font-weight: 500;">${p.file.name}</a>
> >         </div>
> >         <div style="font-size: 0.6em; color: var(--text-faint);">${moment(p.file.mtime.toString()).fromNow()}</div>
> >     </div>`;
> > });
> > html += `</div>`;
> > dv.el("div", html);
> > ```
> 
> > [!success] **🌻 MANAGE (PPM)**  
> > ```dataviewjs
> > const pages = dv.pages('!"z 💾 Data"')
> >     .where(p => dv.array(p.persona).some(m => ["📋", "⛑️", "🏐", "👑"].some(icon => String(m).includes(icon))) 
> >              || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("log") && !String(t).toLowerCase().includes("study"))))
> >     .where(p => !dv.array(p.status).includes("❇️done"))
> >     .sort(p => p.file.mtime, "desc").limit(5);
> > 
> > let html = `<div style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">`;
> > pages.forEach(p => {
> >     html += `<div style="display: flex; align-items: center; justify-content: space-between; background: var(--background-secondary-alt); padding: 8px 12px; border-radius: 8px; border-left: 4px solid #a6e3a1;">
> >         <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap;">
> >             <span>🌻</span>
> >             <a class="internal-link" href="${p.file.path}" style="color: var(--text-normal); text-decoration: none; font-size: 0.85em; font-weight: 500;">${p.file.name}</a>
> >         </div>
> >         <div style="font-size: 0.6em; color: var(--text-faint);">${moment(p.file.mtime.toString()).fromNow()}</div>
> >     </div>`;
> > });
> > html += `</div>`;
> > dv.el("div", html);
> > ```
> 
> > [!info] **🌼 KNOWLEDGE (PKM)**  
> > ```dataviewjs
> > const pages = dv.pages('!"z 💾 Data"')
> >     .where(p => dv.array(p.persona).some(m => String(m).includes("🎓")) 
> >              || (p.discipline && dv.array(p.discipline).length > 0) 
> >              || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("study"))
> >              || dv.array(p.arch).includes("#5✏"))
> >     .sort(p => p.file.mtime, "desc").limit(5);
> > 
> > let html = `<div style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">`;
> > pages.forEach(p => {
> >     let color = "#89dceb"; // Standard PKM Blau
> >     if (p.file.path.includes("Permanent")) color = "#ffd700";
> >     if (p.file.path.includes("Literatur")) color = "#4169e1";
> >     if (p.file.path.includes("Evergreen")) color = "#228b22";
> >     
> >     html += `<div style="display: flex; align-items: center; justify-content: space-between; background: var(--background-secondary-alt); padding: 8px 12px; border-radius: 8px; border-left: 4px solid ${color};">
> >         <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap;">
> >             <span>🌼</span>
> >             <a class="internal-link" href="${p.file.path}" style="color: var(--text-normal); text-decoration: none; font-size: 0.85em; font-weight: 500;">${p.file.name}</a>
> >         </div>
> >         <div style="font-size: 0.6em; color: var(--text-faint);">${moment(p.file.mtime.toString()).fromNow()}</div>
> >     </div>`;
> > });
> > html += `</div>`;
> > dv.el("div", html);
> > ```

> > > [!multi-column]
> > > 
> > > > [!pink] **🌷 PLM (Life)**  
> > > > ```dataviewjs
> > > > const pages = dv.pages('!"z 💾 Data"')
> > > >     .where(p => dv.array(p.persona).some(m => ["🌈", "🌸", "💜", "💚", "🤗", "🚄"].some(icon => String(m).includes(icon))) 
> > > >              || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("journal")))
> > > >     .sort(p => p.file.mtime, "desc").limit(8);
> > > > dv.list(pages.file.link);
> > > > ```
> > > 
> > > > [!success] **🌻 PPM (Manage)**  
> > > > ```dataviewjs
> > > > const pages = dv.pages('!"z 💾 Data"')
> > > >     .where(p => dv.array(p.persona).some(m => ["📋", "⛑️", "🏐", "👑"].some(icon => String(m).includes(icon))) 
> > > >              || (dv.array(p.archtype).some(t => String(t).toLowerCase().includes("log") && !String(t).toLowerCase().includes("study"))))
> > > >     .where(p => !dv.array(p.status).includes("❇️done"))
> > > >     .sort(p => p.file.mtime, "desc").limit(8);
> > > > dv.list(pages.file.link);
> > > > ```
> > > 
> > > > [!info] **🌼 PKM (Knowledge)**  
> > > > ```dataviewjs
> > > > const pages = dv.pages('!"z 💾 Data"')
> > > >     .where(p => dv.array(p.persona).some(m => String(m).includes("🎓")) 
> > > >              || (p.discipline && dv.array(p.discipline).length > 0) 
> > > >              || dv.array(p.archtype).some(t => String(t).toLowerCase().includes("study"))
> > > >              || dv.array(p.arch).includes("#5✏"))
> > > >     .sort(p => p.file.mtime, "desc").limit(8);
> > > > dv.list(pages.file.link);
> > > > ```


> > ## Arch 7-Days View
> >```dataviewjs
> > const days = 7;
> > const start = moment().subtract(days, 'days').startOf('day');
> > 
> > const entries = dv.pages().where(p => 
> >     p.file.ctime >= start || (p['cal-date'] && moment(p['cal-date'].toString()).isAfter(start))
> > );
> > 
> > // Die 7 ARCH-Kategorien zählen
> > const archTags = ["#0📅", "#1✨", "#2💠", "#3🚧", "#4🛠️", "#5✏", "#6🔖"];
> > const labels = ["Calendar", "Stars", "Areas", "Projects", "Tasks", "Notes", "Resources"];
> > const counts = archTags.map(tag => 
> >     entries.filter(p => dv.array(p.arch).some(t => t && String(t).includes(tag))).length
> > );
> > 
> > const chartData = {
> >     type: 'bar',
> >     data: {
> >         labels: labels,
> >         datasets: [{
> >             label: 'ARCH Activity',
> >             data: counts,
> >             // Hier kriegt jeder Balken seine eigene AnuPuccin-Farbe
> >             backgroundColor: [
> >                 '#f5c2e7', // Pink (Calendar)
> >                 '#fab387', // Orange (Stars)
> >                 '#f9e2af', // Yellow (Areas)
> >                 '#a6e3a1', // Green (Projects)
> >                 '#89dceb', // Sky (Tasks)
> >                 '#b4befe', // Lavender (Notes)
> >                 '#cba6f7'  // Mauve (Resources)
> >             ],
> >             borderWidth: 0
> >         }]
> >     },
> >     options: {
> >         scales: {
> >             y: { beginAtZero: true, grid: { color: '#313244' } },
> >             x: { grid: { display: false } }
> >         },
> >         plugins: {
> >             legend: { display: false } // Wir brauchen keine Legende, da die Achse beschriftet ist
> >         }
> >     }
> > };
> > 
> > window.renderChart(chartData, this.container);
> > 
> > ```

