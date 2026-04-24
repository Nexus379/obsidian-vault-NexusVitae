---
cssclasses:
  - dashboard-no-border
  - wide-page
---
# 🎓 PKM
| [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PLM|🌷 PLM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PPM|🌻 PPM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Logs-PKM|🎓 PKM]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard-PKM| 🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard| 🪙 Finance]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Review|🔭 Reviews]] |

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
> >          const pages = dv.pages('!"zData"').where(p => p.discipline); 
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
> > {
> >     const today = moment().startOf('day');
> >     const icons = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌", "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"];
> > 
> >     const timeFrames = [
> >          { label: "Critical", days: 0, color: "var(--text-error)" },
> >          { label: "Upcoming", days: 3, color: "var(--text-accent)" },
> >          { label: "Week", days: 7, color: "var(--text-success)" },
> >          { label: "Future", days: 30, color: "var(--text-muted)" }
> >     ];
> > 
> >     const allPages = dv.pages('"4_Tasks" OR "5_Notes"')
> >          .where(p => p.status !== "done" && (p.nextstudy || p.due));
> > 
> >     let html = '<div style="display: flex; gap: 15px; overflow-x: auto; padding: 10px; align-items: flex-start; background: var(--background-secondary); border-radius: 8px;">';
> > 
> >     timeFrames.forEach(tf => {
> >          html += '<div style="min-width: 220px; flex: 1; display: flex; flex-direction: column;">';
> >          html += `<div style="font-size: 0.9em; font-weight: bold; text-align: center; color: ${tf.color}; margin-bottom: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">${tf.label}</div>`;
> > 
> >          const cards = allPages.filter(p => {
> >              const d = p.nextstudy || p.due;
> >              if (!d) return false;
> >              const diff = moment(d.toString()).diff(today, 'days');
> >              if (tf.days === 0) return diff <= 0;
> >              if (tf.days === 3) return diff > 0 && diff <= 3;
> >              if (tf.days === 7) return diff > 3 && diff <= 7;
> >              return diff > 7 && diff <= 30;
> >          }).sort(p => p.nextstudy || p.due, 'asc');
> > 
> >          cards.forEach(p => {
> >              const lvl = p.spacelvl || 0;
> >              const disc = p.discipline ? String(p.discipline).replace("#disc/", "").split(',')[0].toUpperCase() : "GEN";
> >              const dateVal = p.nextstudy || p.due;
> >              const dateStr = dateVal ? moment(dateVal.toString()).format("DD.MM.") : "--.--";
> >              const rankName = p.spacerank ? String(p.spacerank).split('(')[0].trim() : "Initiate";
> >              const cleanTitle = p.file.name.replace(/^[0-9a-z.]+ /i, "").replace(/^(Quest:|Study:|Atomic:)/i, "").trim();
> > 
> >              html += '<div style="background: var(--background-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; margin-bottom: 8px; box-shadow: var(--shadow-s);">';
> >                  
> >                  html += '<div style="display: flex; justify-content: space-between; font-size: 0.65em; margin-bottom: 6px; opacity: 0.8;">';
> >                      html += `<span style="color: ${tf.color}; font-weight: bold;">${disc}</span>`;
> >                      html += `<span>${dateStr}</span>`;
> >                  html += '</div>';
> > 
> >                  html += `<a class="internal-link" href="${p.file.path}" style="font-size: 0.95em; color: var(--text-normal); text-decoration: none; font-weight: 500; display: block; margin-bottom: 8px;">${cleanTitle}</a>`;
> > 
> >                  html += '<div style="display: flex; justify-content: space-between; font-size: 0.65em; color: var(--text-muted);">';
> >                      html += `<span>${icons[Math.min(lvl, icons.length - 1)]} ${rankName}</span>`;
> >                      html += `<span>Lv.${lvl}</span>`;
> >                  html += '</div>';
> > 
> >                  html += '<div style="width: 100%; height: 2px; background: var(--background-modifier-border); margin-top: 8px;">';
> >                      html += `<div style="height: 100%; width: ${Math.min((lvl/43)*100, 100)}%; background: ${tf.color}; opacity: 0.6;"></div>`;
> >                  html += '</div>';
> > 
> >              html += '</div>';
> >          });
> >          html += '</div>';
> >     });
> > 
> >     html += '</div>';
> >     dv.el('div', html);
> > }
> > 
> > ```

```dataviewjs
// 🔱 NEXUS MINERVA: INTELLIGENT STUDY RADAR
const today = moment();

// 1. DATA PULL
const studyNotes = dv.pages('(#5note OR #4task/tostudy) AND !"zData"')
    .where(p => p.discipline && !String(p.status).includes("spaced"));

// 2. LOGIC-ENGINE 
const processedNotes = studyNotes.map(p => {
    const isRepeat = (Number(p.RecDays) > 0) ? "🔁" : "📌";
    
    let isUrgent = false;
    const due = p.due ? moment(p.due.toString()) : null;
    const doDate = p.do ? moment(p.do.toString()) : null;
    
    if (!due && !doDate && !p.project) {
        isUrgent = true; 
    } else if (due && due.diff(today, 'days') <= 7) {
        isUrgent = true; 
    }

    return {
        link: p.file.link,
        disc: p.discipline,
        type: isRepeat,
        urgent: isUrgent ? "🔥 SOFORT" : "☁️ Später",
        status: p["repetition-status"] || "1-new"
    };
});

// 3. VISUAL COCKPIT
dv.header(2, "📚 Strategic Learning Queue");

dv.table(["Urgency", "Type", "Subject", "Topic", "Stage"], 
    processedNotes
    .sort(n => n.urgent, "desc")
    .map(n => [n.urgent, n.type, n.disc, n.link, n.status])
);
```
---
