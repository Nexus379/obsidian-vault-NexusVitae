async function renderCalendarLog(app, dv, moment) {
// 🔱 1. INITIALIZATION & STATE
if (window.nexusOffset === undefined) window.nexusOffset = 0;
const allLogs = dv.pages('!"zData" AND -"yArchive"')
    .where(p => p.cal_date || p.rev_end)
    .where(p => p.file.path.startsWith("0_Calendar/") || String(p.archtype || "").includes("projectlog"));

const config = {
    jou:    { trigger: "plm",  fileSuffix: "plm",  icon: "🌷", color: "#ff79c6" },
    log:    { trigger: "ppm",  fileSuffix: "ppm",  icon: "🌻", color: "#f1fa8c" },
    study:  { trigger: "pkm",  fileSuffix: "pkm",  icon: "🌼", color: "#bd93f9" },
    prolog: { trigger: "proj", fileSuffix: "proj", icon: "🧩", color: "#ffb86c" },
    proto:  { trigger: "prot", fileSuffix: "prot", icon: "📜", color: "#8be9fd" },
    rev:    { trigger: "rev",  fileSuffix: "rev",  icon: "🛰️", color: "#50fa7b" }
};

const routerPath = "zData/1tmpl/0calendarprompt.md";
const matchesType = (page, type, dateStr) => {
    const name = page.file.name.toLowerCase();
    const archtype = String(page.archtype || "").toLowerCase();
    const pageDate = String(page.cal_date || page.rev_end || "").substring(0, 10);
    if (pageDate !== dateStr && !name.startsWith(dateStr)) return false;
    if (type === "prolog") return archtype.includes("projectlog") || name.startsWith(`${dateStr} proj`);
    if (type === "proto") return archtype.includes("protocol") || name.startsWith(`${dateStr} prot`);
    if (type === "rev") return archtype.includes("review") || name.includes("rev");
    return name.startsWith(`${dateStr} ${config[type].fileSuffix}`);
};

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
        files[key] = allLogs.find(p => matchesType(p, key, dateStr));
    }

    dayData.push({ dateStr, mDate, files });

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
        const existing = data.files[type];
        if (existing) {
            const file = app.vault.getAbstractFileByPath(existing.file.path);
            if (file) await app.workspace.getLeaf('tab').openFile(file);
            return;
        }

        const tPlugin = app.plugins.plugins["templater-obsidian"];
        const templateFile = app.vault.getAbstractFileByPath(routerPath);
        const inbox = app.vault.getAbstractFileByPath("0_Inbox");
        if (!tPlugin || !templateFile || !inbox) {
            new Notice("CalendarLog: Templater, Router oder 0_Inbox fehlt.");
            return;
        }

        const tpApi = tPlugin.templater;
        const vars = tpApi.variables || (tpApi.variables = {});
        ['preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule','energy']
            .forEach(key => delete vars[key]);
        vars.targetDate = data.dateStr;
        vars.activeTrigger = cfg.trigger;
        vars.title = "";

        try {
            await tpApi.create_new_note_from_template(
                templateFile,
                inbox,
                `${data.dateStr} ${cfg.trigger}`,
                true
            );
        } finally {
            ['targetDate','activeTrigger','title','preSelectedSub','customPath','displayTitle','logConnect','finalTitle','targetFolder','revSuffix','revStart','revEnd','revModule']
                .forEach(key => delete vars[key]);
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
}

module.exports = renderCalendarLog;
