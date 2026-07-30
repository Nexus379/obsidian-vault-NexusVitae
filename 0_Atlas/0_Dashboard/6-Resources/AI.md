---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# AI Resources
![[zData/5design_modul/ResourceNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 🤖 **AI SHELF**
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/AI" OR #6resource/ai) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => String(p.status).toLowerCase() === "done").length, pages.where(p => !p.status || String(p.status).toLowerCase() === "1active").length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['AI', 'Cover', 'Done', 'Active'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#89dceb', '#cba6f7', '#a6e3a1', '#fab387'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ![[0_Atlas/Bases/6-Resources/AI.base#⚡ Active]]

> [!source] **🤖 AI Library**
> ![[0_Atlas/Bases/6-Resources/AI.base]]
