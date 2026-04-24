<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview.api;
const revModule = tp.variables.revModule || "master";
const start = tp.variables.revStart; 
const end = tp.variables.revEnd;
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Half-Year Review";

const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const isMaster = (revModule === "master");
const yy = start.split("-")[0];
const hNum = moment(start).month() < 6 ? "1" : "2";

// 🔱 2. PATH & TITLE LOGIC
const targetFolder = `${baseCal}/6_Review/HalfYear/${yy}`;
const finalTitle = `${yy}-H${hNum} revH - ${displayTitle}`; 
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
archtype: ["#0cal/1review/halfyear"]
rev_module: "<%- revModule %>"
rev_start: <%- start %>
rev_end: <%- end %>
connected_log: "<%- logConnect %>"
status: 1active
---

# 🌓 <%- displayTitle %> (H<%- hNum %> / <%- yy %>)
> [!quote] The Great Correction
> "A ship in port is safe, but that is not what ships are built for. Adjust your sails, but never lose sight of the shore."
> **Nexus Sync:** <%- revModule.toUpperCase() %> | **Period:** `<%- start %>` — `<%- end %>`

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 🌌 The North Star (Strategic Pivot)

> [!stars] Long-Term Trajectory
> <small style="opacity:0.5; text-transform:uppercase;">Vision, Purpose & Goals</small>
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
>             timeleft = days >= 0 ? ` *(Ends in ${days} days)*` : ` *(Overdue!)*`;
>         }
>         return "🎯 [[" + g.file.name + "]]" + timeleft;
>     }));
> } else {
>     dv.paragraph("_No active goals defined._");
> }
> ```
> 
> **Does my life still reflect my core values?**
> `INPUT[toggle:revh_valueAlignment]`
> 
> **Is it time for a radical change in my Vision (Yearly Pivot)?**
> `INPUT[text:revh_visionPivot]`

---

## 🧭 The Nexus Fingerprint (180-Day Pulse)

<%* if (isMaster || revModule === "plm") { -%>
> [!pink] 🌷 PLM: Vitality & Energy (Half-Year Heatmap)
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { plmPink: ["#f8bbd0", "#f48fb1", "#f06292", "#e91e63", "#c2185b"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({ date: page.cal_date, intensity: page.energy || 1 });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```
<%* } -%>

