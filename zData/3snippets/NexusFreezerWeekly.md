<%-*
// ❄️ NEXUS FREEZER WEEKLY - (Weekly Plan Archiver 💾)
const file = app.workspace.getActiveFile();
if (!file) {
    new Notice("❌ Freezer: No active note found.");
    return;
}

const dv = app.plugins.plugins.dataview?.api;
const fm = app.metadataCache.getFileCache(file)?.frontmatter || {};

if (fm.frozen) {
    new Notice("❄️ This weekly plan is already secured in the archive!");
    return;
}

new Notice("⏳ Archiving Weekly Plan... Please wait.");

try {
    const content = await app.vault.read(file);
    let lines = content.split("\n");
    let finalLines = [];
    let inBlock = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        const blockStart = line.match(/^([ \t>]*)(```)(dataview|dataviewjs)/);
        
        if (blockStart && !inBlock) {
            inBlock = true;
            const calloutPfx = blockStart[1];
            finalLines.push(calloutPfx + "> [!note] ❄️ Matrix frozen. AI suggestions disabled for archive.");
            continue;
        }

        if (inBlock) {
            if (line.match(/^[ \t>]*```[ \t]*$/)) { inBlock = false; }
            continue; 
        }

        // We delete ALL inline buttons
        line = line.replace(/`?BUTTON\[.*?\]`?/g, "");
        if (line.includes("$=")) line = line.replace(/`\$=.*?`/g, "❄️");
        
        if (line.includes("INPUT[")) {
            line = line.replace(/`?INPUT\[(.*?)\]`?/g, (match, inner) => {
                const parts = inner.split(":");
                let key = parts[parts.length - 1].trim().replace(/\]/g, "");
                let val = fm[key];
                if (typeof val === "boolean" || val === "true" || val === "false") return (val === true || val === "true") ? "✅" : "❌";
                if (val === undefined || val === null || val === "") return "—";
                if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
                return String(val);
            });
        }

        finalLines.push(line);
    }

    await app.vault.modify(file, finalLines.join("\n"));
    
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter.frozen = true;
    });

    new Notice("🏛️ Weekly Archiving complete! Pure Markdown restored.");

} catch (e) {
    new Notice("🔥 CRITICAL ERROR:\n" + e.message, 15000);
}
-%>
