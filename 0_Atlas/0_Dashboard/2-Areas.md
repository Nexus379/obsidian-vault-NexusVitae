---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# 💠 Areas Dashboard (Life Management)
| [[0_Atlas/0_Dashboard/2-Areas/1-Selfcare|🌸 Selfcare]] | [[0_Atlas/0_Dashboard/2-Areas/2-Relationship|🦄 Relationship]] | [[0_Atlas/0_Dashboard/2-Areas/3-Mind|🧠 Mind]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize|🧩 Organize]] | [[0_Atlas/0_Dashboard/2-Areas/5-Creativity|🎨 Creativity]] | [[0_Atlas/0_Dashboard/2-Areas/6-Activity|🚵 Activity]] | [[0_Atlas/0_Dashboard/2-Areas/7-Entertainment|🕹️ Entertainment]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
> 
> > [!blank|wide-0] 7-Days View
> > 
> > ```dataviewjs
> > {
> >      const container = this.container;
> >      container.style.width = "280px";
> >      container.style.margin = "0 auto";
> > 
> >      if (!container.querySelector('canvas')) {
> >          // Paths exactly according to your Nexus Guide
> >          const areas = [
> >              { label: "🌸 Selfcare", path: '"2_Areas/1_Selfcare"', color: "#ff9999" }, 
> >              { label: "🧠 Mind", path: '"2_Areas/3_Mind"', color: "#ffcc99" },      
> >              { label: "🦄 Relation", path: '"2_Areas/2_Relationship"', color: "#ffb3ff" }, 
> >              { label: "🧩 Organize", path: '"2_Areas/4_Organize"', color: "#b3ffb3" },    
> >              { label: "🎨 Creative", path: '"2_Areas/5_Creativity"', color: "#99ccff" },  
> >              { label: "🚵🏽 Activity", path: '"2_Areas/6_Activity"', color: "#9999ff" },    
> >              { label: "🕹️ Entertain", path: '"2_Areas/7_Entertainment"', color: "#cc99ff" } 
> >          ];
> > 
> >          const counts = areas.map(a => dv.pages(a.path).where(p => p.inbox !== true).length);
> > 
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: areas.map(a => a.label),
> >                  datasets: [{
> >                      data: counts,
> >                      backgroundColor: areas.map(a => a.color),
> >                      borderWidth: 0
> >                  }]
> >              },
> >              options: {
> >                  cutout: '85%',
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
> > 
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5] 
> > > [!multi-column]
> > > > [!area]
> > > > 📊 **Area Balance**
> > > > *Activity overview:*
> > > >
> > > > 🛰️ **Area Navigation**
> > > > > [!multi-column]
> > > > > > [!pink]- 🌸 Selfcare
> > > > > > `$= dv.list(dv.pages('#2area/1selfcare AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!soul]- 🦄 Relation
> > > > > > `$= dv.list(dv.pages('#2area/2relationship AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > > 
> > > > > > [!mind]- 🧠 Mind
> > > > > > `$= dv.list(dv.pages('#2area/3mind AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > 
> > > > > [!multi-column]
> > > > > > [!organize]- 🧩 Organize
> > > > > > `$= dv.list(dv.pages('#2area/4organize AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!creativity]- 🎨 Creativity
> > > > > > `$= dv.list(dv.pages('#2area/5creativity AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!activity]- 🚵🏽 Activity
> > > > > > `$= dv.list(dv.pages('#2area/6activity AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!collect]- 🕹️ Entertainment
> > > > > > `$= dv.list(dv.pages('#2area/7entertain AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`

> [!source] **Areas Library**
> ![[0_Atlas/Bases/2-Areas/Areas.base]]
