<%-*
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateCourseTimetable.js";
let generator;
try {
    delete require.cache[require.resolve(enginePath)];
    generator = require(enginePath);
    let dv = app.plugins.plugins["dataview"].api;
    let link = await generator(app, dv, moment);
    if (!link) {
        new Notice("🚫 Cancelled — no week created.");
    }
} catch(e) {
    console.error(e);
    new Notice("🔥 Error generating course timetable: " + e.message, 10000);
}
-%>
