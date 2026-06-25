<%-*
const file = app.workspace.getActiveFile();
if (!file) return;

let cVol = 1;
let cEp = 1;
let maxEp = 12;
let ratingNum = 0;
let isNewSeason = false;
let newMax = "12";

// 1. Read current state BEFORE changing it
await app.fileManager.processFrontMatter(file, (fm) => {
    cVol = Number(fm.season) || 1;
    cEp = Number(fm.episode) || 1;
    ratingNum = Number(fm.ep_rating) || 0;
    maxEp = Number(fm[`s${cVol}_max`]) || 999;
});

let targetEp = cEp + 1;
let targetVol = cVol;

// 2. Check season limit
if (targetEp > maxEp) {
    isNewSeason = true;
    targetVol = cVol + 1;
    targetEp = 1;
    
    newMax = await tp.system.prompt(`🏁 How many episodes does Season ${targetVol} have?`, "12");
    if (!newMax) newMax = "12";
}

// 3. Update YAML (Advance episode, reset rating to 0)
await app.fileManager.processFrontMatter(file, (fm) => {
    fm.season = targetVol;
    fm.episode = targetEp;
    fm.ep_rating = 0; 
    if (isNewSeason) {
        fm[`s${targetVol}_max`] = Number(newMax);
    }
});

// 4. Insert table row with star rating
const view = app.workspace.getActiveViewOfType(require("obsidian").MarkdownView);
if (view) {
    const editor = view.editor;
    const dateStr = tp.date.now("YYYY-MM-DD");
    const stars = ratingNum > 0 ? "⭐".repeat(ratingNum) : "➖";
    
    // Format: | Season | Episode | Rating | Title/Note | Date |
    const newRow = `\n| ${cVol} | ${cEp} | ${stars} |  | ${dateStr} |`;
    
    const content = editor.getValue();
    const lines = content.split('\n');
    
    let insertIndex = -1;
    let inTable = false;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("## 🎞️ Episode Log")) {
            inTable = true;
            continue;
        }
        if (inTable && lines[i].startsWith("|")) {
            insertIndex = i; 
        } else if (inTable && insertIndex !== -1 && !lines[i].startsWith("|")) {
            break; 
        }
    }
    
    if (insertIndex !== -1) {
        editor.replaceRange(newRow, {line: insertIndex, ch: lines[insertIndex].length});
        new Notice(`✅ Logged S${cVol}E${cEp} with ${ratingNum} Stars!`);
        if (isNewSeason) {
            setTimeout(() => new Notice(`🎬 Season ${targetVol} started!`), 1000);
        }
    } else {
        new Notice("⚠️ Episode Log Table not found.");
    }
}
-%>