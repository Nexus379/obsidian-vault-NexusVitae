<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview?.api;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [yy, mm] = dateStr.split("-");

// 🔱 2. ORIGIN (What does this protocol refer to?)
let logConnect = (tp.variables && tp.variables.logConnect) ? tp.variables.logConnect : "";
let inheritedProject = "";

// SMART PATH DETECTION: created directly inside a project's Protocols folder → link the project automatically
if (!logConnect) {
    // 3_Projects is flat: <root>/<Project>/… — no status segment to skip over.
    const _fp = tp.file.folder(true).replace(/\\/g, "/");
    const _pm = _fp.match(/3_Projects\/([^/]+)/);
    if (_pm) logConnect = `[[${_pm[1]}]]`;
}

if (!logConnect || logConnect === "MAN") {
    const manual = await tp.system.prompt("🔗 Link to Origin (Log or Project)?", "");
    logConnect = manual ? (manual.includes("[[") ? manual : `[[${manual}]]`) : "[[Unlinked]]";
}

// 🎯 MAGIC: If logConnect is a Log, automatically extract the project via Dataview
if (dv && logConnect !== "[[Unlinked]]") {
    let logPath = logConnect.replace(/[\[\]]/g, "");
    if (!logPath.endsWith(".md")) logPath += ".md";
    const logPage = dv.page(logPath);
    if (logPage && logPage.project3) {
        inheritedProject = Array.isArray(logPage.project3) ? logPage.project3[0] : logPage.project3;
    }
}

// 🔱 3. TITLE & FOCUS
let folderContext = logConnect.replace(/[\[\]]/g, "").replace(".md", "").split("/").pop().split(" - ").pop() || "General";

let displayTitle = tp.variables.displayTitle || "";
if (!displayTitle || displayTitle === "Untitled" || displayTitle === "") {
    displayTitle = await tp.system.prompt("📝 Protocol Name (Focus)?", "Meeting Insight") || "General";
}

let focusD_prot = await tp.system.prompt(`🎯 Specific Focus for '${displayTitle}'?`, "Key Points");
if (!focusD_prot) focusD_prot = "Insight Tracking";

// 🔱 4. ENGINES (Persona & Discipline)
const personaEngine = (typeof tp.user.personaEngine === "function") ? tp.user.personaEngine() : null;
const discEngineObj = (typeof tp.user.disciplineEngine === "function") ? tp.user.disciplineEngine() : null;

const pLabels = personaEngine ? personaEngine.getPersonaLabels() : [];
const selP = pLabels.length ? await tp.system.suggester(pLabels.map(p => `${p.icon} ${p.label}`), pLabels.map(p => p.key), false, "🎭 Persona?") : null;
const persona = selP ? `#persona/${selP}` : "#persona/general";
const pMeta = selP ? personaEngine.all[selP] : { icon:"👤" };
const icon = pMeta.icon || "👤";
const pArea = personaEngine ? personaEngine.getAxis(selP) : "unknown";

const dLabels = discEngineObj ? Object.keys(discEngineObj.all) : [];
const dSel = dLabels.length ? await tp.system.suggester(dLabels.map(k => `${discEngineObj.all[k].icon} ${discEngineObj.all[k].label}`), dLabels, false, "📚 Discipline?") : null;
const discData = dSel ? discEngineObj.all[dSel] : { disc:"#disc/general", icon:"📝", sci:["#sci/General"] };
const discTag = discData.disc || "#disc/general";
const dIcon = discData.icon || "📝";
const sciTag = discData.sci || ["#sci/General"];

// 🔱 4.1 FLEX-TAGGING
const axisMap = { "PLM": "1selfcare", "PPM": "3drive", "PKM": "6mind" };
const areaBase = tp.variables.ARCH?.a?.tag || "#2area";
const areaTag = axisMap[pArea] ? `${areaBase}/${axisMap[pArea]}` : `${areaBase}/unknown`;

// 🔱 5. PATH LOGISTICS
//
// Every protocol lands in the calendar — same rule as projectlog: a protocol is a time
// thing, so its folder carries only what never changes (name, year, month). It used to
// branch into 3_Projects/<status>/<Project>/Protocols/, which put the project's STATUS
// into the path: every status change would then have had to move the whole subtree.
//
// The project connection lives in the frontmatter and is what the cockpit reads.
const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";

// The linked project's name is the folder; no lookup of its status folder needed any more.
let projName = String(inheritedProject || logConnect).replace(/[\[\]]/g, "").replace(".md", "").split("/").pop().split("|")[0].trim();
const nameForFolder = (projName && projName !== "Unlinked") ? projName : folderContext;

const targetFolder = `${baseCal}/5_Protocols/${nameForFolder}/${yy}/${mm}`;

let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
}

const finalTitle = `${dateStr} prot - ${displayTitle}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;

if (tp.file.title !== finalTitle) { await tp.file.rename(finalTitle); }
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

const finalProj = inheritedProject || logConnect;
tR += "---";
%>
arch:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>"
archtype:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>/5protocol"
persona: "<%- persona %>"
discipline: "<%- discTag %>"
sci: <%- JSON.stringify(Array.isArray(sciTag) ? sciTag : [sciTag]) %>
focusD_prot: "<%- focusD_prot %>"
cal0: ["<%- logConnect %>"]
area2: "<%- areaTag %>"
project3: ["<%- finalProj %>"]
status: 1active
cal_date: <%- dateStr %>
---

# <%- icon %> Protocol: <%- displayTitle %>

> [!hub] 🧠 Nexus Insight
> > [!multi-column]
> >
> > > [!blank|wide-2] 
> > > **Origin Reference**
> > > <%- logConnect %>
> > > 
> > > ---
> > > **Protocol Focus**
> > > <%- focusD_prot %>
> >
> > > [!blank|wide-1]
> > > **Context**
> > > **Role:** <%- icon %> <%- persona.replace("#persona/","") %>
> > > **Disc:** <%- dIcon %> <%- discTag.replace("#disc/","") %>

---

### 🖋️ Protocol Notes
- <%- focusD_prot %>:

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[archive-month]`
