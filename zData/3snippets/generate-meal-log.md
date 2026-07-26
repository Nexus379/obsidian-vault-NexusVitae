<%-*
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateMealLog.js";
let generator;
try {
    delete require.cache[require.resolve(enginePath)];
    generator = require(enginePath);
    let dv = app.plugins.plugins["dataview"].api;
    const link = await generator(app, dv, moment);
    if (link) {
        new Notice("🍱 Meal Log ready!");
    } else {
        new Notice("🍽️ Cancelled or invalid date.");
    }
} catch(e) {
    new Notice("🔥 Error generating meal log: " + e.message, 10000);
}
-%>
