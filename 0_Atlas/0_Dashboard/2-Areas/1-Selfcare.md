---

cssclasses:
  - wide-page
  - dashboard-no-border
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0
---
# Selfcare Central
| [[0_Atlas/0_Dashboard/2-Areas|💠Areas]] | [[0_Atlas/Bases/2-Areas/Areas.base|⚙️Areasbase]] | [[0_Atlas/0_Dashboard/2-Areas/1-Selfcare|❤️Selfcare]] | [[0_Atlas/0_Dashboard/2-Areas/2-Creativity|🧡Creativity]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive|💛Drive]] | [[0_Atlas/0_Dashboard/2-Areas/4-Relationship|💚Relationship]] | [[0_Atlas/0_Dashboard/2-Areas/5-Expression|💙Expression]] | [[0_Atlas/0_Dashboard/2-Areas/6-Mind|💜Mind]] | [[0_Atlas/0_Dashboard/2-Areas/7-Crown|🤍Crown]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Financeboard|🪙Finance]] | [[0_Atlas/0_Dashboard/2-Areas/3-Drive_Fitnessboard|🏋️Fitness]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
> 
> > [!hub|wide-0] 🗺️ **ATLAS & ACTION**
> > 
> > ```dataviewjs
> > {
> >     const chartContainer = this.container;
> >     chartContainer.style.width = "280px";
> >     chartContainer.style.margin = "0 auto";
> >     if (chartContainer.innerHTML.length < 50) {
> >         const linked = p => {
> >             const hay = String([p.file.path, p.file.outlinks, p.arch, p.archtype, p.area2, p.parent, p.sibling, p.child, p.project3, p.task4, p.note5, p.resource6].join(' ')).toLowerCase();
> >             return hay.includes('#2area/1selfcare') || hay.includes('2area/1selfcare') || hay.includes('2_areas/1_selfcare') || hay.includes('1_selfcare') || hay.includes('1selfcare');
> >         };
> >         const values = [
> >             dv.pages('#2area/1selfcare AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).length,
> >             dv.pages('"3_Projects" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"4_Tasks" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"5_Notes" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"6_Resources" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length,
> >             dv.pages('"0_Calendar" AND !"zData" AND -"yArchive"').where(p => p.inbox !== true).where(linked).length
> >         ];
> >         const hasData = values.some(v => v > 0);
> >         const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> >         const chartData = { type: 'doughnut', data: { labels: hasData ? ['Selfcare', 'Projects', 'Tasks', 'Notes', 'Resources', 'Logs'] : ['Empty Orbit'], datasets: [{ data: hasData ? values : [1], backgroundColor: hasData ? ['#ff9999', '#fab387', '#f38ba8', '#a6e3a1', '#cba6f7', '#89b4fa'] : ['var(--background-modifier-border)'], borderWidth: 0, hoverOffset: 12 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 12, weight: 'bold', family: 'serif' }, padding: 20, usePointStyle: true } } } } };
> >         const renderInterval = setInterval(() => { if (window.renderChart) { const oldCanvas = chartContainer.querySelector('canvas'); if (oldCanvas) oldCanvas.remove(); window.renderChart(chartData, chartContainer); clearInterval(renderInterval); } }, 150);
> >         setTimeout(() => clearInterval(renderInterval), 5000);
> >     }
> > }
> > ```
> > 
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> >[!blank|wide-5] 📊 Status & Records
> > 
> > > [!pink] **🌸 Selfcare Entries**
> > > ```dataview
> > > TABLE status, priority, area2, file.mtime AS updated
> > > FROM #2area/1selfcare AND !"zData" AND -"yArchive"
> > > WHERE inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!goals] **🌟 Stars (Purpose · Vision · Goals serving this Area)**
> > > ```dataview
> > > TABLE archtype, status, due
> > > FROM #1stars AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "1_Selfcare") OR contains(string(area2), "1selfcare")) AND inbox != true
> > > SORT due ASC, file.mtime DESC
> > > ```
> >
> > > [!project] **Projects and Tasks**
> > > ```dataview
> > > TABLE archtype, status, priority, due
> > > FROM "3_Projects" OR "4_Tasks" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "1_Selfcare") OR contains(string(area2), "1selfcare") OR contains(string(archtype), "#2area/1selfcare") OR contains(string(file.outlinks), "1_Selfcare")) AND inbox != true
> > > SORT priority DESC, due ASC, file.mtime DESC
> > > ```
> >
> > > [!literature] **Notes and Resources**
> > > ```dataview
> > > TABLE archtype, status, discipline, file.mtime AS updated
> > > FROM "5_Notes" OR "6_Resources" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "1_Selfcare") OR contains(string(area2), "1selfcare") OR contains(string(archtype), "#2area/1selfcare") OR contains(string(file.outlinks), "1_Selfcare")) AND inbox != true
> > > SORT file.mtime DESC
> > > ```
> >
> > > [!info] **Logs and Reviews**
> > > ```dataview
> > > TABLE archtype, status, file.mtime AS updated
> > > FROM "0_Calendar" AND !"zData" AND -"yArchive"
> > > WHERE (contains(string(area2), "1_Selfcare") OR contains(string(area2), "1selfcare") OR contains(string(archtype), "#2area/1selfcare") OR contains(string(file.outlinks), "1_Selfcare")) AND inbox != true
> > > SORT file.mtime DESC
> > > LIMIT 12
> > > ```

> [!success] **🍎 Weekly Nutrition** <small>· aggregated live from the last 7 daily Meal logs</small>
> ```dataviewjs
> const engine = require(app.vault.adapter.basePath + "/zData/2scripts/mealEngine.js")();
> const week = {}; let daysLogged = 0;
> for (let b = 0; b < 7; b++) {
>     const d = moment().subtract(b, 'days');
>     const lp = dv.page(`0_Calendar/4_Projectlogs/Routine/${d.format("YYYY")}/${d.format("MM")}/Meal_${d.format("YYYY-MM-DD")}.md`);
>     if (!lp) continue;
>     const r = engine.parseMealActuals(lp, dv);
>     if (r.anyCooked) daysLogged++;
>     for (const k in r.totals) week[k] = (week[k] || 0) + r.totals[k];
> }
> // Weekly targets = the daily "Molecular Gaps" baselines × 7.
> const targets = { kcal: ["🔥 Energy", 2000, "kcal"], protein_g: ["💪 Protein", 100, "g"], fiber_g: ["🥦 Fiber", 30, "g"], vit_c_mg: ["🍊 Vit C", 100, "mg"], omega3_total_mg: ["🐟 Omega-3", 1000, "mg"], magnesium_mg: ["💎 Magnesium", 350, "mg"], iron_total_mg: ["🩸 Iron", 15, "mg"], zinc_mg: ["🛡️ Zinc", 10, "mg"] };
> if (daysLogged === 0) { dv.paragraph("_No Meal logs this week yet — generate one from today's PLM (🍱 Meal Log)._"); }
> else {
>     const rows = [];
>     for (const k in targets) {
>         const [label, daily, unit] = targets[k];
>         const goal = daily * 7, cur = week[k] || 0;
>         const pct = Math.min(100, Math.round((cur / goal) * 100));
>         const filled = Math.round(pct / 10);
>         rows.push([label, `${Math.round(cur)} / ${goal} ${unit}`, "🟩".repeat(filled) + "⬜".repeat(10 - filled) + ` ${pct}%`]);
>     }
>     dv.paragraph(`<small>📅 ${daysLogged} day(s) logged this week</small>`);
>     dv.table(["Nutrient", "Week total", "Coverage"], rows);
> }
> ```

> [!source] **Selfcare Library**
> ![[0_Atlas/Bases/2-Areas/Selfcare.base]]
