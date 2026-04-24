---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 🌻 PPM Dashboard (Manage)
| [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM|🌷 PLM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM|🌻 PPM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM|🎓 PKM]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### 🔱 **NEXUS NAVIGATOR**
> > ```dataviewjs
> > {
> >      const container = this.container;
> >      container.style.width = "250px";
> >      container.style.margin = "0 auto";
> > 
> >      if (!container.querySelector('canvas')) {
> >          const personas = [
> >              { label: "Worker", key: "worker", color: "#a6e3a1" },
> >              { label: "Trainer", key: "trainer", color: "#fab387" },
> >              { label: "Strategist", key: "strategist", color: "#f9e2af" },
> >              { label: "Organizer", key: "organizer", color: "#94e2d5" },
> >              { label: "Healer", key: "healer", color: "#ff79c6" },
> >              { label: "Queen/King", key: "queen_king", color: "#cba6f7" },
> >              { label: "Diplomat", key: "diplomat", color: "#89dceb" },
> >              { label: "Visionary", key: "visionary", color: "#b4befe" },
> >              { label: "Architect", key: "architect", color: "#74c7ec" },
> >              { label: "Entrepreneur", key: "entrepreneur", color: "#f38ba8" },
> >              { label: "Mentor", key: "mentor", color: "#eba0ac" },
> >              { label: "Critic", key: "critic", color: "#bac2de" }
> >          ];
> > 
> >          const pages = dv.pages('!"zData"');
> >          const counts = personas.map(p => pages.where(page => dv.array(page.persona).some(v => String(v).toLowerCase().includes(p.key)) || dv.array(page.file.tags).some(v => String(v).toLowerCase() === "#" + p.key)).length);
> >          const hasData = counts.some(c => c > 0);
> > 
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: hasData ? personas.map(p => p.label) : ["Empty Orbit 🌌"],
> >                  datasets: [{
> >                      data: hasData ? counts : [1],
> >                      backgroundColor: hasData ? personas.map(p => p.color) : ['var(--background-modifier-border)'],
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
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > > [!ppm]
> > > 📊 **PPM Active Pipeline**
> > > ```dataviewjs
> > > const ppmKeys = ["worker", "trainer", "strategist", "organizer", "healer", "queen_king", "diplomat", "visionary", "architect", "entrepreneur", "mentor", "critic"];
> > > const pages = dv.pages('"3_Projects"')
> > >      .where(p => !dv.array(p.status).some(s => String(s).toLowerCase().includes("done")) && (
> > >          dv.array(p.persona).some(v => ppmKeys.some(k => String(v).toLowerCase().includes(k))) ||
> > >          dv.array(p.archtype).some(v => ["ppm", "2ppm"].some(k => String(v).toLowerCase().includes(k)))
> > >      ))
> > >      .sort(p => p.priority, "desc")
> > >      .limit(12);
> > > 
> > > let html = `<div style="display: flex; flex-direction: column; gap: 2px; padding: 5px 0;">`;
> > > pages.forEach(p => {
> > >      let dotColor = p.priority == "🔴" ? "#f38ba8" : (p.priority == "🟡" ? "#f9e2af" : "#a6e3a1");
> > >      const tasksOpen = p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0;
> > >      const dueDate = p.due ? moment(p.due.toString()).format("DD.MM") : "--";
> > > 
> > >      html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--background-modifier-border);">
> > >          <div style="display: flex; align-items: center; gap: 12px;">
> > >              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor};"></div>
> > >              <a class="internal-link" href="${p.file.path}" style="font-weight: 600; color: var(--text-normal); text-decoration: none; font-size: 0.95em;">${p.file.name}</a>
> > >              ${tasksOpen > 0 ? `<span style="font-size: 0.7em; color: var(--interactive-accent); opacity: 0.8;">🛠️ ${tasksOpen}</span>` : ""}
> > >          </div>
> > >          <div style="display: flex; gap: 15px; align-items: center;">
> > >              <div style="font-size: 0.7em; color: var(--text-faint); font-weight: bold;">📅 ${dueDate}</div>
> > >              <div style="font-size: 0.65em; color: var(--text-muted); font-style: italic; width: 70px; text-align: right;">${p.persona || ""}</div>
> > >          </div>
> > >      </div>`;
> > > });
> > > dv.el("div", html + `</div>`);
> > > ```
> > >
> > > 🛰️ **Management Navigation**
> > > > [!multi-column]
> > > > > [!success]- 👷 Worker
> > > > > `$= dv.list(dv.pages('!"zData"').where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('worker')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#worker' || String(v).toLowerCase() === '#persona/worker')).limit(3).file.link)`
> > > >
> > > > > [!warning]- 👑 Queen/King
> > > > > `$= dv.list(dv.pages('!"zData"').where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('queen_king')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#queen_king' || String(v).toLowerCase() === '#persona/queen_king')).limit(3).file.link)`
> > > > 
> > > > > [!info]- 📊 Organizer
> > > > > `$= dv.list(dv.pages('!"zData"').where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('organizer')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#organizer' || String(v).toLowerCase() === '#persona/organizer')).limit(3).file.link)`
> > > 
> > > > [!multi-column]
> > > > > [!todo]- 🏋️ Trainer
> > > > > `$= dv.list(dv.pages('!"zData"').where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('trainer')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#trainer' || String(v).toLowerCase() === '#persona/trainer')).limit(3).file.link)`
> > > > 
> > > > > [!info]- Strategist
> > > > > `$= dv.list(dv.pages('!"zData"').where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('strategist')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#strategist' || String(v).toLowerCase() === '#persona/strategist')).limit(3).file.link)`
