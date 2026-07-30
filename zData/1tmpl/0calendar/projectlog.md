<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview?.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🎯 FIX: takes the date from the file name (when set by hand),
// before it falls back to the date of today
const matchDate = tp.file.title.match(/^\d{4}-\d{2}-\d{2}/);
const dateStr = tp.variables.targetDate || (matchDate ? matchDate[0] : tp.date.now("YYYY-MM-DD"));
const [yy, mm] = dateStr.split("-");

// 🔱 2. PROJECT LINK & DYNAMIC SELECTOR (with fallbacks and router sync)
let logConnect = (tp.variables && tp.variables.logConnect) ? tp.variables.logConnect : "";
let displayTitle = (tp.variables && tp.variables.displayTitle) ? tp.variables.displayTitle : "";

// NEXUS SYNC: catches the clean name coming from the router
if (!displayTitle && tp.variables && tp.variables.title && !tp.variables.title.includes(defaultName)) {
    displayTitle = tp.variables.title;
}

// The status is read from the project's FRONTMATTER, never from its path — 3_Projects is
// flat, so a status change never moves a folder. These are the values the project
// templates and Projects.base use.
const STAT_LABELS = ["⚡ Active", "💤 Passive", "☁️ Idea", "🔄 Recurring"];
const STAT_VALS = ["1active", "2passive", "3idea", "0recurring"];

let selStat = "1active"; // default fallback
let needsPrompt = true;

// 🚀 SMART PATH DETECTION: was this file created directly inside a project folder?
const currentFolderPath = tp.file.folder(true);
const pathMatch = currentFolderPath.match(/3_Projects\/([^/]+)/);

if (pathMatch) {
    // Folder recognised — the name comes from the path, the status from the project note.
    displayTitle = pathMatch[1];
    const proj = dv ? dv.pages('"3_Projects"').where(p => String(p.arch ?? "").includes("#3project") && p.file.name === displayTitle).first() : null;
    selStat = (proj && proj.status) ? String(proj.status) : "1active";
    needsPrompt = false;
}
// CASE A: the router already handed over a project
else if (displayTitle && displayTitle !== "Unlinked" && !displayTitle.includes(defaultName) && displayTitle !== "") {
    const existingProj = dv
        ? dv.pages('"3_Projects"')
            .where(p => String(p.arch ?? "").includes("#3project") && p.file.name === displayTitle)
            .first()
        : null;
    if (existingProj && existingProj.status) {
        selStat = String(existingProj.status);
    } else {
        selStat = await tp.system.suggester(STAT_LABELS, STAT_VALS, false, `🚦 Status for router project '${displayTitle}'?`) || "1active";
    }
    needsPrompt = false;
}

// CASE B: no project known yet — offer the list
if (needsPrompt) {
    const projs = dv ? dv.pages('"3_Projects"').where(p => String(p.arch ?? "").includes("#3project")).sort(p => p.file.mtime, "desc") : [];
    const projOptions = ["➕ ✨ Create New Project"];
    const projPaths = ["NEW"];

    for (let p of projs) {
        const stat = p.status ? String(p.status) : "1active";
        projOptions.push(`🧩 ${p.file.name} (${stat})`);
        projPaths.push(`${p.file.name}|${stat}`);
    }

    const pick = await tp.system.suggester(projOptions, projPaths, false, "🔗 Select Project or Create New:");

    if (!pick) {
        displayTitle = await tp.system.prompt("📝 Project Name? (Manual Fallback)", "General") || "General";
        selStat = "1active";
    } else if (pick === "NEW") {
        displayTitle = await tp.system.prompt("📝 Name of the NEW Project?", "New Project") || "New Project";
        selStat = await tp.system.suggester(STAT_LABELS, STAT_VALS, false, "🚦 Initial Project Status?") || "1active";
    } else {
        const parts = pick.split("|");
        displayTitle = parts[0];
        selStat = parts[1];
    }
}

