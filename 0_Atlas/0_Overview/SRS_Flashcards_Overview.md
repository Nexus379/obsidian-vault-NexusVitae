---
cssclasses:
  - wide-page
  - srs-card-dashboard
---

# Vocabcards Overview

![[zData/5design_modul/OverviewNavigationModul]]

```dataviewjs
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));
const render = (html, cls) => {
  const node = dv.el("div", "", { cls });
  node.innerHTML = html;
  return node;
};
const first = value => Array.isArray(value) ? value[0] : value;
const label = value => String(first(value) ?? "Vocabulary").replace(/^#/, "");
const arch = page => String(page.archtype ?? "");
const tags = page => Array.isArray(page.file?.tags) ? page.file.tags : [];
const isVocab = page => arch(page).includes("#5note/3atomic/vocabcards") || tags(page).includes("#vocabcards");
const link = page => `<a class="internal-link" data-href="${esc(page.file.path)}" href="${esc(page.file.path)}">${esc(page.file.name)}</a>`;
const deckName = page => String(page.deck || label(page.discipline || page.discTag || page.areaTag) || "Vocabulary");

const pages = dv.pages('"5_Notes" or "6_Resources"').where(isVocab).array();
const today = moment().startOf("day");
const dueDiff = page => page.space_date ? moment(page.space_date).startOf("day").diff(today, "days") : 9999;

const groups = new Map();
for (const page of pages) {
  const key = deckName(page);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(page);
}

render(Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([deck, cards]) => {
  const due = cards.filter(page => dueDiff(page) <= 0).length;
  return `
    <div class="nxs-deck-card">
      <div>
        <div class="nxs-card-kicker">Spaced Repetition Plugin</div>
        <div class="nxs-card-title">${esc(deck)}</div>
        <div class="nxs-card-meta">
          <span class="nxs-card-pill">${cards.length} cards</span>
          <span class="nxs-card-pill">${due} due</span>
          <span class="nxs-card-pill">plugin deck</span>
        </div>
      </div>
    </div>
  `;
}).join("") || `<div class="nxs-deck-card"><div class="nxs-card-title">No vocabcards yet</div><div class="nxs-card-meta"><span class="nxs-card-pill">Use n-vocab</span></div></div>`, "nxs-card-grid");

const cards = pages.sort((a, b) => dueDiff(a) - dueDiff(b)).slice(0, 40).map(page => {
  const diff = dueDiff(page);
  const state = diff < 0 ? "is-overdue" : diff === 0 ? "is-due" : "is-future";
  const dueText = diff === 9999 ? "plugin schedule" : diff < 0 ? `${Math.abs(diff)}d overdue` : diff === 0 ? "due today" : `in ${diff}d`;
  return `
    <div class="nxs-study-card ${state}">
      <div>
        <div class="nxs-card-kicker">${esc(deckName(page))}</div>
        <div class="nxs-card-title">${link(page)}</div>
      </div>
      <div class="nxs-card-meta">
        <span class="nxs-card-pill">${esc(dueText)}</span>
        <span class="nxs-card-pill">#vocabcards</span>
      </div>
    </div>
  `;
}).join("");

dv.header(2, "Cards");
render(cards || `<div class="nxs-study-card"><div class="nxs-card-title">No vocabcards found.</div></div>`, "nxs-card-row");
```
