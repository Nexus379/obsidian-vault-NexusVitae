<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview.api;
const revModule = tp.variables.revModule || "master";
const start = tp.variables.revStart; 
const end = tp.variables.revEnd;
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Weekly Review";

const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const isMaster = (revModule === "master");
const [yy, mm] = end.split("-");

// 🔱 2. PATH & TITLE LOGIC
const targetFolder = `${baseCal}/6_Review/Weekly/${yy}`;
const finalTitle = `${end} revW - ${displayTitle}`; 
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
archtype: ["#0cal/1review/weekly"]
rev_module: "<%- revModule %>"
rev_start: <%- start %>
rev_end: <%- end %>
connected_log: "<%- logConnect %>"
status: 1active
---

# 🛰️ <%- displayTitle %> 
> [!abstract] 🔱 Nexus Sync: <%- revModule.toUpperCase() %> | Period: `<%- start %>` — `<%- end %>`

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 🌌 The North Star (Alignment Check)

> [!stars]  Goals ➡️ Projects
> <small style="opacity:0.5; text-transform:uppercase;">Are my projects on track?</small>
> ```dataviewjs
> // 1. Find all active 90-Day Goals
> const goals = dv.pages("#1stars/3goals").where(g => g.status === "1active");
> 
> if(goals.length > 0) {
>     for (let goal of goals) {
>         // Calculate remaining days
>         let timeleft = "";
>         if(goal.due) {
>             let days = moment(String(goal.due)).diff(moment(), 'days');
>             timeleft = days >= 0 ? `*(in ${days} days)*` : `*(Overdue!)*`;
>         }
>         
>         // Display the goal as a header
>         dv.header(4, "🎯 [[" + goal.file.name + "]] " + timeleft);
>         
>         // 2. Find all active projects linked to this goal (via 'parent', 'stars1', or outlinks)
>         const projects = dv.pages("#3project").where(p => p.status === "1active" && (String(p.parent).includes(goal.file.name) || String(p.stars1).includes(goal.file.name) || String(p.file.outlinks).includes(goal.file.name)));
>         
>         if(projects.length > 0) {
>             dv.list(projects.map(p => {
>                 // Display the project and its remaining open tasks
>                 let taskCount = p.file.tasks.where(t => !t.completed).length;
>                 return "🚧 [[" + p.file.name + "]] *(Open Tasks: " + taskCount + ")*";
>             }));
>         } else {
>             dv.paragraph("_⚠️ No active projects defined for this goal!_");
>         }
>     }
> } else {
>     dv.paragraph("_No active 90-day goals defined._");
> }
> ```
> **Did I move the needle on my main goals this week?**
> `INPUT[toggle:revw_goalsProgress]`


<%* if (isMaster || revModule === "plm") { %>
## 🌷 PLM: Weekly Vitality & Resilience

> [!chart] 🌡️ PLM Pulse (Energy Heatmap)
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

> [!multi-column]
> > [!pink|wide-1] 📈 The Story (Daily Focus & Energy)
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let focusList = [];
> > p.forEach(x => {
> >     let dayName = moment(String(x.cal_date)).format("ddd");
> >     let focus = (x.focusD_plm && String(x.focusD_plm).trim() !== "") ? x.focusD_plm : "_No focus_";
> >     focusList.push(`**${dayName}** (⚡${x.energy || "?"}): ${focus}`);
> > });
> > if(focusList.length > 0) dv.list(focusList);
> > else dv.paragraph("_No PLM logs recorded._");
> > ```
>
> > [!abstract|wide-1] 🏃 Resonance (Averages & Sums)
> > - **Weekly Avg Energy:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Weekly Avg Mood:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.mood.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Sleep Avg:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> > - **Fitness Total:** `$= dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").fitness_revD.sum() || 0` min

---
<%* } %>

