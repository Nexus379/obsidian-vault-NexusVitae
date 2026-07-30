/**
 * 📚 STUDY RADAR — the learning queue of "0-Calendar_Studyboard.md".
 *
 * Shows study notes and #4task/tostudy items with a discipline, ordered by what needs
 * attention first. Two kinds of row appear:
 *
 *   already in the internal SRS  → has study_lvl / study_rank / study_date.
 *                                  Urgent once study_date has arrived.
 *   not scheduled yet            → no study_lvl. Urgent when nothing holds it:
 *                                  no due date, no do date, no project3.
 *
 * The internal system is the Star Trek ladder from add-spaced-rep.md: 44 intervals from
 * 2 days to 10 years, 24 ranks from "Ground Crew (Sprout)" to "Nexus Core". Both
 * #5note/3atomic/studycards and #5note/3atomic/cards live in it — every card is a
 * studycard, not every studycard is an Anki card — so neither is filtered out here.
 *
 * FOUR THINGS WERE WRONG in the version that lived inside the note:
 *   p.RecDays               → recdays   (Dataview field access is case sensitive, so the
 *                                        repeat marker never appeared: always 📌)
 *   p["repetition-status"]  → study_rank / study_lvl  (the fields that exist)
 *   p.project               → project3  (used by 41 templates; the old name read
 *                                        undefined, so every dateless note was urgent)
 *   status.includes("spaced") as the "already scheduled" test — no template ever writes
 *                           such a status, so it excluded nothing. study_lvl decides.
 *
 * Used from the note:
 *   await require(app.vault.adapter.basePath + "/zData/2scripts/studyRadar.js")().render(dv);
 */

function studyRadar() {

    // Same icon ladder as add-spaced-rep.md, so a rank shows the same symbol everywhere.
    const RANK_ICONS = ["🌱", "🌿", "🍀", "⚓", "🖖", "🎖️", "🚢", "🏛️", "📡", "🛰️", "☄️", "🌌",
        "🛸", "👁️", "🌀", "✨", "🎭", "🔱", "💎", "👑", "🌟", "🪐", "🌠", "🌌"];

    async function render(dv) {
        const M = window.moment;
        const today = M();

        const notes = dv.pages('(#5note OR #4task/tostudy) AND !"zData" AND -"yArchive"')
            .where(p => p.inbox !== true)
            .where(p => p.discipline);

        const processed = notes.map(p => {
            const inSrs = p.study_lvl !== undefined && p.study_lvl !== null;
            const lvl = inSrs ? Number(p.study_lvl) || 0 : null;

            const studyDate = p.study_date ? M(p.study_date.toString()) : null;
            const due = p.due ? M(p.due.toString()) : null;
            const doDate = p.do ? M(p.do.toString()) : null;
            const hasProject = p.project3 && String(p.project3).trim() !== "";

            let urgent = false;
            let when = "";
            if (inSrs) {
                // A scheduled item is due when its next review date has arrived.
                urgent = studyDate ? studyDate.diff(today, 'days') <= 0 : false;
                when = studyDate ? studyDate.format("YYYY-MM-DD") : "—";
            } else {
                // Not scheduled: urgent if nothing holds it, or if it is nearly due.
                if (!due && !doDate && !hasProject) urgent = true;
                else if (due && due.diff(today, 'days') <= 7) urgent = true;
                when = due ? due.format("YYYY-MM-DD") : (doDate ? doDate.format("YYYY-MM-DD") : "—");
            }

            const stage = inSrs
                ? `${RANK_ICONS[Math.min(lvl, RANK_ICONS.length - 1)]} ${p.study_rank || "Level " + lvl}`
                : "➖ not scheduled";

            return {
                link: p.file.link,
                disc: p.discipline,
                type: (Number(p.recdays) > 0) ? "🔁" : "📌",
                urgent: urgent ? "🔥 Now" : "☁️ Later",
                when: when,
                stage: stage,
                sortKey: (urgent ? 0 : 1)
            };
        });

        dv.header(2, "📚 Strategic Learning Queue");

        dv.table(["Urgency", "Type", "Subject", "Topic", "Next", "Stage"],
            processed
                .sort(n => n.sortKey, "asc")
                .map(n => [n.urgent, n.type, n.disc, n.link, n.when, n.stage])
        );
    }

    return { render, RANK_ICONS };
}

module.exports = studyRadar;
