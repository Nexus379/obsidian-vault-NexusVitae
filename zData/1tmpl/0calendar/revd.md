<%-*
// 🔱 1. INITIALIZATION & DATE
const dv = app.plugins.plugins.dataview.api;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [yy, mm] = dateStr.split("-");

// 🔱 2. PATH LOGISTICS (Flex & Minimalist)
const baseCal = (tp.variables.ARCH && tp.variables.ARCH.c && tp.variables.ARCH.c.folder) ? tp.variables.ARCH.c.folder : "0_Calendar";
const targetFolder = `${baseCal}/6_Review/Daily/${yy}/${mm}`;
const finalTitle = `${dateStr} revD`; // Clean & Minimalist
const finalDest = `${targetFolder}/${finalTitle}.md`;

// Ensure folder structure
let currentPath = "";
for (const seg of targetFolder.split('/')) {
    currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
}

// Rename and move file
if (tp.file.title !== finalTitle) {
    await tp.file.rename(finalTitle);
}
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200));
    await tp.file.move(finalDest);
}

// 🔱 3. DATA AGGREGATION (Meticulous Vacuum Cleaner)
let plm = null, ppm = null, pkm = null;
let projFocusList = [];
let protFocusList = [];

if (dv) {
    const pages = dv.pages('"0_Calendar"').where(p => p.cal_date === dateStr);
    
    plm = pages.where(p => String(p.archtype).includes("1plm")).first();
    ppm = pages.where(p => String(p.archtype).includes("2ppm")).first();
    pkm = pages.where(p => String(p.archtype).includes("3pkm")).first();

    const projs = pages.where(p => String(p.archtype).includes("projectlog")).array();
    projs.forEach(p => { if (p.focus_LOG) projFocusList.push(p.focus_LOG); });

    const prots = pages.where(p => String(p.archtype).includes("protocol")).array();
    prots.forEach(p => { if (p.focusD_prot) protFocusList.push(p.focusD_prot); });
}

// 🔱 4. SAFE VALUE EXTRACTION & CALCULATION
const getVal = (page, key, fallback = "") => (page && page[key] !== undefined && page[key] !== null && page[key] !== "") ? page[key] : fallback;

// --- PLM Sync ---
const j_am = getVal(plm, "journal_am", false);
const j_pm = getVal(plm, "journal_pm", false);
tp.variables.journal_revD = (j_am || j_pm) ? "true" : "false";

const s_am = getVal(plm, "selfcare_am", false);
const s_pm = getVal(plm, "selfcare_pm", false);
tp.variables.selfcare_revD = (s_am || s_pm) ? "true" : "false";

const f_am = Number(getVal(plm, "fitness_am", 0));
const f_pm = Number(getVal(plm, "fitness_pm", 0));
tp.variables.fitness_revD = f_am + f_pm;

tp.variables.kcal_revD      = getVal(plm, "nexus_kcal", 0);
tp.variables.protein_revD   = getVal(plm, "nexus_protein_g", 0);
tp.variables.mood_plm_revD  = getVal(plm, "mood", "3");
tp.variables.energy_revD    = getVal(plm, "energy", "3");
tp.variables.sleep_revD     = getVal(plm, "sleep", "0");
tp.variables.focusD_plm     = getVal(plm, "focusD_plm"); 
tp.variables.focusM_plm     = getVal(plm, "focusM_plm");

// --- PPM Sync ---
tp.variables.focusD_ppm     = getVal(ppm, "focusD_ppm");
tp.variables.focusM_ppm     = getVal(ppm, "focusM_ppm"); 

// --- PKM Sync ---
tp.variables.focusD_pkm     = getVal(pkm, "focusD_pkm"); 
tp.variables.focusM_pkm     = getVal(pkm, "focusM_pkm");
tp.variables.brainDrain_revD = getVal(pkm, "brain-drain", "1");
tp.variables.mood_pkm_revD   = getVal(pkm, "mood", getVal(plm, "mood", "3")); 

// 🎯 DYNAMIC STUDY UNITS EXTRACTOR
let studyUnits = [];
if (pkm) {
    const subjects = ["english", "german", "math", "latin", "physics", "biology", "chemistry", "history", "philosophy", "politics", "economics", "law", "psychology", "art", "music"];
    
    Object.keys(pkm).forEach(key => {
        const matchedSub = subjects.find(sub => key.startsWith(sub));
        if (matchedSub && pkm[key] && String(pkm[key]).trim() !== "") {
            const label = matchedSub.charAt(0).toUpperCase() + matchedSub.slice(1);
            studyUnits.push(`**${label}:** ${pkm[key]}`);
        }
    });
}
tp.variables.study_revD = studyUnits.length > 0 ? studyUnits.join(" | ") : "_None logged_";

// --- PROJ & PROT Sync ---
tp.variables.projFocusStr = projFocusList.length > 0 ? `[${projFocusList.map(f => `"${f}"`).join(", ")}]` : "[]";
tp.variables.protFocusStr = protFocusList.length > 0 ? `[${protFocusList.map(f => `"${f}"`).join(", ")}]` : "[]";

