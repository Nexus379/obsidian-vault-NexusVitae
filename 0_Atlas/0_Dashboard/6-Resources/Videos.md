---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Videos Resources
![[zData/5design_modul/ResourceNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 💻 **VIDEO SHELF**
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Videos" OR #6resource/video) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.url).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Videos', 'Cover', 'URL', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#fab387', '#cba6f7', '#89dceb', '#a6e3a1'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ![[0_Atlas/Bases/6-Resources/Videos.base#⚡ Active]]

> [!source] **🎬 Videos Library**
> ![[0_Atlas/Bases/6-Resources/Videos.base]]
