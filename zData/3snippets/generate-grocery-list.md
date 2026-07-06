<%-*
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/generateShoppingList.js";
let generator;
try { 
    delete require.cache[require.resolve(enginePath)]; 
    generator = require(enginePath); 
    let dv = app.plugins.plugins["dataview"].api;
    let link = await generator(app, dv, moment);
    new Notice("🛒 Einkaufsliste generiert!");
} catch(e) { 
    console.error(e); 
    new Notice("🔥 Error generating shopping list: " + e.message);
}
-%>
