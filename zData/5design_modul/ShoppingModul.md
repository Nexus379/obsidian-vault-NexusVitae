
```dataviewjs
// 🔱 NEXUS CENTRAL SHOPPING HUB (English & Extended)
const p = dv.current(); // Die Einkaufsliste selbst
const plan = dv.page("2-Areas/1-Selfcare/Nutrition/Ernährungsplan.md");
const j = dv.page(moment().format("YYYY-MM-DD") + " jou"); 

const dayKeys = ["sun-meals", "mon-meals", "tue-meals", "wed-meals", "thu-meals", "fri-meals", "sat-meals"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayIdx = moment().day();

// 1. ⚡ HOUSEHOLD & MANUAL EXTRAS
dv.header(2, "📦 Household & Manual Extras");
let extras = [];

// A. Direkt aus dieser Datei (Einkaufsliste.md)
if (p["shopping-extras"]) {
    p["shopping-extras"].forEach(item => extras.push(`- [ ] 📦 ${item}`));
}

// B. Spontane Mahlzeiten aus dem heutigen Journal (Falls vorhanden)
if (j && j["spont-meals"]) {
    j["spont-meals"].forEach(m => extras.push(`- [ ] 🍎 ${m.path.split("/").pop().replace(".md", "")} (Spontaneous)`));
}
dv.paragraph(extras.join("\n") || "_No extra items listed._");

// 2. 📅 NUTRITION SUPPLY (3-Day Window)
dv.header(2, "📅 Nutrition Supply (3-Day Window)");
[0, 1, 2].forEach(offset => {
    const idx = (todayIdx + offset) % 7;
    const key = dayKeys[idx];
    const name = dayNames[idx];
    
    let dailySum = {};
    if (plan && plan[key]) {
        plan[key].forEach(mLink => {
            const recipe = dv.page(mLink.path);
            if (recipe && recipe.ingredients) {
                const amts = String(recipe.amounts || "1").split(",").map(a => parseFloat(a) || 1);
                recipe.ingredients.forEach((ing, i) => {
                    const ingName = ing.path.split("/").pop().replace(".md", "");
                    dailySum[ingName] = (dailySum[ingName] || 0) + ((amts[i] || 1) * 100);
                });
            }
        });
    }

    const label = offset === 0 ? "📍 Today (" + name + ")" : (offset === 1 ? "🌅 Tomorrow (" + name + ")" : "📅 Day After (" + name + ")");
    dv.header(3, label);
    let list = [];
    for (let it in dailySum) {
        list.push(`- [ ] 🛒 ${it} (${dailySum[it].toFixed(0)}g)`);
    }
    dv.paragraph(list.join("\n") || "_No nutrition plan._");
});

// 3. DYNAMIC NAVIGATION
const today = moment();
const logPath = `0-Calendar/2-Log/${today.format("YYYY")}/${today.format("MM")}/${today.format("YYYY-MM-DD")} log`;
dv.paragraph(`--- \n [[${logPath}|🔙 Back to Today's Log]]`);
```

