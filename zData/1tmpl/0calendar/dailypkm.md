<%-*
// 🔱 1. INITIALIZATION & DATA SYNC
if (!tp.variables) tp.variables = {};
const dv = app.plugins.plugins.dataview.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🔱 2. SMART CLEAN & FALLBACK (For Direct-Start without Prompt)
// Detects "Untitled" or the "Entry-..." placeholder from Router
let currentFileTitle = tp.variables.title || tp.file.title;
const dateStr = tp.variables.targetDate || tp.date.now("YYYY-MM-DD");
const [year, month] = dateStr.split("-");

const isPlaceholder = currentFileTitle.toLowerCase().includes(defaultName.toLowerCase()) || /Entry-\d{2}-\d{2}/.test(currentFileTitle);

let cleanPart = "";

if (tp.variables.title && !tp.variables.title.includes("Entry-")) {
    cleanPart = tp.variables.title; // Taken from Router/Prompt
} else {
    const untitledPattern = new RegExp(defaultName + "(\\s\\d+)?", "i");
    // Manual Fallback: Filter placeholders, "pkm" and the date
    cleanPart = currentFileTitle.replace(/Entry-\d{2}-\d{2}/i, "")
                                .replace(untitledPattern, "")
                                .replace(new RegExp(defaultName, "i"), "")
                                .replace(/^\d{4}-\d{2}-\d{2}/, "")
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
    ["5 - Fresh / Ready", "4 - Focused", "3 - Average", "2 - Tired", "1 - Fried 🍳"], 
    ["5", "4", "3", "2", "1"], false, "🧠 Brain Drain: How taxed is your mind?"
);
const drainVal = drainChoice || "1";

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

// 🔱 6. LOGISTICS & FOLDER SYNC
const [y, m] = dateStr.split("-");
const targetFolder = `0_Calendar/3_PKM/${y}/${m}`;
const finalDest = `${targetFolder}/${finalTitle}.md`;
const focusStart = (tp.frontmatter && tp.frontmatter.focusM_start) ? tp.frontmatter.focusM_start : dateStr;

if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    let currentPath = "";
    for (const seg of targetFolder.split('/')) {
        currentPath = currentPath === "" ? seg : `${currentPath}/${seg}`;
        if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath);
    }
    await tp.file.move(finalDest);
}

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
brain-drain: "<%- drainVal %>"
focusD_pkm: "<%- pureFocus %>"
focusM_pkm: "<%- focusM_pkm %>"
focusM_start: "<%- focusStart %>"
discipline: 
subject: ""
cal0: 
stars1:
area2: ["3_Mind"]
project3:
task4:
note5: 
resource6:
cal_date: <%- dateStr %>
english: ""
german: ""
math: ""
latin: ""
physics: ""
biology: ""
chemistry: ""
history: ""
philosophy: ""
politics: ""
economics: ""
law: ""
psychology: ""
art: ""
music: ""

---

# 🎓 <%- dateStr %> - <%- displayTitle %>
> [!abstract] 🔱 Nexus Sync: <%- energy %>/5 | Brain: <%- drainVal %>/5


<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

> [!multi-column]
> > [!abstract] 🕒 Chronos Sync
> > **Date:** `VIEW[{cal_date}]`
> > 
> > ```dataviewjs
> > const tFile = app.vault.getAbstractFileByPath(dv.current().file.path);
> > const currentEnergy = dv.current().energy || "3";
> > const eMap = {"5":"🔱 Amazing", "4":"🔋 High", "3":"🙂 Medium", "2":"🪫 Low", "1":"⭕ Empty"};
> > 
> > // Container für das Interface-Element erstellen
> > const container = dv.container.createEl("div", { style: "font-size: 0.85em; font-family: var(--font-interface);" });
> > 
> > // Label und Status-Text-Element
> > const label = container.createEl("small", { text: "⚡ Energy Level: ", style: "opacity: 0.8;" });
> > const statusText = container.createEl("span", { 
> >     text: eMap[String(currentEnergy)] || currentEnergy, 
> >     style: "font-weight: bold; margin-left: 4px;" 
> > });
> > 
> > container.createEl("br");
> > 
> > // Der HTML Slider (input type='range')
> > const slider = container.createEl("input", {
> >     type: "range",
> >     attr: { min: "1", max: "5", value: String(currentEnergy), step: "1" },
> >     style: "width: 100%; max-width: 150px; margin-top: 6px; cursor: pointer;"
> > });
> > 
> > // Event-Listener für Interaktionen
> > slider.addEventListener("input", async (e) => {
> >     const val = e.target.value;
> >     statusText.innerText = eMap[val] || val;
> >     
> >     // Schreibt den Wert direkt zurück in das YAML Frontmatter der aktuellen Datei
> >     await app.fileManager.processFrontMatter(tFile, (fm) => {
> >         fm["energy"] = Number(val);
> >     });
> > });
> >```
> > 
> > **Brain-Drain:** `VIEW[{brain-drain}]` / 5
> > 
> > **Focus** (monthly) `INPUT[text:focusM_pkm]`
>
> > [!log] 📜 On this day
> > **Focus** (daily) `INPUT[text:focusD_pkm]`
> > ```dataview
> > LIST FROM "0_Calendar/3_PKM"
> > WHERE file.day.month = this.file.day.month AND file.day.day = this.file.day.day
> > AND file.name != this.file.name
> > ```


## 🚀 Fokus



## 🏫 Academy Logistics

### 🎓 Daily Study Tracker

> [!info] 🔱 Click here to log a discipline:
> `BUTTON[add-disc-pkm]`

>[!log]
> ```dataviewjs
> const c = dv.current();
> const sessions = [];
> let totalMin = 0;
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
>             // Extrahiert den Namen (z.B. "physics" aus "physics_1234")
>             let subjRaw = baseKey.split("_")[0];
>             let subj = subjRaw.charAt(0).toUpperCase() + subjRaw.slice(1);
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
>     dv.paragraph(`<center><span style="color: var(--interactive-accent); font-weight: bold;">Total Time: ${totalMin} min</span></center>`);
> } else {
>     dv.paragraph("<center><i>No sessions logged today. Use the button above.</i></center>");
> }
> ```

## Studyplan
```dataview
TABLE WITHOUT ID
  space_rank as "Rank",
  file.link as "Mission / Topic",
  space_date as "Due Stardate"
WHERE space_date != null
  AND space_date = date(today) 
  AND status != "archive"
SORT space_date ASC
LIMIT 5
```

### ! Delay
```dataview
TABLE WITHOUT ID
  space_rank as "Rank",
  file.link as "Mission / Topic",
  space_date as "Stardate Due"
WHERE space_date != null
  AND space_date < date(today) 
  AND status != "archive"
SORT space_date ASC
LIMIT 8
```

### 🌑 Knowledge Secured. Mind Kindled. 🎻🌊

---

[[n-lit|+ Literature Note]] | [[n-perma|+ Permanent Note]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

`BUTTON[freezer]`
