<%-*
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateInpraLog.js";
let generator;
try {
    delete require.cache[require.resolve(enginePath)];
    generator = require(enginePath);
    let dv = app.plugins.plugins["dataview"].api;
    const link = await generator(app, dv, moment);
    if (link) {
        new Notice("🎼 Inpra Log Generated!");
    } else {
        new Notice("🎵 No practice planned for this day (or log already exists).");
    }
} catch(e) {
    new Notice("🔥 Error generating inpra log: " + e.message, 10000);
}
-%>