tp.variables.projListUI = projFocusList.length > 0 ? projFocusList.map(f => `- 🧩 ${f}`).join("\n> ") : "- _No active projects today._";
tp.variables.protListUI = protFocusList.length > 0 ? protFocusList.map(f => `- 📜 ${f}`).join("\n> ") : "- _No protocols created today._";

tR += "---";
%>
arch:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>"
archtype:
  - "<%- tp.variables.ARCH?.c?.tag || '#0cal' %>/1review"
persona: "#persona/analyst"
cal_date: <%- dateStr %>
status: 1active
journal_revD: <%- tp.variables.journal_revD %>
fitness_revD: <%- tp.variables.fitness_revD %>
selfcare_revD: <%- tp.variables.selfcare_revD %>
kcal_revD: <%- tp.variables.kcal_revD %>
protein_revD: <%- tp.variables.protein_revD %>
mood_plm_revD: "<%- tp.variables.mood_plm_revD %>"
energy_revD: "<%- tp.variables.energy_revD %>"
sleep_revD: <%- tp.variables.sleep_revD %>
focusD_plm: "<%- tp.variables.focusD_plm %>"
focusM_plm: "<%- tp.variables.focusM_plm %>"
focusD_ppm: "<%- tp.variables.focusD_ppm %>"
focusM_ppm: "<%- tp.variables.focusM_ppm %>"
focusD_pkm: "<%- tp.variables.focusD_pkm %>"
focusM_pkm: "<%- tp.variables.focusM_pkm %>"
study_revD: "<%- tp.variables.study_revD.replace(/\*\*/g, "") %>"
brainDrain_revD: "<%- tp.variables.brainDrain_revD %>"
mood_pkm_revD: "<%- tp.variables.mood_pkm_revD %>"
focus_proj: <%- tp.variables.projFocusStr %>
focus_prot: <%- tp.variables.protFocusStr %>
sentiment: 3
---

# <%- dateStr %> revD

> "True humility is not thinking less of yourself; it is thinking of yourself less." — C.G. Jung

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

---

## 📊 Core Performance Matrix

> [!multi-column]
>
> > [!info|wide-1] 🌷 PLM (Life)
> > <small style="opacity:0.5; text-transform:uppercase;">Daily Focus</small><br>**<%- tp.variables.focusD_plm || "..." %>**
> > <small style="opacity:0.5; text-transform:uppercase;">Monthly Focus</small><br>**<%- tp.variables.focusM_plm || "..." %>**
> > ---
> > - **Energy:** `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date === "<%- dateStr %>").first(); p ? p.energy + "/5" : "—"`
> > - **Mood:** `<%- tp.variables.mood_plm_revD %>/5`
> > - **Sleep:** `<%- tp.variables.sleep_revD %>h` | **Fitness:** `<%- tp.variables.fitness_revD %>m`
> > - **Fuel:** 🔥 `<%- tp.variables.kcal_revD %>` | 💪 `<%- tp.variables.protein_revD %>g`
> > - **Habits:**
> > 	- Journal: `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.journal_revD ? "✅" : "❌"`
> > 	- Selfcare: `$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.selfcare_revD ? "✅" : "❌"`
>
> > [!info|wide-1] 🌻 PPM (Strategy)
> > <small style="opacity:0.5; text-transform:uppercase;">Daily Focus</small><br>**<%- tp.variables.focusD_ppm || "..." %>**
> > <small style="opacity:0.5; text-transform:uppercase;">Monthly Focus</small><br>**<%- tp.variables.focusM_ppm || "..." %>**
> > ---
> > - **Energy:** `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p ? p.energy + "/5" : "—"`
> > - **Main Execution:**
> > 	1. `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask1 || "—"`
> > 	2. `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask2 || "—"`
> > 	3. `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask3 || "—"`
> > 	4. `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask4 || "—"`
> > <br>
> > - **Maintenance:**
> > 	- 🧹 `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask5 || "—"`
> > 	- 🧼 `$= const p = dv.pages('"0_Calendar/2_PPM"').where(p => p.cal_date === "<%- dateStr %>").first(); p?.maintask6 || "—"`
>
> > [!info|wide-1] 🌼 PKM (Knowledge)
> > <small style="opacity:0.5; text-transform:uppercase;">Daily Focus</small><br>**<%- tp.variables.focusD_pkm || "..." %>**
> > <small style="opacity:0.5; text-transform:uppercase;">Monthly Focus</small><br>**<%- tp.variables.focusM_pkm || "..." %>**
> > ---
> > - **Energy:** `$= const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date === "<%- dateStr %>").first(); p ? p.energy + "/5" : "—"`
> > - **Mindset:** Brain Drain `<%- tp.variables.brainDrain_revD %>/5`
> > <br>
> > - **Study Units Logged:**
> > <%- tp.variables.study_revD %>

---

