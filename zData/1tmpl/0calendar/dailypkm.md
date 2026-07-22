<%-*
// 🔱 1. INITIALIZATION & DATA SYNC
if (!tp.variables) tp.variables = {};
const dv = app.plugins.plugins.dataview?.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let nexusConfig = {
    roots: { calendar: "0_Calendar" },
    areas: { mainPlans: {} }
};
try {
    const cfgFile = app.vault.getAbstractFileByPath("zData/4values/NexusVitae_SystemConfig.json");
    if (cfgFile) nexusConfig = Object.assign(nexusConfig, JSON.parse(await app.vault.read(cfgFile)));
} catch (e) { console.error("Nexus system config load failed:", e); }
const cfgRoot = (key, fallback) => nexusConfig?.roots?.[key] || fallback;
const cfgAreaPlan = (key, fallback) => nexusConfig?.areas?.mainPlans?.[key] || fallback;
const calendarRoot = cfgRoot("calendar", "0_Calendar");
const weeklyPlanRoot = `${calendarRoot}/7_Plan`;

// 🔱 2. SMART CLEAN & FALLBACK (For Direct-Start without Prompt)
// Detects "Untitled" or the "Entry-..." placeholder from Router
let currentFileTitle = tp.variables.title || tp.file.title;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [year, month] = dateStr.split("-");

const isPlaceholder = currentFileTitle.toLowerCase().includes(defaultName.toLowerCase()) || /Entry-\d{2}-\d{2}/.test(currentFileTitle);

let cleanPart = "";

if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanPart = tp.variables.title.replace(/plm/i, "").replace(/ppm/i, "").replace(/pkm/i, "").replace(/^- /, "").trim(); // Taken from Router/Prompt
} else {
    const untitledPattern = new RegExp(defaultName + "(\\s\\d+)?", "i");
    // Manual Fallback: Filter placeholders, "pkm" and the date
    cleanPart = currentFileTitle.replace(/Entry-\d{2}-\d{2}/i, "")
                                .replace(untitledPattern, "")
                                .replace(new RegExp(defaultName, "i"), "")
                                .replace(/^\d{4}-\d{2}-\d{2}/, "")
                                .replace(/plm/i, "")
                                .replace(/ppm/i, "")
                                .replace(/pkm/i, "")
                                .replace(/^- /, "")
                                .trim();
}

// 🔱 2.1 PKM INTERVENTION: Ask for Study Focus if empty
if (!cleanPart || cleanPart.toLowerCase() === "daily log") {
    const focus = await tp.system.prompt("🌼 Nexus PKM: Study Focus for today?", "");
    cleanPart = focus ? focus.trim() : "";
}

// Construct final title
let finalTitle = `${dateStr} pkm${cleanPart ? " - " + cleanPart : ""}`;
let pureFocus = cleanPart || "";

// 🔱 3. FILE STABILIZATION (Physical Rename)
if (currentFileTitle !== finalTitle) {
    await tp.file.rename(finalTitle);
    await new Promise(r => setTimeout(r, 200)); 
}   

// Save variables for the rest of the template
tp.variables.title = finalTitle;
tp.variables.targetDate = dateStr;
const displayTitle = cleanPart || "Daily Strategy";

// 🔱 4. ENERGY & BRAIN DRAIN
const energy = tp.variables.energy || tp.frontmatter?.energy || "3";
tp.variables.energy = energy;

const drainChoice = await tp.system.suggester(
    ["🧠 5 - Fresh", "💡 4 - Focused", "😐 3 - Average", "🥱 2 - Tired", "🍳 1 - Fried"], 
    ["5", "4", "3", "2", "1"], false, "🧠 Brain Drain?"
);
const drainVal = drainChoice || "3";

// 🔱 5. MONTHLY STRATEGY SYNC
let focusM_pkm = "";
let focusM_Date = dateStr;

if (dv) {
    const monthlyLogs = dv.pages(`"0_Calendar/3_PKM/${year}/${month}"`)
        .where(p => p.focusM_pkm && p.focusM_pkm !== "")
        .sort(p => p.file.name, "desc");

    if (monthlyLogs.length > 0) {
        const lastLog = monthlyLogs.first();
        focusM_pkm = lastLog.focusM_pkm;
        focusM_Date = lastLog.focusM_start || lastLog["cal_date"] || dateStr; // 🎯 FIXED
    }
}

if (tp.frontmatter && tp.frontmatter.focusM_pkm) {
    focusM_pkm = tp.frontmatter.focusM_pkm;
}

