<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview.api;
const revModule = tp.variables.revModule || "master";
const start = tp.variables.revStart; 
const end = tp.variables.revEnd;
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Yearly Review";

const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const isMaster = (revModule === "master");
const yy = start.split("-")[0]; // Extracts the year

// 🔱 2. PATH & TITLE LOGIC
const targetFolder = `${baseCal}/6_Review/Yearly`;
const finalTitle = `${yy} revY - ${displayTitle}`; 
const finalDest = `${targetFolder}/${finalTitle}.md`;

// Ensure folder structure
if (!app.vault.getAbstractFileByPath(targetFolder)) await app.vault.createFolder(targetFolder);

// Rename and move
if (tp.file.title !== finalTitle) await tp.file.rename(finalTitle);
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

tR += "---";
%>
arch: ["#0cal/1review"]
archtype: ["#0cal/1review/yearly"]
rev_module: "<%- revModule %>"
rev_start: <%- start %>
rev_end: <%- end %>
connected_log: "<%- logConnect %>"
status: 1active
---

# 🎆 <%- displayTitle %> (<%- yy %>)
> [!quote] The Architect of Fate
> "We cannot change the wind, but we can adjust the sails. A year is a masterpiece in progress."
> **Nexus Sync:** <%- revModule.toUpperCase() %> | **Period:** `<%- start %>` — `<%- end %>`

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 🌟 The North Star: Horizon 5, 4 & 3 Audit

> [!stars] Eternal Alignment
> <small style="opacity:0.5; text-transform:uppercase;">Purpose, Vision & Goals Check</small>
>
> ```dataviewjs
> // 1. Fetching the core anchors of your life
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
> **Did my actions this year manifest my North Star?**
> `INPUT[toggle:revy_starManifestation]`
> 
> **Does my Purpose need an evolution for the upcoming year?**
> `INPUT[text:revy_purposeEvolution]`

---

## 🏔️ Annual Aggregation (The Deep Harvest)

> [!multi-column]
>
<%* if (isMaster || revModule === "plm") { -%>
> > [!info|wide-1] 🌷 PLM: Resilience
> > <small style="opacity:0.5; text-transform:uppercase;">365-Day Averages</small>
> >
> > - **Avg Energy:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Avg Sleep:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> > - **Total Fitness:** `$= dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").fitness_revD.sum() || 0` min
<%* } -%>
<%* if (isMaster || revModule === "ppm" || revModule === "proj") { -%>
>
> > [!todo|wide-1] 🌻 PPM: Execution
> > <small style="opacity:0.5; text-transform:uppercase;">Volume of 4 Quarters</small>
> >
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<%- start %>") && t.completion <= dv.date("<%- end %>"));
> > let filtered = t;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     filtered = t.where(x => x.link.path.includes(projName) || (x.text && x.text.includes(projName)));
> > }
> > dv.paragraph(`**${filtered.length}** Tasks completed this year.`);
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
> > if(projects.size > 0) dv.list(Array.from(projects).slice(0, 15).map(p => "🚧 [[" + p + "]]"));
> > else dv.paragraph("_No linked projects this year._");
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

## 📖 The Yearly Narrative (Half-Year Reflection)

> [!quote] The Arc of the Year
> <small style="opacity:0.5; text-transform:uppercase;">Summarizing your Half-Yearly Reviews</small>
>
> ```dataviewjs
> const halfyears = dv.pages('#0cal/1review/halfyear').where(p => p.rev_end >= "<%- start %>" && p.rev_end <= "<%- end %>").sort(p => p.rev_end, "asc");
> let filteredH = halfyears;
> if ("<%- revModule %>" !== "master") {
>     filteredH = halfyears.where(w => w.rev_module === "<%- revModule %>" && w.connected_log === "<%- logConnect %>");
> }
> 
> if (filteredH.length > 0) {
>     filteredH.forEach(h => {
>         dv.header(4, `Results of ${h.file.name}`);
>         let mission = h.revh_mainMission || "_No mission set_";
>         let change = h.revh_internalChange || "_No changes recorded_";
>         dv.list([`**Main Mission:** ${mission}`, `**Internal Growth:** ${change}`]);
>     });
> } else {
>     dv.paragraph("_No Half-Yearly Reviews found for this year._");
> }
> ```

---

## 🌑 The Grand Grounding: Yearly Audit

> [!multi-column]
>
> > [!example|wide-1] Retrospective
> > **What was my single greatest achievement this year?**
> > `INPUT[text:revy_greatestWin]`
> > 
> > **What was the hardest challenge I overcame?**
> > `INPUT[text:revy_hardestChallenge]`
>
> > [!heart|wide-1] Future Focus
> > **What is the "Motto" for the upcoming year?**
> > `INPUT[text:revy_nextYearMotto]`
> > 
> > **What one thing must I START, STOP, and CONTINUE?**
> > `INPUT[text:revy_startStopContinue]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`