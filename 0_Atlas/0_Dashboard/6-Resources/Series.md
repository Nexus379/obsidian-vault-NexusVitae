---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Series Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/Boardgame|🎲 Boardgame]] | [[0_Atlas/0_Dashboard/6-Resources/Games|🕹️ Games]] | [[0_Atlas/0_Dashboard/6-Resources/Films|🎬 Films]] | [[0_Atlas/0_Dashboard/6-Resources/Series|🎞️ Series]] | [[0_Atlas/0_Dashboard/6-Resources/Music|🎶 Music]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('"6_Resources/Series" OR #6resou/serie');
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.plattform).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Series', 'Cover', 'Platform', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#f5c2e7', '#cba6f7', '#89dceb', '#a6e3a1'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!source] **🎞️ Series Library**
> > > ![[0_Atlas/Bases/Resources/Series.base]]
