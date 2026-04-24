<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview.api;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [yy, mm] = dateStr.split("-");

// 🔱 2. ORIGIN (What does this protocol refer to?)
let logConnect = (tp.variables && tp.variables.logConnect) ? tp.variables.logConnect : "";
let inheritedProject = "";

if (!logConnect || logConnect === "MAN") {
    const manual = await tp.system.prompt("🔗 Link to Origin (Log or Project)?", "");
    logConnect = manual ? (manual.includes("[[") ? manual : `[[${manual}]]`) : "[[Unlinked]]";
}

// 🎯 MAGIC: If logConnect is a Log, automatically extract the project via Dataview
if (dv && logConnect !== "[[Unlinked]]") {
    const logPage = dv.page(logConnect.replace(/[\[\]]/g, ""));
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
const axisMap = { "PLM": "1_Selfcare", "PPM": "4_Organize", "PKM": "3_Mind" };
const areaBase = tp.variables.ARCH?.a?.tag || "#2area";
const areaTag = axisMap[pArea] ? `${areaBase}/${axisMap[pArea]}` : `${areaBase}/unknown`;

// 🔱 5. PATH LOGISTICS
const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const targetFolder = `${baseCal}/5_Protocol/${yy}/${folderContext}`;

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
sci: <%- Array.isArray(sciTag) ? sciTag.join(", ") : sciTag %>
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


`BUTTON[freezer]`
