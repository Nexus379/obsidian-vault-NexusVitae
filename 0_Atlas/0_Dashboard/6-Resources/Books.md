---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Books Resources
![[zData/5design_modul/ResourceNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
>
> > [!blank|wide-0]
> > #### 📔 **BOOK SHELF**
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Books" OR #6resource/book) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
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
> >     // Sort by frequency and take the top 8
> >     const sorted = labels.map((l, i) => ({l, d: data[i]})).sort((a, b) => b.d - a.d).slice(0, 8);
> >     labels = sorted.map(x => x.l);
> >     data = sorted.map(x => x.d);
> >     const palette = ['#cba6f7', '#89b4fa', '#89dceb', '#94e2d5', '#a6e3a1', '#f9e2af', '#fab387', '#f38ba8'];
> >     bgColors = labels.map((_, i) => palette[i % palette.length]);
> > }
> > 
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### 📖 Currently Reading
> > ![[0_Atlas/Bases/6-Resources/Books.base#⚡ Active]]

> [!source] **📚 Books Library**
> ![[0_Atlas/Bases/6-Resources/Books.base]]
