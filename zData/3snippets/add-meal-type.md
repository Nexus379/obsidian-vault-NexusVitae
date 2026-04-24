<%-*
const base = app.vault.adapter.getBasePath();
const life = require(base + "/zData/2scripts/cookEngine.js")();
const persona = require(base + "/zData/2scripts/personaEngine.js")();

const category = "mealTypes"; 
const labels = life.getAllKitchenLabels(category); 
const ids = life.getAllKitchenIds(category);

const p = life.getPersona(category);
const a = persona.getAxis(p);

// Ein inspirierender Prompt für die Art des Gerichts
const selectedId = await tp.system.suggester(labels, ids, false, "What are you creating today? 🥘");

if (selectedId) {
    await app.fileManager.processFrontMatter(tp.config.target_file, (fm) => {
        if (!fm.mealType) fm.mealType = [];
        if (!fm.mealType.includes(selectedId)) fm.mealType.push(selectedId);
        
        fm.persona = p;
        fm.axis = a;
    });
    new Notice(`🥘 Type defined: ${selectedId}`); 
}
-%>