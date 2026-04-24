---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# ✏️ Notes
| [[0_Atlas/0_Dashboard/5-Notes/1-Fleeting|🌱 Fleeting]] | [[0_Atlas/0_Dashboard/5-Notes/2-Literature|📖 Literature]] | [[0_Atlas/0_Dashboard/5-Notes/3-Permanent|💎 Permanent]] | [[0_Atlas/0_Dashboard/5-Notes/4-Atomic|⚛️ Atomic]] | [[0_Atlas/0_Dashboard/5-Notes/5-Evergreen|🌲 Evergreen]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### 🔱 **NEXUS NAVIGATOR**
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     const days = 30; 
> >     const start = moment().subtract(days, 'days').startOf('day');
> >     
> >     chartContainer.style.width = "250px";
> >     chartContainer.style.margin = "0 auto";
> > 
> >     if (chartContainer.innerHTML.length < 50) {
> >         const entries = dv.pages('!"zData"').where(p => 
> >             p.file.ctime >= start || (p['cal-date'] && moment(p['cal-date'].toString()).isAfter(start))
> >         );
> > 
> >         const noteLabels = ["Fleeting", "Literature", "Permanent", "Atomic", "Evergreen"];
> >         const noteTags = ["fleeting", "literature", "permanent", "atomic", "evergreen"];
> >         const noteColors = ['#fab387', '#89dceb', '#f9e2af', '#a6e3a1', '#94e2d5'];
> > 
> >         const counts = noteTags.map(tag => 
> >             entries.filter(p => {
> >                 const metadata = String(p.file.path + p.archtype + p.file.tags).toLowerCase();
> >                 return metadata.includes(tag);
> >             }).length
> >         );
> > 
> >         const hasData = counts.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = {
> >             type: 'doughnut',
> >             data: {
> >                 labels: hasData ? noteLabels : ["No notes yet"],
> >                 datasets: [{
> >                     data: hasData ? counts : [1],
> >                     backgroundColor: hasData ? noteColors : ["var(--background-modifier-border)"],
> >                     borderWidth: 0
> >                 }]
> >             },
> >             options: {
> >                 cutout: '80%',
> >                 plugins: {
> >                     legend: { position: 'bottom', labels: { color: textColor, font: { size: 9 } } }
> >                 }
> >             }
> >         };
> > 
> >         const renderInterval = setInterval(() => {
> >             if (window.renderChart) {
> >                 const oldCanvas = chartContainer.querySelector('canvas');
> >                 if (oldCanvas) oldCanvas.remove();
> >                 window.renderChart(chartData, chartContainer);
> >                 clearInterval(renderInterval);
> >             }
> >         }, 150);
> >         setTimeout(() => clearInterval(renderInterval), 5000);
> >     }
> > }
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5] 
> > ```dataviewjs
> > {
> >     const stages = [
> >         { label: "🌱 Fleeting", path: '"5_Notes/1_Fleeting"', color: "var(--text-muted)" },
> >         { label: "📖 Literature", path: '"5_Notes/2_Literature"', color: "var(--color-blue)" },
> >         { label: "💎 Permanent", path: '"5_Notes/3_Permanent"', color: "var(--color-purple)" },
> >         { label: "⚛️ Atomic", path: '"5_Notes/4_Atomic"', color: "var(--color-cyan)" },
> >         { label: "🌲 Evergreen", path: '"5_Notes/5_Evergreen"', color: "var(--text-success)" }
> >     ];
> > 
> >     let html = '<div style="display: flex; gap: 10px; overflow-x: auto; padding: 10px; background: var(--background-secondary); border-radius: 12px;">';
> > 
> >     stages.forEach(s => {
> >         const stageNotes = dv.pages(s.path).sort(p => p.file.mtime, 'desc').slice(0, 5);
> > 
> >         html += '<div style="min-width: 180px; flex: 1; display: flex; flex-direction: column;">';
> >         html += `<div style="font-size: 0.7em; font-weight: 800; text-align: center; color: ${s.color}; margin-bottom: 8px; text-transform: uppercase;">${s.label}</div>`;
> > 
> >         stageNotes.forEach(p => {
> >             html += `<div style="background: var(--background-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; margin-bottom: 5px; box-shadow: var(--shadow-s);">`;
> >             html += `<a class="internal-link" href="${p.file.path}" style="font-size: 0.8em; color: var(--text-normal); text-decoration: none; font-weight: 500; display: block;">${p.file.name}</a>`;
> >             html += `</div>`;
> >         });
> > 
> >         if (stageNotes.length === 0) html += `<div style="font-size: 0.6em; opacity: 0.3; text-align: center; padding: 10px;">Empty Orbit</div>`;
> >         html += '</div>';
> >     });
> > 
> >     dv.el('div', html + '</div>');
> > }
> > ```
