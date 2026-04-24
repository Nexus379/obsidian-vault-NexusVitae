<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [yy, mm] = dateStr.split("-");

// 🔱 2. PROJECT LINK (The Anchor)
let logConnect = (tp.variables && tp.variables.logConnect) ? tp.variables.logConnect : "";

// Fallback if the router provides nothing:
if (!logConnect) {
    const manual = await tp.system.prompt("🔗 Link to Project? (Fallback)", "");
    logConnect = manual ? (manual.includes("[[") ? manual : `[[${manual}]]`) : "[[Unlinked]]";
}

// 🔱 3. DISPLAY TITLE (The Project Name)
let displayTitle = tp.variables.displayTitle || logConnect.replace(/[\[\]]/g, "");
// FALLBACK: If we still have no name
if (!displayTitle || displayTitle === "Unlinked") {
    displayTitle = await tp.system.prompt("📝 Project Name?", "General") || "General";
}

// 🔱 4. THE ONLY REAL PROMPT (Your "this")
let focus_LOG = await tp.system.prompt(`🎯Focus in '${displayTitle}'?`, "Work Step");
if (!focus_LOG) focus_LOG = "Progress Update";

// 🔱 5. ENGINES (Persona & Discipline)
async function loadEngine(path) {
  const file = app.vault.getAbstractFileByPath(path);
  if (!file) return null;
  const code = await app.vault.read(file);
  const module = { exports: {} };
  new Function("module","exports", code)(module, module.exports);
  const fn = module.exports || module.exports?.default;
  return typeof fn === "function" ? fn() : null;
}

const personaEngine = await loadEngine("zData/2scripts/personaEngine.js");
const discEngineObj = await loadEngine("zData/2scripts/disciplineEngine.js");

const pLabels = personaEngine ? personaEngine.getPersonaLabels() : [];
const selP = pLabels.length
  ? await tp.system.suggester(pLabels.map(p => `${p.icon} ${p.label}`), pLabels.map(p => p.key), false, "🧑‍💼 Persona?")
  : null;
const persona = selP ? `#persona/${selP}` : "#persona/general";
const pMeta   = selP ? personaEngine.all[selP] : { icon:"👤", label:"General" };
const icon    = pMeta.icon || "👤";
const pArea   = personaEngine ? personaEngine.getAxis(selP) : "unknown";

const dLabels = discEngineObj ? Object.keys(discEngineObj.all) : [];
const dSel = dLabels.length
  ? await tp.system.suggester(dLabels.map(k => `${discEngineObj.all[k].icon} ${discEngineObj.all[k].label}`), dLabels, false, "📚 Discipline?")
  : null;
const discData = dSel ? discEngineObj.all[dSel] : { disc:"#disc/general", icon:"📝", sci:["#sci/General"], area:"unknown" };
const discTag  = discData.disc || "#disc/general";
const dIcon = discData.icon || "📝";
const sciTag   = discData.sci || ["#sci/General"];

// 🔱 5.1 FLEX-TAGGING
const axisMap = { "PLM": "1_Selfcare", "PPM": "4_Organize", "PKM": "3_Mind" };
const areaBase = tp.variables.ARCH?.a?.tag || "#2area";
const areaTag = axisMap[pArea] ? `${areaBase}/${axisMap[pArea]}` : `${areaBase}/unknown`;

// 🔱 6. PATH LOGISTICS & RENAME
const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const targetFolder = `${baseCal}/4_Projectlog/${yy}/${displayTitle}/${mm}`;

// Ensure folder structure
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
}

// Rename and move file
const finalTitle = `${dateStr} proj - ${displayTitle}`;
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
sci: <%- Array.isArray(sciTag) ? sciTag.join(", ") : sciTag %>
focus_LOG: "<%- focus_LOG %>"
cal0:
area2: "<%- areaTag %>"
project3: ["<%- logConnect %>"]
status: 1active
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

---

### 🚧 Progress & Notes
- <%- focus_LOG %>:

### 🛠️ Sub-Tasks
- [ ]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>


`BUTTON[freezer]`