// 🔱 6. FINAL LOGISTICS (Folder-Check & Move)
const [y, m] = dateStr.split("-");
const targetFolder = `0_Calendar/3_PKM/${y}/${m}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;
const focusStart = (tp.frontmatter && tp.frontmatter.focusM_start) ? tp.frontmatter.focusM_start : focusM_Date;

if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    let currentPath = "";
    for (const seg of targetFolder.split('/')) {
        currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
    }
    await tp.file.move(finalDest);
}

// 🔱 6.5 TIMETABLE SYNC (Auto-Extraction)
let timetableBlocks = "";
try {
    // 1. Finde den passenden Wochentag heraus (z.B. "mon", "tue")
    const ttDate = moment(dateStr);
    const dayPrefix = ttDate.locale('en').format("ddd").toLowerCase(); 

    const tYear = ttDate.format("YYYY");
    const tKw = ttDate.format("WW");
    const tMonth = ttDate.format("MM");
    const weeklyTtPath = `${weeklyPlanRoot}/${tYear}/${tMonth}/${tYear}-W${tKw}_timetable.md`;
    
    let ttPage = dv.page(weeklyTtPath);
    if (!ttPage) {
        ttPage = dv.page(cfgAreaPlan("timetable", "2_Areas/3_Mind/Plan/Timetable.md"));
    }

    if (ttPage && ["mon", "tue", "wed", "thu", "fri"].includes(dayPrefix)) {
        let dailySubjects = new Set(); // Set verhindert doppelte Einträge bei Doppelstunden
        
        // 3. Durchsuche das YAML der Timetable nach den Einträgen für diesen Tag
        for (let key in ttPage) {
            if (key.startsWith(`tt_${dayPrefix}_`)) {
                let val = ttPage[key];
                if (val && val !== "free" && val !== "break") {
                    dailySubjects.add(val);
                }
            }
        }

        // 4. Wenn wir Fächer gefunden haben, lade die Discipline Engine
        if (dailySubjects.size > 0) {
            let engineData = {};
            if (typeof tp.user.disciplineEngine === "function") {
                const engine = tp.user.disciplineEngine();
                engineData = engine.all || {};
            }

            // 5. Baue die Blöcke exakt im Format deines Button-Skripts
            timetableBlocks += `> [!info] 🗓️ **Timetable Sync: ${ttDate.format("dddd")}**\n>\n> Die folgenden Fächer stehen heute auf dem Plan:\n\n`;
            
            for (let subjKey of dailySubjects) {
                let disc = engineData[subjKey];
                if (disc) {
                    const sciTags = (disc.sci && disc.sci.length) ? disc.sci.join(", ") : "#sci/General";
                    const counter = Math.floor(Math.random() * 9000) + 1000;
                    const fieldTopic = `${subjKey}_${counter}`;
                    const fieldTime = `${subjKey}_${counter}_min`;
                    
                    timetableBlocks += `${disc.icon} **${disc.label}**\n📝 Topic: \`INPUT[text:${fieldTopic}]\`\n⏱️ Time: \`INPUT[number:${fieldTime}]\` min.\n<small style="opacity:0.65;font-style:italic;font-size:0.9em;">(Sci: ${sciTags})</small>\n\n`;
                }
            }
        } else {
            timetableBlocks = "> [!caution]- 🗓️ **Timetable:** Nothing scheduled today — no subjects in this week's timetable, or it isn't tagged with a discipline yet.\n\n";
        }
    } else if (["sat", "sun"].includes(dayPrefix)) {
        timetableBlocks = "> [!info] 🌴 **Weekend Mode:** No regular subjects scheduled today.\n\n";
    } else {
        timetableBlocks = "> [!caution] ⚠️ **Timetable Error:** Could not locate Timetable.md.\n\n";
    }
} catch (error) {
    console.error("Timetable Sync Error: ", error);
}

// Speichere die gebauten Blöcke als Variable, um sie unten auszugeben
tp.variables.timetableSync = timetableBlocks;


// 🔱 7. CLEANUP
if (tp.variables && tp.variables.targetDate) delete tp.variables.targetDate;
tR = "---\n";
%>
arch:
- "#0cal"
archtype:
- "#0cal/3pkm"
persona: student
energy: "<%- energy %>"
brain_drain: "<%- drainVal %>"
focusD_pkm: "<%- pureFocus %>"
focusM_pkm: "<%- focusM_pkm %>"
focusM_start: "<%- focusStart %>"
discipline: 
subject: ""
cal0: 
stars1:
area2: ["#2area/3mind"]
project3:
task4:
note5: 
resource6:
cal_date: <%- dateStr %>