<%* if (isMaster || revModule === "ppm" || revModule === "proj") { -%>
> [!info] 🌻 PPM: Strategic Consistency (Half-Year Heatmap)
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { ppmBlue: ["#bbdefb", "#90caf9", "#64b5f6", "#2196f3", "#1976d2"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({ date: page.cal_date, intensity: page.energy || 1 });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```
<%* } -%>

<%* if (isMaster || revModule === "pkm") { -%>
> [!warning] 🌼 PKM: Cognitive Load (Half-Year Heatmap)
> ```dataviewjs
> const calendarData = {
>     year: moment("<%- end %>").year(),
>     colors: { pkmOrange: ["#ffe0b2", "#ffcc80", "#ffb74d", "#ff9800", "#e65100"] },
>     entries: []
> };
> for (let page of dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>")) {
>     calendarData.entries.push({ date: page.cal_date, intensity: page['brain-drain'] || 1 });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```
<%* } -%>

---

## 🏔️ Half-Yearly Aggregation (The Deep Harvest)

> [!multi-column]
>
<%* if (isMaster || revModule === "plm") { -%>
> > [!info|wide-1] 🌷 PLM: Resilience
> > <small style="opacity:0.5; text-transform:uppercase;">180-Day Averages</small>
> >
> > - **Avg Energy:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Avg Sleep:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> > - **Total Fitness:** `$= dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").fitness_revD.sum() || 0` min
<%* } -%>
<%* if (isMaster || revModule === "ppm" || revModule === "proj") { -%>
>
> > [!todo|wide-1] 🌻 PPM: Execution
> > <small style="opacity:0.5; text-transform:uppercase;">Volume of 2 Quarters</small>
> >
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<%- start %>") && t.completion <= dv.date("<%- end %>"));
> > let filtered = t;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     filtered = t.where(x => x.link.path.includes(projName) || (x.text && x.text.includes(projName)));
> > }
> > dv.paragraph(`**${filtered.length}** Tasks completed in this half-year.`);
> > ```
> >
> > <small style="opacity:0.5; text-transform:uppercase;">Key Projects Active</small>
> >
> > ```dataviewjs
> > const pr = dv.pages('"0_Calendar/4_Projectlog"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> > let projects = new Set();
> > pr.forEach(x => { 
> >     if ("<%- revModule %>" !== "proj" || x.file.name.includes("<%- logConnect.replace(/[\[\]]/g, '') %>") || (x.file.outlinks && String(x.file.outlinks).includes("<%- logConnect.replace(/[\[\]]/g, '') %>"))) {
> >         if(x.file.outlinks.length > 0) x.file.outlinks.forEach(l => projects.add(l.path.split('/').pop().replace('.md','')));
> >     }
> > });
> > if(projects.size > 0) dv.list(Array.from(projects).slice(0, 10).map(p => "🚧 [[" + p + "]]"));
> > else dv.paragraph("_No linked projects this half-year._");
> > ```
<%* } -%>
<%* if (isMaster || revModule === "pkm") { -%>
>
> > [!abstract|wide-1] 🌼 PKM: Mastery
> > <small style="opacity:0.5; text-transform:uppercase;">Time per Subject (Hours)</small>
> >
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> > const subjects = ["english", "german", "math", "latin", "physics", "biology", "chemistry", "history", "philosophy", "politics", "economics", "law", "psychology", "art", "music"];
> > let totals = {};
> > p.forEach(x => {
> >     Object.keys(x).forEach(k => {
> >         const match = subjects.find(s => k.startsWith(s));
> >         if(match && !isNaN(x[k])) totals[match] = (totals[match] || 0) + Number(x[k]);
> >     });
> > });
> > let output = [];
> > for (let [sub, val] of Object.entries(totals)) {
> >     output.push(`**${sub.charAt(0).toUpperCase() + sub.slice(1)}**: ${Math.round(val/60)} h`);
> > }
> > if (output.length > 0) dv.list(output);
> > else dv.paragraph("_No data logged._");
> > ```
<%* } -%>

---

## 📖 The Half-Yearly Narrative (Quarterly Reflection)

> [!quote] The Arc of the Semester
> <small style="opacity:0.5; text-transform:uppercase;">Summarizing your Quarterly Reviews</small>
>
> ```dataviewjs
> const quarterlies = dv.pages('#0cal/1review/quarterly').where(p => p.rev_end >= "<%- start %>" && p.rev_end <= "<%- end %>").sort(p => p.rev_end, "asc");
> let filteredQ = quarterlies;
> if ("<%- revModule %>" !== "master") {
>     filteredQ = quarterlies.where(w => w.rev_module === "<%- revModule %>" && w.connected_log === "<%- logConnect %>");
> }
> 
> if (filteredQ.length > 0) {
>     filteredQ.forEach(q => {
>         dv.header(4, `Results of ${q.file.name}`);
>         let theme = q.revq_quarterlyTheme || "_No theme set_";
>         let focus = q.revq_nextQuarterFocus || "_No focus set_";
>         dv.list([`**Quarterly Theme:** ${theme}`, `**Main Focus:** ${focus}`]);
>     });
> } else {
>     dv.paragraph("_No Quarterly Reviews found for this half-year._");
> }
> ```

---

## 🌑 Deep Sync: Mid-Year Audit

> [!multi-column]
>
> > [!example|wide-1] Evolution
> > **What is the most significant change in me since the start of this period?**
> > `INPUT[text:revh_internalChange]`
> > 
> > **Which "Sunk Costs" (projects/goals) must I finally abandon?**
> > `INPUT[text:revh_abandoned]`
>
> > [!heart|wide-1] Strategy
> > **What will be the "Main Mission" for the next 6 months?**
> > `INPUT[text:revh_mainMission]`
> > 
> > **How can I make the next 6 months 20% simpler?**
> > `INPUT[text:revh_simplification]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`