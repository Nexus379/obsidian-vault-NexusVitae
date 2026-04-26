---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# 🔖 Library & Resources
| [[0_Atlas/Bases/Resourcebase.base|🛠️ Resourcebase]] | [[0_Atlas/0_Dashboard/6-Resources/AI|🤖 AI]] | [[0_Atlas/0_Dashboard/6-Resources/Articles|📄 Articles]] | [[0_Atlas/0_Dashboard/6-Resources/Books|📚 Books]] | [[0_Atlas/0_Dashboard/6-Resources/Recipes|🍳 Recipes]] | [[0_Atlas/0_Dashboard/6-Resources/Videos|🎬 Videos]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---
>[!multi-column]
>  
> > [!blank|wide-0]
> > ### 🔱 **NEXUS NAVIGATOR**
> > 
> > ```dataviewjs
> > {
> >      const container = this.container;
> >      container.style.width = "260px";
> >      container.style.margin = "0 auto";
> > 
> >      if (!container.querySelector('canvas')) {
> >          const days = 90; 
> >          const start = moment().subtract(days, 'days').startOf('day');
> > 
> >          // Scan resources (Path & Tag combined)
> >          const entries = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => 
> >              String(p.arch || p.file.etags || "").includes("#6") || 
> >              p.file.path.includes("6_Resources")
> >          );
> > 
> >          const resLabels = ["AI", "Articles", "Boardgames", "Books", "Classes", "Courses", "Films", "Games", "Guides", "Museums", "Music", "Papers", "Recipes", "Reference", "Series", "Videos"];
> >          const resTags = ["ai", "article", "boardgame", "book", "class", "course", "film", "game", "guide", "museum", "music", "paper", "recipe", "reference", "serie", "video"];
> >          const resColors = ['#89dceb', '#a6e3a1', '#f9e2af', '#f5e0dc', '#94e2d5', '#74c7ec', '#fab387', '#cba6f7', '#b4befe', '#eba0ac', '#f38ba8', '#89b4fa', '#a6e3a1', '#bac2de', '#f5c2e7', '#fab387'];
> > 
> >          const counts = resTags.map(tag => 
> >              entries.filter(p => {
> >                  const metadata = String(p.file.path + p.archtype + p.file.tags + p.arch).toLowerCase();
> >                  return metadata.includes(tag);
> >              }).length
> >          );
> > 
> >          const hasData = counts.some(c => c > 0);
> > 
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: hasData ? resLabels : ["Empty Library 🌌"],
> >                  datasets: [{
> >                      data: hasData ? counts : [1],
> >                      backgroundColor: hasData ? resColors : ['var(--background-modifier-border)'],
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
> > > [!info] **📚 Recent Sources (Input Radar)**
> > > *Latest additions to your library:*
> > > ```dataviewjs
> > > const recent = dv.pages('!"zData" AND -"yArchive"')
> > >      .where(p => p.inbox !== true)
> > >      .where(p => (
> > >          String(p.arch || "").includes("#6") || 
> > >          p.file.path.includes("6_Resources")
> > >      ))
> > >      .where(p => !p.file.name.toLowerCase().includes("dashboard") && 
> > >                  !p.file.name.toLowerCase().includes("moc") && 
> > >                  !p.file.path.includes("y-Archive"))
> > >      .sort(p => p.file.mtime, "desc")
> > >      .limit(10);
> > > 
> > > const getEmoji = (p) => {
> > >      const meta = String(p.file.path + (p.archtype || "") + (p.file.tags || "")).toLowerCase();
> > >      if (meta.includes("📚") || meta.includes("book")) return "📚";
> > >      if (meta.includes("🎥") || meta.includes("video")) return "🎥";
> > >      if (meta.includes("📄") || meta.includes("article")) return "📄";
> > >      if (meta.includes("🎓") || meta.includes("study") || meta.includes("course")) return "🎓";
> > >      if (meta.includes("🎙️") || meta.includes("audio") || meta.includes("pod")) return "🎙️";
> > >      return "🔖"; 
> > > };
> > > 
> > > let html = `<div style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">`;
> > > 
> > > recent.forEach(s => {
> > >      const emoji = getEmoji(s);
> > >      html += `<div style="display: flex; align-items: center; justify-content: space-between; background: var(--background-secondary-alt); padding: 10px 15px; border-radius: 10px; border-left: 4px solid #cba6f7;">
> > >          <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; white-space: nowrap;">
> > >              <span style="font-size: 1.1em;">${emoji}</span>
> > >              <a class="internal-link" href="${s.file.path}" style="color: var(--text-normal); text-decoration: none; font-size: 0.85em; font-weight: bold;">${s.file.name}</a>
> > >          </div>
> > >          <div style="font-size: 0.6em; color: var(--text-faint); text-transform: uppercase;">${s.status || ""}</div>
> > >      </div>`;
> > > });
> > > 
> > > dv.el("div", html + `</div>`);
> > > ```
