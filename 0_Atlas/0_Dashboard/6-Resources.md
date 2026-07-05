---
cssclasses:
  - dashboard-no-border
  - wide-page
---

# 🔖 Library & Resources
| [[0_Atlas/0_Dashboard/6-Resources|🔖Resources]] | [[0_Atlas/Bases/Resourcebase.base|⚙️Resourcebase]] | [[0_Atlas/0_Dashboard/6-Resources/AI|🤖AI]] | [[0_Atlas/0_Dashboard/6-Resources/Articles|📄Articles]] | [[0_Atlas/0_Dashboard/6-Resources/Boardgame|🎲Boardgame]] | [[0_Atlas/0_Dashboard/6-Resources/Books|📚Books]] | [[0_Atlas/0_Dashboard/6-Resources/Classes|🏫Classes]] | [[0_Atlas/0_Dashboard/6-Resources/Courses|🎓Courses]] | [[0_Atlas/0_Dashboard/6-Resources/Films|🎬Films]] | [[0_Atlas/0_Dashboard/6-Resources/Games|🕹️Games]] | [[0_Atlas/0_Dashboard/6-Resources/Guides|🗺️Guides]] | [[0_Atlas/0_Dashboard/6-Resources/Museums|🖼️Museums]] | [[0_Atlas/0_Dashboard/6-Resources/Music|🎶Music]] | [[0_Atlas/0_Dashboard/6-Resources/Papers|📃Papers]] | [[0_Atlas/0_Dashboard/6-Resources/Recipes|🍳Recipes]] | [[0_Atlas/0_Dashboard/6-Resources/Reference|📚Reference]] | [[0_Atlas/0_Dashboard/6-Resources/Series|🎞️Series]] | [[0_Atlas/0_Dashboard/6-Resources/Videos|🎬Videos]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---
> [!multi-column]
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
> >          // 🔱 FIX 1: Findet Ressourcen jetzt lückenlos in ALLEN Meta-Feldern
> >          const entries = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => {
> >              const allTags = (String(p.arch || "") + " " + String(p.archtype || "") + " " + String(p.file.etags || "")).toLowerCase();
> >              return allTags.includes("#6") || p.file.path.includes("6_Resources");
> >          });
> > 
> >          const resLabels = ["AI", "Articles", "Boardgames", "Books", "Classes", "Courses", "Films", "Games", "Guides", "Museums", "Music", "Papers", "Recipes", "Reference", "Series", "Videos"];
> >          const resTags = ["ai", "article", "boardgame", "book", "class", "course", "film", "game", "guide", "museum", "music", "paper", "recipe", "reference", "serie", "video"];
> >          const resColors = ['#89dceb', '#a6e3a1', '#f9e2af', '#f5e0dc', '#94e2d5', '#74c7ec', '#fab387', '#cba6f7', '#b4befe', '#eba0ac', '#f38ba8', '#89b4fa', '#a6e3a1', '#bac2de', '#f5c2e7', '#fab387'];
> > 
> >          const counts = resTags.map(tag => 
> >              entries.filter(p => {
> >                  const meta = (p.file.path + " " + String(p.arch || "") + " " + String(p.archtype || "") + " " + String(p.file.tags || "")).toLowerCase();
> >                  
> >                  // 🔱 FIX 2: Die "Fallen" umgehen
> >                  // '\b' zwingt Dataview, nur nach dem alleinstehenden Wort zu suchen.
> >                  if (tag === "ai") return meta.match(/\bai\b/) || meta.includes("#6resource/ai"); // Kein Treffer mehr bei "Daily" oder "Email"
> >                  if (tag === "game") return meta.match(/\bgames?\b/) && !meta.includes("boardgame"); // Trennt normale Games von Boardgames
> >                  
> >                  return meta.includes(tag);
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
> > >      .where(p => {
> > >          // 🔱 FIX 3: Auch hier die Metadaten sicher kombinieren
> > >          const allTags = (String(p.arch || "") + " " + String(p.archtype || "") + " " + String(p.file.etags || "")).toLowerCase();
> > >          return allTags.includes("#6") || p.file.path.includes("6_Resources");
> > >      })
> > >      .where(p => !p.file.name.toLowerCase().includes("dashboard") && 
> > >                  !p.file.name.toLowerCase().includes("moc") && 
> > >                  !p.file.path.includes("y-Archive"))
> > >      .sort(p => p.file.mtime, "desc")
> > >      .limit(10);
> > > 
> > > const getEmoji = (p) => {
> > >      const meta = (p.file.path + " " + String(p.archtype || "") + " " + String(p.arch || "") + " " + String(p.file.tags || "")).toLowerCase();
> > >      
> > >      // 🔱 Emojis erweitert, damit das Radar noch besser aussieht
> > >      if (meta.includes("📚") || meta.includes("book")) return "📚";
> > >      if (meta.includes("🎥") || meta.includes("video") || meta.includes("film") || meta.includes("serie")) return "🎥";
> > >      if (meta.includes("📄") || meta.includes("article") || meta.includes("paper")) return "📄";
> > >      if (meta.includes("🎓") || meta.includes("study") || meta.includes("course") || meta.includes("class")) return "🎓";
> > >      if (meta.includes("🎙️") || meta.includes("audio") || meta.includes("pod") || meta.includes("music")) return "🎙️";
> > >      if (meta.includes("🎲") || meta.includes("game") || meta.includes("boardgame")) return "🎲";
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
