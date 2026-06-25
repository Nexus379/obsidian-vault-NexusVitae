<%-*
const file = app.workspace.getActiveFile();
if (!file) return;

let cVol = 1;
let cEp = 1;
let maxEp = 12;
let ratingNum = 0;
let isNewSeason = false;
let newMax = "12";

// 1. Read YAML frontmatter
await app.fileManager.processFrontMatter(file, (fm) => {
    cVol = Number(fm.season) || 1;
    cEp = Number(fm.episode) || 1;
    ratingNum = Number(fm.ep_rating) || 0;
    maxEp = Number(fm[`s${cVol}_max`]) || 999;
});

let targetEp = cEp + 1;
let targetVol = cVol;

// 2. Check for new season limit
if (targetEp > maxEp) {
    isNewSeason = true;
    targetVol = cVol + 1;
    targetEp = 1;
    
    newMax = await tp.system.prompt(`🏁 How many episodes does Season ${targetVol} have?`, "12");
    if (!newMax) newMax = "12";
}

// 3. Update YAML 
await app.fileManager.processFrontMatter(file, (fm) => {
    if (fm[`s${cVol}_rating`] === undefined) fm[`s${cVol}_rating`] = 0;
    fm.season = targetVol;
    fm.episode = targetEp;
    fm.ep_rating = 0; 
    if (isNewSeason) {
        fm[`s${targetVol}_max`] = Number(newMax);
        fm[`s${targetVol}_rating`] = 0; 
    }
});

// 4. Build Compact Headings (Background Text Injection)
await app.vault.process(file, (content) => {
    const dateStr = tp.date.now("YYYY-MM-DD");
    const stars = ratingNum > 0 ? "⭐".repeat(ratingNum) : "➖";
    
    const formatVol = String(cVol).padStart(2, '0');
    const formatEp = String(cEp).padStart(2, '0');
    
    let lines = content.split('\n');
    let hasSeasonHeading = false;
    let insertIndex = -1;

    for (let line of lines) {
        if (line.startsWith(`### 📺 S${formatVol}`)) {
            hasSeasonHeading = true;
            break;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("## 📺 Season Overview")) {
            insertIndex = i; 
            break;
        }
    }
    
    if (insertIndex !== -1) {
        let newText = "";
        
        if (!hasSeasonHeading) {
            newText += `### 📺 S${formatVol}\n`;
            newText += `**Season Rating:** \`INPUT[suggester(option(0, "➖"), option(1, "⭐ 1"), option(2, "⭐⭐ 2"), option(3, "⭐⭐⭐ 3"), option(4, "⭐⭐⭐⭐ 4"), option(5, "⭐⭐⭐⭐⭐ 5")):s${cVol}_rating]\`\n`;
        }
        
        // Exakt dein gewünschtes, kompaktes Format ohne Leerzeilen
        newText += `#### 🎬 E${formatEp} ${stars} | ${dateStr}\n`;
        newText += `- 📝 `; 

        let newLines = newText.split('\n');
        
        lines.splice(insertIndex, 0, ...newLines);
        return lines.join('\n');
    }
    return content;
});

// 5. Notifications
const finalVol = String(cVol).padStart(2, '0');
const finalEp = String(cEp).padStart(2, '0');
new Notice(`✅ S${finalVol}E${finalEp} logged successfully!`);

if (isNewSeason) {
    setTimeout(() => new Notice(`🎬 Season ${targetVol} started!`), 1000);
}
-%>