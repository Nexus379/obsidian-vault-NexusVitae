<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview?.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🎯 FIX: Übernimmt das Datum aus dem Dateinamen (falls manuell gesetzt), 
// bevor es auf das heutige Datum zurückfällt!
const matchDate = tp.file.title.match(/^\d{4}-\d{2}-\d{2}/);
const dateStr = tp.variables.targetDate || (matchDate ? matchDate[0] : tp.date.now("YYYY-MM-DD"));
const [yy, mm] = dateStr.split("-");

// 🔱 2. PROJECT LINK & DYNAMIC SELECTOR (Mit Fallbacks & Router-Sync)
let logConnect = (tp.variables && tp.variables.logConnect) ? tp.variables.logConnect : "";
let displayTitle = (tp.variables && tp.variables.displayTitle) ? tp.variables.displayTitle : "";

// NEXUS-SYNC: Fängt den sauberen Namen aus dem Router auf
if (!displayTitle && tp.variables && tp.variables.title && !tp.variables.title.includes(defaultName)) {
    displayTitle = tp.variables.title;
}

let selStat = "1_Active"; // Standard-Fallback
let needsPrompt = true;

// 🚀 SMART PATH DETECTION: Prüft, ob die Datei manuell direkt in einem Projekt-Ordner erstellt wurde
const currentFolderPath = tp.file.folder(true);
const pathMatch = currentFolderPath.match(/3_Projects\/(1_Active|2_Passive|3_Idea|0_Recurring|4_Archive)\/([^/]+)/);

if (pathMatch) {
    // Ordner erkannt! Wir nehmen Status und Name direkt aus dem Dateipfad
    selStat = pathMatch[1];
    displayTitle = pathMatch[2];
    needsPrompt = false;
} 
// FALL A: DER ROUTER HAT SCHON EIN PROJEKT ÜBERGEBEN
else if (displayTitle && displayTitle !== "Unlinked" && !displayTitle.includes(defaultName) && displayTitle !== "") {
    const existingProj = dv
        ? dv.pages('"3_Projects"')
            .where(p => !p.file.path.includes("/Logs/") && !p.file.path.includes("/Tasks/") && p.file.name === displayTitle)
            .first()
        : null;
    if (existingProj) {
        let match = existingProj.file.path.match(/3_Projects\/(1_Active|2_Passive|3_Idea|0_Recurring|4_Archive)/);
        selStat = match ? match[1] : "1_Active";
    } else {
        const statLabels = ["🟢 1_Active", "🟡 2_Passive", "💡 3_Idea", "🔄 0_Recurring"];
        const statFolders = ["1_Active", "2_Passive", "3_Idea", "0_Recurring"];
        selStat = await tp.system.suggester(statLabels, statFolders, false, `🚦 Status for Router-Project '${displayTitle}'?`) || "1_Active";
    }
    needsPrompt = false;
}

// FALL B: ES GIBT NOCH KEIN PROJEKT (Das Dataview-Dropdown startet)
if (needsPrompt) {
    const projs = dv ? dv.pages('"3_Projects"').where(p => !p.file.path.includes("/Logs/")).sort(p => p.file.mtime, "desc") : [];
    const projOptions = ["➕ ✨ Create New Project"];
    const projPaths = ["NEW"];

    for (let p of projs) {
        let match = p.file.path.match(/3_Projects\/(1_Active|2_Passive|3_Idea|0_Recurring|4_Archive)/);
        let stat = match ? match[1] : "1_Active";
        projOptions.push(`🧩 ${p.file.name} (${stat})`);
        projPaths.push(`${p.file.name}|${stat}`);
    }

    const pick = await tp.system.suggester(projOptions, projPaths, false, "🔗 Select Project or Create New:");
    
    if (!pick) { 
        displayTitle = await tp.system.prompt("📝 Project Name? (Manual Fallback)", "General") || "General";
        selStat = "1_Active";
    } else if (pick === "NEW") {
        displayTitle = await tp.system.prompt("📝 Name of the NEW Project?", "New Project") || "New Project";
        const statLabels = ["🟢 1_Active", "🟡 2_Passive", "💡 3_Idea", "🔄 0_Recurring"];
        const statFolders = ["1_Active", "2_Passive", "3_Idea", "0_Recurring"];
        selStat = await tp.system.suggester(statLabels, statFolders, false, "🚦 Initial Project Status?") || "1_Active";
    } else {
        const parts = pick.split("|");
        displayTitle = parts[0];  
        selStat = parts[1];       
    }
}

// 🛡️ SICHERHEIT: Entfernt illegale Zeichen aus dem Titel, damit die Ordner-Erstellung nicht crasht
displayTitle = displayTitle.replace(/[\\/:"*?<>|]+/g, "-").trim();

// 🔱 3. VARIABLEN ZUSAMMENFÜHREN
if (!logConnect || logConnect === "[[Unlinked]]" || logConnect === "") {
    logConnect = `[[${displayTitle}]]`;
}

// YAML-Tag generieren
const statTagsMap = { "1_Active": "1active", "2_Passive": "2passive", "3_Idea": "3idea", "0_Recurring": "0recurring", "4_Archive": "4archive" };
const finalStatus = statTagsMap[selStat] || "1active";

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
const axisMap = { "PLM": "1selfcare", "PPM": "4organize", "PKM": "3mind" };
const areaBase = tp.variables.ARCH?.a?.tag || "#2area";
const areaTag = axisMap[pArea] ? `${areaBase}/${axisMap[pArea]}` : `${areaBase}/unknown`;
 
// 🔱 6. PATH LOGISTICS & RENAME (Die neue Weiche)
let targetFolder = "";

// WEICHE: Ist es ein echtes Projekt oder nur ein allgemeines Log ("General")?
if (displayTitle === "General" || displayTitle === "Unlinked") {
    const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
    targetFolder = `${baseCal}/4_Projectlogs/${yy}/${displayTitle}/${mm}`;
} else {
    // 🎯 DAS NEUE PARA-SYSTEM GREIFT HIER
    targetFolder = `3_Projects/${selStat}/${displayTitle}/Logs/${yy}/${mm}`;
}

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


`BUTTON[freezer]` `BUTTON[archive-month-logs]`