---

# 🎓 <%- dateStr %> - <%- displayTitle %>
> [!abstract] 🔱 Nexus Sync: <%- energy %>/5 | Brain: <%- drainVal %>/5

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

> [!multi-column]
> > [!abstract|flat] 📅 Focus
> > **Monthly Aim:** `INPUT[text(placeholder(Monthly Study Goal...)):focusM_pkm]`
> > **Daily Mission:** `INPUT[text(placeholder(What to conquer today?)):focusD_pkm]`
> 
> > [!quote|flat] 📜 On this day
> > ```dataview
> > LIST FROM "0_Calendar/3_PKM"
> > WHERE file.day.month = this.file.day.month AND file.day.day = this.file.day.day
> > AND contains(file.name, " pkm")
> > AND file.name != this.file.name
> > ```

```dataviewjs
// ⚡ NEXUS VITALITY DASHBOARD (Energy & Brain-Drain)
const tFile = app.vault.getAbstractFileByPath(dv.current().file.path);
const c = dv.current();

const eMap = {"5":"🔱 Amazing", "4":"🔋 High", "3":"🙂 Medium", "2":"🪫 Low", "1":"⭕ Empty"};
const bMap = {"5":"🧠 Fresh / Ready", "4":"💡 Focused", "3":"😐 Average", "2":"🥱 Tired", "1":"🍳 Fried"};

// Das "display: flex" sorgt dafür, dass die Elemente nebeneinander stehen
const container = dv.container.createEl("div", { 
    style: "display: flex; gap: 15px; margin-bottom: 20px;" 
});

// Funktion zum Erstellen der Boxen
function createDashboardBox(title, map, fieldName, color, icon) {
    const box = container.createEl("div", { 
        style: `flex: 1; padding: 12px; background: var(--background-secondary-alt); border-radius: 8px; border-left: 4px solid ${color};` 
    });
    box.createEl("div", { text: `${icon} ${title}`, style: "opacity: 0.7; font-weight: bold; text-transform: uppercase; font-size: 0.75em; margin-bottom: 8px;" });
    const valText = box.createEl("div", { text: map[String(c[fieldName])] || c[fieldName], style: "font-weight: bold; font-size: 1.1em;" });
    const slider = box.createEl("input", { type: "range", attr: { min: "1", max: "5", value: String(c[fieldName] || 3), step: "1" }, style: "width: 100%; margin-top: 10px; cursor: pointer;" });
    
    slider.addEventListener("input", async (e) => { 
        valText.innerText = map[e.target.value]; 
        await app.fileManager.processFrontMatter(tFile, fm => fm[fieldName] = Number(e.target.value)); 
    });
}

// Boxen generieren
createDashboardBox("System Energy", eMap, "energy", "var(--interactive-accent)", "⚡");
createDashboardBox("Cognitive Load", bMap, "brain_drain", "#b873f0", "🧠");
```


## 🚀 Fokus



## 🏫 Academy Logistics

### 🎓 Daily Study Tracker



> [!info] 🔱 Click here to log a discipline:
> `BUTTON[add-disc-pkm]`


<%- tp.variables.timetableSync %>


