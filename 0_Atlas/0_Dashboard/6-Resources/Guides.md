---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Guides Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/Classes|🏫 Classes]] | [[0_Atlas/0_Dashboard/6-Resources/Courses|🎓 Courses]] | [[0_Atlas/0_Dashboard/6-Resources/Papers|📃 Papers]] | [[0_Atlas/0_Dashboard/6-Resources/Reference|📚 Reference]] | [[0_Atlas/0_Dashboard/6-Resources/Guides|🗺️ Guides]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('"6_Resources/Guides" OR #6resou/guide');
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.url).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Guides', 'Cover', 'URL', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#b4befe', '#cba6f7', '#89dceb', '#a6e3a1'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!source] **🗺️ Guides Library**
> > > ![[0_Atlas/Bases/Resources/Guides.base]]
