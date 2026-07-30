---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 🎓 PKM
![[zData/5design_modul/CalNav]]


![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
> > [!blank]
> > 
> > #### 🌼 **LEARNING FLOW**
> > ```dataviewjs
> > { 
> >      const chartContainer = this.container;
> >      const REFRESH_COOLDOWN = 60000; 
> >      const now = Date.now();
> >      
> >      chartContainer.style.width = "100%"; chartContainer.style.maxWidth = "240px"; chartContainer.style.height = "230px";
> >      chartContainer.style.margin = "0 auto"; 
> >      
> >      if (!window.lastPieRender) window.lastPieRender = 0;
> >      const isNewTab = chartContainer.innerHTML.length < 50;
> >      const cooldownOver = (now - window.lastPieRender > REFRESH_COOLDOWN);
> > 
> >      if (isNewTab || cooldownOver) {
> >          window.lastPieRender = now;
> > 
> >          // --- 🟢 1. DATA SOURCE ---
> >          const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.discipline); 
> > 
> >          // --- 🔵 2. LOGIC ---
> >          const counts = {};
> >          pages.forEach(p => {
> >              const discs = Array.isArray(p.discipline) ? p.discipline : [p.discipline];
> >              discs.forEach(d => {
> >                  const label = String(d).replace("#disc/", ""); 
> >                  counts[label] = (counts[label] || 0) + 1;
> >              });
> >          });
> > 
> >          const labels = Object.keys(counts);
> >          const dataValues = Object.values(counts);
> >          const hasData = dataValues.some(v => v > 0);
> > 
> >          // --- 🟡 3. DESIGN ---
> >          const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >          const chartData = {
> >              type: 'doughnut',
> >              data: {
> >                  labels: hasData ? labels : ["No disciplines yet"],
> >                  datasets: [{
> >                      data: hasData ? dataValues : [1],
> >                      backgroundColor: [
> >                          '#ff79c6', '#a6e3a1', '#89dceb', '#ffb86c', 
> >                          '#f9e2af', '#eba0ac', '#b4befe', '#cba6f7', 
> >                          '#f5e0dc', '#94e2d5', '#fab387', '#f38ba8'
> >                      ],
> >                      borderWidth: 0
> >                  }]
> >              },
> >              options: {
> >                  maintainAspectRatio: false, cutout: '76%', 
> >                  animation: false, 
> >                  plugins: {
> >                      legend: { 
> >                          position: 'bottom', 
> >                          labels: { 
> >                              color: textColor, 
> >                              font: { size: 8 },
> >                              boxWidth: 10,
> >                              padding: 10
> >                          } 
> >                      }
> >                  }
> >              }
> >          };
> > 
> >          // --- 🏗️ 4. RENDER PROCESS ---
> >          const renderInterval = setInterval(() => {
> >              if (window.renderChart) {
> >                  const oldCanvas = chartContainer.querySelector('canvas');
> >                  if (oldCanvas) oldCanvas.remove();
> >                  
> >                  window.renderChart(chartData, chartContainer);
> >                  clearInterval(renderInterval);
> >              }
> >          }, 150);
> >          setTimeout(() => clearInterval(renderInterval), 5000);
> >      }
> > }
> > 
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] Upcoming & Spaced Repetition
> > 
> > ```dataviewjs
> > dv.table(
> >     ["Log", "Focus & Topics"],
> >     dv.pages('"0_Calendar/3_PKM"')
> >         .where(p => p.file.name.toLowerCase().includes(" pkm"))
> >         .sort(p => p.file.ctime, 'desc')
> >         .limit(10)
> >         .map(p => {
> >             let topics = [];
> >             
> >             // Searches every YAML variable of the note
> >             for (let key in p) {
> >                 // Checks whether the name looks like one of the generated IDs (e.g. "mathematics_1234")
> >                 if (/[a-z_]+_\d{4}/.test(key) && p[key]) {
> >                     // Schneidet die Zahlen ab, um den Fachnamen zu bekommen
> >                     let rawDisc = key.replace(/_\d{4}$/, '');
> >                     
> >                     // Prettify the subject name (e.g. "computer_sci" -> "Computer Sci")
> >                     let cleanDisc = rawDisc.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
> >                     
> >                     // Assemble the text: "Subject: the topic you typed"
> >                     topics.push(`**${cleanDisc}:** ${p[key]}`);
> >                 }
> >             }
> >             
> >             // If topics were found, list them one below the other
> >             return [
> >                 p.file.link, 
> >                 topics.length > 0 ? topics.join("<br>") : "*(no topic entered)*"
> >             ];
> >         })
> > )
> > ```


---
