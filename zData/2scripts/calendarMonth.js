/**
 * 📅 CALENDAR MONTH GRID — the clickable month view of the Calendar dashboard.
 *
 * WHY THIS IS A SCRIPT
 *   These 179 lines used to sit inside a callout in "0_Atlas/0_Dashboard/0-Calendar.md".
 *   In Live Preview you had to scroll past all of it to reach the rendered grid.
 *
 * WHAT IT DOES
 *   Draws one tile per day of the shown month. Each tile carries six clickable icons:
 *   the three daily axes (Journal / Log / Studylog) and the three project types
 *   (Projectlog / Protocol / Review). Clicking an icon opens that day's note if it
 *   exists, otherwise it runs the calendar router to create it for exactly that date.
 *   The footer shows tracked mobility minutes, open tasks and an energy bar.
 *
 * Used from the note:
 *   await require(app.vault.adapter.basePath + "/zData/2scripts/calendarMonth.js")().render(dv, app);
 */

function calendarMonth() {

    const CONFIG = {
        jou:    { trigger: 'plm',  fileSuffix: 'plm',  icon: '🌷', color: '#ff79c6' },
        log:    { trigger: 'ppm',  fileSuffix: 'ppm',  icon: '🌻', color: '#a6e3a1' },
        study:  { trigger: 'pkm',  fileSuffix: 'pkm',  icon: '🌼', color: '#89dceb' },
        prolog: { trigger: 'proj', fileSuffix: 'proj', icon: '🧩', color: '#ffb86c' },
        proto:  { trigger: 'prot', fileSuffix: 'prot', icon: '📜', color: '#8be9fd' },
        rev:    { trigger: 'rev',  fileSuffix: 'rev',  icon: '🛰️', color: '#50fa7b' }
    };
    const ROUTER_PATH = 'zData/1tmpl/0calendarprompt.md';

    /** Does this page belong to `type` on `dateStr`? Name and frontmatter both count. */
    const matchesType = (page, type, dateStr) => {
        const name = page.file.name.toLowerCase();
        const archtype = String(page.archtype || "").toLowerCase();
        const pageDate = String(page.cal_date || page.rev_end || "").substring(0, 10);
        if (pageDate !== dateStr && !name.startsWith(dateStr)) return false;
        if (type === 'prolog') return archtype.includes('projectlog') || name.startsWith(`${dateStr} proj`);
        if (type === 'proto') return archtype.includes('protocol') || name.startsWith(`${dateStr} prot`);
        if (type === 'rev') return archtype.includes('review') || name.includes('rev');
        return name.startsWith(`${dateStr} ${CONFIG[type].fileSuffix}`);
    };

    async function render(dv, app, moment) {
        const M = moment || window.moment;

        // The shown month is kept on the window so the arrows survive a re-render.
        if (window.nexusOffset === undefined) window.nexusOffset = 0;

        const allLogs = dv.pages('!"zData" AND -"yArchive"')
            .where(p => p.inbox !== true)
            .where(p => p.cal_date || p.rev_end)
            .where(p => p.file.path.startsWith("0_Calendar/") || String(p.archtype || "").includes("projectlog"));

        // ─── Navigation ───────────────────────────────────────────────────────
        const nav = dv.el('div', '');
        const currentMoment = M().add(window.nexusOffset, 'months');
        const currentMonthStr = currentMoment.format('MMMM YYYY');

        nav.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <button id="prevM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">⬅️</button>
    <b style="font-size: 1.3em; color: var(--interactive-accent); letter-spacing: 2px; text-shadow: 0 0 10px var(--interactive-accent)44;">🔱 ${currentMonthStr.toUpperCase()}</b>
    <button id="nextM" style="cursor: pointer; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; color: var(--text-normal); padding: 6px 16px; font-weight: bold; transition: 0.2s;">➡️</button>
</div>`;

        // ─── Build the grid ───────────────────────────────────────────────────
        const startOfMonth = M(currentMoment).startOf('month');
        const daysInMonth = startOfMonth.daysInMonth();
        let gridHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 5px;">';
        const dayData = [];

        for (let i = 0; i < daysInMonth; i++) {
            const mDate = M(startOfMonth).add(i, 'days');
            const dStr = mDate.format('YYYY-MM-DD');
            const isToday = (dStr === M().format('YYYY-MM-DD'));
            const isWeekend = (mDate.day() === 0 || mDate.day() === 6);

            const dayFiles = allLogs.filter(p =>
                p.file.name.includes(dStr) ||
                String(p.cal_date || "").substring(0, 10) === dStr ||
                String(p.rev_end || "").substring(0, 10) === dStr
            );
            const fitLog = dayFiles.find(p => p.mobility_am !== undefined || p.mobility_pm !== undefined);
            const fitTotal = (fitLog ? (Number(fitLog.mobility_am) || 0) + (Number(fitLog.mobility_pm) || 0) : 0);
            const energy = dayFiles.find(p => p.energy)?.energy || null;
            const tasks = dayFiles.array().reduce((acc, p) => acc + (p.file.tasks ? p.file.tasks.where(t => !t.completed).length : 0), 0);

            const files = {};
            Object.keys(CONFIG).forEach(type => files[type] = dayFiles.find(p => matchesType(p, type, dStr)));
            dayData.push({ dStr, mDate, files });

            // Each axis that has a log fades in from its own side — three logs, three fades.
            let gradients = [];
            if (files.jou)   gradients.push(`linear-gradient(90deg, ${CONFIG.jou.color}25 0%, transparent 50%)`);
            if (files.log)   gradients.push(`linear-gradient(180deg, ${CONFIG.log.color}25 0%, transparent 50%)`);
            if (files.study) gradients.push(`linear-gradient(270deg, ${CONFIG.study.color}25 0%, transparent 50%)`);

            const baseColor = isWeekend ? 'rgba(255,255,255,0.02)' : 'var(--background-secondary-alt)';
            const finalBg = gradients.length > 0 ? gradients.join(', ') + ', ' + baseColor : baseColor;

            gridHTML += `<div style="background: ${finalBg}; border: 1px solid rgba(255,255,255,0.05); padding: 10px 6px; border-radius: 10px; display: flex; flex-direction: column; min-height: 135px; transition: transform 0.2s; ${isToday ? 'outline: 1.5px solid var(--interactive-accent); box-shadow: 0 0 15px var(--interactive-accent)33;' : ''}">`;

            gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; opacity: 0.5;">
        <span style="font-size: 0.55em; font-weight: 900; text-transform: uppercase;">${mDate.format('ddd')}</span>
        <span style="font-size: 0.95em; font-weight: 800; ${isToday ? 'color: var(--interactive-accent);' : ''}">${mDate.format('DD')}</span>
    </div>`;

            // The three flowers: Journal, Log, Studylog.
            gridHTML += `<div style="display: flex; justify-content: space-around; margin: 4px 0 10px 0;">`;
            ['jou', 'log', 'study'].forEach(k => {
                const ex = files[k];
                const style = ex ? `opacity: 1; filter: drop-shadow(0 0 5px ${CONFIG[k].color}); transform: scale(1.1);` : `opacity: 0.1; filter: grayscale(1);`;
                gridHTML += `<span class="${k}-btn" data-idx="${dayData.length - 1}" style="${style} font-size: 1.5em; cursor: pointer;">${CONFIG[k].icon}</span>`;
            });
            gridHTML += `</div>`;

            // Projectlog, Protocol, Review.
            gridHTML += `<div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 6px;">`;
            ['prolog', 'proto', 'rev'].forEach(k => {
                const ex = files[k];
                const style = ex ? `opacity: 1; filter: drop-shadow(0 0 3px ${CONFIG[k].color});` : `opacity: 0.15; filter: grayscale(1);`;
                gridHTML += `<span class="${k}-btn" data-idx="${dayData.length - 1}" style="${style} font-size: 1.15em; cursor: pointer;">${CONFIG[k].icon}</span>`;
            });
            gridHTML += `</div>`;

            gridHTML += `<div style="margin-top: auto; display: flex; flex-direction: column; gap: 5px;">`;
            gridHTML += `<div style="display: flex; justify-content: space-between; align-items: center; min-height: 18px;">`;
            gridHTML += fitTotal > 0 ? `<span style="font-size: 0.65em; color: ${CONFIG.rev.color}; font-weight: 800; opacity: 0.8;">🏃 ${fitTotal}m</span>` : `<span></span>`;
            gridHTML += tasks > 0 ? `<span style="font-size: 0.8em; filter: drop-shadow(0 0 3px #ff5555); font-weight: 900;">🔨 ${tasks}</span>` : `<span></span>`;
            gridHTML += `</div>`;

            if (energy) {
                gridHTML += `<div style="width: 100%; height: 4px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden;"><div style="width: ${(energy / 5) * 100}%; height: 100%; background: ${energy >= 4 ? CONFIG.rev.color : (energy >= 3 ? CONFIG.log.color : '#ff5555')}; box-shadow: 0 0 5px currentColor;"></div></div>`;
            }
            gridHTML += `</div></div>`;
        }

        const renderTarget = dv.el('div', gridHTML + '</div>');

        // ─── Click handling ───────────────────────────────────────────────────
        const handleBtnClick = async (type, idx) => {
            if (window._nexusCalendarRunning) return;
            window._nexusCalendarRunning = true;

            try {
                const data = dayData[idx];
                const existing = data.files[type];
                if (existing) {
                    const file = app.vault.getAbstractFileByPath(existing.file.path);
                    if (file) await app.workspace.getLeaf('tab').openFile(file);
                    return;
                }

                const plugin = app.plugins.plugins['templater-obsidian'];
                const routerFile = app.vault.getAbstractFileByPath(ROUTER_PATH);
                const inbox = app.vault.getAbstractFileByPath('0_Inbox');
                if (!plugin || !routerFile || !inbox) {
                    new Notice('Calendar UI: Templater, router or 0_Inbox is missing.');
                    return;
                }

                // Clear anything a previous router run left behind, then set this date.
                const vars = plugin.templater.variables || (plugin.templater.variables = {});
                ['preSelectedSub', 'customPath', 'displayTitle', 'logConnect', 'finalTitle', 'targetFolder', 'revSuffix', 'revStart', 'revEnd', 'revModule', 'energy']
                    .forEach(key => delete vars[key]);
                vars.targetDate = data.dStr;
                vars.activeTrigger = CONFIG[type].trigger;
                vars.title = '';

                try {
                    await plugin.templater.create_new_note_from_template(
                        routerFile,
                        inbox,
                        `${data.dStr} ${CONFIG[type].trigger}`,
                        true
                    );
                } finally {
                    ['targetDate', 'activeTrigger', 'title', 'preSelectedSub', 'customPath', 'displayTitle', 'logConnect', 'finalTitle', 'targetFolder', 'revSuffix', 'revStart', 'revEnd', 'revModule']
                        .forEach(key => delete vars[key]);
                }
            } catch (error) {
                console.error('Calendar UI Error:', error);
                new Notice('Calendar UI: creation failed — details are in the console.');
            } finally {
                window._nexusCalendarRunning = false;
            }
        };

        nav.querySelector('#prevM').onclick = () => { window.nexusOffset--; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };
        nav.querySelector('#nextM').onclick = () => { window.nexusOffset++; app.commands.executeCommandById('dataview:dataview-force-refresh-views'); };

        Object.keys(CONFIG).forEach(type => {
            renderTarget.querySelectorAll(`.${type}-btn`).forEach(btn => {
                btn.onclick = () => handleBtnClick(type, btn.getAttribute('data-idx'));
            });
        });
    }

    return { render, CONFIG, matchesType };
}

module.exports = calendarMonth;
