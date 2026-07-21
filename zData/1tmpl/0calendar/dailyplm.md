<%-*
// 🔱 1. INITIALIZATION & DATA SYNC
if (!tp.variables) tp.variables = {};
const dv = app.plugins.plugins.dataview.api;
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");

// 🌐 i18n label helper (loads zData/2scripts/i18n.js via the same read+Function pattern as the engines).
// L("key") returns the label in the current language, falling back to English, then the key itself.
let L = (k) => k;
try {
    const _i18nFile = app.vault.getAbstractFileByPath("zData/2scripts/i18n.js");
    if (_i18nFile) {
        const _code = await app.vault.read(_i18nFile);
        const _mod = { exports: {} };
        new Function("module", "exports", _code)(_mod, _mod.exports);
        L = _mod.exports().t;
    }
} catch (e) { console.error("i18n load failed:", e); }

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
    // Manual Fallback: Filter placeholders, "plm" and the date
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

// 3.2 Mood & Sleep (If not provided by router)
let mood = tp.variables.mood;
if (!mood) {
    const moodOptions = ["💎 5 - Stellar", "✨ 4 - Radiant", "🍃 3 - Balanced", "☁️ 2 - Low", "🌑 1 - Void"];
    const moodValues = ["5", "4", "3", "2", "1"];
    mood = await tp.system.suggester(moodOptions, moodValues, false, "✨ Current Mood Status?");
}

let schlaf = tp.variables.sleep;
if (!schlaf) {
    schlaf = await tp.system.prompt("🌙 Hours of sleep?", "7");
}

// 🔱 2.1 PLM-SPECIFIC: If empty, ask for personal focus
if (!cleanPart || cleanPart.toLowerCase() === "daily log") {
    const focus = await tp.system.prompt("🌷 Nexus PLM: Personal Focus for today?", "");
    cleanPart = focus ? focus.trim() : "";
}

// Energy directly from Router
const energy = tp.variables.energy || "3";

// Assign exact icon to value
const mM = { "5":"💎", "4":"✨", "3":"🍃", "2":"☁️", "1":"🌑" }; 
const eM = { "5":"🔱", "4":"🔋", "3":"🙂", "2":"🪫", "1":"⭕" };

// Save formatted icon as variable
const moodIcon = mM[mood] || "⚪";
const energyIcon = eM[energy] || "⚪";

// 🔱 4. FILE STABILIZATION (Title & Rename)
let finalTitle = `${dateStr} plm${cleanPart ? " - " + cleanPart : ""}`;
let pureFocus = cleanPart || "";

const displayTitle = pureFocus || "Daily Journal";

if (currentFileTitle !== finalTitle) {
    await tp.file.rename(finalTitle);
    await new Promise(r => setTimeout(r, 200)); 
}   

// Save variables for Frontmatter
tp.variables.mood = mood || "3";
tp.variables.energy = energy;
tp.variables.sleep = schlaf || "7";
tp.variables.title = finalTitle;

// 🔱 4.5 MEAL PLAN SYNC (Zero-Delay & Clean List Edition)
const targetMoment = moment(dateStr, "YYYY-MM-DD");
const dayPrefix = targetMoment.locale('en').format("ddd").toLowerCase(); // e.g. 'mon'

// Custom logic replacing planPaths.js
const pYear = targetMoment.format("YYYY");
const pMonth = targetMoment.format("MM");
const pKw = targetMoment.format("WW");
const weeklyPlanPath = `0_Calendar/7_Plan/${pYear}/${pMonth}/${pYear}-W${pKw}_meal`;
const masterPlanPath = `2_Areas/1_Selfcare/Plan/Meal_Plan`;

let planPage = dv.page(weeklyPlanPath);
tp.variables.activePlanLink = `[[${weeklyPlanPath}|Week ${pKw} Meal Plan]]`;
if (!planPage) {
    planPage = dv.page(masterPlanPath);
    tp.variables.activePlanLink = `[[${masterPlanPath}|Meal_Plan (Master)]]`;
}

let plannedMealsUI = [];
let nexusBase = {};

