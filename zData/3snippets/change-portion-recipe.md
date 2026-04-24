<%*
/**
 * 🧪 NEXUS SCALE ENGINE: Ultimate Fix
 */
const activeFile = app.workspace.getActiveFile();
const fileCache = app.metadataCache.getFileCache(activeFile);
const fmCache = fileCache?.frontmatter || {};

// 1. Alte Portionen auslesen
const oldP = Number(fmCache.portions) || 1;

// 2. Prompt aufrufen (BEVOR wir die Datei bearbeiten)
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
    
    // Alle amt_ Felder durchsuchen und umrechnen
    Object.keys(fm).forEach(key => {
        if (key.startsWith("amt_")) {
            let val = Number(fm[key]);
            
            if (val > 0) {
                let newVal = Math.round((val * ratio) * 1000) / 1000;
                fm[key] = newVal; // Wert im YAML überschreiben
                
                // Für unsere Erfolgsmeldung merken
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
    new Notice("❌ No active 'amt_' values found to scale.");
}
-%>