// zData/2scripts/dashEngine.js
// ⚡ One vault pass for dashboards and overviews.
//
// ARBEITSTEILUNG IM SYSTEM
//   Bases  → the lists in the dashboards. Native, indexed, virtualised.
//   Engine → what Bases cannot do: count across folders, read foreign
//            prepare chart values — and render the overview pages, which are
//            deliberately compact and card-like rather than tabular.
//
// WHY IT EXISTS
// The eight area dashboards shared one matcher that built a twelve-field string
// per page — across five folders, for six chart values, on every render. Here it
// happens once; the result holds until Dataview reindexes.
//
// VERWENDUNG
//   const dash = await require(app.vault.adapter.basePath + "/zData/2scripts/dashEngine.js")().load(dv, app);
//   dash.areaCounts("3drive")            → the numbers for the doughnut
//   dash.chart(this, values, labels, colors)
//   dash.areaPage("3drive")              → finished overview page for one area
//   dash.sectionPage({ filter: … })      → finished overview page for one family

function dashEngine() {

    const STATUS_CLOSED = ["done", "canceled", "archived", "bin"];
    const BUCKETS = ["3_Projects/", "4_Tasks/", "5_Notes/", "6_Resources/", "0_Calendar/"];

    // The cache key is the Dataview index revision: change the vault and the cache
    // drops by itself. No timer, no manual invalidation.
    function revisionOf(dv, app) {
        try { return dv.index.revision; } catch (e) {}
        try { return app.metadataCache.getCachedFiles().length; } catch (e) {}
        return 0;
    }

    function buildSnapshot(dv) {
        const rows = [];
        for (const p of dv.pages('!"zData" AND -"yArchive" AND !"0_Atlas"')) {
            if (p.inbox === true) continue;

            const path = p.file.path;
            const status = String(p.status || "1active").toLowerCase();

            let bucket = null;
            for (const b of BUCKETS) { if (path.startsWith(b)) { bucket = b; break; } }

            rows.push({
                page: p,
                path,
                name: p.file.name,
                link: p.file.link,
                mtime: p.file.mtime,
                status,
                open: !STATUS_CLOSED.includes(status),
                bucket,
                // Keep the two cheap fields apart — they answer almost every
                // area question; the expensive rest is assembled only on demand.
                archtype: String(p.archtype ?? "").toLowerCase(),
                area2: String(p.area2 ?? "").toLowerCase(),
                _hay: null,
                isProject:  path.startsWith("3_Projects/"),
                isTask:     path.startsWith("4_Tasks/"),
                isNote:     path.startsWith("5_Notes/"),
                isResource: path.startsWith("6_Resources/"),
                isCalendar: path.startsWith("0_Calendar/"),
                isStar:     path.startsWith("1_Stars/"),
                isArea:     path.startsWith("2_Areas/"),
            });
        }

        // Inbox counted separately — by definition it sits outside the main body.
        const inboxCount = dv.pages('!"zData" AND -"yArchive"').where(p => p.inbox === true).length;

        return { rows, inboxCount };
    }

    async function load(dv, app) {
        const rev = revisionOf(dv, app);
        const store = window.__nexusDash;

        let snap;
        if (store && store.rev === rev && store.snap) {
            snap = store.snap;
        } else {
            snap = buildSnapshot(dv);
            window.__nexusDash = { rev, snap };
        }

        const rows = snap.rows;
        const inboxCount = snap.inboxCount;

        // Expensive field join, only when archtype/area2 miss — and then cached.
        const deepHay = (r) => {
            if (r._hay === null) {
                const p = r.page;
                r._hay = String([p.file.path, p.file.outlinks, p.arch, p.parent,
                    p.sibling, p.child, p.project3, p.task4, p.note5, p.resource6]
                    .join(" ")).toLowerCase();
            }
            return r._hay;
        };

        const linked = (r, key) =>
            r.archtype.includes(key) || r.area2.includes(key) || deepHay(r).includes(key);

        const api = {
            rows,
            all: rows,
            inboxCount,
            linked,

            count: (fn) => rows.reduce((n, r) => n + (fn(r) ? 1 : 0), 0),
            where: (fn) => rows.filter(fn),
            area: (key) => rows.filter(r => linked(r, key)),

            recent: (limit = 8, fn = null) =>
                (fn ? rows.filter(fn) : rows).slice()
                    .sort((a, b) => b.mtime - a.mtime).slice(0, limit),

            fmtDate: (d) => { try { return d.toFormat("dd.MM.yyyy"); } catch (e) { return ""; } },

            linkTo: (p, text) => `<a class="internal-link" href="${p.path}">${text || p.name}</a>`,

            // The six values of the area doughnut, in ONE pass.
            areaCounts: (key) => {
                const out = { own: 0, projects: 0, tasks: 0, notes: 0, resources: 0, calendar: 0 };
                const map = {
                    "3_Projects/": "projects", "4_Tasks/": "tasks", "5_Notes/": "notes",
                    "6_Resources/": "resources", "0_Calendar/": "calendar",
                };
                for (const r of rows) {
                    if (r.archtype.includes("#2area/" + key)) out.own++;
                    if (r.bucket && linked(r, key)) out[map[r.bucket]]++;
                }
                return out;
            },

            // ── Rendering for the overview pages ─────────────────────
            statCards: (tiles) => {
                let html = '<div class="nv-grid">';
                for (const t of tiles) {
                    const empty = !t.n ? " is-empty" : "";
                    const num = t.href ? `<a class="internal-link" href="${t.href}">${t.n}</a>` : t.n;
                    html += `<div class="nv-card nv-link nv-stat${empty}">`
                          + `<div class="nv-label">${t.label}</div>`
                          + `<div class="nv-num">${num}</div>`
                          + (t.sub ? `<div class="nv-sub">${t.sub}</div>` : "")
                          + `</div>`;
                }
                return html + "</div>";
            },

            table: (rowsIn, headers) => {
                if (!rowsIn.length) return `<p class="nv-sub">Nothing here. Not yet.</p>`;
                let html = "<table><thead><tr>";
                for (const h of headers) html += `<th>${h}</th>`;
                html += "</tr></thead><tbody>";
                for (const r of rowsIn) {
                    html += "<tr>";
                    for (const c of r) html += `<td>${c ?? ""}</td>`;
                    html += "</tr>";
                }
                return html + "</tbody></table>";
            },

            // Draw the doughnut — UNIFORM across all dashboards.
            // Fixed height instead of aspect ratio: otherwise Chart.js derives the
            // height from the width, puts the legend below on top of that, and the
            // chart gets cut off in narrow columns, or is left standing as an empty gap.
            chart: (ctx, values, labels, colors, opt = {}) => {
                const el = ctx.container;
                el.style.width = "100%";
                el.style.maxWidth = opt.width || "240px";
                el.style.height = opt.height || "230px";
                el.style.margin = "0 auto";

                const hasData = values.some(v => v > 0);
                const textColor = getComputedStyle(document.body)
                    .getPropertyValue("--text-normal").trim() || "#cdd6f4";

                const data = {
                    type: "doughnut",
                    data: {
                        labels: hasData ? labels : ["Empty Orbit"],
                        datasets: [{
                            data: hasData ? values : [1],
                            backgroundColor: hasData ? colors : ["var(--background-modifier-border)"],
                            borderWidth: 0, hoverOffset: 10,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: opt.cutout || "76%",
                        layout: { padding: { top: 4, bottom: 4 } },
                        plugins: { legend: { position: "bottom", labels: {
                            color: textColor, padding: 10, usePointStyle: true, boxWidth: 8,
                            font: { size: 10, weight: "bold", family: "serif" },
                        } } },
                    },
                };

                const draw = () => {
                    const old = el.querySelector("canvas");
                    if (old) old.remove();
                    window.renderChart(data, el);
                };
                if (window.renderChart) return draw();
                let wait = 60;
                const tick = () => {
                    if (window.renderChart) return draw();
                    if ((wait *= 1.6) < 4000) setTimeout(tick, wait);
                };
                setTimeout(tick, wait);
            },
        };

        // A complete area page. Lives here instead of in seven files,
        // so one layout change reaches all of them.
        api.areaPage = (key) => {
            const mine = api.area(key);
            const out = [];
            const strip = (v, re) => String(v ?? "").replace(re, "");

            out.push(`<h2>At a glance</h2>`);
            out.push(api.statCards([
                { label: "Entries", n: mine.length,                                    sub: "in this area" },
                { label: "Projects", n: mine.filter(p => p.isProject && p.open).length, sub: "open" },
                { label: "Tasks",    n: mine.filter(p => p.isTask && p.open).length,    sub: "open" },
                { label: "Notes",  n: mine.filter(p => p.isNote).length,              sub: "linked" },
            ]));

            const section = (title, rowsIn, headers) => {
                out.push(`<h2>${title}</h2>`);
                out.push(api.table(rowsIn, headers));
            };

            section("Stars this area serves",
                mine.filter(p => p.isStar).slice(0, 8)
                    .map(p => [api.linkTo(p), strip(p.page.archtype, /#1stars\//), p.status, p.page.due ?? ""]),
                ["Star", "Art", "Status", "Due"]);

            section("Projects & Tasks",
                mine.filter(p => (p.isProject || p.isTask) && p.open)
                    .sort((a, b) => String(a.page.priority ?? "9").localeCompare(String(b.page.priority ?? "9")))
                    .slice(0, 12)
                    .map(p => [api.linkTo(p), strip(p.page.archtype, /#\d\w+\//), p.page.priority ?? "", p.page.due ?? ""]),
                ["Entry", "Art", "Prio", "Due"]);

            section("Notes & Ressourcen",
                mine.filter(p => p.isNote || p.isResource)
                    .sort((a, b) => b.mtime - a.mtime).slice(0, 12)
                    .map(p => [api.linkTo(p), strip(p.page.archtype, /#\d\w+\//), strip(p.page.discipline, /#disc\//), api.fmtDate(p.mtime)]),
                ["Entry", "Art", "Discipline", "Modified"]);

            section("Logs & Reviews",
                mine.filter(p => p.isCalendar).sort((a, b) => b.mtime - a.mtime).slice(0, 10)
                    .map(p => [api.linkTo(p), strip(p.page.archtype, /#0cal\//), api.fmtDate(p.mtime)]),
                ["Entry", "Art", "Modified"]);

            return out.join("");
        };

        // Generic collection page: one slice of the vault, always built the same way.
        //   cfg.filter   required — which pages belong to it
        //   cfg.groups   optional — Untergruppen als Kacheln [{label, filter, sub, href}]
        //   cfg.columns  optional — columns of the main table
        //   cfg.limit    optional — Zeilen (Default 20)
        //   cfg.sort     optional — "mtime" (Default) | "priority" | "name"
        api.sectionPage = (cfg) => {
            const mine = api.where(cfg.filter);
            const out = [];
            const strip = (v) => String(v ?? "").replace(/#[\w\d]+\//, "");

            const sorters = {
                mtime:    (a, b) => b.mtime - a.mtime,
                name:     (a, b) => a.name.localeCompare(b.name),
                priority: (a, b) => String(a.page.priority ?? "9").localeCompare(String(b.page.priority ?? "9")) || b.mtime - a.mtime,
            };
            const sorted = mine.slice().sort(sorters[cfg.sort || "mtime"]);

            out.push(`<h2>At a glance</h2>`);
            if (cfg.groups && cfg.groups.length) {
                out.push(api.statCards(cfg.groups.map(g => ({
                    label: g.label,
                    n: mine.filter(g.filter).length,
                    sub: g.sub,
                    href: g.href,
                }))));
            } else {
                out.push(api.statCards([
                    { label: "Total", n: mine.length,                      sub: "Entries" },
                    { label: "Offen",     n: mine.filter(p => p.open).length,  sub: "in progress" },
                    { label: "Done",  n: mine.filter(p => !p.open).length, sub: "completed" },
                ]));
            }

            const cols = cfg.columns || ["Entry", "Art", "Status", "Modified"];
            const limit = cfg.limit || 20;
            out.push(`<h2>${cfg.tableTitle || "Entries"}</h2>`);
            out.push(api.table(
                sorted.slice(0, limit).map(p => {
                    const cells = [api.linkTo(p)];
                    if (cols.includes("Art"))       cells.push(strip(p.page.archtype));
                    if (cols.includes("Status"))    cells.push(p.status);
                    if (cols.includes("Prio"))      cells.push(p.page.priority ?? "");
                    if (cols.includes("Due"))    cells.push(p.page.due ?? "");
                    if (cols.includes("Discipline")) cells.push(String(p.page.discipline ?? "").replace("#disc/", ""));
                    if (cols.includes("Area"))   cells.push(String(p.page.area2 ?? "").replace("#2area/", ""));
                    if (cols.includes("Modified"))  cells.push(api.fmtDate(p.mtime));
                    return cells;
                }),
                cols
            ));

            if (sorted.length > limit) {
                out.push(`<p class="nv-sub">… and ${sorted.length - limit} more.</p>`);
            }

            return out.join("");
        };

        return api;
    }

    return { load };
}

module.exports = dashEngine;
