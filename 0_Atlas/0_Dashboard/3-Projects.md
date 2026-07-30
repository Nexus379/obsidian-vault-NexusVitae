---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# 🚧 Projects
| [[0_Atlas/0_Dashboard/3-Projects|🚧Projects]] | [[0_Atlas/0_Dashboard/3-Projects/0-Recurring|🔄Recurring]] | [[0_Atlas/0_Dashboard/3-Projects/1-Active|⚡Active]] | [[0_Atlas/0_Dashboard/3-Projects/2-Passive|⏳Passive]] | [[0_Atlas/0_Dashboard/3-Projects/3-Idea|💡Ideas]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > #### 🚧 **PROJECT FLOW**
> > ```dataviewjs
> > {
> >      const container = this.container;
> >      container.style.width = "100%"; container.style.maxWidth = "240px"; container.style.height = "230px";
> >      container.style.margin = "0 auto"; 
> > 
> >      if (!container.querySelector('canvas')) {
> >          const phases = [
> >              { label: "Active", status: "1active", color: "#a6e3a1" },
> >              { label: "Passive", status: "2passive", color: "#f9e2af" },
> >              { label: "Ideas", status: "3idea", color: "#89dceb" },
> >              { label: "Recurring", status: "0recurring", color: "#cba6f7" }
> >          ];
> > 
> >          const counts = phases.map(phase => dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => String(p.status).toLowerCase() === phase.status).length);
> >          const hasData = counts.some(v => v > 0);
> > 
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: hasData ? phases.map(p => p.label) : ["No projects yet"],
> >                  datasets: [{
> >                      data: hasData ? counts : [1],
> >                      backgroundColor: hasData ? phases.map(p => p.color) : ["var(--background-modifier-border)"],
> >                      borderWidth: 0
> >                  }]
> >              },
> >              options: {
> >                  maintainAspectRatio: false, cutout: '76%',
> >                  animation: false,
> >                  plugins: {
> >                      legend: { 
> >                          position: 'bottom', 
> >                          labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } 
> >                      }
> >                  }
> >              }
> >          };
> > 
> >          const interval = setInterval(() => {
> >              if (window.renderChart) {
> >                  const oldCanvas = container.querySelector('canvas');
> >                  if (oldCanvas) oldCanvas.remove();
> >                  window.renderChart(chartData, container);
> >                  clearInterval(interval);
> >              }
> >          }, 150);
> >      }
> > }
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!project]
> > > 📊 **Active Pipeline**
> > > ```dataviewjs
> > > const pages = dv.pages('"3_Projects" AND !"zData" AND -"yArchive"')
> > >      .where(p => p.inbox !== true)
> > >      .where(p => String(p.status).toLowerCase() === "1active")
> > >      .where(p => !dv.array(p.status).some(s => ["done", "archived", "bin"].includes(String(s))))
> > >      .sort(p => p.priority, "desc")
> > >      .limit(8);
> > > 
> > > let html = `<div style="display: flex; flex-direction: column; gap: 2px; padding: 5px 0;">`;
> > > pages.forEach(p => {
> > >      // priority holds "1".."5" (1 = highest), never an emoji — comparing against 🔴/🟡 made every dot green.
> > >      const prio = String(dv.array(p.priority)[0] ?? "").trim();
> > >      let dotColor = prio === "1" ? "#f38ba8" : (prio === "2" ? "#f9e2af" : "#a6e3a1");
> > >      const tasksOpen = p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0;
> > >      const dueDate = p.due ? moment(p.due.toString()).format("DD.MM") : "--";
> > >      // The slot on the right read p.phase, which nothing writes: "Phase" is the LABEL of
> > >      // the explore_lvl input. Projects now carry that field too, so status says whether a
> > >      // project runs and explore_lvl how far it has come — two independent axes.
> > >      const phase = String(dv.array(p.explore_lvl)[0] ?? "").replace(/^[0-9]/, "");
> > > 
> > >      html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--background-modifier-border);">
> > >          <div style="display: flex; align-items: center; gap: 12px;">
> > >              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor};"></div>
> > >              <a class="internal-link" href="${p.file.path}" style="font-weight: 600; color: var(--text-normal); text-decoration: none; font-size: 0.95em;">${p.file.name}</a>
> > >              ${tasksOpen > 0 ? `<span style="font-size: 0.7em; color: var(--interactive-accent); opacity: 0.8;">🛠️ ${tasksOpen}</span>` : ""}
> > >          </div>
> > >          <div style="display: flex; gap: 15px; align-items: center;">
> > >              <div style="font-size: 0.7em; color: var(--text-faint); font-weight: bold;">📅 ${dueDate}</div>
> > >              <div style="font-size: 0.65em; color: var(--text-muted); font-style: italic; width: 60px; text-align: right;">${phase}</div>
> > >          </div>
> > >      </div>`;
> > > });
> > > dv.el("div", html + `</div>`);
> > > ```
> > >
> > > 🛰️ **Status Overview**
> > > > [!multi-column]
> > > > > [!caution]- ⏳ Passive
> > > > > `$= dv.list(dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => String(p.status).toLowerCase() === "2passive").limit(3).file.link)`
> > > >
> > > > > [!thought]- ☁️ Ideas
> > > > > `$= dv.list(dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => String(p.status).toLowerCase() === "3idea").limit(3).file.link)`
