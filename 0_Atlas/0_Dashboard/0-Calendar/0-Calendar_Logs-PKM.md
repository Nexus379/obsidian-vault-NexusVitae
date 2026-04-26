---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 🎓 PKM
| [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM|🌷 PLM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM|🌻 PPM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM|🎓 PKM]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

> [!multi-column]
> > [!blank]
> > 
> > ### 🔱 **NEXUS NAVIGATOR**
> > ```dataviewjs
> > { 
> >      const chartContainer = this.container;
> >      const REFRESH_COOLDOWN = 60000; 
> >      const now = Date.now();
> >      
> >      chartContainer.style.width = "300px";
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
> >                  cutout: '75%', 
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
> >     ["Log", "Fokus & Themen"],
> >     dv.pages('"0_Calendar/3_PKM"')
> >         .sort(p => p.file.ctime, 'desc')
> >         .limit(10)
> >         .map(p => {
> >             let topics = [];
> >             
> >             // Durchsucht alle YAML-Variablen der Notiz
> >             for (let key in p) {
> >                 // Prüft, ob der Name wie eine deiner generierten IDs aussieht (z.B. "mathematics_1234")
> >                 if (/[a-z_]+_\d{4}/.test(key) && p[key]) {
> >                     // Schneidet die Zahlen ab, um den Fachnamen zu bekommen
> >                     let rawDisc = key.replace(/_\d{4}$/, '');
> >                     
> >                     // Macht den Fachnamen hübsch (z.B. "computer_sci" -> "Computer Sci")
> >                     let cleanDisc = rawDisc.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
> >                     
> >                     // Baut den Text zusammen: "Fach: Dein eingetipptes Thema"
> >                     topics.push(`**${cleanDisc}:** ${p[key]}`);
> >                 }
> >             }
> >             
> >             // Falls Themen gefunden wurden, werden sie untereinander aufgelistet
> >             return [
> >                 p.file.link, 
> >                 topics.length > 0 ? topics.join("<br>") : "*(kein Thema eingetragen)*"
> >             ];
> >         })
> > )
> > ```


---