## 📝 Activity & Manifestation

> [!multi-column]
>
> > [!pink|wide-1] 🍽️ PLM: Fuel & Body
> > <small style="opacity:0.5; text-transform:uppercase;">Daily Totals</small>
> > - 🔥 **`$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date === "<%- dateStr %>").first(); p ? p.nexus_kcal : 0`** kcal
> > - 💪 **`$= const p = dv.pages('"0_Calendar/1_PLM"').where(p => p.cal_date === "<%- dateStr %>").first(); p ? p.nexus_protein_g : 0`**g Protein
> > ---
> > <small style="opacity:0.5; text-transform:uppercase;">Meal Log Details</small>
> > [[<%- dateStr %> plm|↗️ Open Today's Journal]]
> > <br>
>
> > [!todo|wide-1] 🛠️ PPM: Execution
> > <small style="opacity:0.5; text-transform:uppercase;">Tasks Completed Today</small>
> > ```dataviewjs
> > const t = dv.pages().file.tasks.where(t => t.completed && t.completion && String(t.completion).includes("<%- dateStr %>"));
> > if(t.length > 0) dv.list(t.map(x => x.text + " [[" + x.link.path.split('/').pop().replace('.md','') + "|↗️]]"));
> > else dv.paragraph("_No tasks finished today._");
> > ```
> > ---
> > <small style="opacity:0.5; text-transform:uppercase;">Project Nexus Activity</small>
> > ```dataviewjs
> > const pr = dv.pages('"0_Calendar/4_Projectlog"').where(p => p.cal_date === "<%- dateStr %>");
> > if(pr.length > 0) dv.list(pr.map(p => "🧩 [[" + p.file.name + "|" + (p.displayTitle || p.file.name) + "]]: " + (p.focus_LOG || "Update")));
> > else dv.paragraph("_No project logs recorded._");
> > ```
>
> > [!abstract|wide-1] 🎓 PKM: Knowledge Gained
> > <small style="opacity:0.5; text-transform:uppercase;">Subject Deep-Dive (Min)</small>
> > ```dataviewjs
> > const p = dv.pages('"0_Calendar/3_PKM"').where(p => p.cal_date === "<%- dateStr %>").first();
> > if (p) {
> >     const subjects = ["english", "german", "math", "latin", "physics", "biology", "chemistry", "history", "philosophy", "politics", "economics", "law", "psychology", "art", "music"];
> >     let learned = [];
> >     Object.keys(p).forEach(k => {
> >         const matched = subjects.find(s => k.startsWith(s));
> >         if (matched && p[k] && String(p[k]).trim() !== "" && !isNaN(p[k])) {
> >             learned.push("**" + matched.charAt(0).toUpperCase() + matched.slice(1) + "**: " + p[k] + " min");
> >         }
> >     });
> >     if (learned.length > 0) dv.list(learned);
> >     else dv.paragraph("_No specific subjects logged._");
> > } else { dv.paragraph("_No PKM Log found._"); }
> > ```
> > ---
> > <small style="opacity:0.5; text-transform:uppercase;">Knowledge Objects</small>
> > ```dataviewjs
> > const notes = dv.pages('-"zData" and -"0_Calendar"').where(n => n.file.cday.toString() === "<%- dateStr %>" || n.file.mday.toString() === "<%- dateStr %>").limit(5);
> > if(notes.length > 0) dv.list(notes.file.link);
> > else dv.paragraph("_No new notes recorded._");
> > ```

---

## 🔍 Specific Pillar Review

> [!multi-column]
>
> > [!abstract|wide-1] 🍽️ PLM: Meal Review
> > <small>Did I stick to the baseline? Resonance?</small>
> > `INPUT[text:review_meal]`
>
> > [!abstract|wide-1] 🛒 PPM: Shopping
> > <small>Procurement status? Impulsive buys?</small>
> > `INPUT[text:review_shopping]`
>
> > [!abstract|wide-1] 🧠 PKM: Spaced Rep.
> > <small>Flashcards done? Delay cleared?</small>
> > `INPUT[text:review_spacedrep]`

---

> [!todo] 🚧 Executed Nexus Activities
> **Projects:**
> <%- tp.variables.projListUI %>
> 
> **Protocols:**
> <%- tp.variables.protListUI %>

---
---
## 🌑 Deep Sync: Humility & Alignment

> [!multi-column]
>
> > [!example|wide-1] The Crucible
> > <small style="opacity:0.5; text-transform:uppercase;">Overcoming Obstacles</small>
> >
> > **The Greatest Challenge:** 
> > `INPUT[text:challenge_today]`
> > <br>
> > **Emotional Balance:**
> > `INPUT[slider:sentiment]`
>
> > [!heart|wide-1] Grace
> > <small style="opacity:0.5; text-transform:uppercase;">Staying Grounded</small>
> > **Moments of Gratitude:**
> > 1. `INPUT[text:gratitude_1]`
> > 2. `INPUT[text:gratitude_2]`

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`


