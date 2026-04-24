---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Reference Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/Classes|🏫 Classes]] | [[0_Atlas/0_Dashboard/6-Resources/Courses|🎓 Courses]] | [[0_Atlas/0_Dashboard/6-Resources/Papers|📃 Papers]] | [[0_Atlas/0_Dashboard/6-Resources/Reference|📚 Reference]] | [[0_Atlas/0_Dashboard/6-Resources/Guides|🗺️ Guides]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('"6_Resources/Reference" OR #6resou/reference');
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.science).length, pages.where(p => p.discipline).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Reference', 'Cover', 'Science', 'Discipline'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#bac2de', '#cba6f7', '#89dceb', '#fab387'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!source] **📚 Reference Library**
> > > ![[0_Atlas/Bases/Resources/Reference.base]]
