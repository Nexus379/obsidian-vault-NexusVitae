---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Boardgame Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/Boardgame|🎲 Boardgame]] | [[0_Atlas/0_Dashboard/6-Resources/Games|🕹️ Games]] | [[0_Atlas/0_Dashboard/6-Resources/Films|🎬 Films]] | [[0_Atlas/0_Dashboard/6-Resources/Series|🎞️ Series]] | [[0_Atlas/0_Dashboard/6-Resources/Music|🎶 Music]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('"6_Resources/Boardgame" OR #6resou/boardgame');
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Boardgame', 'Cover', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#f9e2af', '#cba6f7', '#a6e3a1'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!source] **🎲 Boardgame Library**
> > > ![[0_Atlas/Bases/Resources/Boardgame.base]]