<%* if (isMaster || revModule === "ppm" || revModule === "proj") { %>
## 🌻 PPM & Projects: Strategic Execution

<%* if (revModule === "proj") { %>
> [!todo] 🧩 Project Focus: <%- logConnect %>
<%* } else { %>

> [!chart] 🌡️ PPM Pulse (Strategy Heatmap)
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
> > [!todo|wide-1] 🎯 The Story (Daily Strategy)
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let focusList = [];
> > p.forEach(x => {
> >     if(x.focusD_ppm && String(x.focusD_ppm).trim() !== "") {
> >         let dayName = moment(String(x.cal_date)).format("ddd");
> >         focusList.push(`**${dayName}:** ${x.focusD_ppm}`);
> >     }
> > });
> > if(focusList.length > 0) dv.list(focusList);
> > else dv.paragraph("_No specific daily focus logged._");
> > ```
> >
> > <small style="opacity:0.5; text-transform:uppercase;">Project Logs this week</small>
> >
> > ```dataviewjs
> > const pr = dv.pages('"0_Calendar/4_Projectlog"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let pList = [];
> > pr.forEach(x => {
> >     if ("<%- revModule %>" !== "proj" || x.file.name.includes("<%- logConnect.replace(/[\[\]]/g, '') %>") || (x.file.outlinks && String(x.file.outlinks).includes("<%- logConnect.replace(/[\[\]]/g, '') %>"))) {
> >         let dayName = moment(String(x.cal_date)).format("ddd");
> >         pList.push(`**${dayName}** [[${x.file.name}|🧩]]: ${x.focus_LOG || "_Update_"}`);
> >     }
> > });
> > if(pList.length > 0) dv.list(pList);
> > else dv.paragraph("_No project logs recorded._");
> > ```
>
> > [!abstract|wide-1] ✅ Tasks & 📜 Protocols
> > <small style="opacity:0.5; text-transform:uppercase;">Completed Tasks</small>
> >
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<%- start %>") && t.completion <= dv.date("<%- end %>"));
> > let filtered = t;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     filtered = t.where(x => x.link.path.includes(projName) || (x.text && x.text.includes(projName)));
> > }
> > if(filtered.length > 0) dv.list(filtered.map(x => x.text + " [[" + x.link.path.split('/').pop().replace('.md','') + "|↗️]]"));
> > else dv.paragraph("_No tasks recorded._");
> > ```
> >
> > <small style="opacity:0.5; text-transform:uppercase;">Protocols Created</small>
> >
> > ```dataviewjs
> > const prots = dv.pages('"0_Calendar/5_Protocol"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> > let pFiltered = prots;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     pFiltered = prots.where(p => String(p.file.outlinks).includes(projName) || p.file.name.includes(projName));
> > }
> > if(pFiltered.length > 0) dv.list(pFiltered.file.link);
> > else dv.paragraph("_No specific protocols found._");
> > ```

---
<%* } %>

<%* if (isMaster || revModule === "pkm") { %>
## 🌼 PKM: Knowledge Harvest

> [!chart] 🌡️ PKM Pulse (Mind Heatmap)
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { pkmOrange: ["#ffe0b2", "#ffcc80", "#ffb74d", "#ff9800", "#e65100"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date)) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page['brain-drain'] || 1, // Zieht den Brain-Drain Wert als Intensität!
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!multi-column]
> > [!info|wide-1] 🧠 The Story (Daily Knowledge)
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let focusList = [];
> > p.forEach(x => {
> >     if(x.focusD_pkm && String(x.focusD_pkm).trim() !== "") {
> >         let dayName = moment(String(x.cal_date)).format("ddd");
> >         focusList.push(`**${dayName}** (Drain: ${x['brain-drain'] || "?"}): ${x.focusD_pkm}`);
> >     }
> > });
> > if(focusList.length > 0) dv.list(focusList);
> > else dv.paragraph("_No daily PKM focus logged._");
> > ```
> > <small style="opacity:0.5; text-transform:uppercase;">Total Time per Subject</small>
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> > const subjects = ["english", "german", "math", "latin", "physics", "biology", "chemistry", "history", "philosophy", "politics", "economics", "law", "psychology", "art", "music"];
> > let totals = {};
> > let grandTotal = 0;
> > p.forEach(x => {
> >     Object.keys(x).forEach(k => {
> >         const match = subjects.find(s => k.startsWith(s));
> >         if(match && !isNaN(x[k]) && String(x[k]).trim() !== "") {
> >             let val = Number(x[k]);
> >             totals[match] = (totals[match] || 0) + val;
> >             grandTotal += val;
> >         }
> >     });
> > });
> > let output = [];
> > for (let [sub, val] of Object.entries(totals)) {
> >     output.push(`**${sub.charAt(0).toUpperCase() + sub.slice(1)}**: ${val} min`);
> > }
> > if (output.length > 0) {
> >     dv.list(output);
> >     dv.paragraph(`> **Grand Total:** ${grandTotal} min`);
> > } else {
> >     dv.paragraph("_No study minutes logged._");
> > }
> > ```
>
> > [!abstract|wide-1] 📚 New Knowledge Created
> > <small style="opacity:0.5; text-transform:uppercase;">Objects Manifested</small>
> > ```dataviewjs
> > const notes = dv.pages('-"zData" and -"0_Calendar"').where(n => n.file.cday >= dv.date("<%- start %>") && n.file.cday <= dv.date("<%- end %>")).sort(n => n.file.cday, "desc");
> > if(notes.length > 0) dv.list(notes.file.link);
> > else dv.paragraph("_No new notes._");
> > ```

---
<%* } %>

---
## 🌑 Deep Sync: Reflection & Alignment

> [!multi-column]
>
> > [!abstract|wide-1] The Crucible
> > **Biggest Win of the Week:**
> > `INPUT[text:weekly_win]`
> > 
> > **Main Lesson Learned:**
> > `INPUT[text:weekly_lesson]`
>
> > [!heart|wide-1] Grace
> > **Moments of Gratitude:**
> > `INPUT[text:weekly_gratitude]`
> > 
> > **Focus for Next Week:**
> > `INPUT[text:next_week_focus]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`