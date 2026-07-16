<%-*
/**
 * 🏋️ NEXUS FITNESS SYNC (Actuals Tracker & Backsync)
 * 1. Reads the plan from the Weekly Fitness Template
 * 2. Asks for actual execution (Sets/Minutes)
 * 3. Backsyncs the data to the Weekly Plan and Daily PLM
 */

const dv = app.plugins.plugins.dataview?.api;
if (!dv) {
    new Notice("Dataview API not found!");
    return;
}

const dailyFile = tp.config.active_file;
if (!dailyFile) {
    new Notice("No active daily file found!");
    return;
}

// 1. Calculate Day & Week from filename (e.g. "2026-07-03")
const dateStr = dailyFile.basename.substring(0, 10);
const m = moment(dateStr, "YYYY-MM-DD");
if (!m.isValid()) {
    new Notice("Could not parse date from filename.");
    return;
}

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const dayPrefix = days[m.day()]; // "mon", "tue", etc.

let kw = m.format("YYYY-[W]WW");
// ISO week edge case logic (if sunday, sometimes it's grouped differently, but let's stick to simple ISO)
if (m.day() === 0) {
    kw = m.clone().add(1, 'days').format("YYYY-[W]WW"); 
}

const year = kw.split("-")[0];

// 2. Locate the Weekly Fitness Plan
const planPages = dv.pages('"0_Calendar/7_Plan/Fitness/Weekly"').where(p => p.plan_kw === kw.split("W")[1] && p.plan_year === year);
if (planPages.length === 0) {
    new Notice(`No Fitness Plan found for ${kw}! Please create one via the Calendar Menu.`);
    return;
}

const planPage = planPages.first();
const planFile = app.vault.getAbstractFileByPath(planPage.file.path);

if (!planFile) {
    new Notice("Could not load the Weekly Fitness file.");
    return;
}

// 3. Extract today's planned workout
const plannedWorkout = planPage[`${dayPrefix}_plan`];

if (!plannedWorkout || String(plannedWorkout).trim() === "") {
    const isSpontaneous = await tp.system.prompt("No workout planned for today. Did you do a spontaneous one? (Enter exercise/minutes or leave empty)", "");
    if (!isSpontaneous) return;
    
    // Spontaneous Logging
    const actuals = await tp.system.prompt(`How many sets/minutes for '${isSpontaneous}'?`, "30");
    const numActuals = Number(actuals);
    if (!isNaN(numActuals)) {
        await app.fileManager.processFrontMatter(planFile, (fm) => {
            fm[`${dayPrefix}_plan`] = `(Spontaneous) ${isSpontaneous}`;
            fm[`${dayPrefix}_act`] = numActuals;
        });
        await app.fileManager.processFrontMatter(dailyFile, (fm) => {
            fm["mobility_pm"] = (Number(fm["mobility_pm"]) || 0) + numActuals;
        });
        new Notice(`💪 Spontaneous Workout synced: ${isSpontaneous} (${numActuals})`);
    }
    return;
}

// 4. Prompt for Actuals
const options = [
    { display: `✅ Completed as planned: ${plannedWorkout}`, value: "completed" },
    { display: `⚖️ Partially completed or modified`, value: "modified" },
    { display: `❌ Skipped (Rest day)`, value: "skipped" }
];

const choice = await tp.system.suggester(options.map(o => o.display), options, false, `How did your workout go today?\nPlan: ${plannedWorkout}`);
if (!choice) return;

let finalActuals = 0;

if (choice.value === "completed") {
    const input = await tp.system.prompt(`Great job! How many Sets/Minutes did you do total?`, "45");
    finalActuals = Number(input) || 0;
} else if (choice.value === "modified") {
    const modPlan = await tp.system.prompt("What did you do instead?", plannedWorkout);
    const input = await tp.system.prompt(`How many Sets/Minutes for '${modPlan}'?`, "20");
    finalActuals = Number(input) || 0;
    
    if (modPlan && modPlan !== plannedWorkout) {
        await app.fileManager.processFrontMatter(planFile, (fm) => {
            fm[`${dayPrefix}_plan`] = `(Mod) ${modPlan}`;
        });
    }
} else if (choice.value === "skipped") {
    finalActuals = 0;
}

// 5. Backsync to Weekly Plan and Daily PLM
if (choice.value !== "skipped" || finalActuals > 0) {
    await app.fileManager.processFrontMatter(planFile, (fm) => {
        fm[`${dayPrefix}_act`] = finalActuals;
    });
    
    await app.fileManager.processFrontMatter(dailyFile, (fm) => {
        fm["mobility_pm"] = (Number(fm["mobility_pm"]) || 0) + finalActuals;
    });
    
    new Notice(`🏋️ Workout synced to ${kw}! (${finalActuals} units)`);
} else {
    await app.fileManager.processFrontMatter(planFile, (fm) => {
        fm[`${dayPrefix}_act`] = 0;
        fm[`${dayPrefix}_plan`] = `(Skipped) ${plannedWorkout}`;
    });
    new Notice(`💤 Rest Day synced to ${kw}.`);
}
-%>
