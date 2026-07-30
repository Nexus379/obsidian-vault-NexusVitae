/**
 * 💫 MAIN DASHBOARD — the two big views of "0_Atlas/0_Dashboard/0-Dashboard.md".
 *
 *   flow(dv, app, ctx)     🔱 NEXUS FLOW — doughnut of the last 7 days by axis
 *   heatmap(dv, app, ctx)  14-day grid, one tile per day, five rows of markers
 *
 * WHY THIS IS A SCRIPT
 *   The two blocks were 90 and 91 lines inside callouts, 181 of the note's 324 lines.
 *   In Live Preview you scrolled past all of it before reaching the views.
 *
 * WHAT CHANGED BESIDES MOVING
 *   Both blocks carried the same three hard-coded lists of 45 persona names to decide
 *   whether a note belongs to PLM, PPM or PKM. personaEngine already owns that mapping
 *   (44 personas), so the lists are gone and both views ask the engine. One source of
 *   truth: adding a persona there now shows up here without touching this file.
 *
 * `ctx` is the dataviewjs `this` — needed for this.container inside a callout.
 */

function dashboardMain() {

    /** Loads personaEngine once and returns axisOf(persona) → "PLM" | "PPM" | "PKM" | "" */
    function axisResolver(app) {
        let pers = null;
        try {
            pers = require(app.vault.adapter.basePath + "/zData/2scripts/personaEngine.js")();
        } catch (e) { /* fall through — archtype matching below still works */ }

        return (persona) => {
            if (!pers || !persona) return "";
            const key = String(persona).toLowerCase().trim();
            const axis = pers.getAxis(key);
            return (axis && axis !== "Unknown") ? axis : "";
        };
    }

    /** Does any of a page's personas sit on `axis`, or does its archtype say so? */
    function makeAxisTest(dv, axisOf) {
        return (p, axis, extraTags) => {
            const personas = dv.array(p.persona);
            if (personas.some(m => axisOf(m) === axis)) return true;
            const arch = String(p.archtype || "").toLowerCase();
            return (extraTags || []).some(t => arch.includes(t));
        };
    }

    // ─── 🔱 NEXUS FLOW (doughnut) ─────────────────────────────────────────────
    async function flow(dv, app, ctx) {
        const chartContainer = ctx.container;
        const REFRESH_COOLDOWN = 30000;   // Lock against re-rendering on every keystroke.
        const now = Date.now();

        if (!window.lastNexusChartRender) window.lastNexusChartRender = 0;

        chartContainer.style.width = "100%";
        chartContainer.style.maxWidth = "240px";
        chartContainer.style.height = "230px";
        chartContainer.style.margin = "0 auto";

        const shouldRender = !chartContainer.querySelector('canvas')
            || (now - window.lastNexusChartRender > REFRESH_COOLDOWN);
        if (!shouldRender) return;
        window.lastNexusChartRender = now;

        const CACHE_KEY = "nexus-pie-cache";
        const CACHE_TIME = 60 * 60 * 1000;
        const lastUpdate = localStorage.getItem(CACHE_KEY + "-time");
        const cachedData = localStorage.getItem(CACHE_KEY);

        const getFreshData = () => {
            const axisOf = axisResolver(app);
            const onAxis = makeAxisTest(dv, axisOf);
            const start = window.moment().subtract(7, 'days').startOf('day');

            const entries = dv.pages('!"zData" AND -"yArchive"')
                .where(p => p.inbox !== true)
                .where(p => p.file.ctime >= start
                    || (p.cal_date && window.moment(p.cal_date.toString()).isAfter(start)));

            const data = [
                entries.filter(p => onAxis(p, "PLM", ["1plm", "plm"])).length,
                entries.filter(p => onAxis(p, "PPM", ["2ppm", "ppm"])).length,
                entries.filter(p => onAxis(p, "PKM", ["3pkm", "pkm", "study"])).length
            ];
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_KEY + "-time", now.toString());
            return data;
        };

        const dataToRender = (cachedData && lastUpdate && (now - lastUpdate < CACHE_TIME))
            ? JSON.parse(cachedData)
            : getFreshData();

        const hasData = dataToRender.some(v => v > 0);
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';

        const chartData = {
            type: 'doughnut',
            data: {
                labels: hasData ? ['Life', 'Manage', 'Knowledge'] : ['Empty Orbit'],
                datasets: [{
                    data: hasData ? dataToRender : [1],
                    backgroundColor: hasData ? ['#f5c2e7', '#a6e3a1', '#89dceb'] : ['var(--background-modifier-border)'],
                    borderWidth: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '76%',
                animation: false,   // Off, so it does not jump while you type.
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
                }
            }
        };

        // window.renderChart comes from the Charts plugin and may not be ready yet.
        const renderInterval = setInterval(() => {
            if (window.renderChart) {
                const oldCanvas = chartContainer.querySelector('canvas');
                if (oldCanvas) oldCanvas.remove();
                window.renderChart(chartData, chartContainer);
                clearInterval(renderInterval);
            }
        }, 150);
        setTimeout(() => clearInterval(renderInterval), 5000);
    }

    // ─── 14-DAY HEATMAP ───────────────────────────────────────────────────────
    async function heatmap(dv, app, ctx) {
        const chartContainer = ctx.container;
        const REFRESH_COOLDOWN = 30000;
        const now = Date.now();

        if (!window.lastHeatmapRender) window.lastHeatmapRender = 0;
        const shouldRender = !chartContainer.querySelector('.heatmap-grid')
            || (now - window.lastHeatmapRender > REFRESH_COOLDOWN);
        if (!shouldRender) return;
        window.lastHeatmapRender = now;

        const days = 14;
        const M = window.moment;
        const allPages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);

        const axisOf = axisResolver(app);
        const onAxis = makeAxisTest(dv, axisOf);

        // Calendar notes are dated by their name or cal_date; everything else by creation.
        const getNoteDate = (p) => {
            if (p.file.path.includes("0_Calendar")) {
                if (/^\d{4}-\d{2}-\d{2}/.test(p.file.name)) return p.file.name.substring(0, 10);
                if (p.cal_date) return String(p.cal_date).substring(0, 10);
            }
            return M(p.file.cday.toString()).format("YYYY-MM-DD");
        };

        const checkYaml = (p, field, value) => {
            if (!p || !p[field]) return false;
            const val = p[field];
            return Array.isArray(val)
                ? val.some(v => String(v).toLowerCase().includes(value.toLowerCase()))
                : String(val).toLowerCase().includes(value.toLowerCase());
        };

        const getIcon = (icon, exists) =>
            `<span style='opacity: ${exists ? "1" : "0.12"}; filter: ${exists ? "none" : "grayscale(100%)"}; margin: 0 1px;'>${icon}</span>`;

        // Seven columns for fourteen days — two weeks stacked.
        let tableHTML = "<div class='heatmap-grid' style='display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; width: 100%;'>";

        for (let i = days - 1; i >= 0; i--) {
            const mDate = M().subtract(i, 'days');
            const dateStr = mDate.format("YYYY-MM-DD");
            const isToday = (dateStr === M().format("YYYY-MM-DD"));
            const dayPages = allPages.filter(p => getNoteDate(p) === dateStr);

            tableHTML += `<div style='padding: 6px 2px; border: ${isToday ? "2px solid #a6e3a1" : "1px solid var(--background-modifier-border)"}; border-radius: 10px; background-color: var(--background-secondary); text-align: center;'>`;
            tableHTML += `<div style='font-size: 0.5em; color: var(--text-muted);'>${mDate.format("ddd")}</div>`;
            tableHTML += `<div style='font-size: 0.75em; font-weight: 800; margin-bottom: 2px;'>${mDate.format("DD.MM.")}</div>`;

            // ROW 1: the three daily axes
            tableHTML += "<div>" +
                getIcon("🌷", dayPages.some(p => onAxis(p, "PLM", ["plm"]))) +
                getIcon("🌻", dayPages.some(p => onAxis(p, "PPM", ["ppm"]) && !checkYaml(p, 'archtype', 'studylog'))) +
                getIcon("🌼", dayPages.some(p => onAxis(p, "PKM", ["pkm", "study"]))) +
                "</div>";

            // ROW 2: Stars
            tableHTML += "<div>" +
                getIcon("🌟", dayPages.some(p => checkYaml(p, 'archtype', '1purpose'))) +
                getIcon("🧭", dayPages.some(p => checkYaml(p, 'archtype', '2vision'))) +
                getIcon("🎯", dayPages.some(p => checkYaml(p, 'archtype', '3goals'))) +
                "</div>";

            // ROW 3: the seven areas, in chakra order
            tableHTML += "<div style='font-size: 0.75em;'>" +
                getIcon("<span class='cha1'>🌸</span>", dayPages.some(p => checkYaml(p, 'archtype', '1selfcare'))) +
                getIcon("<span class='cha2'>🎨</span>", dayPages.some(p => checkYaml(p, 'archtype', '2creativity'))) +
                getIcon("<span class='cha3'>🔥</span>", dayPages.some(p => checkYaml(p, 'archtype', '3drive'))) +
                getIcon("<span class='cha4'>🦄</span>", dayPages.some(p => checkYaml(p, 'archtype', '4relationship'))) +
                getIcon("<span class='cha5'>🗣️</span>", dayPages.some(p => checkYaml(p, 'archtype', '5expression'))) +
                getIcon("<span class='cha6'>🧠</span>", dayPages.some(p => checkYaml(p, 'archtype', '6mind'))) +
                getIcon("<span class='cha7'>🕉️</span>", dayPages.some(p => checkYaml(p, 'archtype', '7crown'))) +
                "</div>";

            // ROW 4: action
            tableHTML += "<div style='margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);'>" +
                getIcon("🧩", dayPages.some(p => checkYaml(p, 'arch', '#3project'))) +
                getIcon("🛠️", dayPages.some(p => checkYaml(p, 'arch', '#4task'))) +
                getIcon("✏️", dayPages.some(p => checkYaml(p, 'arch', '#5note'))) +
                "</div>";

            tableHTML += "</div>";   // closes the day tile
        }

        tableHTML += "</div>";
        dv.el("div", tableHTML);
    }

    return { flow, heatmap };
}

module.exports = dashboardMain;
