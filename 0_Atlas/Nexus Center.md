---
cssclasses:
  - wide-page
  - dashboard-no-border
---

# 🔱 Nexus Center

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

```dataviewjs
// ==========================================
// 🚀 NEXUS MASTER COMMAND CENTER
// ==========================================

const allPages = dv.pages('!"zData" and !"yArchive" and !"xAttachment"');

// --- HELPER FUNCTIONS FOR DATA ---
const countTag = (tag) => allPages.where(p => 
    (p.archtype && String(p.archtype).includes(tag)) || 
    (p.arch && String(p.arch).includes(tag))
).length;

// --- 1. DATA GATHERING ---
// Master Architectures
const archData = [
    { label: "Calendar", count: countTag("#0cal"), color: "#b4befe" },
    { label: "Stars", count: countTag("#1stars"), color: "#f9e2af" },
    { label: "Areas", count: countTag("#2area"), color: "#a6e3a1" },
    { label: "Projects", count: countTag("#3project"), color: "#fab387" },
    { label: "Tasks", count: countTag("#4task"), color: "#f38ba8" },
    { label: "Notes", count: countTag("#5note"), color: "#74c7ec" },
    { label: "Resources", count: countTag("#6resou"), color: "#cba6f7" }
];

// Areas Detail
const areasData = [
    { label: "Selfcare", count: countTag("#2area/1selfcare"), color: "#f38ba8" },
    { label: "Relation", count: countTag("#2area/2relationship"), color: "#fab387" },
    { label: "Mind", count: countTag("#2area/3mind"), color: "#f9e2af" },
    { label: "Organize", count: countTag("#2area/4organize"), color: "#a6e3a1" },
    { label: "Creativity", count: countTag("#2area/5creativity"), color: "#74c7ec" },
    { label: "Activity", count: countTag("#2area/6activity"), color: "#89b4fa" },
    { label: "Entertain", count: countTag("#2area/7entertain"), color: "#cba6f7" }
];

// Notes Detail
const notesData = [
    { label: "Fleeting", count: countTag("#5note/1fleeting"), color: "#bac2de" },
    { label: "Literature", count: countTag("#5note/2literature"), color: "#89b4fa" },
    { label: "Permanent", count: countTag("#5note/3permanent"), color: "#cba6f7" },
    { label: "Atomic", count: countTag("#5note/4atomic"), color: "#f38ba8" },
    { label: "Evergreen", count: countTag("#5note/5evergreen"), color: "#a6e3a1" }
];

// Project Status
const p = allPages.where(page => page.arch && String(page.arch).includes("#3project"));
const projectData = [
    { label: "Active", count: p.where(x => x.status === "1active").length, color: "#a6e3a1" },
    { label: "Passive", count: p.where(x => x.status === "2passive").length, color: "#89b4fa" },
    { label: "Idea", count: p.where(x => x.status === "3idea").length, color: "#cba6f7" },
    { label: "Done", count: p.where(x => x.status === "done").length, color: "#bac2de" }
];

// Task Stats (Real Tasks in Checkboxes)
const allTasks = allPages.file.tasks.where(t => !t.path.includes("zData") && !t.path.includes("yArchive"));
const openTasks = allTasks.where(t => !t.completed).length;
const doneTasks = allTasks.where(t => t.completed).length;
const totalTasks = allTasks.length || 1;

// System Totals
const totalFiles = allPages.length;
const totalNotes = countTag("#5note");
const totalProjects = p.length;

// --- 2. ENGINE FOR PIE CHARTS ---
function createPie(title, data, size, isLarge = false) {
    let total = data.reduce((sum, d) => sum + d.count, 0) || 1;
    let gradient = "";
    let currentAngle = 0;
    let legend = "";

    for (let d of data) {
        let pct = (d.count / total) * 100;
        if (pct > 0) {
            gradient += `${d.color} ${currentAngle}% ${currentAngle + pct}%, `;
            currentAngle += pct;
        }
        let displayPct = Math.round(pct);
        legend += `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: ${isLarge ? '0.85em' : '0.7em'}; padding: 3px 0; border-bottom: 1px solid var(--background-modifier-border);">
                <span><span style="color:${d.color}; font-size:1.2em;">●</span> ${d.label}</span>
                <span style="font-family: monospace; color: var(--text-muted); font-weight: bold;">${d.count} <span style="font-size:0.8em; font-weight:normal;">(${displayPct}%)</span></span>
            </div>
        `;
    }
    gradient = gradient.slice(0, -2);
    if (!gradient) gradient = "var(--background-modifier-border) 0% 100%";

    return `
    <div style="background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 20px; display: flex; flex-direction: ${isLarge ? 'row' : 'column'}; gap: 20px; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); height: 100%;">
        ${!isLarge ? `<div style="font-size: 0.8em; text-transform: uppercase; font-weight: 800; color: var(--text-muted); width: 100%; text-align: center; margin-bottom: -10px;">${title}</div>` : ''}
        
        <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: conic-gradient(${gradient}); flex-shrink: 0; box-shadow: inset 0 0 10px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.1);"></div>
        
        <div style="flex-grow: 1; width: 100%; display: flex; flex-direction: column; justify-content: center;">
            ${isLarge ? `<div style="font-size: 0.9em; text-transform: uppercase; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; border-bottom: 2px solid var(--background-modifier-border); padding-bottom: 4px;">${title}</div>` : ''}
            ${legend}
        </div>
    </div>`;
}

// --- 3. UI ASSEMBLY ---
let html = `<div style="display: flex; flex-direction: column; gap: 20px; font-family: var(--font-interface);">`;

// ROW 1: HARD FACTS COUNTERS
html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;">`;
const kpi = (title, mainNum, sub, icon, color) => `
    <div style="background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-top: 3px solid ${color}; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 1.5em; margin-bottom: 4px;">${icon}</div>
        <div style="font-size: 2.2em; font-weight: 900; color: var(--text-normal); font-family: monospace; line-height: 1.1;">${mainNum}</div>
        <div style="font-size: 0.7em; text-transform: uppercase; font-weight: 800; color: ${color}; margin-top: 6px;">${title}</div>
        <div style="font-size: 0.65em; color: var(--text-muted); margin-top: 4px;">${sub}</div>
    </div>
`;
html += kpi("Total Nexus", totalFiles, "Active Files", "🌌", "#cba6f7");
html += kpi("Open Tasks", openTasks, "Pending", "🛠️", "#f38ba8");
html += kpi("Done Tasks", doneTasks, "Completed", "✅", "#a6e3a1");
html += kpi("Total Notes", totalNotes, "Secured Knowledge", "🧠", "#74c7ec");
html += kpi("Total Projects", totalProjects, "In Pipeline", "🚧", "#fab387");
html += `</div>`;

