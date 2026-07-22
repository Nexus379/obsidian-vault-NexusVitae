---
cssclasses:
  - wide-page
  - srs-card-dashboard
---

# Studycards Overview

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
const label = value => String(first(value) ?? "Concept Knowledge").replace(/^#/, "");
const arch = page => String(page.archtype ?? "");
const isStudy = page => page.space_rank != null || page.space_lvl != null || arch(page).includes("#5note/3atomic/studycards");
const link = page => `<a class="internal-link" data-href="${esc(page.file.path)}" href="${esc(page.file.path)}">${esc(page.file.name)}</a>`;
const deckName = page => String(page.deck || label(page.discipline || page.discTag || page.areaTag) || "Concept Knowledge");

const pages = dv.pages('"5_Notes" or "6_Resources"').where(isStudy).array();
const today = moment().startOf("day");
const dueDiff = page => page.space_date ? moment(page.space_date).startOf("day").diff(today, "days") : 9999;

const ranks = new Map();
for (const page of pages) {
  const raw = page.space_rank || (page.space_lvl != null ? `Level ${page.space_lvl}` : "Unranked");
  const key = String(raw);
  if (!ranks.has(key)) ranks.set(key, []);
  ranks.get(key).push(page);
}

render(Array.from(ranks.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([rank, cards]) => {
  const due = cards.filter(page => dueDiff(page) <= 0).length;
  return `
    <div class="nxs-deck-card">
      <div>
        <div class="nxs-card-kicker">Nexus Rank</div>
        <div class="nxs-card-title">${esc(rank)}</div>
        <div class="nxs-card-meta">
          <span class="nxs-card-pill">${cards.length} cards</span>
          <span class="nxs-card-pill">${due} due</span>
        </div>
      </div>
    </div>
  `;
}).join("") || `<div class="nxs-deck-card"><div class="nxs-card-title">No studycards yet</div><div class="nxs-card-meta"><span class="nxs-card-pill">Use n-studycards</span></div></div>`, "nxs-card-grid");

const cards = pages.sort((a, b) => dueDiff(a) - dueDiff(b)).slice(0, 40).map(page => {
  const diff = dueDiff(page);
  const state = diff < 0 ? "is-overdue" : diff === 0 ? "is-due" : "is-future";
  const dueText = diff === 9999 ? "no date" : diff < 0 ? `${Math.abs(diff)}d overdue` : diff === 0 ? "due today" : `in ${diff}d`;
  const rank = page.space_rank || (page.space_lvl != null ? `Level ${page.space_lvl}` : "Unranked");
  return `
    <div class="nxs-study-card ${state}">
      <div>
        <div class="nxs-card-kicker">${esc(deckName(page))}</div>
        <div class="nxs-card-title">${link(page)}</div>
      </div>
      <div class="nxs-card-meta">
        <span class="nxs-card-pill">${esc(dueText)}</span>
        <span class="nxs-card-pill">${esc(rank)}</span>
      </div>
    </div>
  `;
}).join("");

dv.header(2, "Cards");
render(cards || `<div class="nxs-study-card"><div class="nxs-card-title">No studycards found.</div></div>`, "nxs-card-row");
```
