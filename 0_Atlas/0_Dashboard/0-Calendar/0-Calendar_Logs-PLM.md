---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# 🌷 PLM Dashboard (Life)
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
> >          // Deine PLM Personas
> >          const personas = [
> >              { label: "Guardian", key: "guardian", color: "#f5c2e7" },
> >              { label: "Warrior", key: "warrior", color: "#f38ba8" },
> >              { label: "Nurturer", key: "nurturer", color: "#a6e3a1" },
> >              { label: "Parent", key: "parent", color: "#f9e2af" },
> >              { label: "Child", key: "child", color: "#89dceb" },
> >              { label: "Sibling", key: "sibling", color: "#94e2d5" },
> >              { label: "Partner", key: "partner", color: "#eba0ac" },
> >              { label: "Friend", key: "friend", color: "#fab387" },
> >              { label: "Lover", key: "lover", color: "#ff79c6" },
> >              { label: "Host", key: "host", color: "#b4befe" },
> >              { label: "Traveler", key: "traveler", color: "#cba6f7" },
> >              { label: "Player", key: "player", color: "#74c7ec" },
> >              { label: "Monk/Nun", key: "monk_nun", color: "#bac2de" }
> >          ];
> > 
> >          const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
> >          const counts = personas.map(p => pages.where(page => dv.array(page.persona).some(v => String(v).toLowerCase().includes(p.key)) || dv.array(page.file.tags).some(v => String(v).toLowerCase() === "#" + p.key)).length);
> >          const hasData = counts.some(c => c > 0);
> > 
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: hasData ? personas.map(p => p.label) : ["Pure Existence 🌌"],
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
> > > [!plm]
> > > 📊 **PLM Active Pipeline**
> > > ```dataviewjs
> > > const plmKeys = ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "host", "traveler", "player", "monk_nun"];
> > > const pages = dv.pages('"3_Projects" AND !"zData" AND -"yArchive"')
> > >      .where(p => p.inbox !== true)
> > >      .where(p => !dv.array(p.status).some(s => String(s).toLowerCase().includes("done")) && (
> > >          dv.array(p.persona).some(v => plmKeys.some(k => String(v).toLowerCase().includes(k))) ||
> > >          dv.array(p.archtype).some(v => ["plm", "1plm"].some(k => String(v).toLowerCase().includes(k)))
> > >      ))
> > >      .sort(p => p.priority, "desc")
> > >      .limit(10);
> > > 
> > > let html = `<div style="display: flex; flex-direction: column; gap: 2px; padding: 5px 0;">`;
> > > pages.forEach(p => {
> > >      let dotColor = p.priority == "🔴" ? "#f38ba8" : (p.priority == "🟡" ? "#f9e2af" : "#ff79c6");
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
> > >              <div style="font-size: 0.65em; color: var(--text-muted); font-style: italic; width: 80px; text-align: right;">${p.persona || ""}</div>
> > >          </div>
> > >      </div>`;
> > > });
> > > dv.el("div", html + `</div>`);
> > > ```
> > >
> > > 🛰️ **Life Navigation**
> > > > [!multi-column]
> > > > > [!pink]- Guardian
> > > > > `$= dv.list(dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('guardian')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#guardian' || String(v).toLowerCase() === '#persona/guardian')).limit(3).file.link)`
> > > >
> > > > > [!soul]- 🦄 Love & Relation
> > > > > `$= dv.list(dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('partner')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#partner' || String(v).toLowerCase() === '#persona/partner')).limit(3).file.link)`
> > > > 
> > > > > [!healer]- Nurturer
> > > > > `$= dv.list(dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('nurturer')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#nurturer' || String(v).toLowerCase() === '#persona/nurturer')).limit(3).file.link)`
> > > 
> > > > [!multi-column]
> > > > > [!social]- 👥 Friends & Social
> > > > > `$= dv.list(dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('friend')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#friend' || String(v).toLowerCase() === '#persona/friend')).limit(3).file.link)`
> > > > 
> > > > > [!travel]- 🧭 Traveler
> > > > > `$= dv.list(dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => dv.array(p.persona).some(v => String(v).toLowerCase().includes('traveler')) || dv.array(p.file.tags).some(v => String(v).toLowerCase() === '#traveler' || String(v).toLowerCase() === '#persona/traveler')).limit(3).file.link)`
