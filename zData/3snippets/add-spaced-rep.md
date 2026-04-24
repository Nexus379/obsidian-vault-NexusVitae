<%-* // 🔱 1. THE INFINITE SEQUENCE (Prime-Power bis 10 Jahre)  
const srsIntervals = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 127, 151, 181, 211, 241, 271, 311, 367, 431, 521, 641, 761, 911, 1111, 1411, 1811, 2511, 3650];

// 🔱 2. EVOLUTIONARY RANKS (Star Trek + Nexus Evolution)  
const srsRanks = [  
"Ground Crew (Sprout)", "Starfleet Cadet (Novice)", "Ensign (Apprentice)",  
"Lieutenant (Journeyman)", "Lt. Commander (Sentinel)", "Commander (Warrior)",  
"Captain (Veteran)", "Commodore (Castellan)", "Rear Admiral (Mage)",  
"Vice Admiral (Seer)", "Admiral (Scholar)", "Fleet Admiral (Archivar)",  
"High Councilor (Councilor)", "Sector Regent (Regent)", "Enlightened One",  
"Orbital Ghost", "Void Walker", "Star Surfer", "Galaxy Warden",  
"Spacetime Weaver", "Supernova", "Singularity", "Shapeshifter", "Nexus Core"  
];

// 🎨 Icons für Notice & Display
const visualIcons = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌", "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"];

const grades = ["🔴 1: Blackout (Reset)", "🟠 2: Hard (Stagnate)", "🟡 3: Okay (+1 Level)", "🟢 4: Good (+2 Levels)", "🔥 5: Perfect (+3 Levels)"];  
const gChoice = await tp.system.suggester(grades, [0, 0, 1, 2, 3], false, "🔱 Nexus Grade?");

if (gChoice !== null) {  
    const tFile = tp.config.target_file;  
    let nextLvl;

    await app.fileManager.processFrontMatter(tFile, (fm) => {  
        // ⚡ HIER SIND DEINE NEUEN VARIABLEN:
        let currentLevel = Number(fm["space_lvl"]) || 0;  
        nextLvl = (gChoice === 0) ? 0 : Math.max(0, Math.min(srsIntervals.length - 1, currentLevel + gChoice));

        fm["space_lvl"] = nextLvl;  
        fm["space_rank"] = srsRanks[Math.min(nextLvl, srsRanks.length - 1)] || "Nexus Core";  
        fm["spaced_date"] = moment().add(srsIntervals[nextLvl], 'days').format("YYYY-MM-DD");  
    });

    const icon = visualIcons[Math.min(nextLvl, visualIcons.length - 1)] || "🔱";  
    new Notice(`${icon} Rank Up: ${srsRanks[Math.min(nextLvl, srsRanks.length - 1)]}!`);  
}  
-%>