---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# 🪙 Finance Dashboard
| [[0_Atlas/0_Dashboard/0-Dashboard|💫 Dashy]] | [[0_Atlas/0_Dashboard/0-Inbox|💌 Inbox]] | [[0_Atlas/0_Dashboard/0-Calendar|📅 Calendar]] |[[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Studyboard-PKM| 🎓Studyboard]] | [[0_Atlas/0_Dashboard/2-Areas/4-Organize_Financeboard| 🪙 Finance]] | [[0_Atlas/0_Dashboard/0-Calendar/0-Calendar_Review|🔭 Reviews]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---
>[!multi-column]
>
> > [!blank|wide-0]
> > ### 💹 **FINANCIAL FLOW**
> >
> > ```dataviewjs
> > {
> >      const chartContainer = this.container;
> >      chartContainer.style.width = "300px";
> >      chartContainer.style.margin = "0 auto";
> >
> >      const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.amount != null);
> >      const getSum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
> >      
> >      const totalIn = getSum(pages.where(p => p.flow === "in").amount.array());
> >      const totalOut = getSum(pages.where(p => p.flow === "out").amount.array());
> >
> >      const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >      
> >      const chartData = {
> >          type: 'doughnut',
> >          data: {
> >              labels: ['Inflow', 'Outflow'],
> >              datasets: [{
> >                  data: [totalIn || 0.001, totalOut || 0.001],
> >                  backgroundColor: ['#a6e3a1', '#f38ba8'],
> >                  borderWidth: 0
> >              }]
> >          },
> >          options: { 
> >              cutout: '75%', 
> >              animation: false,
> >              plugins: { 
> >                  legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } 
> >              } 
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
> > **Net Balance:**
> > ```dataviewjs
> > {
> >      const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.amount != null);
> >      const getSum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
> >      const totalIn = getSum(pages.where(p => p.flow === "in").amount.array());
> >      const totalOut = getSum(pages.where(p => p.flow === "out").amount.array());
> >      const balance = totalIn - totalOut;
> >      const color = balance >= 0 ? "#a6e3a1" : "#f38ba8";
> >      dv.el("h2", balance.toFixed(2) + " €", { style: "color: " + color + "; text-align: center; margin: 0; font-size: 1.8em; font-weight: 800;" });
> > }
> > ```
>
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5] 💳 Accounts & Liquidity
> > > [!multi-column]
> > >
> > > > [!info] **🔵 PAYPAL**
> > > > ```dataviewjs
> > > > {
> > > >      const p = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.account === "PayPal");
> > > >      const getSum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
> > > >      const sum = getSum(p.where(p => p.flow === "in").amount.array()) - getSum(p.where(p => p.flow === "out").amount.array());
> > > >      dv.paragraph("**" + sum.toFixed(2) + " €**");
> > > > }
> > > > ```
> > >
> > > > [!success] **🏦 BANK**
> > > > ```dataviewjs
> > > > {
> > > >      const p = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.account === "Bank");
> > > >      const getSum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
> > > >      const sum = getSum(p.where(p => p.flow === "in").amount.array()) - getSum(p.where(p => p.flow === "out").amount.array());
> > > >      dv.paragraph("**" + sum.toFixed(2) + " €**");
> > > > }
> > > > ```
> > >
> > > > [!warning] **💳 VISA**
> > > > ```dataviewjs
> > > > {
> > > >      const p = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.account === "Visa");
> > > >      const getSum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
> > > >      const sum = getSum(p.where(p => p.flow === "in").amount.array()) - getSum(p.where(p => p.flow === "out").amount.array());
> > > >      dv.paragraph("**" + sum.toFixed(2) + " €**");
> > > > }
> > > > ```
> >
> > ---
> > ### 🗓️ Recent Transactions
> > ```dataviewjs
> > {
> >     const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true).where(p => p.amount != null).sort(p => p.file.mtime, "desc").limit(8);
> >     let html = `<div style="display: flex; flex-direction: column; gap: 6px;">`;
> >     
> >     pages.forEach(p => {
> >         const isOut = p.flow === "out";
> >         const color = isOut ? "#f38ba8" : "#a6e3a1";
> >         const icon = isOut ? "💸" : "💰";
> >         const auroraBg = "linear-gradient(270deg, " + color + "15 0%, transparent 95%)";
> >         
> >         html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: ${auroraBg}; border-left: 3px solid ${color}; border-radius: 4px;">
> >             <div style="display: flex; align-items: center; gap: 10px;">
> >                 <span style="font-size: 1.2em;">${icon}</span>
> >                 <div style="display: flex; flex-direction: column;">
> >                     <a class="internal-link" href="${p.file.path}" style="font-size: 0.85em; font-weight: 600; color: var(--text-normal); text-decoration: none;">${p.file.name}</a>
> >                     <span style="font-size: 0.6em; color: var(--text-muted); opacity: 0.8;">${p.payee || "N/A"} • ${p.account || "TBD"}</span>
> >                 </div>
> >             </div>
> >             <div style="text-align: right;">
> >                 <div style="font-size: 0.85em; font-weight: 800; color: ${color};">${isOut ? "-" : "+"}${Number(p.amount).toFixed(2)} €</div>
> >                 <div style="font-size: 0.55em; color: var(--text-faint);">${moment(p.file.mtime.toString()).fromNow()}</div>
> >             </div>
> >         </div>`;
> >     });
> >     dv.el("div", html + "</div>");
> > }
> > ```
