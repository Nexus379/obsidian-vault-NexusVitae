<%-*
// 🔱 1. INITIALIZATION & CONTEXT
const dv = app.plugins.plugins.dataview?.api;
const revModule = tp.variables.revModule || "master";
const end = tp.variables.revEnd || tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const start = tp.variables.revStart || moment(end).subtract(7, "days").format("YYYY-MM-DD"); 
const logConnect = tp.variables.logConnect || ""; 
const displayTitle = tp.variables.displayTitle || "Weekly Review";

const isMaster = (revModule === "master");

// 🔱 2. PATH & TITLE LOGIC (Backsafe for direct template starts)
if (!tp.variables.finalTitle || !tp.variables.targetFolder) {
    const yy = end.split("-")[0];
    const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
    const mm = end.split("-")[1];
    const targetFolder = `${baseCal}/6_Reviews/0_Master/${yy}/${mm}`;
    const finalTitle = `${end} revW - ${displayTitle}`;
    const finalDest = `${targetFolder}/${finalTitle}.md`;

    let currentPath = "";
    for (const seg of targetFolder.split('/')) {
        currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
    }

    if (tp.file.title !== finalTitle) await tp.file.rename(finalTitle);
    if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
        await new Promise(r => setTimeout(r, 200));
        await tp.file.move(finalDest);
    }
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
> for (let page of dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date)) {
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
> > const p = dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
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
> > - **Weekly Avg Energy:** `$= const p = dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.energy.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Weekly Avg Mood:** `$= const p = dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.mood.avg() * 10) / 10 || 0) + "** / 5")`
> > - **Sleep Avg:** `$= const p = dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>"); dv.paragraph("**" + (Math.round(p.sleep.avg() * 10) / 10 || 0) + "** h")`
> > - **Fitness Total:** `$= dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").array().reduce((sum, p) => sum + (Number(p.mobility_am) || 0) + (Number(p.mobility_pm) || 0), 0)` min
> > - **Music Total:** `$= dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").array().reduce((sum, p) => sum + (Number(p.inpra_min) || 0), 0)` min

