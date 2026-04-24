<%-*
const base = app.vault.adapter.getBasePath();
const life = require(base + "/zData/2scripts/cookEngine.js")();
const persona = require(base + "/zData/2scripts/personaEngine.js")();

const category = "cookTools"; 
const labels = life.getAllKitchenLabels(category); 
const ids = life.getAllKitchenIds(category);

const p = life.getPersona(category);
const a = persona.getAxis(p);

// Ein freundlicherer, englischer Prompt für den Suggester
const selectedId = await tp.system.suggester(labels, ids, false, "What do you need for this? 🌬️");

if (selectedId) {
    await app.fileManager.processFrontMatter(tp.config.target_file, (fm) => {
        if (!fm.cookTools) fm.cookTools = [];
        if (!fm.cookTools.includes(selectedId)) fm.cookTools.push(selectedId);
        
        fm.persona = p;
        fm.axis = a;
    });
    new Notice(`🛠️ Tool added: ${selectedId}`); 
}
-%>