---
frozen: true
---
<%-*
// ❄️ NEXUS FREEZER v60 - Return to Vault (Connexio Shield 🛡️ + PKM Engine Sync ⚙️)

const file = app.workspace.getActiveFile();
if (!file) {
    new Notice("❌ Freezer: No active note found.");
    return;
}

const dv = app.plugins.plugins.dataview?.api;
const fm = app.metadataCache.getFileCache(file)?.frontmatter || {};

if (fm.frozen) {
    new Notice("❄️ This matrix is already secured in the archive!");
    return;
}

new Notice("⏳ Creating museum in the background... Please wait.");

try {
    // 1. Gently read the file from the disk
    const content = await app.vault.read(file);
    let lines = content.split("\n");
    let finalLines = [];
    let inBlock = false;
    let currentContext = "";
    let calloutPfx = "";

    // 2. Your modern museum logic
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // 🎯 RADAR: Context detection 
        if (line.includes("[!zettelkasten] ✍️ Recent Notes")) currentContext = "notes";
        else if (line.includes("[!log] 🌙 Last Syncs")) currentContext = "logs";
        else if (line.includes("L - Lifestyle / Food")) currentContext = "food_main";
        else if (line.includes("Live Resonance (Actuals)")) currentContext = "food_res";
        else if (line.includes("**Fitness:**")) currentContext = "fitness";
        else if (line.includes("## 🌿Consuetudo")) currentContext = "consuetudo";
        else if (line.includes("#### 🔱 Connexio")) currentContext = "connexio";
        
        // ⚡ NEUE PKM-MODULE ERKENNUNG:
        else if (line.includes("NEXUS VITALITY DASHBOARD")) currentContext = "vitality";
        else if (line.includes("NEXUS STUDY LOG COMPILER")) currentContext = "study_tracker";
        else if (line.includes("Upcoming Missions") || line.includes("Due Today") || line.includes("Delayed")) currentContext = "study_plan";
        else if (line.includes("On this day")) currentContext = "on_this_day";

        // We ONLY target dataview and dataviewjs. 
        const blockStart = line.match(/^([ \t>]*)(```)(dataview|dataviewjs)/);
        
        if (blockStart && !inBlock) {
            
            // 🛡️ CONNEXIO SHIELD
            if (currentContext === "connexio") {
                finalLines.push(line);
                continue; 
            }

            inBlock = true;
            calloutPfx = blockStart[1];
            
            if (currentContext === "notes" && dv) {
                const notes = dv.pages('"5_Notes"').sort(p => p.file.mtime, "desc").limit(5).array();
                if (notes.length > 0) notes.forEach(p => finalLines.push(calloutPfx + `- [[${p.file.name}]]`));
                else finalLines.push(calloutPfx + "- _No recent notes._");
            }
            else if (currentContext === "logs" && dv) {
                const configs = [
                    { label: "Journal", folder: '"0_Calendar/1_PLM"' },
                    { label: "Log", folder: '"0_Calendar/2_PPM"' },
                    { label: "Study", folder: '"0_Calendar/3_PKM"' },
                    { label: "Project", folder: '"0_Calendar/4_Projectlog"' },
                    { label: "Review", folder: '"0_Calendar/6_Review"' }
                ];
                configs.forEach(cfg => {
                    const last = dv.pages(cfg.folder).sort(p => p.file.name, "desc").first();
                    if (last) finalLines.push(calloutPfx + `- **${cfg.label}:** ${last.file.link}`);
                });
            }
            else if (currentContext === "fitness") {
                const am = Number(fm.fitness_am) || 0;
                const pm = Number(fm.fitness_pm) || 0;
                const t = am + pm;
                let ic = "⚪"; if(t>=90)ic="🦅"; else if(t>=60)ic="✨"; else if(t>=30)ic="🟢"; else if(t>0)ic="🟡";
                finalLines.push(calloutPfx + `🏃🏽 **Status:** ${t} / 30 min ${ic}`);
            }
            else if (currentContext === "food_res") {
                const r = window.dailyResonance || {};
                const kcal = Math.round(Number(r.kcal) || 0);
                const pro = (Number(r.protein_g) || 0).toFixed(1);
                const fat = (Number(r.fat_total_g) || 0).toFixed(1);
                finalLines.push(calloutPfx + `🔥 **${kcal}** kcal | 💪 **${pro}**g Pro | 🥑 **${fat}**g Fat`);
            }
            else if (currentContext === "consuetudo") {
                finalLines.push(calloutPfx + "> [!quote] 🌿 **Consuetudo:** Day calculated & archived.");
            }
            else if (currentContext === "food_main") {
                 finalLines.push(calloutPfx + "> [!note] ❄️ **Nutrition Log:** Metrics finalized.");
            }
            // ⚡ NEUE FREEZER LOGIK FÜR PKM:
            else if (currentContext === "vitality") {
                const e = fm.energy || "3";
                const b = fm["brain-drain"] || "3";
                finalLines.push(calloutPfx + `**⚡ Energy:** ${e}/5 | **🧠 Cognitive Load:** ${b}/5 (Frozen)`);
            }
            else if (currentContext === "study_tracker") {
                let totalMin = 0;
                for (let k in fm) {
                    if (k.endsWith("_min")) totalMin += (Number(fm[k]) || 0);
                }
                finalLines.push(calloutPfx + `**⏱️ Total Study Time:** ${totalMin} min (Frozen)`);
            }
            else if (currentContext === "study_plan") {
                 finalLines.push(calloutPfx + "_Mission board locked for this cycle._");
            }
            else if (currentContext === "on_this_day") {
                 finalLines.push(calloutPfx + "_Historical sync locked._");
            }
            else {
                finalLines.push(calloutPfx + "> [!note] ❄️ Matrix frozen.");
            }
            continue;
        }

        if (inBlock) {
            if (line.match(/^[ \t>]*```[ \t]*$/)) { inBlock = false; currentContext = ""; }
            continue; 
        }

        // We delete ALL inline buttons (like BUTTON[freezer])
        line = line.replace(/`?BUTTON\[.*?\]`?/g, "");
        if (line.includes("$=")) line = line.replace(/`\$=.*?`/g, "❄️");
        
        // Input-Replacement Logic
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

    // 3. Gently save to the disk
    await app.vault.modify(file, finalLines.join("\n"));

    // 4. Mark it as frozen
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter.frozen = true;
    });

    new Notice("🏛️ Archiving complete! File is now ready for the archive button.");

} catch (e) {
    new Notice("🔥 CRITICAL ERROR:\n" + e.message, 15000);
}
-%>