if (planPage) {
    // 1. Generate UI Display (Pulls names directly from Meal Plan)
    const slots = { brk: "🌅 Breakfast", ben: "🍱 Bento", lun: "🥗 Lunch", snk: "🍎 Snack", eve: "🌙 Dinner" };
    for (let [key, label] of Object.entries(slots)) {
        let meals = planPage[`${dayPrefix}_${key}`];
        let lines = [];
        if (meals) {
            let mealArray = Array.isArray(meals) ? meals : [meals];
            for (let m of mealArray) {
                if (m) {
                    let rawLink = String(m);
                    let pathStr = rawLink.replace(/[\[\]"]/g, "").split("|")[0].trim();
                    let title = rawLink.includes("|") 
                        ? rawLink.replace(/[\[\]"]/g, "").split("|")[1].trim() 
                        : pathStr.split('/').pop().replace(".md", "");
                    
                    lines.push(`  - [[${pathStr}|${title}]]`);
                }
            }
        }
        if (lines.length === 0) lines.push(`  - _empty_`);
        
        plannedMealsUI.push(`- **${label}**\n${lines.join("\n")}`);
    }
    tp.variables.plannedMealsText = plannedMealsUI.join("\n");
    
    // 2. Import YAML Nutrients
    for (let k in planPage) {
        if (k.startsWith(`${dayPrefix}_`) && !["brk", "ben", "lun", "snk", "eve"].includes(k.split("_")[1])) {
            let metric = k.substring(4); 
            if (planPage[k] > 0) {
                nexusBase[`nexus_${metric}`] = planPage[k];
            }
        }
    }
} else {
    tp.variables.plannedMealsText = "_No Meal Plan found._";
}

tp.variables.nexusYaml = Object.entries(nexusBase).map(([k, v]) => `${k}: ${v}`).join("\n");
tp.variables.nexusJson = JSON.stringify(nexusBase);

// 5.3 Mantra Randomizer
const mantraFile = app.vault.getAbstractFileByPath("zData/4values/MantraListe.md");
let zufallsMantra = "Focus on the Essential. 🔱"; 
if (mantraFile) {
    const mContent = await app.vault.read(mantraFile);
    const listItems = mContent.split("\n").map(l => l.trim()).filter(l => l.startsWith("- ")).map(l => l.replace(/^- /, "").trim());
    if (listItems.length > 0) {
        zufallsMantra = listItems[Math.floor(Math.random() * listItems.length)];
    }
}

// 🔱 5.1 MONTHLY STRATEGY SYNC (Pulls the last set monthly focus)
let focusM_plm = "";
let focusM_Date = dateStr; 

if (dv) {
    const monthlyLogs = dv.pages(`"0_Calendar/1_PLM/${year}/${month}"`)
        .where(p => p.focusM_plm && p.focusM_plm !== "")
        .sort(p => p.file.name, "desc");

    if (monthlyLogs.length > 0) {
        const lastLog = monthlyLogs.first();
        focusM_plm = lastLog.focusM_plm;
        focusM_Date = lastLog.focusM_start || lastLog["cal_date"] || dateStr;
    }
}

// Keep manual frontmatter if it exists
if (tp.frontmatter && tp.frontmatter.focusM_plm) {
    focusM_plm = tp.frontmatter.focusM_plm;
}

// 🔱 5.5 ROUTINE & HOUSEHOLD SYNC (Pure Timeblocking MD Edition)
let routineBlocks = "";
try {
    const rDate = moment(dateStr);
    const rDayPrefix = rDate.locale('en').format("ddd").toLowerCase(); // e.g. "mon"
    
    const rYear = rDate.format("YYYY");
    const rMonth = rDate.format("MM");
    const rKw = rDate.format("WW");
    const weeklyRoutinePath = `0_Calendar/7_Plan/${rYear}/${rMonth}/${rYear}-W${rKw}_routine`;
    const masterRoutinePath = `2_Areas/4_Organize/Plan/Routine_Timeblocking`;

    let rPage = dv.page(weeklyRoutinePath);
    let rLink = `[[${weeklyRoutinePath}|Week ${rKw} Routine Plan]]`;
    if (!rPage) {
        rPage = dv.page(masterRoutinePath);
        rLink = `[[${masterRoutinePath}|Routine_Timeblocking (Master)]]`;
    }

    if (rPage && ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(rDayPrefix)) {
        const enginePath = "zData/2scripts/routineEngine.js";
        const eFile = app.vault.getAbstractFileByPath(enginePath);
        let engineData = {};
        
        if (eFile) {
            const code = await app.vault.read(eFile);
            const module = { exports: {} };
            new Function("module", "exports", code)(module, module.exports);
            const engineFn = module.exports;
            engineData = (typeof engineFn === "function") ? engineFn().all : {};
        }

        const rStart = rPage.rt_start || "07:00";
        const rDur = Number(rPage.rt_duration) || 60;
        const rTotal = Number(rPage.rt_periods) || 14;
        
        const rBreaksStr = String(rPage.rt_breaks || "");
        const rCustomBreaks = {};
        if (rBreaksStr) {
            rBreaksStr.split(",").forEach(b => {
                let parts = b.split(":");
                if(parts.length === 2) rCustomBreaks[parseInt(parts[0].trim())] = parseInt(parts[1].trim());
            });
        }

        let rCurrent = moment(rStart, ["HH:mm", "h:mm A", "h:mma"]);
        let dailyRoutines = [];

        // Read only the time blocks from the MD file
        for (let i = 1; i <= rTotal; i++) {
            let key = `rt_${rDayPrefix}_${i}`;
            let val = rPage[key];
            
            if (val && val !== "free" && val !== "break") {
                let parts = String(val).split("|");
                let baseKey = parts[0];
                let detail = parts.length > 1 ? ` _(${parts.slice(1).join(" ")})_` : "";
                
                let isHousehold = false;
                let label = baseKey;
                let icon = "🔸";

                // Filter: does this block from Timeblocking.md belong to household/life (Root chakra = daily basics)?
                if (engineData && engineData[baseKey]) {
                    if (engineData[baseKey].group === "1. Root") {
                        isHousehold = true;
                        label = engineData[baseKey].label;
                        icon = engineData[baseKey].icon || "🔸";
                    }
                } else if (baseKey === "custom") {
                    // If you use "custom", surface it in the PLM (e.g. for quick, personal todos)
                    isHousehold = true; 
                    label = parts.slice(1).join(" ");
                    detail = "";
                }

                if (isHousehold) {
                    dailyRoutines.push(`- [ ] **${rCurrent.format("HH:mm")}** | ${icon} ${label}${detail}`);
                }
            }
            
            rCurrent.add(rDur, 'minutes');
            if (rCustomBreaks[i] && i !== rTotal) {
                rCurrent.add(rCustomBreaks[i], 'minutes');
            }
        }

        let headerPrefix = `> [!abstract]- 📂 **Active Plan Source**\n> ${rLink}\n> \n`;
        if (dailyRoutines.length > 0) {
            routineBlocks = headerPrefix + `> [!info|clean] 🧹 **Today's Scheduled Routines**\n> \n` + dailyRoutines.map(r => `> ${r}`).join("\n> ");
        } else {
            routineBlocks = headerPrefix + `> [!info|clean] 🌿 **Free Day:** No household or life routines scheduled today.`;
        }
    } else {
        routineBlocks = "> [!caution] **Sync Error:** Could not locate Routine_Timeblocking file.";
    }
} catch (error) {
    console.error("Routine Sync Error: ", error);
    routineBlocks = "> [!caution] ⚠️ **Sync Error:** Routine Engine failed to load.";
}
tp.variables.routineSync = routineBlocks;

// 🔱 5.6 FITNESS SYNC (Weekly-Plan first, Master-Plan fallback)
let fitnessBlocks = "";
let fitnessLinkPath = "";
try {
    const fDate = moment(dateStr);
    const fYear = fDate.format("YYYY");
    const fMonth = fDate.format("MM");
    const fKw = fDate.format("WW");
    const weeklyFitnessPath = `0_Calendar/7_Plan/${fYear}/${fMonth}/${fYear}-W${fKw}_fitness`;
    const masterFitnessPath = `2_Areas/6_Activity/Plan/Fitness_Routine`;

    let fPage = dv.page(weeklyFitnessPath);
    if (fPage) {
        fitnessLinkPath = weeklyFitnessPath;
    } else {
        fPage = dv.page(masterFitnessPath);
        fitnessLinkPath = masterFitnessPath;
    }

    if (fPage) {
        const fDayPrefix = fDate.locale('en').format("ddd").toLowerCase();

        const enginePathFit = "zData/2scripts/fitnessEngine.js";
        const eFileFit = app.vault.getAbstractFileByPath(enginePathFit);
        let fitEngineData = {};
        if (eFileFit) {
            const code = await app.vault.read(eFileFit);
            const module = { exports: {} };
            new Function("module", "exports", code)(module, module.exports);
            fitEngineData = (typeof module.exports === "function") ? module.exports().all : {};
        }

        const regions = [
            { l: "🤸 Warmup", v: "mobility" }, { l: "💪 Upper", v: "upper" },
            { l: "🦵 Lower", v: "lower" }, { l: "🪨 Core", v: "core" }, { l: "🔥 Cardio", v: "cardio" }
        ];

        let dayHasTraining = false;
        regions.forEach(reg => {
            let planned = fPage[`fit_${fDayPrefix}_${reg.v}`];
            if (planned && planned !== "free") {
                dayHasTraining = true;
                let arr = Array.isArray(planned) ? planned : [planned];
                arr.forEach(k => {
                    let parts = String(k).split("|");
                    let baseKey = parts[0];
                    let detail = parts.length > 1 ? ` _(${parts.slice(1).join(" ")})_` : "";
                    let iconName = (baseKey === "custom")
                        ? `🔸 ${parts.slice(1).join(" ")}`
                        : (fitEngineData[baseKey] ? `${fitEngineData[baseKey].icon} ${fitEngineData[baseKey].label}` : `❓ ${baseKey}`);
                    fitnessBlocks += `- [ ] ${reg.l}: ${iconName}${detail}\n`;
                });
            }
        });

        if (!dayHasTraining) fitnessBlocks = "_Rest day — no training scheduled._\n";
    } else {
        fitnessBlocks = "_No Fitness plan found (neither weekly nor master)._\n";
    }
} catch (error) {
    console.error("Fitness Sync Error: ", error);
    fitnessBlocks = "_Fitness sync failed — see console._\n";
}
tp.variables.fitnessSync = fitnessBlocks;
tp.variables.fitnessLinkPath = fitnessLinkPath;
// Build the ready link (guard against an empty path -> avoids a broken [[|label]] wikilink)
tp.variables.fitnessLinkMd = fitnessLinkPath
    ? `➤ [[${fitnessLinkPath}|🏋️ Open Fitness Plan]]`
    : `_No fitness plan found._`;

// 🔱 5.7 INPRA SYNC (Instrumental Practice)
let inpraBlocks = "";
let inpraLinkPath = "";
try {
    const iDate = moment(dateStr);
    const iYear = iDate.format("YYYY");
    const iMonth = iDate.format("MM");
    const iKw = iDate.format("WW");
    const weeklyInpraPath = `0_Calendar/7_Plan/${iYear}/${iMonth}/${iYear}-W${iKw}_inpra`;
    
    let iPage = dv.page(weeklyInpraPath);
    if (iPage) {
        inpraLinkPath = weeklyInpraPath;
        const iDayPrefix = iDate.locale('en').format("ddd").toLowerCase();
        let activeInstr = iPage["instr_active"] || "Instrument";
        // Read 3 slots inpra_<day>_ex_1..3 (+ Mastery lvl_1..3) — matches weekplan_inpra
        let items = [];
        for (let s = 1; s <= 3; s++) {
            let ex = iPage[`inpra_${iDayPrefix}_ex_${s}`];
            if (ex && String(ex).trim() !== "") {
                let lvl = Number(iPage[`inpra_${iDayPrefix}_lvl_${s}`]) || 0;
                items.push(`- ${String(ex).trim()}${lvl ? ` _(Mastery ${lvl}/5)_` : ""}`);
            }
        }
        if (items.length > 0) {
            inpraBlocks = `**${activeInstr}:**\n${items.join("\n")}\n`;
        } else {
            inpraBlocks = `_No specific exercise planned for ${activeInstr} today._\n`;
        }
    } else {
        inpraBlocks = "_No Instrumental Practice plan found for this week._\n";
    }
} catch (error) {
    console.error("Inpra Sync Error: ", error);
    inpraBlocks = "_Inpra sync failed — see console._\n";
}
tp.variables.inpraSync = inpraBlocks;
tp.variables.inpraLinkPath = inpraLinkPath;
// Inpra has no master fallback -> without a weekly plan the path is empty. Guard the link.
tp.variables.inpraLinkMd = inpraLinkPath
    ? `➤ [[${inpraLinkPath}|🎼 Open Practice Plan]]`
    : `_No practice plan yet — create one via the weekly router._`;

// 🔱 6. FINAL LOGISTICS (Folder-Check & Move)
const [y, m] = dateStr.split("-");
const targetFolder = `0_Calendar/1_PLM/${y}/${m}`;
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

// 🔱 6.5 EAT THE FROG (Path Calculation)
const ppmPath = `0_Calendar/2_PPM/${year}/${month}/${dateStr} ppm`;
const pkmPath = `0_Calendar/3_PKM/${year}/${month}/${dateStr} pkm`;

// 🔱 7. CLEANUP
if (tp.variables && tp.variables.targetDate) delete tp.variables.targetDate;
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.26
banner_icon: 🌷
persona: healer
fileTitle: "<%- finalTitle %>"
arch: 
- "#0cal"
archtype: 
- "#0cal/1plm"
cal0:
stars1:
area2: ["#2area/1selfcare"]
project3:
task4:
note5: []
resource6:
sleep: <%- schlaf %>
mood: "<%- mood %>"
energy: "<%- energy %>"
focusD_plm: "<%- pureFocus %>"
focusM_plm: "<%- focusM_plm %>"
focusM_start: "<%- focusStart %>"
journal_am: false
journal_pm: false
mobility_am: 0
mobility_pm: 0
inpra_min: 0
selfcare_am: false
selfcare_pm: false
meal: []
activity_link: []
activity_time: 0
shopping_extras: []
creativity_link: []
entertain_link: []
strength_link: []
vita_snap: []
cal_date: <%- dateStr %>
meal_spont: []
meal_rem:
food_add:
food_rem:
<%- tp.variables.nexusYaml %>
---

# 🌸 <%- dateStr %>

<%- tp.file.include("[[zData/5design_modul/CalendarLog]]") %>

## <%- displayTitle %>

<%-*
// 🔱 3. DYNAMIC LINKS TO THE OTHER LOGS
const todayPPM = `0_Calendar/2_PPM/${year}/${month}/${dateStr} ppm`;
const todayPKM = `0_Calendar/3_PKM/${year}/${month}/${dateStr} pkm`;
%>
**Professional:** [[<%- todayPPM %>|🌻 Go to today's Manager-Log (PPM)]]
**Knowledge:** [[<%- todayPKM %>|🌼 Go to today's Study-Log (PKM)]]

---

> [!soul] Focus PLM
> > [!multi-column]
> > > [!blank|wide-2]
> > > <small style="opacity:0.4; text-transform:uppercase; font-size:0.65em; letter-spacing:0.1em;">🔱 Soul & Presence</small>
> > > <br>
> > > **Focus (Daily):**
> > > 
> > > `INPUT[text:focusD_plm]`
> > >
> > >  **Mantra:** 
> > >   
> > >   <%- zufallsMantra %> 
> > >  🔱🌈  
> > > <br>
> >
> > > [!blank|wide-2]
> > > <small style="opacity:0.4; text-transform:uppercase; font-size:0.65em; letter-spacing:0.1em;">⏳ 30-Day Cycle</small>
> > > <br>
> > > **Focus (Monthly):**
> > > 
> > > `INPUT[text:focusM_plm]`  
> > > <small style="opacity:0.5;">Days remaining: `$= dv.current().focusM_start ? Math.max(0, 30 - moment().startOf('day').diff(moment(String(dv.current().focusM_start)).startOf('day'), 'days')) : 30` · Start: `$= dv.current().focusM_start ? moment(String(dv.current().focusM_start)).format("YYYY-MM-DD") : ""`</small>
> > > 
> > > `BUTTON[reset-focus]`



## 🌿 Consuetudo (L-E-B-E-N)
```dataviewjs
(async function(){ 
    const c = dv.current(); 
    const v = dv.page("zData/4values/VitaminTracker.md"); 
    
    // --- 1. DATA SYNC ---
    const dateValue = c["cal_date"] ? moment(String(c["cal_date"])) : moment(c.file.name, "YYYY-MM-DD");
    const dayPref = moment(dateValue).locale('en').format("ddd").toLowerCase();
    const weekName = moment(dateValue).format("YYYY-[W]WW");
    
    // Smart Sync with Weekly Plans (aus 0_Calendar/7_Plan/)
    const fitPage = dv.pages('"0_Calendar/7_Plan"').where(p => p.file.name === weekName + "_fitness").first();

    // --- 2. THE 5 PILLARS (L-E-B-E-N) ---
    const vitaminTasks = (v && v.file.tasks) ? v.file.tasks : [];
    const isAlchemy = (t) => String(t.section).includes("Alchemy");
    
    // P1: Lifestyle (Food) - 75% of Bold Tasks
    const baseTasks = vitaminTasks.filter(t => !isAlchemy(t) && String(t.text).includes("**"));
    const compBase = baseTasks.filter(t => t.completed).length;
    const reqBase = Math.floor(baseTasks.length * 0.75);
    const p1 = (compBase >= reqBase && baseTasks.length > 0) ? 1 : 0;

    // P2: Emotions (4/4 Toggles)
    const p2 = ["journal_am","journal_pm","selfcare_am","selfcare_pm"].filter(k => String(c[k]) === "true").length / 4;
    
    // P3: Body (Mobility + Spontaneous Activity + Planned Workout Check)
    const sportTime = (Number(c["mobility_am"]) || 0) + (Number(c["mobility_pm"]) || 0) + (Number(c["activity_time"]) || 0);
    
    // Read "did train?" from the Workout log (real reps live there) instead of empty act_ fields
    let actuallyDidWorkout = false;
    const _wDate = moment(dateValue).format("YYYY-MM-DD");
    const _wFile = app.vault.getAbstractFileByPath(`0_Calendar/4_Projectlogs/Routine/${moment(dateValue).format("YYYY")}/${moment(dateValue).format("MM")}/Workout_${_wDate}.md`);
    if (_wFile) {
        const _wc = await app.vault.read(_wFile);
        for (let _l of _wc.split("\n")) {
            if (_l.startsWith("|") && !_l.includes("Target") && !_l.includes(":---:")) {
                const _cells = _l.split("|").slice(2, -1);
                if (_cells.some(x => x.trim() !== "" && !isNaN(parseInt(x.trim())))) { actuallyDidWorkout = true; break; }
            }
        }
    }
    const p3 = (sportTime >= 30 || actuallyDidWorkout) ? 1 : 0;
    
    // P4: Entropy (Enjoyment Link)
    const ent = c["entertain_link"];
    const p4 = (ent && (Array.isArray(ent) ? ent.length > 0 : String(ent).trim().length > 0)) ? 1 : 0;
    
    // P5: Night (>= 7h Sleep)
    const p5 = (Number(c.sleep) || 0) >= 7 ? 1 : 0;

    // 🔱 BASE CHECK (Der Gatekeeper)
    const baseMet = (p1 === 1 && p2 === 1 && p3 === 1 && p4 === 1 && p5 === 1);
    const basePercent = ((p1 + p2 + p3 + p4 + p5) / 5) * 100;

    // --- 3. BONUS CALCULATION ---
    let bonus = 0;
    if (sportTime >= 45) bonus += 5;
    if (sportTime >= 60 || actuallyDidWorkout) bonus += 5;
    if (actuallyDidWorkout && sportTime >= 20) bonus += 5; // Bonus for mixing structured workout + mobility
    if (Number(c.mood) >= 4) bonus += 5;
    if (Number(c.energy) >= 4) bonus += 5;
    
    // Instrument practice bonus (inpra): minutes straight from the day note
    const musicTime = Number(c["inpra_min"]) || 0;
    if (musicTime >= 15) bonus += 5;
    if (musicTime >= 30) bonus += 5;

    const compAlchemy = vitaminTasks.filter(t => isAlchemy(t) && t.completed).length;
    bonus += (compAlchemy * 2.5); // Bio-Hacks

    // 🏋️ WORKOUT BONUS (Powered by 7_Plan)
    if (actuallyDidWorkout) {
        bonus += 15; // Phoenix boost for a completed workout! (+15%)
    }

    // 🔱 THE CAP (Max 120%)
    const totalPercent = Math.min(basePercent + bonus, 120);

    // --- 4. VISUAL EVOLUTION (Strict Logic) ---
    let icon = "🌸"; let status = "BUILDING FOUNDATION"; let color = "var(--text-faint)";

    // Der neue Gatekeeper: Du hast alle 5 Pillars ODER du hast es mit Boni ausgeglichen!
    if (totalPercent >= 100) {
        icon = "💖"; status = "SYNC COMPLETE"; color = "var(--interactive-accent)";
        if (totalPercent >= 110) { icon = "🔥"; status = "OVERCHARGE"; color = "#ff7b00"; }
        if (totalPercent >= 120) { icon = "🐦‍🔥"; status = "PHOENIX ASCENSION"; color = "#ff4500"; }
    }
    
    // --- 5. UI OUTPUT ---
    const sFlower = "font-size: 0.8em; opacity: 0.7;";
    const sFire   = "font-size: 1.2em; filter: drop-shadow(0 0 5px #ff7b00);";
    const sPhoenix = "font-size: 1.7em; filter: drop-shadow(0 0 12px #ff4500); vertical-align: middle;";
    const sHeart  = "font-size: 0.8em; opacity: 0.2;";

    let bar = "";
    for (let i = 1; i <= 12; i++) {
        bar += (totalPercent >= i * 10) ? `<span style='${sFlower}'>🌸</span>` : `<span style='${sHeart}'>🤍</span>`;
    }
    if (totalPercent >= 110 && totalPercent < 120) bar += `<span style='${sFire}'>🔥</span>`;
    if (totalPercent >= 120) bar += `<span style='${sPhoenix}'>🐦‍🔥</span>`;

    dv.paragraph("<div style='font-family: var(--font-interface); padding: 10px 0;'>" +
        "<div style='display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; color: " + color + ";'>" +
            "<span>" + icon + " " + status + "</span>" +
            "<span>" + totalPercent.toFixed(0) + "%</span>" +
        "</div>" +
        "<div style='display: flex; align-items: center; min-height: 50px;'>" + bar + "</div>" +
    "</div>");

    if (!baseMet) {
        let open = [];
        if(!p1) open.push(`L (${compBase}/${reqBase})`); if(p2 < 1) open.push("E"); 
        if(!p3) open.push("B"); if(!p4) open.push("E"); if(!p5) open.push("N");
        if (totalPercent >= 100) {
            dv.paragraph("> [!success] **Pillars balanced out by pure Effort!** (Missed: " + open.join(" • ") + ")");
        } else {
            dv.paragraph("> [!caution] **Pending Pillars:** " + open.join(" • "));
        }
    }
})()
```
[^1]

> [!pink] L - Lifestyle / Food  
> > [!quote|flat] ☀️[[2_Areas/1_Selfcare/Plan/AM_Routine|AM_Routine]]
> > - **Selfcare** AM: `INPUT[toggle:selfcare_am]`  
> > - **Journal** AM: `INPUT[toggle:journal_am]` 
> > 	- *Gratitude, Fascinating, Braindump*
> > 	- ✍️ *Better by hand — pen & paper. See [[Journaling Ideas]]*
> > - **Mobility** AM: INPUT[number:mobility_am] min (Yoga, stretching, morning walk)
> > - [ ] 🛏️ Make bed & air out the room
> > - [ ] 🍽️ Empty dishwasher
> > - [ ] 🍵 Make tea
> > - [ ] 🪻 Give Flowers Love
> ### Basics doing
> <%- tp.variables.routineSync.replace(/\n/g, "\n> ") %>
> 
> ```dataviewjs
> // 🔱 START OF CALCULATION (wrapped as a Promise so other blocks can await it)
> window.dailyResonancePromise = (async () => {
>      const c = dv.current();
>      const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
>      let Nexus = null;
>      try { Nexus = await (require(enginePath))(app); } catch(e) {}
> 
>      // 🔱 1. LOAD BASELINE (Parse-Safe Injection)
>      let rawJson = String.raw`<%- tp.variables.nexusJson %>`;
>      let baseData = {};
>      if (rawJson && !rawJson.startsWith("<")) {
>            try { baseData = JSON.parse(rawJson); } catch(e) { console.log("JSON Parse Error", e); }
>      }
> 
>      let totals = {};
>      for(let k in baseData) {
>            let metric = k.replace("nexus_", "");
>            totals[metric] = Number(baseData[k]) || 0;
>      }
> 
>      for(let k in c) {
>            if(k.startsWith("nexus_")) {
>                let metric = k.replace("nexus_", "");
>                totals[metric] = Number(c[k]) || totals[metric] || 0;
>            }
>      }
> 
>      ["kcal", "protein_g", "fat_total_g", "carbs_total_g", "vit_c_mg", "iron_total_mg", "magnesium_mg", "zinc_mg"].forEach(m => {
>            if(totals[m] === undefined) totals[m] = 0;
>      });
> 
>      let mealLog = [];
>      let atomLog = [];
> 
>      // 🔱 2. MEAL MODIFIERS (Spontaneous Add/Remove)
>      const processMeal = async (links, isPlus) => {
>            if(!links) return;
>            let arr = Array.isArray(links) ? links : [links];
>            for(let link of arr) {
>                let pathStr = typeof link === "object" ? link.path : String(link).replace(/[\[\]"]/g, "").split("|")[0].trim();
>                let p = dv.page(pathStr);
>                if(p) { 
>                    let portions = Number(p.portions) || 1;
>                    for(let k in p) {
>                        if(k.startsWith("recipe_")) {
>                            let metric = k.replace("recipe_", "");
>                            if(!totals[metric]) totals[metric] = 0;
>                            totals[metric] += (Number(p[k]) / portions) * (isPlus ? 1 : -1);
>                        }
>                    }
>                    mealLog.push((isPlus ? "➕ 🍱 " : "➖ 🍱 ") + " **" + p.file.name + "**");
>                } else if (Nexus && Nexus.calculate) { 
>                    let v = Nexus.calculate(pathStr, 1);
>                    if(v) {
>                        for(let k in v) {
>                            let metric = k.replace("recipe_", ""); 
>                            if(!totals[metric]) totals[metric] = 0;
>                            totals[metric] += v[k] * (isPlus ? 1 : -1);
>                        }
>                        mealLog.push((isPlus ? "➕ 🍔 " : "➖ 🍔 ") + " **" + (Nexus.find(pathStr)?.label || pathStr) + "**");
>                    }
>                }
>            }
>      };
>      await processMeal(c.meal_spont, true);
>      await processMeal(c.meal_rem, false);
> 
>      // 🔱 3. ATOM MODIFIERS (Alchemy)
>      if (Nexus && Nexus.calculate) {
>            const processAtom = (links, isPlus) => {
>                if(!links) return;
>                let arr = Array.isArray(links) ? links : [links];
>                arr.forEach(entry => {
>                    let [id, amtRaw] = String(entry).split("|");
>                    let amt = Number(amtRaw) || 1;
>                    let v = Nexus.calculate(id, amt);
>                    if(v) {
>                        for(let k in v) {
>                            let metric = k.replace("recipe_", ""); 
>                            if(!totals[metric]) totals[metric] = 0;
>                            totals[metric] += v[k] * (isPlus ? 1 : -1);
>                        }
>                        let _it = Nexus.find(id) || {}; let _u = _it.unit_type;
>                        let _amtShown = (_u === "piece") ? (amt + "×") : (Math.round(amt * 100) + (_u === "100ml" ? "ml" : "g"));
>                        atomLog.push((isPlus ? "➕ 🧪 " : "➖ 🧪 ") + " _" + (_it.label || id) + "_ <small>(" + _amtShown + ")</small>");
>                    }
>                });
>            };
>            processAtom(c.food_add, true);
>            processAtom(c.food_rem, false);
>      }
>      
>      return { totals, mealLog, atomLog };
> })();
> 
> // 🔱 4. VISUAL SYNTHESIS
> const data = await window.dailyResonancePromise;
> 
> if (data.mealLog.length === 0 && data.atomLog.length === 0) {
>      dv.paragraph("_Following baseline plan..._");
> } else {
>      let outHtml = `<div style="display: flex; gap: 30px; flex-wrap: wrap; margin-top: 10px; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px;">`;
>      if (data.mealLog.length > 0) {
>          outHtml += `<div><span style="opacity: 0.7; text-transform: uppercase; font-size: 0.8em; font-weight: bold;">🍔 Spontaneous Meals</span><br>` + data.mealLog.join("<br>") + `</div>`;
>      }
>      if (data.atomLog.length > 0) {
>          outHtml += `<div><span style="opacity: 0.7; text-transform: uppercase; font-size: 0.8em; font-weight: bold;">🧪 Alchemy (Ingredients)</span><br>` + data.atomLog.join("<br>") + `</div>`;
>      }
>      outHtml += `</div>`;
>      dv.paragraph(outHtml);
> }
> ```
> > [!multi-column]
> > > [!blank]
> > > ### 🍽️ Planned Menu (Baseline)
> > > <%- tp.variables.activePlanLink %>
> > > <%- tp.variables.plannedMealsText.replace(/\n/g, "\n> > > ") %>
> > > 
> > > ---
> > > **Actions:** `BUTTON[sync-fridge-meals]` `BUTTON[add-remove-meal]` `BUTTON[add-remove-alchemy]`
> >
> > > [!info] **Live Resonance (Actuals)**
> > > ```dataviewjs
> > > // 🔱 WAITS FOR BLOCK 1 BEFORE STARTING
> > > const data = window.dailyResonancePromise ? await window.dailyResonancePromise : null;
> > > const r = data ? data.totals : { kcal:0, protein_g:0, fat_total_g:0 };
> > > 
> > > const resStr = (r.kcal <= 0) ? "🔥 **0** kcal | 💪 **0**g Pro | 🥑 **0**g Fat" : "🔥 **" + Math.round(r.kcal) + "** kcal | 💪 **" + r.protein_g.toFixed(1) + "**g Pro | 🥑 **" + r.fat_total_g.toFixed(1) + "**g Fat";
> > > let mList = []; 
> > > const gaps = { "protein_g": ["💪 Protein", 100, "g"], "vit_c_mg": ["🍊 Vit C", 100, "mg"], "fiber_g": ["🥦 Fiber", 30, "g"], "omega3_total_mg": ["🐟 Omega-3", 1000, "mg"], "magnesium_mg": ["💎 Magnesium", 350, "mg"], "iron_total_mg": ["🩸 Iron", 15, "mg"], "zinc_mg": ["🛡️ Zinc", 10, "mg"] };
> > > for(let k in gaps){ 
> > >      let cur = r[k] || 0; 
> > >      if(cur < gaps[k][1]) mList.push("**" + gaps[k][0] + ":** " + Math.max(0, cur).toFixed(1) + " / " + gaps[k][1] + gaps[k][2]); 
> > > }
> > > const gapStr = mList.length > 0 ? mList.join("<br>") : "✅ **All molecular baselines stabilized.**";
> > > dv.paragraph(resStr + "\n\n> [!quote] **Molecular Gaps (Action Matrix)**\n> " + gapStr);
> > > ```
>
> > [!quote]- ⏲️ Molecular Timing Guide (Ref)
> > > [!multi-column]
> > >
> > > > [!info]  **🌅 Morning (AM)**
> > > > *Focus: Oxygen & Energy*
> > > > - **Iron + Vit C:** Best on empty stomach.
> > > > - **B-Complex:** Activates metabolism.
> > > > - **Creatine:** Saturation for the day.
> > > > ---
> > > > *🚫 Blocker:* Coffee/Tea (60min gap).
> > >
> > > > [!info]  **☀️ Midday (MID)**
> > > > *Focus: Protection & Lipids*
> > > > - **D3 + K2 + Omega-3:** Needs fat to absorb.
> > > > - **Choline:** Supports midday focus.
> > > > ---
> > > > *🥑 Synergy:* Take with meal for hormone synthesis.
> > >
> > > > [!info] **🌙 Evening (PM)**
> > > > *Focus: Recovery & CNS*
> > > > - **Magnesium:** Relaxes muscles & CNS.
> > > > - **Zinc + Selenium:** Immune & hormone repair.
> > > > - **Glycine:** Lowers core temp for sleep.
>
> ## 🛒 Procurement & Supply
>
> > [!multi-column]
> >
> > > [!info|flat] 🛒 Automated Grocery Sync
> > > ```dataviewjs
> > > const dStr = dv.current().cal_date || dv.current().file.name.substring(0, 10);
> > > const dObj = moment(dStr, "YYYY-MM-DD");
> > > const weekYearG = dObj.format("YYYY");
> > > const weekKwG = dObj.format("WW");
> > > const weeklyRoutinePath = `0_Calendar/7_Plan/${weekYearG}/${dObj.format("MM")}/${weekYearG}-W${weekKwG}_routine.md`;
> > > let rPage = dv.page(weeklyRoutinePath);
> > > if (!rPage) {
> > >     rPage = dv.page("2_Areas/4_Organize/Plan/Routine_Timeblocking.md");
> > > }
> > > 
> > > if (rPage) {
> > >     const dayMap = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
> > >     const todayStr = dObj.isValid() ? dayMap[dObj.day()] : dayMap[moment().day()];
> > >     
> > >     let hasGroceries = false;
> > >     for (let i = 1; i <= 21; i++) {
> > >         let slotVal = rPage[`rt_${todayStr}_${i}`];
> > >         if (!slotVal) continue;
> > >         let arr = Array.isArray(slotVal) ? slotVal : [slotVal];
> > >         for (let v of arr) {
> > >             if (String(v).startsWith("shop_groceries")) hasGroceries = true;
> > >         }
> > >     }
> > >     
> > >     if (hasGroceries) {
> > >         const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateShoppingList.js";
> > >         let generator;
> > >         try { 
> > >             delete require.cache[require.resolve(enginePath)]; 
> > >             generator = require(enginePath); 
> > >             generator(app, dv, moment).then(link => {
> > >                 dv.paragraph(`🛒 **Today is Shopping Day!**<br>Your list is ready:<br>➤ ${link}`);
> > >             });
> > >         } catch(e) { dv.paragraph("🔥 Error loading generator: " + e.message); }
> > >     } else {
> > >         dv.paragraph("_No groceries scheduled for today._");
> > >     }
> > > }
> > > ```
> > > <br>[[2_Areas/4_Organize/Plan/Shopping_Hub|➡️ Open Central Procurement Hub]]
> >
> > > [!todo|flat] 📝 Household & Quick Extras
> > > **Household & Quick Extras:** `BUTTON[add-shopping-extra]`
> > > `VIEW[{shopping_extras}]`

> [!pink] E - Emotions
> >[!multi-column]
> > 
> > > [!journal] **Resonance Radar:** 
> > > Mood: <%- mood %> / 5 <%- mM[mood] || "⚪" %> 
> > > 
> > > ```dataviewjs
> > > const tFile = app.vault.getAbstractFileByPath(dv.current().file.path);
> > > const currentEnergy = dv.current().energy || "3";
> > > const eMap = {"5":"🔱 Amazing", "4":"🔋 High", "3":"🙂 Medium", "2":"🪫 Low", "1":"⭕ Empty"};
> > > 
> > > // Create the container for the interface element
> > > const container = dv.container.createEl("div", { style: "font-size: 0.85em; font-family: var(--font-interface);" });
> > > 
> > > // Label and status-text element
> > > const label = container.createEl("small", { text: "⚡ Energy Level: ", style: "opacity: 0.8;" });
> > > const statusText = container.createEl("span", { 
> > >     text: eMap[String(currentEnergy)] || currentEnergy, 
> > >     style: "font-weight: bold; margin-left: 4px;" 
> > > });
> > > 
> > > container.createEl("br");
> > > 
> > > // The HTML slider (input type='range')
> > > const slider = container.createEl("input", {
> > >     type: "range",
> > >     attr: { min: "1", max: "5", value: String(currentEnergy), step: "1" },
> > >     style: "width: 100%; max-width: 150px; margin-top: 6px; cursor: pointer;"
> > > });
> > > 
> > > // Event listener for interactions
> > > slider.addEventListener("input", async (e) => {
> > >     const val = e.target.value;
> > >     statusText.innerText = eMap[val] || val;
> > >     
> > >     // Writes the value straight back into the current file's YAML frontmatter
> > >     await app.fileManager.processFrontMatter(tFile, (fm) => {
> > >         fm["energy"] = Number(val);
> > >     });
> > > });
> > >```

>[!pink] ## B - Body / Movement
> > [!multi-column]
> > > [!blank]
> > > ```dataviewjs
> > > const c = dv.current();
> > > const am = Number(c["mobility_am"]) || 0;
> > > const pm = Number(c["mobility_pm"]) || 0;
> > > const act = Number(c["activity_time"]) || 0;
> > > const gesamt = am + pm + act;
> > > const ziel = 30;
> > > 
> > > let icon = "⚪"; let flair = "";
> > > if (gesamt >= 90) { icon = "🦅"; flair = " PHOENIX RUN"; }
> > > else if (gesamt >= 60) { icon = "✨"; flair = " SHINE"; }
> > > else if (gesamt >= ziel) { icon = "🟢"; }
> > > else if (gesamt > 0) { icon = "🟡"; }
> > > 
> > > dv.paragraph(`🏃🏽 **Status:** ${gesamt} /${ziel} min ${icon}${flair}`);
> > > ```
> > 
> > > [!blank]
> > > **Today's Training:**
> > > <%- tp.variables.fitnessSync.trim().replace(/\n/g, '\n> > > ') %>
> > > ---
> > > <%- tp.variables.fitnessLinkMd %>
> > > 
> > > ➤ `BUTTON[snapshot-week-fitness]`

> [!pink] E - Entropy / Relaxation
> >[!multi-column]
> > 
> > > [!blank]
> > > **Spontaneous / Free Blocks (Today)**
> > > ```dataviewjs
> > > const dStr = dv.current().file.name.substring(0, 10);
> > > const dayMap = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
> > > const dObj = moment(dStr, "YYYY-MM-DD");
> > > const todayStr = dObj.isValid() ? dayMap[dObj.day()] : dayMap[moment().day()];
> > > 
> > > const weekName = dObj.isValid() ? dObj.format("YYYY-[W]WW") : moment().format("YYYY-[W]WW");
> > > let rPage = dv.pages('"0_Calendar/7_Plan"').where(p => p.file.name === weekName + "_routine").first();
> > > if (!rPage) rPage = dv.page("2_Areas/4_Organize/Plan/Routine_Timeblocking"); // Fallback to main routine
> > > if (rPage) {
> > >     const rStart = rPage.rt_start || "07:00";
> > >     const rDur = Number(rPage.rt_duration) || 60;
> > >     const rTotal = Number(rPage.rt_periods) || 14;
> > >     
> > >     let current = moment(rStart, ["HH:mm", "h:mm A", "h:mma"]);
> > >     let freeBlocks = [];
> > >     
> > >     const breaksStr = String(rPage.rt_breaks || "");
> > >     const customBreaks = {};
> > >     if (breaksStr) {
> > >         breaksStr.split(",").forEach(b => {
> > >             let parts = b.split(":");
> > >             if(parts.length === 2) customBreaks[parseInt(parts[0].trim())] = parseInt(parts[1].trim());
> > >         });
> > >     }
> > > 
> > >     const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
> > >     let eng = null; try { eng = require(enginePath)(); } catch(e){}
> > >     const relaxedKeys = ["social", "rest", "meditation", "plants", "entertain"];
> > > 
> > >     for (let i = 1; i <= rTotal; i++) {
> > >         let end = moment(current).add(rDur, 'minutes');
> > >         let key = `rt_${todayStr}_${i}`;
> > >         let val = rPage[key];
> > >         
> > >         if (!val || val === "free") {
> > >             freeBlocks.push(`- **${current.format("HH:mm")} - ${end.format("HH:mm")}** (Block ${i})`);
> > >         } else if (String(val).startsWith("custom|")) {
> > >             freeBlocks.push(`- **${current.format("HH:mm")} - ${end.format("HH:mm")}**: 🔸 _${String(val).split("|")[1]}_`);
> > >         } else {
> > >             let base = String(val).split("|")[0];
> > >             if (relaxedKeys.includes(base)) {
> > >                 let lbl = (eng && eng.all && eng.all[base]) ? eng.all[base].icon + " " + eng.all[base].label : base;
> > >                 freeBlocks.push(`- **${current.format("HH:mm")} - ${end.format("HH:mm")}**: ${lbl}`);
> > >             }
> > >         }
> > >         
> > >         current = end;
> > >         if (customBreaks[i] && i !== rTotal) {
> > >             current.add(customBreaks[i], 'minutes');
> > >         }
> > >     }
> > >     if (freeBlocks.length > 0) {
> > >         dv.paragraph(freeBlocks.join("\n"));
> > >     } else {
> > >         dv.paragraph("_No free blocks available today._");
> > >     }
> > > } else {
> > >     dv.paragraph("_Routine plan not found._");
> > > }
> > > ```
> > > `BUTTON[edit-routine]`
> > > 
> > > ---
> > > **Active Enjoyment**
> > > > [!blank]
> > > > **🏃🏽‍♀️ Activity (Spontaneous Sports)**
> > > > Take a walk, play basketball, etc.
> > > > `INPUT[inlineListSuggester(option(Walk), option(Run), option(Basketball), option(Swim), option(Cycling), option(Climbing), option(Yoga), option(Dance), option(Hike), option(Tennis)):activity_link]` ⏱️ Duration: `INPUT[number:activity_time]` min
> > > > 
> > > > **🎨 Creativity**
> > > > Painting/Drawing, Crafting, etc.
> > > > `INPUT[inlineList:creativity_link]`
> > > > 
> > > > 🎸 **Instrument Practice**
> > > > ```dataviewjs
> > > > const c = dv.current();
> > > > const mMin = Number(c["inpra_min"]) || 0;
> > > > const mZiel = 10;
> > > > let mIcon = "⚪"; let mFlair = "";
> > > > if (mMin >= 30) { mIcon = "🔥"; mFlair = " VIRTUOSO"; }
> > > > else if (mMin >= mZiel) { mIcon = "🟢"; }
> > > > else if (mMin > 0) { mIcon = "🟡"; }
> > > > dv.paragraph(`🎸 **Status:** ${mMin} /${mZiel} min ${mIcon}${mFlair}`);
> > > > ```
> > > > ➤ `INPUT[number:inpra_min]` min
> > > > 
> > > > **Today's Setup:**
> > > > <%- tp.variables.inpraSync.trim().replace(/\n/g, '\n> > > > ') %>
> > > > ---
> > > > <%- tp.variables.inpraLinkMd %>
> 
> > [!quote|flat] 📺 Entertainment (Passive)
> > *Unplug & Consume: Gaming, Movies, Series, etc.*
> > `INPUT[inlineList:entertain_link]`
> > 
> > ```dataviewjs
> > // 📺 NEXUS CONSUMPTION MONITOR
> > // Scans your entertainment folders and shows the 3 most recently updated entries
> > const sources = ['6_Resources/Films', '6_Resources/Series', '6_Resources/Games'];
> > const pages = dv.pages(sources.map(s => `"${s}"`).join(" or "));
> > 
> > const recent = pages
> >     .sort(p => p.file.mday, 'desc') // Sorted by last modified date
> >     .limit(3);
> > 
> > if (recent.length > 0) {
> >     dv.table(
> >         ["Title", "Type", "Last Update"],
> >         recent.map(p => [
> >             p.file.link, 
> >             p.file.folder.split('/').pop(), // Shows whether it's a film, series or game
> >             p.file.mday.toFormat("yyyy-MM-dd")
> >         ])
> >     );
> > } else {
> >     dv.paragraph("_No recent entertainment activity found._");
> > }
> > ```
> > 
> 
> > **Action:** `BUTTON[add-entropy]`

> [!pink] N - Night / Sleep
> > [!quote|flat] 🌙 [[2_Areas/1_Selfcare/Plan/PM_Routine|PM_Routine]]
> > - **Selfcare** PM: `INPUT[toggle:selfcare_pm]`
> > - **Journal** PM: `INPUT[toggle:journal_pm]` 
> > 	- *Gratitude, Fascinating, Braindump*
> > 	- ✍️ *Better by hand — pen & paper. See [[Journaling Ideas]]*
> > - **Mobility** PM: INPUT[number:mobility_pm] min (Evening stretches, relaxation)
> > - [ ] 🍽️ Load & start dishwasher
> > - [ ] 🗑️ Check trash & take out if needed
> > - [ ] 🛋️ 5-Minute Reset (clear tables & surfaces)
> > - [ ] 📱 Plug in devices & switch to offline mode

> 
> - **Sleep:** <%- schlaf %>h `$= Number(<%- schlaf %>) >= 7 ? "🟢" : "🔴"`

```dataviewjs
const c = dv.current();
const base = app.vault.adapter.basePath;
let engine = null; try { engine = require(base + "/zData/2scripts/routineEngine.js")(); } catch(e) {}
if (engine && engine.renderChakraColumns) {
  const actual = engine.getActualChakraMinutes(c);
  const chakras = [
    {g:"1. Root", icon:"❤️", col:"239,83,80"},
    {g:"2. Sacral", icon:"🧡", col:"255,152,0"},
    {g:"3. Solar Plexus", icon:"💛", col:"255,213,0"},
    {g:"4. Heart", icon:"💚", col:"102,187,106"},
    {g:"5. Throat", icon:"💙", col:"41,182,246"},
    {g:"6. Third Eye", icon:"💜", col:"171,71,188"},
    {g:"7. Crown", icon:"🤍", col:"236,64,122"},
  ];
  const rows = chakras.map(ch => ({ icon: ch.icon, col: ch.col, ist: actual[ch.g] || 0 }));
  dv.paragraph(`<small style="opacity:0.55;">🌈 Chakra time today</small>`);
  dv.paragraph(engine.renderChakraColumns(rows));
}
```




[^1]: L-E-B-E-N by Birkenbihl

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
