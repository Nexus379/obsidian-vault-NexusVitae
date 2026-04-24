<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview.api;
const revModule = tp.variables.revModule || "master";
const start = tp.variables.revStart; 
const end = tp.variables.revEnd;
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Monthly Review";

const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const isMaster = (revModule === "master");
const [yy, mm] = start.split("-");

// 🔱 2. PATH & TITLE LOGIC
const targetFolder = `${baseCal}/6_Review/Monthly/${yy}`;
const finalTitle = `${yy}-${mm} revM - ${displayTitle}`; 
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
archtype: ["#0cal/1review/monthly"]
rev_module: "<%- revModule %>"
rev_start: <%- start %>
rev_end: <%- end %>
connected_log: "<%- logConnect %>"
status: 1active
---

# 🌍 <%- displayTitle %> 
> [!quote] The Macro View
> "The obstacle in the path becomes the path. Never forget, within every challenge is an opportunity to improve our condition."
> **Nexus Sync:** <%- revModule.toUpperCase() %> | **Period:** `<%- start %>` — `<%- end %>`

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 🌌 The North Star (Alignment Check)

> [!stars] Vision, Purpose & Goals
> <small style="opacity:0.5; text-transform:uppercase;">The Current Horizon</small>
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
> // 2. Show Active Goals
> const goals = dv.pages("#1stars/3goals").where(g => g.status === "1active").sort(g => g.due, "asc");
> if(goals.length > 0) {
>     dv.list(goals.map(g => {
>         let timeleft = "";
>         if(g.due) {
>             let days = moment(String(g.due)).diff(moment(), 'days');
>             timeleft = days >= 0 ? ` *(in ${days} days)*` : ` *(Overdue!)*`;
>         }
>         return "🎯 [[" + g.file.name + "]]" + timeleft;
>     }));
> } else {
>     dv.paragraph("_No active 90-day goals defined._");
> }
> ```
> 
> **Are my current projects aligned with my Purpose & Vision?**
> `INPUT[toggle:revm_visionAlignment]`
> 
> **Does a 90-day goal require a status shift (done/canceled)?**
> `INPUT[toggle:revm_goalShift]`

---

<%* if (isMaster || revModule === "plm") { %>
## 🌷 PLM: Monthly Resilience

> [!chart] 🌡️ PLM Pulse (Energy Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { plmPink: ["#f8bbd0", "#f48fb1", "#f06292", "#e91e63", "#c2185b"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date)) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page.energy || 1,
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!info] 🏃 Monthly Averages & Sums
> - **Avg Energy:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> - **Avg Sleep:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> - **Total Fitness:** `$= dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").fitness_revD.sum() || 0` min

---
<%* } %>

<%* if (isMaster || revModule === "ppm" || revModule === "proj") { %>
## 🌻 PPM & Projects: Strategic Execution

<%* if (revModule === "proj") { %>
> [!todo] 🧩 Project Focus: <%- logConnect %>
<%* } else { %>

> [!chart] 🌡️ PPM Pulse (Strategy Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { ppmBlue: ["#bbdefb", "#90caf9", "#64b5f6", "#2196f3", "#1976d2"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date)) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page.energy || 1,
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```
<%* } %>

> [!multi-column]
>
> > [!todo|wide-1] 🎯 Execution Volume
> > 
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<%- start %>") && t.completion <= dv.date("<%- end %>"));
> > let filtered = t;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     filtered = t.where(x => x.link.path.includes(projName) || (x.text && x.text.includes(projName)));
> > }
> > dv.paragraph(`**${filtered.length}** Tasks completed.`);
> > ```
>
> > [!abstract|wide-1] 🚧 Active Projects This Month
> > 
> > ```dataviewjs
> > const pr = dv.pages('"0_Calendar/4_Projectlog"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let projects = new Set();
> > pr.forEach(x => { 
> >     if ("<%- revModule %>" !== "proj" || x.file.name.includes("<%- logConnect.replace(/[\[\]]/g, '') %>") || (x.file.outlinks && String(x.file.outlinks).includes("<%- logConnect.replace(/[\[\]]/g, '') %>"))) {
> >         if(x.file.outlinks.length > 0) x.file.outlinks.forEach(l => projects.add(l.path.split('/').pop().replace('.md','')));
> >     }
> > });
> > if(projects.size > 0) dv.list(Array.from(projects).map(p => "🚧 [[" + p + "]]"));
> > else dv.paragraph("_No linked projects this month._");
> > ```

---
<%* } %>

<%* if (isMaster || revModule === "pkm") { %>
## 🌼 PKM: Knowledge Harvest

> [!chart] 🌡️ PKM Pulse (Mind Heatmap)
>
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { pkmOrange: ["#ffe0b2", "#ffcc80", "#ffb74d", "#ff9800", "#e65100"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date)) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page['brain-drain'] || 1, // Focus is brain-drain
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!abstract] 📚 Total Time Invested
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
<%* } %>

## 📖 The Monthly Narrative

> [!quote] The Condensed Truth of the Past Weeks
> <small style="opacity:0.5; text-transform:uppercase;">Summary of your Weekly Reviews</small>
>
> ```dataviewjs
> const weeklies = dv.pages('#0cal/1review/weekly').where(p => p.rev_end >= "<%- start %>" && p.rev_end <= "<%- end %>").sort(p => p.rev_end, "asc");
> let filtered = weeklies;
> if ("<%- revModule %>" !== "master") {
>     filtered = weeklies.where(w => w.rev_module === "<%- revModule %>" && w.connected_log === "<%- logConnect %>");
> }
> 
> if (filtered.length > 0) {
>     filtered.forEach(w => {
>         dv.header(4, `Week ending ${w.rev_end}`);
>         let win = w.weekly_win || "_Not recorded_";
>         let lesson = w.weekly_lesson || "_Not recorded_";
>         dv.list([`**Win:** ${win}`, `**Lesson:** ${lesson}`]);
>     });
> } else {
>     dv.paragraph("_No Weekly Reviews found for this period._");
> }
> ```

---

## 🌑 Deep Sync: Monthly Alignment

> [!multi-column]
>
> > [!example|wide-1] The Horizon
> > **What is the core pattern of my lessons this month?**
> > `INPUT[text:revm_lessonPattern]`
> > 
> > **Where did I put my ego before the mission?**
> > `INPUT[text:revm_egoCheck]`
>
> > [!heart|wide-1] The Foundation
> > **What am I genuinely grateful for this month?**
> > `INPUT[text:revm_gratitude]`
> > 
> > **The radically reduced focus for next month:**
> > `INPUT[text:revm_nextMonthFocus]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`