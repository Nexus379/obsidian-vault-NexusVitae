---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 🏛️ Review Command Center
| [[0_Atlas/0_Dashboard/0-Dashboard|💫 Dashy]] | [[0_Atlas/0_Dashboard/0-Inbox|💌 Inbox]] | [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] |[[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard-PKM| 🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard| 🪙 Finance]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Review|🔭 Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---
>[!multi-column]
>
> > [!blank|wide-0]
> > ### 💹 **REVIEW DISTRIBUTION**
> > ```dataviewjs
> > {
> >      const chartContainer = this.container;
> >      chartContainer.style.width = "300px";
> >      chartContainer.style.margin = "0 auto";
> >
> >      const dailies = dv.pages('#0cal/1review').where(p => p.archtype.includes("daily") || (!p.archtype.includes("weekly") && !p.archtype.includes("monthly"))).length;
> >      const weeklies = dv.pages('#0cal/1review/weekly').length;
> >      const strategic = dv.pages('#0cal/1review').where(p => p.archtype.includes("monthly") || p.archtype.includes("quarterly") || p.archtype.includes("yearly")).length;
> >
> >      const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >      
> >      const chartData = {
> >          type: 'doughnut',
> >          data: {
> >              labels: ['Dailies', 'Weeklies', 'Strategic'],
> >              datasets: [{
> >                  data: [dailies || 1, weeklies || 0, strategic || 0],
> >                  backgroundColor: ['#89dceb', '#fab387', '#f5c2e7'],
> >                  borderWidth: 0
> >              }]
> >          },
> >          options: { 
> >              cutout: '75%', 
> >              animation: false,
> >              plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } } 
> >          }
> >      };
> >
> >      const renderInterval = setInterval(() => {
> >          if (window.renderChart) {
> >              const oldCanvas = chartContainer.querySelector('canvas');
> >              if (oldCanvas) oldCanvas.remove();
> >              window.renderChart(chartData, chartContainer);
> >              clearInterval(renderInterval);
> >          }
> >      }, 150);
> >      setTimeout(() => clearInterval(renderInterval), 5000);
> > }
> > ```
>
> > [!blank|wide-5]
> > ### 📈 **VITALITY ARC (30D)**
> > ```dataviewjs
> > {
> >      const chartContainer = this.container;
> >      chartContainer.style.width = "100%";
> >      chartContainer.style.height = "200px";
> >
> >      const days = 30;
> >      const start = moment().subtract(days, 'days');
> >      const reviews = dv.pages('#0cal/1review').where(p => p.cal_date >= start.format("YYYY-MM-DD")).sort(p => p.cal_date, "asc");
> >
> >      const labels = [];
> >      const energyData = [];
> >      const moodData = [];
> >
> >      for(let i=0; i < days; i++) {
> >          const d = moment().subtract(days-1-i, 'days').format("YYYY-MM-DD");
> >          labels.push(moment(d).format("DD.MM"));
> >          const rev = reviews.find(r => String(r.cal_date) === d);
> >          energyData.push(rev ? Number(rev.energy_revD) : null);
> >          moodData.push(rev ? Number(rev.mood_plm_revD) : null);
> >      }
> >
> >      const chartData = {
> >          type: 'line',
> >          data: {
> >              labels: labels,
> >              datasets: [
> >                  { label: 'Energy', data: energyData, borderColor: '#89dceb', backgroundColor: '#89dceb22', tension: 0.3, fill: true, pointRadius: 2 },
> >                  { label: 'Mood', data: moodData, borderColor: '#f5c2e7', backgroundColor: '#f5c2e722', tension: 0.3, fill: true, pointRadius: 2 }
> >              ]
> >          },
> >          options: {
> >              scales: { y: { min: 1, max: 5, ticks: { stepSize: 1, color: 'var(--text-muted)' } } },
> >              plugins: { legend: { display: true, labels: { color: 'var(--text-normal)', font: { size: 10 } } } }
> >          }
> >      };
> >
> >      const renderInterval = setInterval(() => {
> >          if (window.renderChart) {
> >              const oldCanvas = chartContainer.querySelector('canvas');
> >              if (oldCanvas) oldCanvas.remove();
> >              window.renderChart(chartData, chartContainer);
> >              clearInterval(renderInterval);
> >          }
> >      }, 150);
> >      setTimeout(() => clearInterval(renderInterval), 5000);
> > }
> > ```
> > ---
> > ### 🏆 **HALL OF WINS**
> > ```dataviewjs
> > {
> >     const weeklies = dv.pages('#0cal/1review/weekly').sort(p => p.file.mtime, "desc").limit(4);
> >     let html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;
> >     
> >     if(weeklies.length > 0) {
> >         weeklies.forEach(w => {
> >             const color = "#fab387";
> >             const auroraBg = "linear-gradient(270deg, " + color + "15 0%, transparent 95%)";
> >             html += `<div style="padding: 10px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px;">
> >                 <div style="font-size: 0.6em; color: var(--text-muted); font-weight: 800;">WEEKLY WIN • ${w.file.name.split(' ')[0]}</div>
> >                 <div style="font-size: 0.85em; font-style: italic; color: var(--text-normal); margin-top: 4px;">"${w.weekly_win || "Progress made."}"</div>
> >             </div>`;
> >         });
> >     } else {
> >         html += `<div style="text-align: center; opacity: 0.5; padding: 20px;">No wins logged yet.</div>`;
> >     }
> >     dv.el("div", html + "</div>");
> > }
> > ```

---
### 🛰️ The Review Stream
> [!multi-column]
>
> > [!pink] **Dailies (7D)**
> > ```dataviewjs
> > {
> >     const pages = dv.pages('#0cal/1review').where(p => !p.file.path.includes("Weekly") && !p.file.path.includes("Monthly")).sort(p => p.cal_date, "desc").limit(7);
> >     if(pages.length > 0) {
> >         dv.list(pages.map(p => `[[${p.file.path}|📅 ${p.file.name.split(' ')[0]}]] (Mood: ${p.mood_plm_revD || "?"})`));
> >     } else {
> >         dv.paragraph("_No dailies found._");
> >     }
> > }
> > ```
>
> > [!info] **Weeklies & Monthlies**
> > ```dataviewjs
> > {
> >     const w = dv.pages('#0cal/1review/weekly').sort(p => p.rev_end, "desc").limit(4);
> >     const m = dv.pages('#0cal/1review/monthly').sort(p => p.rev_end, "desc").limit(2);
> >     dv.header(6, "🛰️ Recent Weeklies");
> >     if(w.length > 0) dv.list(w.map(p => `[[${p.file.path}|Weekly ${p.rev_end || ""}]]`));
> >     else dv.paragraph("_None_");
> >     dv.header(6, "🌍 Recent Monthlies");
> >     if(m.length > 0) dv.list(m.map(p => `[[${p.file.path}|Monthly ${p.rev_start || ""}]]`));
> >     else dv.paragraph("_None_");
> > }
> > ```
>
> > [!success] **Strategic (Q/H/Y)**
> > ```dataviewjs
> > {
> >     const s = dv.pages('#0cal/1review').where(p => String(p.archtype).includes("quarterly") || String(p.archtype).includes("halfyear") || String(p.archtype).includes("yearly")).sort(p => p.file.mtime, "desc").limit(5);
> >     if(s.length > 0) {
> >         dv.list(s.map(p => `[[${p.file.path}|🏛️ ${p.file.name}]]`));
> >     } else {
> >         dv.paragraph("_No strategic reviews yet._");
> >     }
> > }
> > ```

---
