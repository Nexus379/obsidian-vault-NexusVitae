<%-*
/**
 * 🔄 NEXUS FRIDGE SYNC (Leftovers & Reality)
 */
const dv = app.plugins.plugins.dataview?.api;
if (!dv) {
    new Notice("Dataview API not found!");
    return;
}

const planPage = dv.page("2_Areas/1_Selfcare/Nutrition/Meal_Plan.md");
if (!planPage) {
    new Notice("Meal Plan not found!");
    return;
}

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const todayStr = days[moment().day()];
const slots = ["brk", "ben", "lun", "snk", "eve"];

let todaysMeals = [];

for (let slot of slots) {
    let meals = planPage[`${todayStr}_${slot}`];
    if (!meals) continue;
    let mealArray = Array.isArray(meals) ? meals : [meals];
    for (let m of mealArray) {
        if (!m) continue;
        let linkStr = (typeof m === "object" && m.path) ? m.path : String(m);
        const cleanPath = linkStr.replace(/[\[\]"]/g, "").split("|")[0].trim();
        const rPage = dv.page(cleanPath);
        if (rPage && cleanPath.includes("Recipes")) { 
            todaysMeals.push({ path: rPage.file.path, name: rPage.file.name, page: rPage });
        }
    }
}

if (todaysMeals.length === 0) {
    new Notice("No recipes planned for today.");
    return;
}

for (let meal of todaysMeals) {
    const options = [
        { display: "🟢 Cooked as planned (Ate 1 portion)", action: "cook_standard" },
        { display: "👥 Cooked (Custom portions eaten)", action: "cook_custom" },
        { display: "🧊 Ate leftovers from fridge", action: "eat_leftover" },
        { display: "❌ Skipped (Remove from macros)", action: "skip" }
    ];
    
    const choice = await tp.system.suggester(options.map(o => o.display), options, false, `What happened today with: ${meal.name}?`);
    if (!choice) continue;

    const file = app.vault.getAbstractFileByPath(meal.path);
    if (!file) {
        console.error("File not found: ", meal.path);
        continue;
    }

    const yieldTotal = Number(meal.page.portions) || 1;
    let currentStored = Number(meal.page.portions_stored) || 0;

    if (choice.action === "cook_standard") {
        let newStored = Math.max(0, yieldTotal - 1);
        await app.fileManager.processFrontMatter(file, (fm) => {
            fm.portions_stored = newStored;
            fm.prep_date = moment().format("YYYY-MM-DD");
        });
        new Notice(`🍳 ${meal.name}: Fridge updated to ${newStored} portions.`);
    } 
    else if (choice.action === "cook_custom") {
        let eaten = await tp.system.prompt(`Recipe yields ${yieldTotal} portions. How many did you eat JUST NOW?`, "2");
        eaten = Number(eaten);
        if (!isNaN(eaten)) {
            let newStored = Math.max(0, yieldTotal - eaten);
            await app.fileManager.processFrontMatter(file, (fm) => {
                fm.portions_stored = newStored;
                fm.prep_date = moment().format("YYYY-MM-DD");
            });
            new Notice(`🍳 ${meal.name}: Fridge updated to ${newStored} portions.`);
        }
    }
    else if (choice.action === "eat_leftover") {
        let eaten = await tp.system.prompt(`${currentStored} portions in fridge. How many did you eat?`, "1");
        eaten = Number(eaten);
        if (!isNaN(eaten)) {
            let newStored = Math.max(0, currentStored - eaten);
            await app.fileManager.processFrontMatter(file, (fm) => {
                fm.portions_stored = newStored;
            });
            new Notice(`🧊 ${meal.name}: Fridge leftovers decreased to ${newStored}.`);
        }
    }
    else if (choice.action === "skip") {
        const dailyFile = tp.config.active_file;
        if (dailyFile) {
            await app.fileManager.processFrontMatter(dailyFile, (fm) => {
                if (!fm.meal_rem) fm.meal_rem = [];
                if (!Array.isArray(fm.meal_rem)) fm.meal_rem = [fm.meal_rem];
                let link = `[[${meal.path}|${meal.name}]]`; 
                if (!fm.meal_rem.includes(link)) {
                    fm.meal_rem.push(link);
                }
            });
            new Notice(`❌ ${meal.name} removed from today's macros.`);
        }
    }
}
-%>
