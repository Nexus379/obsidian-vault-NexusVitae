---
cssclasses:
  - wide-page
  - srs-card-dashboard
---

# Spaced Repetition Master Overview

![[zData/5design_modul/OverviewNavigationModul]]

<div class="nxs-card-links">
  <a class="internal-link" data-href="0_Atlas/0_Overview/SRS_Studycards_Overview.md" href="0_Atlas/0_Overview/SRS_Studycards_Overview.md">Studycards</a>
  <a class="internal-link" data-href="0_Atlas/0_Overview/SRS_Flashcards_Overview.md" href="0_Atlas/0_Overview/SRS_Flashcards_Overview.md">Vocabcards</a>
</div>

```dataviewjs
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));

const first = value => Array.isArray(value) ? value[0] : value;
const arch = page => String(page.archtype ?? "");
const tags = page => Array.isArray(page.file?.tags) ? page.file.tags : [];
const isVocab = page => arch(page).includes("#5note/3atomic/vocabcards") || tags(page).includes("#vocabcards");
const isStudy = page => page.space_rank != null || page.space_lvl != null || arch(page).includes("#5note/3atomic/studycards");
const link = page => `<a class="internal-link" data-href="${esc(page.file.path)}" href="${esc(page.file.path)}">${esc(page.file.name)}</a>`;
const label = value => String(first(value) ?? "General").replace(/^#/, "");
const deckName = page => String(page.deck || label(page.discipline || page.discTag || page.areaTag) || "General");

const pages = dv.pages('"5_Notes" or "6_Resources"')
  .where(page => isVocab(page) || isStudy(page))
  .array();

const today = moment().startOf("day");
const dueDiff = page => page.space_date ? moment(page.space_date).startOf("day").diff(today, "days") : 9999;
const overdue = pages.filter(page => dueDiff(page) < 0);
const dueToday = pages.filter(page => dueDiff(page) === 0);
const future = pages.filter(page => dueDiff(page) > 0 && dueDiff(page) < 9999);
const unscheduled = pages.filter(page => dueDiff(page) === 9999);
const vocab = pages.filter(isVocab);
const study = pages.filter(isStudy);

const summary = [
  ["All cards", pages.length, "combined Nexus + plugin review pool"],
  ["Studycards", study.length, "Nexus internal ranks"],
  ["Vocabcards", vocab.length, "Obsidian Spaced Repetition plugin"],
  ["Due now", overdue.length + dueToday.length, `${overdue.length} overdue, ${dueToday.length} today`]
];

const render = (html, cls) => {
  const node = dv.el("div", "", { cls });
  node.innerHTML = html;
  return node;
};

render(summary.map(([title, count, note]) => `
  <div class="nxs-deck-card">
    <div>
      <div class="nxs-card-kicker">${esc(note)}</div>
      <div class="nxs-card-title">${esc(title)}</div>
    </div>
    <div class="nxs-card-count">${count}</div>
  </div>
`).join(""), "nxs-card-grid");

const groups = new Map();
for (const page of pages) {
  const key = deckName(page);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(page);
}

const deckCards = Array.from(groups.entries())
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([deck, cards]) => {
    const due = cards.filter(page => dueDiff(page) <= 0).length;
    const next = cards
      .filter(page => dueDiff(page) < 9999)
      .sort((a, b) => dueDiff(a) - dueDiff(b))[0];
    const nextText = next ? `${dueDiff(next) <= 0 ? "now" : `in ${dueDiff(next)}d`}` : "no date";
    return `
      <div class="nxs-deck-card">
        <div>
          <div class="nxs-card-kicker">Deck</div>
          <div class="nxs-card-title">${esc(deck)}</div>
          <div class="nxs-card-meta">
            <span class="nxs-card-pill">${cards.length} cards</span>
            <span class="nxs-card-pill">${due} due</span>
            <span class="nxs-card-pill">next ${esc(nextText)}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

dv.header(2, "Decks");
render(deckCards || `<div class="nxs-deck-card"><div class="nxs-card-title">No decks yet</div></div>`, "nxs-card-grid");

const queue = pages
  .filter(page => dueDiff(page) <= 7)
  .sort((a, b) => dueDiff(a) - dueDiff(b))
  .slice(0, 30)
  .map(page => {
    const diff = dueDiff(page);
    const state = diff < 0 ? "is-overdue" : diff === 0 ? "is-due" : "is-future";
    const dueText = diff < 0 ? `${Math.abs(diff)}d overdue` : diff === 0 ? "due today" : `in ${diff}d`;
    const type = isVocab(page) ? "Vocabcard" : "Studycard";
    const rank = page.space_rank || (page.space_lvl != null ? `Level ${page.space_lvl}` : "plugin schedule");
    return `
      <div class="nxs-study-card ${state}">
        <div>
          <div class="nxs-card-kicker">${esc(type)} / ${esc(deckName(page))}</div>
          <div class="nxs-card-title">${link(page)}</div>
        </div>
        <div class="nxs-card-meta">
          <span class="nxs-card-pill">${esc(dueText)}</span>
          <span class="nxs-card-pill">${esc(rank)}</span>
        </div>
      </div>
    `;
  }).join("");

dv.header(2, "Review Queue");
render(queue || `<div class="nxs-study-card"><div class="nxs-card-title">No cards due in the next 7 days.</div></div>`, "nxs-card-row");

if (unscheduled.length) {
  dv.paragraph(`<small>${unscheduled.length} cards have no space_date yet.</small>`);
}
```