### 🌈 Chakra Balance (Plan vs Actual)
```dataviewjs
// Read-only weekly aggregation of chakra time (plan from routine, actual from the dailyplm ct_/auto fields)
const base = app.vault.adapter.basePath;
let engine = null, i18n = null, persEngine = null;
try { engine = require(base + "/zData/2scripts/routineEngine.js")(); } catch(e) {}
try { persEngine = require(base + "/zData/2scripts/personaEngine.js")(); } catch(e) {}
try { i18n   = require(base + "/zData/2scripts/i18n.js")(); } catch(e) {}
const t = i18n ? i18n.t : (k)=>k;
const start = "<%- start %>", end = "<%- end %>";

const wk = moment(end).format("YYYY-[W]WW");
let rPage = dv.pages('"0_Calendar/7_Plan"').where(p => p.file.name === wk + "_routine").first();
if (!rPage) rPage = dv.page("2_Areas/4_Organize/Plan/Routine_Timeblocking");

const chakras = [
  {g:"1. Root",         icon:"❤️", lkey:"ck_root",     key:"ct_root",     col:"239,83,80"},
  {g:"2. Sacral",       icon:"🧡", lkey:"ck_sacral",   key:"ct_sacral",   col:"255,152,0"},
  {g:"3. Solar Plexus", icon:"💛", lkey:"ck_solar",    key:"ct_solar",    col:"255,213,0"},
  {g:"4. Heart",        icon:"💚", lkey:"ck_heart",    key:"ct_heart",    col:"102,187,106"},
  {g:"5. Throat",       icon:"💙", lkey:"ck_throat",   key:"ct_throat",   col:"41,182,246"},
  {g:"6. Third Eye",    icon:"💜", lkey:"ck_thirdeye", key:"ct_thirdeye", col:"171,71,188"},
  {g:"7. Crown",        icon:"🤍", lkey:"ck_crown",    key:"ct_crown",    col:"236,64,122"},
];

// ACTUAL: sum over the week's dailyplm notes; each day's actuals are auto-pulled via the engine
// (manual ct_ override wins per day, else the engine maps tracked time to its chakra).
const plm = dv.pages().where(p => String(p.archtype).includes("#0cal/1plm") && p.cal_date >= start && p.cal_date <= end).array();
const istSum = {}; chakras.forEach(ch => istSum[ch.g] = 0);
plm.forEach(x => {
  const act = engine ? engine.getActualChakraMinutes(x) : {};
  chakras.forEach(ch => {
    const manual = Number(x[ch.key]) || 0;
    istSum[ch.g] += manual > 0 ? manual : (act[ch.g] || 0);
  });
});

// PLAN: sum getChakraMinutes per weekday
const planSum = {}; chakras.forEach(ch => planSum[ch.g] = 0);
if (engine && rPage && engine.getChakraMinutes) {
  ["mon","tue","wed","thu","fri","sat","sun"].forEach(d => {
    const m = engine.getChakraMinutes(rPage, d);
    Object.entries(m).forEach(([g,v]) => { if (planSum[g] !== undefined) planSum[g] += v; });
  });
}

// SHARED renderer — same bars as dailyplm, only the data prep above differs (week sums vs single day).
const rows = chakras.map(ch => ({ icon: ch.icon, label: t(ch.lkey), col: ch.col, p: planSum[ch.g] || 0, ist: istSum[ch.g] || 0 }));
if (engine && engine.renderChakraBars) {
  const out = engine.renderChakraBars(rows, { plan: t("chakra_plan"), act: t("chakra_act"), legend: t("chakra_legend") });
  dv.paragraph(out.bars);
  dv.paragraph(out.sigma);
  // 🧬 Axis coverage: which of the 3 axes (PLM/PPM/PKM) the plan touches, via persona.
  if (persEngine && rPage && engine.getAxisCoverage) {
    const ax = { PLM:false, PPM:false, PKM:false };
    ["mon","tue","wed","thu","fri","sat","sun"].forEach(d => {
      const a = engine.getAxisCoverage(rPage, d, persEngine);
      Object.keys(ax).forEach(k => { if (a[k]) ax[k] = true; });
    });
    const mk = b => b ? "✅" : "⚪";
    dv.paragraph(`<small style="opacity:0.75;"><b>Axes:</b> 🧬 PLM ${mk(ax.PLM)} · ⚙️ PPM ${mk(ax.PPM)} · 🧠 PKM ${mk(ax.PKM)}</small>`);
  }
} else {
  dv.paragraph("⚠️ routineEngine not found — chakra bars unavailable.");
}
```

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
> for (let page of dv.pages().where(p => String(p.archtype).includes("#0cal/2ppm") && p.cal_date)) {
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
> > const p = dv.pages().where(p => String(p.archtype).includes("#0cal/2ppm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
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
> > const pr = dv.pages().where(p => String(p.archtype).includes("#0cal/4projectlog") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let pList = [];
> > const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> > pr.forEach(x => {
> >     const linkedProject = String(x.project3 || "").includes(projName) || x.file.name.includes(projName) || (x.file.outlinks && String(x.file.outlinks).includes(projName));
> >     if ("<%- revModule %>" !== "proj" || linkedProject) {
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
> > const prots = dv.pages().where(p => String(p.archtype).includes("#0cal/5protocol") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
> > let pFiltered = prots;
> > if ("<%- revModule %>" === "proj") {
> >     const projName = "<%- logConnect.replace(/[\[\]]/g, '') %>";
> >     pFiltered = prots.where(p => String(p.project3 || "").includes(projName) || String(p.file.outlinks).includes(projName) || p.file.name.includes(projName));
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
> for (let page of dv.pages().where(p => String(p.archtype).includes("#0cal/3pkm") && p.cal_date)) {
>     calendarData.entries.push({
>         date: page.cal_date,
>         intensity: page.brain_drain || 1, 
>         content: ""
>     });
> }
> renderHeatmapCalendar(this.container, calendarData);
> ```

> [!multi-column]
> > [!info|wide-1] 🧠 The Story (Daily Knowledge)
> > ```dataviewjs
> > const p = dv.pages().where(p => String(p.archtype).includes("#0cal/3pkm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>").sort(p => p.cal_date, "asc");
> > let focusList = [];
> > p.forEach(x => {
> >     if(x.focusD_pkm && String(x.focusD_pkm).trim() !== "") {
> >         let dayName = moment(String(x.cal_date)).format("ddd");
> >         focusList.push(`**${dayName}** (Drain: ${x.brain_drain || "?"}): ${x.focusD_pkm}`);
> >     }
> > });
> > if(focusList.length > 0) dv.list(focusList);
> > else dv.paragraph("_No daily PKM focus logged._");
> > ```
> > <small style="opacity:0.5; text-transform:uppercase;">Total Time per Subject</small>
> > ```dataviewjs
> > const p = dv.pages().where(p => String(p.archtype).includes("#0cal/3pkm") && p.cal_date >= "<%- start %>" && p.cal_date <= "<%- end %>");
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
> >     dv.paragraph("> **Grand Total:** " + grandTotal + " min");
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
