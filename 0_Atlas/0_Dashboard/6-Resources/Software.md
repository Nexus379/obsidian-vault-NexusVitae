---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Software Resources
![[zData/5design_modul/ResourceNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 💽 **SOFTWARE SHELF**
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Software" OR #6resource/software) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const values = [pages.length, pages.where(p => p.software_type).length, pages.where(p => String(p.maintenance_status ?? "").includes("needs_update")).length, pages.where(p => String(p.maintenance_status ?? "").includes("broken")).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Software', 'Typed', 'Needs Update', 'Broken'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#89b4fa', '#94e2d5', '#f9e2af', '#f38ba8'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ![[0_Atlas/Bases/6-Resources/Software.base#⚡ Active]]

> [!source] **💻 Software Library**
> ![[0_Atlas/Bases/6-Resources/Software.base]]
