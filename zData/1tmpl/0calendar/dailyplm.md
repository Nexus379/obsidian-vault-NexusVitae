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
    // Manual Fallback: Filter placeholders, "plm" and the date
    cleanPart = currentFileTitle.replace(/Entry-\d{2}-\d{2}/i, "")
                                .replace(untitledPattern, "")
                                .replace(new RegExp(defaultName, "i"), "")
                                .replace(/^\d{4}-\d{2}-\d{2}/, "")
                                .replace(/plm/i, "")
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
const planPath = "2_Areas/1_Selfcare/Nutrition/Meal_Plan.md";
const planPage = dv.page(planPath);
const dayPrefix = moment(dateStr).locale('en').format("ddd").toLowerCase(); // e.g. 'mon'

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
    tp.variables.plannedMealsText = "> > > _No Meal Plan found._";
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

// 🔱 6. FINAL LOGISTICS (Folder-Check & Move)
const [y, m] = dateStr.split("-");
const targetFolder = `0_Calendar/1_PLM/${y}/${m}`;
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
area2: ["1_Selfcare"]
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
fitness_am: 0
fitness_pm: 0
selfcare_am: false
selfcare_pm: false
meal: []
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
// 🔱 3. DYNAMISCHE LINKS ZU DEN ANDEREN LOGS
const todayPPM = `0_Calendar/2_PPM/${year}/${month}/${dateStr} ppm`;
const todayPKM = `0_Calendar/3_PKM/${year}/${month}/${dateStr} pkm`;
const displayTitle = pureFocus || "Daily Journal";
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
> > > <small style="opacity:0.5;">Days remaining: `$= Math.max(0,30 - moment().diff(moment(dv.current().focusM_start),"days"))` · Start: `$= dv.current().focusM_start ?? ""`</small>
> > > 
> > > `BUTTON[reset-focus]`

> [!quote|flat] ☀️ AM Protocol
> - [ ] 🧘🏽‍♀️ Yoga (Stretching)
> - [ ] 🛏️ Make bed & air out the room
> - [ ] 🍽️ Empty dishwasher
> - [ ] ☕ Make coffee / tea
> - [ ] 💊 Vitamins / Supplements

## 🌿Consuetudo
```dataviewjs
(function(){ 
    const c = dv.current(); 
    const v = dv.page("zData/4values/VitaminTracker.md"); 
    
    // --- 1. DATA SYNC ---
    const dateValue = c["cal_date"] ? moment(String(c["cal_date"])) : moment(c.file.name, "YYYY-MM-DD");

    // --- 2. THE 5 PILLARS (L-E-B-E-N) ---
    const vitaminTasks = (v && v.file.tasks) ? v.file.tasks : [];
    const isAlchemy = (t) => String(t.section).includes("Alchemy") || String(t.section).includes("Alchemy");
    
    // P1: Lifestyle (Food) - 75% of Bold Tasks
    const baseTasks = vitaminTasks.filter(t => !isAlchemy(t) && String(t.text).includes("**"));
    const compBase = baseTasks.filter(t => t.completed).length;
    const reqBase = Math.floor(baseTasks.length * 0.75);
    const p1 = (compBase >= reqBase && baseTasks.length > 0) ? 1 : 0;

    // P2: Emotions (4/4 Toggles)
    const p2 = ["journal_am","journal_pm","selfcare_am","selfcare_pm"].filter(k => String(c[k]) === "true").length / 4;
    
    // P3: Body (>= 30 Min)
    const sport = (Number(c["fitness_am"]) || 0) + (Number(c["fitness_pm"]) || 0);
    const p3 = sport >= 30 ? 1 : 0;
    
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
    if (sport >= 45) bonus += 5;
    if (sport >= 60) bonus += 5;
    if (Number(c.mood) >= 4) bonus += 5;
    if (Number(c.energy) >= 4) bonus += 5;
    const compAlchemy = vitaminTasks.filter(t => isAlchemy(t) && t.completed).length;
    bonus += (compAlchemy * 2.5); // Bio-Hacks

    // 🔱 THE CAP (Max 120%)
    const totalPercent = Math.min(basePercent + bonus, 120);

    // --- 4. VISUAL EVOLUTION (Strict Logic) ---
    let icon = "🌸"; let status = "BUILDING FOUNDATION"; let color = "var(--text-faint)";

    if (baseMet) {
        icon = "💖"; status = "SYNC COMPLETE"; color = "var(--interactive-accent)";
        if (totalPercent >= 110) { icon = "🔥"; status = "OVERCHARGE"; color = "#ff7b00"; }
        if (totalPercent >= 120) { icon = "🐦‍🔥"; status = "PHOENIX ASCENSION"; color = "#ff4500"; }
    } else if (totalPercent >= 100) {
        status = "BASICS PENDING"; 
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
    if (baseMet && totalPercent >= 110 && totalPercent < 120) bar += `<span style='${sFire}'>🔥</span>`;
    if (baseMet && totalPercent >= 120) bar += `<span style='${sPhoenix}'>🐦‍🔥</span>`;

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
        dv.paragraph("> [!caution] **Pending Pillars:** " + open.join(" • "));
    }
})()
```
[^1]

