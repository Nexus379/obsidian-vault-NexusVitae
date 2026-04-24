
```dataviewjs
// 🔱 1. INITIALIZATION & STATE
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('"0_Calendar"');

const config = {
    jou:   { suffix: "plm",    folder: "0_Calendar/1_PLM",        icon: "🌷", color: "#ff79c6" },
    log:   { suffix: "ppm",    folder: "0_Calendar/2_PPM",        icon: "🌻", color: "#f1fa8c" },
    study: { suffix: "pkm",    folder: "0_Calendar/3_PKM",        icon: "🌼", color: "#bd93f9" },
    prolog:{ suffix: "prjlog", folder: "0_Calendar/4_Projectlog", icon: "🧩", color: "#ffb86c" },
    proto: { suffix: "prot",   folder: "0_Calendar/5_Protocol",   icon: "📜", color: "#8be9fd" },
    rev:   { suffix: "rev",    folder: "0_Calendar/6_Review",     icon: "🛰️", color: "#50fa7b" }
};

const routerPath = "zData/1tmpl/0calendarprompt.md";

// 🔱 2. NAVIGATION UI
const navHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: var(--background-secondary); border-radius: 8px;">
    <button id="prevWeek" style="cursor: pointer;">⬅️</button>
    <b style="font-family: monospace; letter-spacing: 1px;">🔱 NEXUS CHRONOS</b>
    <button id="nextWeek" style="cursor: pointer;">➡️</button>
</div>`;

let tableHTML = `<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">`;
const dayData = [];

// 🔱 3. GRID GENERIERUNG
for (let i = 0; i < 7; i++) {
    let mDate = moment().add(window.nexusOffset, 'weeks').startOf('week').add(i, 'days');
    let dateStr = mDate.format("YYYY-MM-DD");
    let isToday = (dateStr === moment().format("YYYY-MM-DD"));

    let files = {};
    for (let key in config) {
        files[key] = allLogs.find(p => p.file.name.includes(dateStr) && p.file.name.toLowerCase().includes(config[key].suffix.toLowerCase()));
    }

    dayData.push({ dateStr, mDate });

    const getStyle = (exists, color) => exists 
        ? `opacity: 1; filter: drop-shadow(0 0 3px ${color}); cursor: pointer; transform: scale(1.1);` 
        : `opacity: 0.2; filter: grayscale(100%); cursor: pointer;`;

    tableHTML += `
    <div style="padding: 10px; border: ${isToday ? '2px solid var(--interactive-accent)' : '1px solid var(--background-modifier-border)'}; border-radius: 12px; background-color: var(--background-secondary-alt); text-align: center;">
        <div style="font-size: 0.65em; opacity: 0.5; text-transform: uppercase;">${mDate.format("ddd")}</div>
        <div style="font-size: 0.9em; font-weight: 800; margin: 4px 0 10px 0;">${mDate.format("DD.MM.")}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 1.3em;">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <span class="jou-btn"   data-idx="${dayData.length-1}" style="${getStyle(files.jou, config.jou.color)}">${config.jou.icon}</span>
                <span class="log-btn"   data-idx="${dayData.length-1}" style="${getStyle(files.log, config.log.color)}">${config.log.icon}</span>
                <span class="study-btn" data-idx="${dayData.length-1}" style="${getStyle(files.study, config.study.color)}">${config.study.icon}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <span class="prolog-btn" data-idx="${dayData.length-1}" style="${getStyle(files.prolog, config.prolog.color)}">${config.prolog.icon}</span>
                <span class="proto-btn"  data-idx="${dayData.length-1}" style="${getStyle(files.proto, config.proto.color)}">${config.proto.icon}</span>
                <span class="rev-btn"    data-idx="${dayData.length-1}" style="${getStyle(files.rev, config.rev.color)}">${config.rev.icon}</span>
            </div>
        </div>
    </div>`;
}

const mainContainer = dv.el("div", navHTML + tableHTML + "</div>");

// 🔱 4. NAVIGATION HANDLER
mainContainer.querySelector("#prevWeek").onclick = () => { window.nexusOffset--; app.commands.executeCommandById("dataview:dataview-force-refresh-views"); };
mainContainer.querySelector("#nextWeek").onclick = () => { window.nexusOffset++; app.commands.executeCommandById("dataview:dataview-force-refresh-views"); };

const handleBtnClick = async (type, btn) => {
    if (window._nexusRunning) return;
    window._nexusRunning = true;

    try {
        const data = dayData[btn.getAttribute('data-idx')];
        const cfg = config[type];
        const folderPath = `${cfg.folder}/${data.mDate.format("YYYY")}/${data.mDate.format("MM")}`;
        const fileName = `${data.dateStr} ${cfg.suffix}.md`; // Dateiname ist hier schon PERFEKT
        const fullPath = `${folderPath}/${fileName}`;

        let file = app.vault.getAbstractFileByPath(fullPath);

        if (!file) {
            let curr = "";
            for (const seg of folderPath.split("/")) {
                curr = curr === "" ? seg : `${curr}/${seg}`;
                if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
            }
            // Wir erstellen die Datei mit einem Marker im Frontmatter
            file = await app.vault.create(fullPath, "---\nnexus_routed: true\n---\n");
            await new Promise(r => setTimeout(r, 200));
        }

        await app.workspace.getLeaf('tab').openFile(file);

        const tPlugin = app.plugins.plugins["templater-obsidian"];
        if (tPlugin) {
            const tpApi = tPlugin.templater;
            if (!tpApi.variables) tpApi.variables = {};
            
            // 🔱 DAS PREFIX-PAKET
            tpApi.variables.targetDate = data.dateStr;
            tpApi.variables.activeTrigger = cfg.suffix; // z.B. "plm"
            tpApi.variables.title = "";                 // Wichtig: Wir schicken "leer", damit nichts angehängt wird
            tpApi.variables.isNexusCall = true;         // Das "Halt-Stop"-Signal für den Specialist

            const templateFile = app.vault.getAbstractFileByPath(routerPath);
            if (templateFile) {
                await new Promise(r => setTimeout(r, 400));
                await tpApi.append_template_to_active_file(templateFile);
            }
        }
    } catch (e) {
        console.error("Nexus Error:", e);
    } finally {
        window._nexusRunning = false;
    }
};

// 🔱 6. BINDING
Object.keys(config).forEach(type => {
    mainContainer.querySelectorAll(`.${type}-btn`).forEach(btn => {
        btn.onclick = () => handleBtnClick(type, btn);
    });
});
```
