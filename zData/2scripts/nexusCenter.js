/**
 * 🔱 NEXUS CENTER — the global statistics view.
 *
 * WHY THIS IS A SCRIPT AND NOT A CODE BLOCK IN THE NOTE
 *   In Live Preview a 190-line dataviewjs block means scrolling past all of it before
 *   the rendered view appears. Everything here used to sit inside "0_Atlas/Nexus Center.md";
 *   that note is now three lines and shows its output straight away.
 *
 * PERFORMANCE
 *   Runs on the shared dashEngine snapshot — one vault pass, cached on dv.index.revision
 *   and reused by all overviews. Every number below is then tallied in a SINGLE loop over
 *   that array. The previous version issued 21 separate dv.pages() queries for the same
 *   figures, which is what made the page slow.
 *
 * Used from the note:
 *   const nc = require(app.vault.adapter.basePath + "/zData/2scripts/nexusCenter.js")();
 *   await nc.render(dv, app);
 */

function nexusCenter() {

    // ─── PIE (CSS conic-gradient — no chart library, no canvas) ───────────────
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

    const kpi = (title, mainNum, sub, icon, color) => `
    <div style="background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-top: 3px solid ${color}; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 1.5em; margin-bottom: 4px;">${icon}</div>
        <div style="font-size: 2.2em; font-weight: 900; color: var(--text-normal); font-family: monospace; line-height: 1.1;">${mainNum}</div>
        <div style="font-size: 0.7em; text-transform: uppercase; font-weight: 800; color: ${color}; margin-top: 6px;">${title}</div>
        <div style="font-size: 0.65em; color: var(--text-muted); margin-top: 4px;">${sub}</div>
    </div>`;

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

    // ─── TALLY ────────────────────────────────────────────────────────────────
    function tally(rows) {
        const arch  = { cal: 0, stars: 0, area: 0, project: 0, task: 0, note: 0, resource: 0 };
        const areas = { "1selfcare": 0, "2creativity": 0, "3drive": 0, "4relationship": 0, "5expression": 0, "6mind": 0, "7crown": 0 };
        const notes = { "1fleeting": 0, "2literature": 0, "3atomic": 0, "4permanent": 0, "5evergreen": 0 };
        const proj  = { active: 0, passive: 0, idea: 0, done: 0 };

        for (const r of rows) {
            if (r.isCalendar) arch.cal++;
            else if (r.isStar) arch.stars++;
            else if (r.isArea) arch.area++;
            else if (r.isProject) arch.project++;
            else if (r.isTask) arch.task++;
            else if (r.isNote) arch.note++;
            else if (r.isResource) arch.resource++;

            // archtype is pre-lowercased by dashEngine, so these are plain string tests.
            for (const k in areas) if (r.archtype.includes("2area/" + k)) areas[k]++;
            for (const k in notes) if (r.archtype.includes("5note/" + k)) notes[k]++;

            if (r.isProject) {
                if (r.status === "1active") proj.active++;
                else if (r.status === "2passive") proj.passive++;
                else if (r.status === "3idea") proj.idea++;
                else if (r.status === "done") proj.done++;
            }
        }
        return { arch, areas, notes, proj };
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────
    async function render(dv, app) {
        const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
        const { arch, areas, notes, proj } = tally(dash.rows);

        // Checkbox tasks inside notes are not part of the snapshot — one query, not twenty-one.
        const allTasks = dv.pages('!"zData" and !"yArchive" and !"xAttachment"').file.tasks;
        const openTasks = allTasks.where(t => !t.completed).length;
        const doneTasks = allTasks.where(t => t.completed).length;
        const totalTasks = allTasks.length || 1;

        const totalFiles = dash.rows.length;
        const totalNotes = arch.note;
        const totalProjects = arch.project;

        const archData = [
            { label: "📅 Calendar",  count: arch.cal,      color: "#b4befe" },
            { label: "✨ Stars",     count: arch.stars,    color: "#f9e2af" },
            { label: "💠 Areas",     count: arch.area,     color: "#a6e3a1" },
            { label: "🧩 Projects",  count: arch.project,  color: "#fab387" },
            { label: "🛠️ Tasks",     count: arch.task,     color: "#f38ba8" },
            { label: "✏️ Notes",     count: arch.note,     color: "#74c7ec" },
            { label: "🔖 Resources", count: arch.resource, color: "#cba6f7" }
        ];

        // The seven areas in chakra order. The old list had Drive twice (as "Organize" and
        // "Activity"), labelled Crown as "Entertain", and left Expression out entirely.
        const areasData = [
            { label: "🌸 Selfcare",     count: areas["1selfcare"],     color: "#f38ba8" },
            { label: "🎨 Creativity",   count: areas["2creativity"],   color: "#fab387" },
            { label: "🔥 Drive",        count: areas["3drive"],        color: "#f9e2af" },
            { label: "🦄 Relationship", count: areas["4relationship"], color: "#a6e3a1" },
            { label: "🗣️ Expression",   count: areas["5expression"],   color: "#74c7ec" },
            { label: "🧠 Mind",         count: areas["6mind"],         color: "#89b4fa" },
            { label: "🕉️ Crown",        count: areas["7crown"],        color: "#cba6f7" }
        ];

        const notesData = [
            { label: "🍂 Fleeting",   count: notes["1fleeting"],   color: "#bac2de" },
            { label: "📘 Literature", count: notes["2literature"], color: "#89b4fa" },
            { label: "⚛️ Atomic",     count: notes["3atomic"],     color: "#f38ba8" },
            { label: "📜 Permanent",  count: notes["4permanent"],  color: "#cba6f7" },
            { label: "🌳 Evergreen",  count: notes["5evergreen"],  color: "#a6e3a1" }
        ];

        const projectData = [
            { label: "🟢 Active",  count: proj.active,  color: "#a6e3a1" },
            { label: "🟡 Passive", count: proj.passive, color: "#89b4fa" },
            { label: "💡 Idea",    count: proj.idea,    color: "#cba6f7" },
            { label: "✅ Done",    count: proj.done,    color: "#bac2de" }
        ];

        let html = `<div style="display: flex; flex-direction: column; gap: 20px; font-family: var(--font-interface);">`;

        // ROW 1: hard facts
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;">`;
        html += kpi("Total Nexus", totalFiles, "Content Files", "🌌", "#cba6f7");
        html += kpi("Inbox", dash.inboxCount, "To Process", "💌", "#f9e2af");
        html += kpi("Open Tasks", openTasks, "Pending", "🛠️", "#f38ba8");
        html += kpi("Done Tasks", doneTasks, "Completed", "✅", "#a6e3a1");
        html += kpi("Total Notes", totalNotes, "Secured Knowledge", "🧠", "#74c7ec");
        html += kpi("Total Projects", totalProjects, "In Pipeline", "🚧", "#fab387");
        html += `</div>`;

        // ROW 2: master pie + statistics
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px;">`;
        html += createPie("Master Architecture (Global)", archData, 220, true);
        html += `
    <div style="background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 0.9em; text-transform: uppercase; font-weight: 800; color: var(--text-muted); margin-bottom: 16px; border-bottom: 2px solid var(--background-modifier-border); padding-bottom: 4px;">📊 System Statistics</div>
        ${bar("Tasks Completed (Done Rate)", doneTasks, totalTasks, "#a6e3a1")}
        ${bar("Tasks Open (Backlog)", openTasks, totalTasks, "#f38ba8")}
        <div style="margin: 12px 0; border-top: 1px dashed var(--background-modifier-border);"></div>
        ${bar("Active Projects", proj.active, totalProjects || 1, "#fab387")}
        ${bar("Passive Projects / Ideas", proj.passive + proj.idea, totalProjects || 1, "#89b4fa")}
        ${bar("Notes: Permanent & Evergreen", notes["4permanent"] + notes["5evergreen"], totalNotes || 1, "#cba6f7")}
    </div>`;
        html += `</div>`;

        // ROW 3: satellites
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">`;
        html += createPie("Areas", areasData, 120, false);
        html += createPie("Notes", notesData, 120, false);
        html += createPie("Projects", projectData, 120, false);
        html += `</div>`;

        html += `</div>`;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        dv.container.appendChild(wrapper);
    }

    return { render, tally, createPie, kpi, bar };
}

module.exports = nexusCenter;
