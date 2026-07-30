---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# 💠 Areas Dashboard (Life Management)
| [[0_Atlas/0_Dashboard/2-Areas|💠Areas]] | [[0_Atlas/Bases/2-Areas/Areas.base|⚙️Areasbase]] | [[0_Atlas/0_Dashboard/2-Areas/1-Selfcare|🌸Selfcare]] | [[0_Atlas/0_Dashboard/2-Areas/2-Creativity|🎨Creativity]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive|🔥Drive]] | [[0_Atlas/0_Dashboard/2-Areas/4-Relationship|🦄Relationship]] | [[0_Atlas/0_Dashboard/2-Areas/5-Expression|🗣️Expression]] | [[0_Atlas/0_Dashboard/2-Areas/6-Mind|🧠Mind]] | [[0_Atlas/0_Dashboard/2-Areas/7-Crown|🕉️Crown]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Financeboard|🪙Finance]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Fitnessboard|🏋️Fitness]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
> 
> > [!blank|wide-0]
> > #### 🗺️ **ATLAS & ACTION**
> > <small style="opacity:.5;">7-Days View</small>
> > 
> > ```dataviewjs
> > {
> >      const container = this.container;
> >      container.style.width = "100%"; container.style.maxWidth = "240px"; container.style.height = "230px";
> >      container.style.margin = "0 auto";
> > 
> >      if (!container.querySelector('canvas')) {
> >          // Paths exactly according to your Nexus Guide
> >          const areas = [
> >              // Chakra order 1–7, every area exactly once.
> >              // Drive used to be in here twice (as "Organize" and "Activity"),
> >              // dafür fehlte Expression ganz.
> >              { label: "🌸 Selfcare",   path: '"2_Areas/1_Selfcare"',    color: "#ff9999" },
> >              { label: "🎨 Creativity", path: '"2_Areas/2_Creativity"',  color: "#99ccff" },
> >              { label: "🔥 Drive",      path: '"2_Areas/3_Drive"',       color: "#b3ffb3" },
> >              { label: "🦄 Relation",   path: '"2_Areas/4_Relationship"',color: "#ffb3ff" },
> >              { label: "🗣️ Expression", path: '"2_Areas/5_Expression"',  color: "#ffcc99" },
> >              { label: "🧠 Mind",       path: '"2_Areas/6_Mind"',        color: "#9999ff" },
> >              { label: "🕉️ Crown",      path: '"2_Areas/7_Crown"',       color: "#cc99ff" }
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
> > > > > > [!creativity]- 🎨 Creativity
> > > > > > `$= dv.list(dv.pages('#2area/2creativity AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!organize]- 🔥 Drive
> > > > > > `$= dv.list(dv.pages('#2area/3drive AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!soul]- 🦄 Relationship
> > > > > > `$= dv.list(dv.pages('#2area/4relationship AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > 
> > > > > [!multi-column]
> > > > > > [!activity]- 🗣️ Expression
> > > > > > `$= dv.list(dv.pages('#2area/5expression AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!mind]- 🧠 Mind
> > > > > > `$= dv.list(dv.pages('#2area/6mind AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`
> > > > >
> > > > > > [!collect]- 🕉️ Crown
> > > > > > `$= dv.list(dv.pages('#2area/7crown AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).limit(3).file.link)`

> [!source] **Areas Library**
> ![[0_Atlas/Bases/2-Areas/Areas.base]]
