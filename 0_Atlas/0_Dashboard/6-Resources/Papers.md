---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Papers Resources
![[zData/5design_modul/ResourceNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 📃 **PAPER SHELF**
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Papers" OR #6resource/paper) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.science).length, pages.where(p => p.discipline).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Papers', 'Cover', 'Science', 'Discipline'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#89b4fa', '#cba6f7', '#89dceb', '#fab387'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ![[0_Atlas/Bases/6-Resources/Papers.base#⚡ Active]]

> [!source] **📃 Papers Library**
> ![[0_Atlas/Bases/6-Resources/Papers.base]]
