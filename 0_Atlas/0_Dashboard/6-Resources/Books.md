---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Books Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/AI|🤖 AI]] | [[0_Atlas/0_Dashboard/6-Resources/Articles|📄 Articles]] | [[0_Atlas/0_Dashboard/6-Resources/Books|📚 Books]] | [[0_Atlas/0_Dashboard/6-Resources/Recipes|🍳 Recipes]] | [[0_Atlas/0_Dashboard/6-Resources/Videos|🎬 Videos]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('"6_Resources/Books" OR #6resou/book');
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.science).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Books', 'Cover', 'Science', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#f5e0dc', '#cba6f7', '#89dceb', '#a6e3a1'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!source] **📚 Books Library**
> > > ![[0_Atlas/Bases/Resources/Books.base]]
