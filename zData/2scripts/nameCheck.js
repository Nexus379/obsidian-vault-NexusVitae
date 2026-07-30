/**
 * 🔎 NAME CHECK — the live duplicate guard for every prompt that names something new.
 *
 * WHY
 *   Without it you only find out that "Shopping List", "Shoppinglist" and "Einkaufsliste"
 *   are the same thing weeks later, when three half-filled notes disagree. The moment to
 *   notice is while typing the name, not while cleaning up.
 *
 * WHAT IT DOES
 *   Takes the name the user just typed and searches the existing notes of that archetype
 *   for anything close — same fuzzy matching as the routine and ingredient search, so
 *   typos, umlauts, word stems and loose letter order all count as "close". If something
 *   turns up, it offers the choice: use the existing note, or keep the new name anyway.
 *
 * NOT A BLOCKER
 *   It never refuses. Two things may legitimately have similar names, and the user is the
 *   one who knows. It only makes sure the decision is conscious.
 *
 * Used from a prompt:
 *   const nc = require(app.vault.adapter.basePath + "/zData/2scripts/nameCheck.js")();
 *   const res = await nc.check(app, tp, dv, { name, archTag: "#3project", label: "project" });
 *   if (res.existing) { … link to res.existing instead of creating … }
 *   const finalName = res.name;
 */

function nameCheck() {

    /**
     * check(app, tp, dv, opt) → { name, existing }
     *   opt.name     the name the user typed
     *   opt.archTag  which archetype to search, e.g. "#3project" / "#5note" / "#6resource"
     *   opt.folder   optional folder to limit the search to
     *   opt.label    what to call the thing in the question ("project", "note", …)
     *   opt.minScore how close counts as close (default 60 — prefix/substring, not typos)
     *
     * `existing` is the matched page when the user picks it, otherwise null.
     * `name` is what to go on with — the existing name, or the typed one.
     */
    async function check(app, tp, dv, opt) {
        const typed = String(opt && opt.name || "").trim();
        const out = { name: typed, existing: null };
        if (!typed || !dv) return out;

        const archTag = opt.archTag || "";
        const label = opt.label || "entry";
        const minScore = opt.minScore || 60;

        let i18n = null;
        try { i18n = require(app.vault.adapter.basePath + "/zData/2scripts/i18n.js")(); } catch (e) { }
        if (!i18n || typeof i18n.norm !== "function" || typeof i18n.fuzzyScore !== "function") return out;

        const term = i18n.norm(typed);
        if (!term) return out;

        // Candidates: the archetype's own notes. Cockpits and sub-notes carry a different
        // arch (or none), so filtering on the tag keeps them out without path juggling.
        const source = opt.folder ? dv.pages(`"${opt.folder}"`) : dv.pages();
        const candidates = source.where(p => {
            if (p.inbox === true) return false;
            if (String(p.file.path).startsWith("yArchive")) return false;
            if (String(p.file.path).startsWith("zData")) return false;
            if (!archTag) return true;
            return String(p.arch ?? "").includes(archTag) || String(p.archtype ?? "").includes(archTag);
        });

        const hits = [];
        for (const p of candidates) {
            const names = [p.file.name].concat(Array.isArray(p.aliases) ? p.aliases : (p.aliases ? [p.aliases] : []));
            let best = 0;
            for (const n of names) {
                const s = i18n.fuzzyScore(term, i18n.norm(n));
                if (s > best) best = s;
                if (best === 100) break;
            }
            if (best >= minScore) hits.push({ page: p, score: best });
        }
        if (hits.length === 0) return out;

        hits.sort((a, b) => b.score - a.score);

        const KEEP = "__keep__";
        const labels = hits.slice(0, 8).map(h =>
            `🔗 ${h.page.file.name}${h.score === 100 ? "  (identical)" : ""}`);
        const values = hits.slice(0, 8).map(h => h.page.file.path);

        const pick = await tp.system.suggester(
            [...labels, `➕ Create "${typed}" anyway`],
            [...values, KEEP],
            false,
            `⚠️ A similar ${label} already exists — use it, or create a new one?`
        );

        // ESC counts as "create anyway": never lose what the user typed.
        if (!pick || pick === KEEP) return out;

        const chosen = hits.find(h => h.page.file.path === pick);
        if (chosen) {
            out.existing = chosen.page;
            out.name = chosen.page.file.name;
        }
        return out;
    }

    return { check };
}

module.exports = nameCheck;
