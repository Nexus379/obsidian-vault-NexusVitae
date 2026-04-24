<%-*
const base = app.vault.adapter.getBasePath();
const life = require(base + "/zData/2scripts/cookEngine.js")();
const persona = require(base + "/zData/2scripts/personaEngine.js")();

const category = "mealTimes";
const labels = life.getAllKitchenLabels(category);
const ids = life.getAllKitchenIds(category);

const p = life.getPersona(category);
const a = persona.getAxis(p);

// Die kompakte Legende direkt im Suchfeld:
const selectedId = await tp.system.suggester(labels, ids, false, "W = hours since Wake | S = hours before Sleep");

if (selectedId) {
    await app.fileManager.processFrontMatter(tp.config.target_file, (fm) => {
        if (!fm.mealTime) fm.mealTime = [];
        if (!fm.mealTime.includes(selectedId)) fm.mealTime.push(selectedId);
        fm.persona = p;
        fm.axis = a;
    });
    new Notice(`⏰ Time set: ${selectedId}`);
}
-%>