// ROW 2: MASTER PIE & SYSTEM STATS (Bars)
html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px;">`;

// Left: Big Master Pie (All Archs)
html += createPie("Master Architecture (Global)", archData, 220, true);

// Right: Progress Bars & Hard Stats
const bar = (label, value, total, color) => {
    let pct = Math.round((value / total) * 100) || 0;
    return `
    <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8em; font-weight: 600; margin-bottom: 4px;">
            <span>${label}</span>
            <span style="font-family: monospace;">${value} / ${total} (${pct}%)</span>
        </div>
        <div style="width: 100%; background: var(--background-modifier-border); border-radius: 4px; height: 10px; overflow: hidden;">
            <div style="width: ${pct}%; background: ${color}; height: 100%; border-radius: 4px;"></div>
        </div>
    </div>`;
};

html += `
<div style="background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center;">
    <div style="font-size: 0.9em; text-transform: uppercase; font-weight: 800; color: var(--text-muted); margin-bottom: 16px; border-bottom: 2px solid var(--background-modifier-border); padding-bottom: 4px;">📊 System Statistics</div>
    ${bar("Tasks Completed (Done Rate)", doneTasks, totalTasks, "#a6e3a1")}
    ${bar("Tasks Open (Backlog)", openTasks, totalTasks, "#f38ba8")}
    <div style="margin: 12px 0; border-top: 1px dashed var(--background-modifier-border);"></div>
    ${bar("Active Projects", projectData[0].count, totalProjects || 1, "#fab387")}
    ${bar("Passive Projects / Ideas", projectData[1].count + projectData[2].count, totalProjects || 1, "#89b4fa")}
    ${bar("Notes: Permanent & Evergreen", countTag("#5note/3permanent") + countTag("#5note/5evergreen"), totalNotes || 1, "#cba6f7")}
</div>
`;
html += `</div>`;

// ROW 3: SMALL SATELLITE PIES
html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">`;
html += createPie("Areas", areasData, 120, false);
html += createPie("Notes", notesData, 120, false);
html += createPie("Projects", projectData, 120, false);
html += `</div>`;

html += `</div>`;

// --- 4. RENDER OUTPUT ---
const wrapper = document.createElement("div");
wrapper.innerHTML = html;
dv.container.appendChild(wrapper);
```

---
---
