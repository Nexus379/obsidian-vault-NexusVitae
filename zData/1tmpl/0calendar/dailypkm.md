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
> > **Energy:** `VIEW[{energy}]` / 5
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
