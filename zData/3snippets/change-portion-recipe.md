<%*
/**
 * 🧪 NEXUS SCALE ENGINE: Ultimate Fix
 */
const activeFile = app.workspace.getActiveFile();
const fileCache = app.metadataCache.getFileCache(activeFile);
const fmCache = fileCache?.frontmatter || {};

// 1. Alte Portionen auslesen
const oldP = Number(fmCache.portions) || 1;

// 2. Ask first (BEFORE touching the file)
const newP_input = await tp.system.prompt(`Current: ${oldP} serv. | New serving count?`, oldP);
const newP = Number(newP_input);

if (!newP || newP === oldP) {
    new Notice("⚠️ Scaling cancelled.");
    return;
}

const ratio = newP / oldP;
let changedItems = [];

// 3. Blitzschneller Schreibvorgang (Synchron)
await app.fileManager.processFrontMatter(activeFile, (fm) => {
    fm.portions = newP; // Portionen updaten
    
// Walk all qty_ fields and rescale them
    Object.keys(fm).forEach(key => {
        if (key.startsWith("qty_")) {
            let val = Number(fm[key]);
            
            if (val > 0) {
                let newVal = Math.round((val * ratio) * 1000) / 1000;
                fm[key] = newVal; // Overwrite the value in the YAML
                
                // Remember it for the success notice
                changedItems.push(`${key}: ${val} -> ${newVal}`);
            }
        }
    });
});

// 4. Eindeutiges Feedback
if (changedItems.length > 0) {
    new Notice(`✅ SUCCESS!\nScaled ${changedItems.length} ingredients.`);
    console.log("Nexus Scale Details:\n" + changedItems.join("\n"));
} else {
    new Notice("❌ No active 'qty_' values found to scale.");
}
-%>
