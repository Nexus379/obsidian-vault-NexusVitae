<%-*
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateWorkoutLog.js";
let generator;
try { 
    delete require.cache[require.resolve(enginePath)]; 
    generator = require(enginePath); 
    let dv = app.plugins.plugins["dataview"].api;
    let link = await generator(app, dv, moment);
    if (link) {
        new Notice("🏋️‍♂️ Workout Log Generated!");
    } else {
        new Notice("🧘 No workout scheduled for that day (Rest Day).");
    }
} catch(e) { 
    console.error(e); 
    new Notice("🔥 Error generating workout log: " + e.message);
}
-%>
