<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview.api;
const revModule = tp.variables.revModule || "master";
const start = tp.variables.revStart; 
const end = tp.variables.revEnd;
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Quarterly Review";

const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const isMaster = (revModule === "master");
const yy = start.split("-")[0];
const qNum = moment(start).quarter(); // 🔱 MAGIC: Berechnet automatisch Q1, Q2, Q3 oder Q4

// 🔱 2. PATH & TITLE LOGIC
const targetFolder = `${baseCal}/6_Review/Quarterly/${yy}`;
const finalTitle = `${yy}-Q${qNum} revQ - ${displayTitle}`; 
const finalDest = `${targetFolder}/${finalTitle}.md`;

// Ensure folder structure
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
}

// Rename and move
if (tp.file.title !== finalTitle) await tp.file.rename(finalTitle);
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

tR += "---";
%>
arch: ["#0cal/1review"]
archtype: ["#0cal/1review/quarterly"]
rev_module: "<%- revModule %>"
rev_start: <%- start %>
rev_end: <%- end %>
connected_log: "<%- logConnect %>"
status: 1active
---

# 🏔️ <%- displayTitle %> (Q<%- qNum %>)
> [!quote] The Seasons of Life
> "We overestimate what we can do in a day, but underestimate what we can do in 90 days."
> **Nexus Sync:** <%- revModule.toUpperCase() %> | **Period:** `<%- start %>` — `<%- end %>`

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 🌌 The North Star (Quarterly Goal Harvest)

> [!stars] Vision, Purpose & Goals
> <small style="opacity:0.5; text-transform:uppercase;">The 90-Day Reality Check</small>
>
> ```dataviewjs
> // 1. Show Vision & Purpose
> const purpose = dv.pages("#1stars/1purpose").where(p => p.status === "1active");
> const vision = dv.pages("#1stars/2vision").where(v => v.status === "1active");
> 
> if(purpose.length > 0) dv.list(purpose.map(p => "🌟 **Purpose:** [[" + p.file.name + "]]"));
> if(vision.length > 0) dv.list(vision.map(v => "👁️ **Vision:** [[" + v.file.name + "]]"));
> 
> dv.paragraph("---");
> 
> // 2. Show Active Goals for this Quarter
> const goals = dv.pages("#1stars/3goals").where(g => g.status === "1active").sort(g => g.due, "asc");
> if(goals.length > 0) {
>     dv.list(goals.map(g => {
>         let timeleft = "";
>         if(g.due) {
>             let days = moment(String(g.due)).diff(moment(), 'days');
>             timeleft = days >= 0 ? ` *(Ends in ${days} days)*` : ` *(Time is up!)*`;
>         }
>         return "🎯 [[" + g.file.name + "]]" + timeleft;
>     }));
> } else {
>     dv.paragraph("_No active 90-day goals defined. Time to set new ones!_");
> }
> ```
> 
> **Are my current projects still aligned with my 5-Year Vision?**
> `INPUT[toggle:revq_visionAlignment]`
> 
> **Have I completed my main 90-Day Goals for this Quarter?**
> `INPUT[toggle:revq_goalsCompleted]`

---

