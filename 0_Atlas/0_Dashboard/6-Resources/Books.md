---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Books Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/AI|🤖 AI]] | [[0_Atlas/0_Dashboard/6-Resources/Articles|📄 Articles]] | [[0_Atlas/0_Dashboard/6-Resources/Books|📚 Books]] | [[0_Atlas/0_Dashboard/6-Resources/Recipes|🍳 Recipes]] | [[0_Atlas/0_Dashboard/6-Resources/Videos|🎬 Videos]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
>
> > [!blank|wide-0]
> > ### 🔱 NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Books" OR #6resou/book) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const genreCounts = {};
> > pages.forEach(p => {
> >     if (!p.genre) return;
> >     const genres = Array.isArray(p.genre) ? p.genre : [p.genre];
> >     genres.forEach(g => {
> >         const clean = String(g).trim();
> >         if (clean) genreCounts[clean] = (genreCounts[clean] || 0) + 1;
> >     });
> > });
> > 
> > let labels = Object.keys(genreCounts);
> > let data = Object.values(genreCounts);
> > let bgColors = [];
> > 
> > if (labels.length === 0) {
> >     labels = ["No Genres"];
> >     data = [1];
> >     bgColors = ["var(--background-modifier-border)"];
> > } else {
> >     // Sortiere nach Häufigkeit und nimm die Top 8
> >     const sorted = labels.map((l, i) => ({l, d: data[i]})).sort((a, b) => b.d - a.d).slice(0, 8);
> >     labels = sorted.map(x => x.l);
> >     data = sorted.map(x => x.d);
> >     const palette = ['#cba6f7', '#89b4fa', '#89dceb', '#94e2d5', '#a6e3a1', '#f9e2af', '#fab387', '#f38ba8'];
> >     bgColors = labels.map((_, i) => palette[i % palette.length]);
> > }
> > 
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### 📖 Currently Reading
> > ```dataviewjs
> > const clean = value => String(value ?? "").toLowerCase();
> > const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
> > const activeBooks = dv.pages('("6_Resources/Books" OR #6resou/book) AND -"zData" AND -"yArchive"')
> >     .where(p => p.inbox !== true)
> >     .where(p => clean(p.status).includes("1active") || clean(p.status).includes("0start"));
> > 
> > let html = `<div style="display:flex; flex-direction:column; gap:4px;">`;
> > if (activeBooks.length === 0) {
> >     html += `<div style="font-size:.8em; color:var(--text-faint);">No books currently in progress.</div>`;
> > } else {
> >     for (let b of activeBooks.sort(b => b.file.mtime, 'desc').slice(0, 10)) {
> >         let progress = "";
> >         const chapter = (b["chapter-now"] ?? b.chapter);
> >         if (chapter) progress += `Ch. ${chapter} `;
> >         if (b.volume) progress += `Vol. ${b.volume}` + (b["volume-max"] ? `/${b["volume-max"]}` : "");
> >         progress = progress.trim() || "Reading";
> >         
> >         html += `<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 10px; border-bottom:1px solid var(--background-modifier-border);">`;
> >         html += `<div style="min-width:0;"><a class="internal-link" href="${b.file.path}" style="font-weight:650; color:var(--text-normal); text-decoration:none; font-size:.9em;">${esc(b.file.name)}</a><div style="font-size:.65em; color:var(--text-muted);">${esc(b.author || b.creator || "Unknown Author")}</div></div>`;
> >         html += `<div style="font-size:.7em; color:var(--text-accent); font-weight:800; white-space:nowrap;">${esc(progress)}</div>`;
> >         html += `</div>`;
> >     }
> > }
> > html += `</div>`;
> > dv.el("div", html);
> > ```

> [!source] **📚 Books Library**
> ![[0_Atlas/Bases/6-Resources/Books.base]]