> [!pink] L - Lifestyle / Food  
> ```dataviewjs
> const c = dv.current();
> const enginePath = app.vault.adapter.basePath + "/zData/2scripts/itemsNexusEngine.js";
> let Nexus = null;
> try { Nexus = await (require(enginePath))(app); } catch(e) {}
> 
> // 🔱 1. LOAD BASELINE (Parse-Safe Injection)
> let rawJson = `{}`;
> let baseData = {};
> if (rawJson && !rawJson.startsWith("<")) {
>      try { baseData = JSON.parse(rawJson); } catch(e) { console.log("JSON Parse Error", e); }
> }
> 
> let totals = {};
> for(let k in baseData) {
>      let metric = k.replace("nexus_", "");
>      totals[metric] = Number(baseData[k]) || 0;
> }
> 
> for(let k in c) {
>      if(k.startsWith("nexus_")) {
>          let metric = k.replace("nexus_", "");
>          totals[metric] = Number(c[k]) || totals[metric] || 0;
>      }
> }
> 
> ["kcal", "protein_g", "fat_total_g", "carbs_total_g", "vit_c_mg", "iron_total_mg", "magnesium_mg", "zinc_mg"].forEach(m => {
>      if(totals[m] === undefined) totals[m] = 0;
> });
> 
> let mealLog = [];
> let atomLog = [];
> 
> // 🔱 2. MEAL MODIFIERS (Spontaneous Add/Remove)
> const processMeal = async (links, isPlus) => {
>      if(!links) return;
>      let arr = Array.isArray(links) ? links : [links];
>      for(let link of arr) {
>          let pathStr = typeof link === "object" ? link.path : String(link).replace(/[\[\]"]/g, "").split("|")[0].trim();
>          let p = dv.page(pathStr);
>          if(p) { 
>              let portions = Number(p.portions) || 1;
>              for(let k in p) {
>                  if(k.startsWith("recipe_")) {
>                      let metric = k.replace("recipe_", "");
>                      if(!totals[metric]) totals[metric] = 0;
>                      totals[metric] += (Number(p[k]) / portions) * (isPlus ? 1 : -1);
>                  }
>              }
>              mealLog.push((isPlus ? "➕ 🍱 " : "➖ 🍱 ") + " **" + p.file.name + "**");
>          } else if (Nexus && Nexus.calculate) { 
>              let v = Nexus.calculate(pathStr, 1);
>              if(v) {
>                  for(let k in v) {
>                      let metric = k.replace("recipe_", ""); 
>                      if(!totals[metric]) totals[metric] = 0;
>                      totals[metric] += v[k] * (isPlus ? 1 : -1);
>                  }
>                  mealLog.push((isPlus ? "➕ 🍔 " : "➖ 🍔 ") + " **" + (Nexus.find(pathStr)?.label || pathStr) + "**");
>              }
>          }
>      }
> };
> await processMeal(c.meal_spont, true);
> await processMeal(c.meal_rem, false);
> 
> // 🔱 3. ATOM MODIFIERS (Alchemy)
> if (Nexus && Nexus.calculate) {
>      const processAtom = (links, isPlus) => {
>          if(!links) return;
>          let arr = Array.isArray(links) ? links : [links];
>          arr.forEach(id => {
>              let v = Nexus.calculate(id, 1);
>              if(v) {
>                  for(let k in v) {
>                      let metric = k.replace("recipe_", ""); 
>                      if(!totals[metric]) totals[metric] = 0;
>                      totals[metric] += v[k] * (isPlus ? 1 : -1);
>                  }
>                  atomLog.push((isPlus ? "➕ 🧪 " : "➖ 🧪 ") + " _" + (Nexus.find(id)?.label || id) + "_");
>              }
>          });
>      };
>      processAtom(c.food_add, true);
>      processAtom(c.food_rem, false);
> }
> 
> window.dailyResonance = totals;
> 
> // 🔱 4. VISUAL SYNTHESIS
> if (mealLog.length === 0 && atomLog.length === 0) {
>      dv.paragraph("_Following baseline plan..._");
> } else {
>      let outHtml = `<div style="display: flex; gap: 30px; flex-wrap: wrap; margin-top: 10px; padding: 10px; background: var(--background-secondary-alt); border-radius: 8px;">`;
>      if (mealLog.length > 0) {
>          outHtml += `<div><span style="opacity: 0.7; text-transform: uppercase; font-size: 0.8em; font-weight: bold;">🍔 Spontaneous Meals</span><br>` + mealLog.join("<br>") + `</div>`;
>      }
>      if (atomLog.length > 0) {
>          outHtml += `<div><span style="opacity: 0.7; text-transform: uppercase; font-size: 0.8em; font-weight: bold;">🧪 Alchemy (Ingredients)</span><br>` + atomLog.join("<br>") + `</div>`;
>      }
>      outHtml += `</div>`;
>      dv.paragraph(outHtml);
> }
> ```
> > [!multi-column]
> > > [!blank]
> > > ### 🍽️ Planned Menu (Baseline)
> > > - **🌅 Breakfast**
> > >   - _empty_
> > > - **🍱 Bento**
> > >   - _empty_
> > > - **🥗 Lunch**
> > >   - _empty_
> > > - **🍎 Snack**
> > >   - _empty_
> > > - **🌙 Dinner**
> > >   - _empty_
> > > 
> > > ---
> > > **Actions:** `BUTTON[add-remove-meal]` `BUTTON[add-remove-alchemy]`
> >
> > > [!info] **Live Resonance (Actuals)**
> > > ```dataviewjs
> > > const r = window.dailyResonance || { kcal:0, protein_g:0, fat_total_g:0 };
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

> [!pink] E - Emotions
> >[!multi-column]
> > > [!journal]
> > > - **Journaling:**
> > > - AM: `INPUT[toggle:journal_am]` |  PM: `INPUT[toggle:journal_pm]` 
> > > - *Gratitude, Fascinating, Braindump*
> > 
> > > [!journal] **Resonance Radar:** > > > -  Mood: <%- mood %> / 5 <%- mM[mood] || "⚪" %> 
> > > - Energy: <%- energy %> / 5 <%- eM[energy] || "⚪" %>

>[!pink] B - Body / Movement
> > [!multi-column]
> > > [!blank]
> > > **Fitness:**
> > > 
> > > AM: `INPUT[number:fitness_am]`
> > > 
> > > PM: `INPUT[number:fitness_pm]`
> >  
> > > [!blank]
> > > ```dataviewjs
> > > const c = dv.current();
> > > const am = Number(c["fitness_am"]) || 0;
> > > const pm = Number(c["fitness_pm"]) || 0;
> > > const gesamt = am + pm;
> > > const ziel = 30;
> > > 
> > > let icon = "⚪";
> > > let flair = "";
> > > 
> > > if (gesamt >= 90) { icon = "🦅"; flair = " PHOENIX RUN"; }
> > > else if (gesamt >= 60) { icon = "✨"; flair = " SHINE"; }
> > > else if (gesamt >= ziel) { icon = "🟢"; }
> > > else if (gesamt > 0) { icon = "🟡"; }
> > > 
> > > dv.paragraph(`🏃🏽 **Status:** ${gesamt} / ${ziel} min ${icon}${flair}`);
> > > ```

>[!pink] E - Entropie / Relaxation
> >[!multi-column]
> > > [!blank]
> > > **Selfcare**
> > > >[!blank]
> > > > AM: `INPUT[toggle:selfcare_am]`   |  PM: `INPUT[toggle:selfcare_pm]`
> > 
> > > [!blank]
> > > **Enjoy**
> > > > [!blank]
> > > > `BUTTON[add-entropy]` `INPUT[inlineList:entropy_link]`
> > > Activities/Creativity/Entertainment

> [!pink] N - Night / Sleep
> - **Sleep:** <%- schlaf %>h `$= Number(<%- schlaf %>) >= 7 ? "🟢" : "🔴"`

> [!quote|flat] 🌙 PM Protocol
> - [ ] 🍽️ Load & start dishwasher
> - [ ] 🗑️ Check trash & take out if needed
> - [ ] 🛋️ 5-Minute Reset (clear tables & surfaces)
> - [ ] 📱 Plug in devices & switch to offline mode

---
`BUTTON[freezer]`


<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>


[^1]: L-E-B-E-N von Birkenbihl