<%* if (isMaster || revModule === "plm") { -%>
## 🌷 PLM: Quarterly Resilience

> [!pink] 🌡️ PLM Pulse (Energy Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { plmPink: ["#f8bbd0", "#f48fb1", "#f06292", "#e91e63", "#c2185b"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page.energy || 1,
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!abstract] 🏃 Quarterly Averages & Sums
> - **Avg Energy (90 Days):** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> - **Avg Sleep (90 Days):** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> - **Total Fitness (90 Days):** `$= dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").fitness_revD.sum() || 0` min

---
<%* } -%>

<%* if (isMaster || revModule === "ppm" || revModule === "proj") { -%>
## 🌻 PPM & Projects: Strategic Execution

<%* if (revModule === "proj") { -%>
> [!todo] 🧩 Project Focus: <%- logConnect %>
<%* } else { -%>

> [!example] 🌡️ PPM Pulse (Strategy Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { ppmBlue: ["#bbdefb", "#90caf9", "#64b5f6", "#2196f3", "#1976d2"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page.energy || 1,
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```
<%* } -%>

> [!multi-column]
>
> > [!abstract|wide-1] 🎯 90-Day Execution Volume
> > 
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<%- start %>") && t.completion <= dv.date("<%- end %>"));
> > let filtered = t;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     filtered = t.where(x => x.link.path.includes(projName) || (x.text && x.text.includes(projName)));
> > }
> > dv.paragraph(`**${filtered.length}** Tasks completed in this quarter.`);
> > ```
>
> > [!abstract|wide-1] 🚧 Active Projects in Q<%- qNum %>
> > 
> > ```dataviewjs
> > const pr = dv.pages('"0_Calendar/4_Projectlog"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let projects = new Set();
> > pr.forEach(x => { 
> >     if ("<%- revModule %>" !== "proj" || x.file.name.includes("<%- logConnect.replace(/[\[\]]/g, '') %>") || (x.file.outlinks && String(x.file.outlinks).includes("<%- logConnect.replace(/[\[\]]/g, '') %>"))) {
> >         if(x.file.outlinks.length > 0) x.file.outlinks.forEach(l => projects.add(l.path.split('/').pop().replace('.md','')));
> >     }
> > });
> > if(projects.size > 0) dv.list(Array.from(projects).slice(0, 10).map(p => "🚧 [[" + p + "]]"));
> > else dv.paragraph("_No linked projects this quarter._");
> > ```

---
<%* } -%>

<%* if (isMaster || revModule === "pkm") { -%>
## 🌼 PKM: Knowledge Harvest

> [!mind] 🌡️ PKM Pulse (Mind Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { pkmOrange: ["#ffe0b2", "#ffcc80", "#ffb74d", "#ff9800", "#e65100"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page['brain-drain'] || 1, 
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!abstract] 📚 Total Time Invested (90 Days)
> 
> ```dataviewjs
> const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> const subjects = ["english", "german", "math", "latin", "physics", "biology", "chemistry", "history", "philosophy", "politics", "economics", "law", "psychology", "art", "music"];
> let totals = {};
> let grandTotal = 0;
> p.forEach(x => {
>     Object.keys(x).forEach(k => {
>         const match = subjects.find(s => k.startsWith(s));
>         if(match && !isNaN(x[k]) && String(x[k]).trim() !== "") {
>             let val = Number(x[k]);
>             totals[match] = (totals[match] || 0) + val;
>             grandTotal += val;
>         }
>     });
> });
> let output = [];
> for (let [sub, val] of Object.entries(totals)) {
>     let hours = Math.floor(val / 60);
>     let mins = val % 60;
>     output.push(`**${sub.charAt(0).toUpperCase() + sub.slice(1)}**: ${hours}h ${mins}m`);
> }
> if (output.length > 0) {
>     dv.list(output);
>     let gHours = Math.floor(grandTotal / 60);
>     let gMins = grandTotal % 60;
>     dv.paragraph(`> **Grand Total:** ${gHours}h ${gMins}m`);
> } else {
>     dv.paragraph("_No study minutes logged._");
> }
> ```

---
<%* } -%>

## 📖 The Quarterly Narrative (Extracting Wisdom from Months)

> [!quote] The Arc of the Season
> <small style="opacity:0.5; text-transform:uppercase;">Summary of your Monthly Reviews</small>
>
> ```dataviewjs
> const monthlies = dv.pages('#0cal/1review/monthly').where(p => p.rev_end >= "<%- start %>" && p.rev_end <= "<%- end %>").sort(p => p.rev_end, "asc");
> let filtered = monthlies;
> if ("<%- revModule %>" !== "master") {
>     filtered = monthlies.where(w => w.rev_module === "<%- revModule %>" && w.connected_log === "<%- logConnect %>");
> }
> 
> if (filtered.length > 0) {
>     filtered.forEach(m => {
>         dv.header(4, `Month ending ${m.rev_end}`);
>         let pattern = m.revm_lessonPattern || "_Not recorded_";
>         let gratitude = m.revm_gratitude || "_Not recorded_";
>         dv.list([`**Pattern:** ${pattern}`, `**Gratitude:** ${gratitude}`]);
>     });
> } else {
>     dv.paragraph("_No Monthly Reviews found for this quarter._");
> }
> ```

---

## 🌑 Deep Sync: The 90-Day Reset

> [!multi-column]
>
> > [!example|wide-1] The Core Truth
> > **What was the overarching theme or lesson of this entire Quarter?**
> > 
> > `INPUT[text:revq_quarterlyTheme]`
> > 
> > **Which habits served me, and which ones need to die?**
> > 
> > `INPUT[text:revq_habitAudit]`
>
> > [!heart|wide-1] The Horizon
> > **What are the 1-3 new 90-Day Goals I will commit to now?**
> > 
> > `INPUT[text:revq_newGoals]`
> > 
> > **What is my single biggest focus for the upcoming Quarter?**
> > 
> > `INPUT[text:revq_nextQuarterFocus]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`