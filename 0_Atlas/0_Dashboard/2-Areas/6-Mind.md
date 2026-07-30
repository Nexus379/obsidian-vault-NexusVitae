---

cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0
---
# Mind Central
![[zData/5design_modul/AreaNav]]

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
> 
> > [!blank|wide-0]
> > #### 🧠 **KNOWLEDGE FLOW**
> >
> > 
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     chartContainer.style.width = "100%"; chartContainer.style.maxWidth = "240px"; chartContainer.style.height = "230px";
> >     chartContainer.style.margin = "0 auto";
> >     if (chartContainer.innerHTML.length < 50) {
> >         // One vault pass instead of six — computed and cached in dashEngine.js
> >         const _d = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
> >         const _c = _d.areaCounts('6mind');
> >         const values = [_c.own, _c.projects, _c.tasks, _c.notes, _c.resources, _c.calendar];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Mind', 'Projects', 'Tasks', 'Notes', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#ffcc99', '#fab387', '#f38ba8', '#a6e3a1', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0, hoverOffset: 12 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10, weight: "bold", family: "serif" }, padding: 10, boxWidth: 8, usePointStyle: true } } } } };
> >         const _draw = () => { const c = chartContainer.querySelector('canvas'); if (c) c.remove(); window.renderChart(chartData, chartContainer); };
> >         if (window.renderChart) _draw();
> >         else { let w = 60; const t = () => { if (window.renderChart) return _draw(); if ((w *= 1.6) < 4000) setTimeout(t, w); }; setTimeout(t, w); }
> >     }
> > }
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
> >
> > ##### 🎯 Open here
> > ```dataview
> > LIST
> > FROM "4_Tasks" AND !"zData" AND -"yArchive"
> > WHERE contains(string(area2), "6mind") AND status != "done" AND status != "canceled" AND inbox != true
> > SORT priority ASC, due ASC
> > LIMIT 5
> > ```
>
> >[!blank|wide-5] 📊 Status & Records
> > 
> > > [!mind] **🧠 Mind Entries**
> > > ```dataview
> > > TABLE status, priority, area2, file.mtime AS updated
> > > FROM #2area/6mind AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!goals] **🌟 Stars (Purpose · Vision · Goals serving this Area)**
> > > ```dataview
> > > TABLE archtype, status, due
> > > FROM #1stars AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "6_Mind") OR contains(string(area2), "6mind")) AND inbox != true
> > > SORT due ASC, file.mtime DESC
> > > ```
> >
> > > [!project] **Projects**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "6_Mind") OR contains(string(area2), "6mind") OR contains(string(archtype), "#2area/6mind") OR contains(string(file.outlinks), "6_Mind")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!literature] **Notes and Resources**
> > > ```dataview
> > > TABLE archtype, status, discipline, file.mtime AS updated
> > > FROM "5_Notes" OR "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "6_Mind") OR contains(string(area2), "6mind") OR contains(string(archtype), "#2area/6mind") OR contains(string(file.outlinks), "6_Mind")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!info] **Logs and Reviews**
> > > ```dataview
> > > TABLE archtype, status, file.mtime AS updated
> > > FROM "0_Calendar" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "6_Mind") OR contains(string(area2), "6mind") OR contains(string(archtype), "#2area/6mind") OR contains(string(file.outlinks), "6_Mind")) AND inbox != true
> > > SORT file.mtime DESC
> > > LIMIT 12
> > > ```

> [!source] **Mind Library**
> ![[0_Atlas/Bases/2-Areas/Mind.base]]