>[!log]
> ```dataviewjs
> const c = dv.current();
> const sessions = [];
> let totalMin = 0;
> let disciplineData = {};
> try {
>     if (typeof tp.user.disciplineEngine === "function") {
>         const engine = tp.user.disciplineEngine();
>         disciplineData = engine.all || {};
>     }
> } catch (e) {}
> 
> // Sucht nach allen generierten Schlüsseln, die auf "_min" enden
> for (let key in c) {
>     if (key.endsWith("_min")) {
>         let baseKey = key.replace("_min", "");
>         
>         // Prüft, ob Meta-Bind den Eintrag angelegt hat
>         if (c[baseKey] !== undefined || c[key] !== undefined) {
>             // Macht aus einem leeren Feld eine 0 für die Berechnung
>             let time = Number(c[key]) || 0; 
>             
>             // Rohdaten des Themas abgreifen
>             let rawTopic = c[baseKey] || "---"; 
>             
>             // SICHERHEITS-CHECK FÜR LINKS:
>             // Falls du mehrere Links wie "[[n-lit1]], [[n-lit2]]" einträgst, 
>             // macht Dataview ein Array daraus. Das fangen wir hier sauber ab:
>             let topic = Array.isArray(rawTopic) ? rawTopic.join(", ") : rawTopic;
>             
>             // Entfernt nur die Zufalls-ID und übernimmt den Namen aus der Discipline Engine
>             let subjKey = baseKey.replace(/_\d{4}$/, "");
>             let subj = disciplineData[subjKey]?.label || subjKey.split("_").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
>             
>             // Zeigt die Zeit an, oder "---" wenn sie 0 / leer ist
>             let displayTime = time > 0 ? `${time} min` : `---`;
>             
>             sessions.push([`**${subj}**`, topic, displayTime]);
>             totalMin += time;
>         }
>     }
> }
> 
> if (sessions.length > 0) {
>     dv.table(["Discipline", "Topic", "Time"], sessions);
>     // Hier ist das optische Upgrade: Die "Total Time" Box
>     dv.paragraph(`
>         <div style="text-align: center; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px; margin-top: 10px;">
>             <span style="opacity: 0.8; text-transform: uppercase; font-size: 0.8em;">Total Study Time Today</span><br>
>             <span style="color: var(--interactive-accent); font-weight: bold; font-size: 1.2em;">⏱️ ${totalMin} min</span>
>         </div>
>     `);
> } else {
>     dv.paragraph("<center><i>No sessions logged yet — add a discipline with the button above, or check today's Timetable Sync.</i></center>");
> }
> ```

## 🚀 Studyplan & Mastery Matrix

> [!info] 🎖️ **Star Trek Rank Mastery Matrix (Disciplines vs. Ranks)**
> *Every SRS Card is a Study Card, but not every Study Card is an SRS Card!*

```dataviewjs
const pages = dv.pages('(#5note/3atomic/studycards OR #5note/3atomic) AND !"zData" AND -"yArchive"')
    .where(p => p.space_rank != null && p.status !== "archive" && p.status !== "archived");

const ranks = ["Cadet 🎖️", "Ensign 🔰", "Lieutenant 🎗️", "Commander 🎖️", "Captain 👨‍✈️"];

if (pages.length > 0) {
    const grouped = pages.groupBy(p => {
        let disc = p.discipline ? (Array.isArray(p.discipline) ? p.discipline[0] : p.discipline) : "General";
        return String(disc).replace("#disc/", "").toUpperCase();
    });

    const rows = [];
    grouped.forEach(g => {
        let r1 = g.rows.filter(p => !p.space_rank || p.space_rank === 1).map(p => p.file.link).slice(0, 3).join("<br>") || "—";
        let r2 = g.rows.filter(p => p.space_rank === 2).map(p => p.file.link).slice(0, 3).join("<br>") || "—";
        let r3 = g.rows.filter(p => p.space_rank === 3).map(p => p.file.link).slice(0, 3).join("<br>") || "—";
        let r4 = g.rows.filter(p => p.space_rank === 4).map(p => p.file.link).slice(0, 3).join("<br>") || "—";
        let r5 = g.rows.filter(p => p.space_rank >= 5).map(p => p.file.link).slice(0, 3).join("<br>") || "—";
        rows.push([`**${g.key}**`, r1, r2, r3, r4, r5]);
    });

    dv.table(["📚 Discipline (Y-Axis)", "Cadet (L1)", "Ensign (L2)", "Lieutenant (L3)", "Commander (L4)", "Captain (L5)"], rows);
} else {
    dv.paragraph("_No active Study Cards found. Create cards via 3atomic_studycards!_");
}
```

### 🧠 Spaced Repetition (SRS Due Reviews)
<small style="opacity:0.45;font-style:italic;">(Study Cards whose SRS Stardate interval is due today for review)</small>
```dataview
TABLE WITHOUT ID
  space_rank as "Rank",
  file.link as "Mission / Topic",
  space_date as "Due Stardate"
WHERE space_date != null
  AND date(space_date) = date(today) 
  AND status != "archive"
SORT space_date ASC
LIMIT 5
```

### ⚠️ SRS Delay (Overdue Reviews)
<small style="opacity:0.45;font-style:italic;">(past-due SRS Study Cards — empty = you're all caught up!)</small>
```dataview
TABLE WITHOUT ID
  space_rank as "Rank",
  file.link as "Mission / Topic",
  space_date as "Stardate Due"
WHERE space_date != null
  AND date(space_date) < date(today) 
  AND status != "archive"
SORT space_date ASC
LIMIT 8
```

### 🌑 Knowledge Secured. Mind Kindled. 🎻🌊

---

[[lit- |+ Literature Note]] | [[perma- |+ Permanent Note]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[archive-month]`