// 🛡️ SAFETY: strips illegal characters from the title so folder creation cannot crash
displayTitle = displayTitle.replace(/[\\/:"*?<>|]+/g, "-").trim();

// 🔱 3. MERGE THE VARIABLES
if (!logConnect || logConnect === "[[Unlinked]]" || logConnect === "") {
    logConnect = `[[${displayTitle}]]`;
}

// selStat already holds the frontmatter value — no folder-name mapping needed any more.
const finalStatus = STAT_VALS.includes(selStat) ? selStat : "1active";

// 🔱 4. THE ONLY REAL PROMPT (Your "this")
let focus_LOG = await tp.system.prompt(`🎯Focus in '${displayTitle}'?`, "Work Step");
if (!focus_LOG) focus_LOG = "Progress Update";

// 🔱 5. ENGINES (Persona & Discipline)
const personaEngine = (typeof tp.user.personaEngine === "function") ? tp.user.personaEngine() : null;
const discEngineObj = (typeof tp.user.disciplineEngine === "function") ? tp.user.disciplineEngine() : null;

const pLabels = personaEngine ? personaEngine.getPersonaLabels() : [];
const selP = pLabels.length
  ? await tp.system.suggester(pLabels.map(p => `${p.icon}${p.label}`), pLabels.map(p => p.key), false, "🧑‍💼 Persona?")
  : null;
const persona = selP ? `#persona/${selP}` : "#persona/general";
const pMeta   = selP ? personaEngine.all[selP] : { icon:"👤", label:"General" };
const icon    = pMeta.icon || "👤";
const pArea   = personaEngine ? personaEngine.getAxis(selP) : "unknown";

const dLabels = discEngineObj ? Object.keys(discEngineObj.all) : [];
const dSel = dLabels.length
  ? await tp.system.suggester(dLabels.map(k => `${discEngineObj.all[k].icon}${discEngineObj.all[k].label}`), dLabels, false, "📚 Discipline?")
  : null;
const discData = dSel ? discEngineObj.all[dSel] : { disc:"#disc/general", icon:"📝", sci:["#sci/General"], area:"unknown" };
const discTag  = discData.disc || "#disc/general";
const dIcon = discData.icon || "📝";
const sciTag   = discData.sci || ["#sci/General"];

// 🔱 5.1 FLEX-TAGGING
const axisMap = { "PLM": "1selfcare", "PPM": "3drive", "PKM": "6mind" };
const areaBase = tp.variables.ARCH?.a?.tag || "#2area";
const areaTag = axisMap[pArea] ? `${areaBase}/${axisMap[pArea]}` : `${areaBase}/unknown`;
 
// 🔱 6. PATH LOGISTICS & RENAME
//
// Every log lands in the calendar — GTD-clean, because a log is a time thing, not a
// project artefact. The project folder holds the project note and its cockpit; the
// cockpit is what gathers this project's logs, protocols, tasks and notes.
//
// This used to branch: a real project wrote to 3_Projects/<status>/<Project>/Logs/,
// which put time things inside the PARA tree and made the cockpit pointless.
//
// Order is name → year → month, the same as the routine logs
// (4_Projectlogs/Routine/YYYY/MM), so every log folder reads the same way.
const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const targetFolder = `${baseCal}/4_Projectlogs/${displayTitle}/${yy}/${mm}`;

// Ensure folder structure
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
}

// Rename and move file
const finalTitle = `${dateStr} proj -${displayTitle}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;

if (tp.file.title !== finalTitle) {
    await tp.file.rename(finalTitle);
}

if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

// Secure variables for potential subsequent scripts
tp.variables.logConnect = logConnect;
tp.variables.focus_LOG = focus_LOG;
tp.variables.displayTitle = displayTitle;

tR += "---";
%>
arch:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>"
archtype:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>/4projectlog"
persona: "<%- persona %>"
discipline: "<%- discTag %>"
sci: <%- JSON.stringify(Array.isArray(sciTag) ? sciTag : [sciTag]) %>
focus_LOG: "<%- focus_LOG %>"
cal0:
area2: "<%- areaTag %>"
project3: ["<%- logConnect %>"]
status: "<%- finalStatus %>"
cal_date: <%- dateStr %>
---

# 🧩 Project-Log: <%- displayTitle %>
**Origin:** <%- logConnect %>

> [!multi-column]
> > [!hub] ### 🧠 Persona & Context
> > - **Origin:** <%- logConnect %>
> > - **Focus:** <%- focus_LOG %>
> > - **Role:** <%- icon %> <%- persona %>
>
> > [!hub] ### 📚 Discipline & Focus
> > - **Discipline:** <%- dIcon %> <%- discTag %>
> > - **Area:** <%- areaTag %>
> > - **Date:** <%- dateStr %>
> > - **discipline::** <%- discTag %>

**Status:** `INPUT[suggester(option(0recurring, 🔄 Recurring), option(0start, 🚀 Start), option(1active, ⚡ Active), option(2passive, 💤 Passive), option(3idea, 💡 Idea), option(done, ✅ Done), option(canceled, ❌ Canceled), option(review, 🔍 Review), option(archived, 📦 Archived), option(bin, 🗑️ Bin)):status]`

---
### 🚧 Progress & Notes
- <%- focus_LOG %>: 

### 🛠️ Sub-Tasks
- [ ] 

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[archive-month]`