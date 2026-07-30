/**
 * 🛠️ TASK CENTER — the two boards of "0_Atlas/0_Dashboard/4-Tasks/0-Task-Center.md".
 *
 *   statusBoard(dv)  groups every task by status  (Start · Active · Review · … · Done)
 *   typeBoard(dv)    groups the OPEN ones by type (Cook · Craft · Pay · … · Other)
 *
 * WHY THIS IS A SCRIPT
 *   The two blocks were 36 and 81 lines in the note, and both carried their own copy of
 *   the same helpers and the same task-collection logic. Collecting tasks is the tricky
 *   part — a task is either a note in 4_Tasks or a checkbox line tagged #4task anywhere
 *   in the vault — and having that written twice meant the boards could drift apart.
 *   They now share one collect() and differ only in how they group.
 *
 * Used from the note:
 *   await require(app.vault.adapter.basePath + "/zData/2scripts/taskCenter.js")().statusBoard(dv);
 */

function taskCenter() {

    const clean = (value) => String(value ?? "").toLowerCase();

    const esc = (value) => String(value ?? "").replace(/[&<>"']/g, ch =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

    /** A page counts as a task if its tags say so or it simply lives in 4_Tasks. */
    const hasTaskContext = (p) =>
        clean(p.arch).includes("#4task")
        || clean(p.archtype).includes("#4task")
        || p.file.path.includes("4_Tasks");

    const dueSort = (item) => item.due ? window.moment(item.due.toString()).valueOf() : 9999999999999;
    const dueLabel = (item, fmt) => item.due ? window.moment(item.due.toString()).format(fmt) : "";

    /**
     * collect(dv, opt) → the flat task list both boards work from.
     *   opt.openOnly  true = drop everything closed or completed
     * Two sources: task NOTES, and checkbox lines tagged #4task in any note.
     */
    function collect(dv, opt) {
        const openOnly = opt && opt.openOnly;
        const CLOSED = ["done", "canceled", "archive", "archived", "bin"];
        const openStatus = (p) => !CLOSED.includes(clean(p.status)) && p.done !== true;

        const pages = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox !== true);
        const items = [];

        pages.where(p => hasTaskContext(p) && (!openOnly || openStatus(p))).forEach(p => {
            items.push({
                name: p.file.name,
                path: p.file.path,
                status: clean(p.status) || "1active",
                priority: String(p.priority ?? ""),
                due: p.due,
                archtype: String(dv.array(p.archtype).join(", ")),
                source: "Task File"
            });
        });

        let inline = pages
            .where(p => hasTaskContext(p) || p.file.tasks.where(t => clean(t.text).includes("#4task")).length)
            .file.tasks
            .where(t => !t.path.includes("zData") && !t.path.includes("yArchive"))
            .where(t => hasTaskContext(dv.page(t.path)) || clean(t.text).includes("#4task"));

        if (openOnly) inline = inline.where(t => !t.completed);

        inline.forEach(t => {
            const p = dv.page(t.path);
            items.push({
                name: t.text.replace(/#[^\s]+/g, "").trim(),
                path: t.path,
                status: t.completed ? "done" : (clean(p.status) || "inline"),
                priority: String(t.priority ?? p.priority ?? ""),
                due: t.due || p.due,
                archtype: String(dv.array(p.archtype).join(", ")),
                source: p.file.name
            });
        });

        return items;
    }

    /** One column of the grid — shared by both boards. */
    function column(title, color, list, limit, fmt, subLabel) {
        const top = list.slice(0, limit);
        let html = `<div style="border-left:3px solid ${color}; background:var(--background-secondary); border-radius:6px; padding:8px;">`;
        html += `<div style="font-size:.72em; font-weight:800; color:${color}; text-transform:uppercase; margin-bottom:6px;">${esc(title)} · ${list.length}</div>`;
        if (!top.length) html += `<div style="font-size:.7em; color:var(--text-faint);">empty</div>`;
        for (const item of top) {
            const sub = subLabel ? subLabel(item) : "";
            html += `<div style="padding:5px 0; border-top:1px solid var(--background-modifier-border);">`
                + `<a class="internal-link" href="${item.path}" style="font-size:.78em; font-weight:650; color:var(--text-normal); text-decoration:none;">${esc(item.name)}</a>`
                + `<div style="font-size:.62em; color:var(--text-muted);">${esc(item.source)}${sub}${dueLabel(item, fmt) ? " · " + dueLabel(item, fmt) : ""}</div>`
                + `</div>`;
        }
        return html + `</div>`;
    }

    const GRID_OPEN = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">`;

    // ─── STATUS BOARD ─────────────────────────────────────────────────────────
    async function statusBoard(dv) {
        const STATUSES = [
            { key: "0start",   title: "Start",   color: "#89dceb" },
            { key: "1active",  title: "Active",  color: "#a6e3a1" },
            { key: "review",   title: "Review",  color: "#cba6f7" },
            { key: "2passive", title: "Passive", color: "#f9e2af" },
            { key: "3idea",    title: "Idea",    color: "#fab387" },
            { key: "inline",   title: "Inline",  color: "#bac2de" },
            { key: "done",     title: "Done",    color: "#94e2d5" }
        ];

        const items = collect(dv, { openOnly: false });
        const archLabel = (item) => item.archtype.replace(/#4task\//g, "").replace(/#4task/g, "").trim();
        const sub = (item) => archLabel(item) ? " · " + esc(archLabel(item)) : "";

        let html = GRID_OPEN;
        for (const status of STATUSES) {
            const list = items.filter(i => i.status === status.key).sort((a, b) => dueSort(a) - dueSort(b));
            html += column(status.title, status.color, list, 18, "DD.MM.YYYY", sub);
        }
        dv.el("div", html + `</div>`);
    }

    // ─── TYPE BOARD ───────────────────────────────────────────────────────────
    async function typeBoard(dv) {
        // Icons match the task templates and the 4-Tasks bases.
        const TYPES = [
            { label: "🍜 Cook",  key: "tocook",  color: "#f38ba8" },
            { label: "🎀 Craft", key: "tocraft", color: "#fab387" },
            { label: "💵 Pay",   key: "topay",   color: "#f9e2af" },
            { label: "💰 Buy",   key: "tobuy",   color: "#eed49f" },
            { label: "🛠️ Do",    key: "todo",    color: "#a6e3a1" },
            { label: "🏃🏽 Go",    key: "togo",    color: "#94e2d5" },
            { label: "📅 Meet",  key: "tomeet",  color: "#89dceb" },
            { label: "🎓 Study", key: "tostudy", color: "#89b4fa" },
            { label: "📥 Get",   key: "toget",   color: "#cba6f7" }
        ];

        const typeKeyOf = (archtype, text) => {
            const hay = `${clean(archtype)} ${clean(text)}`;
            const found = TYPES.find(t => hay.includes(t.key));
            return found ? found.key : "other";
        };

        const items = collect(dv, { openOnly: true }).map(i => ({
            ...i,
            type: typeKeyOf(i.archtype, i.source === "Task File" ? "" : i.name)
        }));

        const grouped = new Map();
        TYPES.forEach(t => grouped.set(t.key, []));
        grouped.set("other", []);
        items.forEach(i => {
            if (!grouped.has(i.type)) grouped.set(i.type, []);
            grouped.get(i.type).push(i);
        });

        let html = GRID_OPEN;
        for (const t of [...TYPES, { label: "Other", key: "other", color: "var(--text-muted)" }]) {
            const list = (grouped.get(t.key) ?? []).sort((a, b) => dueSort(a) - dueSort(b));
            html += column(t.label, t.color, list, 6, "DD.MM", null);
        }
        dv.el("div", html + `</div>`);
    }

    return { statusBoard, typeBoard, collect };
}

module.exports = taskCenter;
