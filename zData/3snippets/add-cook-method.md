<%-*
const base = app.vault.adapter.getBasePath();
const life = require(base + "/zData/2scripts/cookEngine.js")();
const persona = require(base + "/zData/2scripts/personaEngine.js")();

const category = "cookMethods"; 
const labels = life.getAllKitchenLabels(category); 
const ids = life.getAllKitchenIds(category);

const p = life.getPersona(category);
const a = persona.getAxis(p);

// Fokus auf die Zubereitungsart
const selectedId = await tp.system.suggester(labels, ids, false, "How will you prepare it? 🔥");

if (selectedId) {
    await app.fileManager.processFrontMatter(tp.config.target_file, (fm) => {
        if (!fm.cookMethod) fm.cookMethod = [];
        if (!fm.cookMethod.includes(selectedId)) fm.cookMethod.push(selectedId);
        
        fm.persona = p;
        fm.axis = a;
    });
    new Notice(`🫧 Method added: ${selectedId}`); 
}
-%>