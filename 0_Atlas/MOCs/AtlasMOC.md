---
cssclasses:
  - wide-page
  - dashboard-no-border
---

# Atlas
```dataviewjs
const links = dv.pages('"0_Atlas/MOCs"').file.sort(f => f.name).map(f => {
    let name = f.name.replace(/ ?MOC/g, "");
    if(f.name.includes("Atlas")) name = "🗺️ " + name;
    if(f.name.includes("Resources")) name = "🔖 " + name;
    return `[[${f.path}|${name}]]`;
});
dv.paragraph(links.join(" &nbsp;|&nbsp; "));
```
![[zData/5design_modul/NavigationModul|NavigationModul]]


```dataviewjs
const groups = [
  { title: "📅 Calendar", tag: "#0cal" },
  { title: "✨ Stars", tag: "#1stars" },
  { title: "💠 Areas", tag: "#2area" },
  { title: "🧩 Projects", tag: "#3project" },
  { title: "🛠️ Tasks", tag: "#4task" },
  { title: "✏️ Notes", tag: "#5note" },
  { title: "🔖 Resources", tag: "#6resource" }
];

const pages = dv.pages('!"zData" AND -"yArchive" AND -"xAttachment"')
  .where(p => p.inbox !== true);

const hasTag = (page, tag) => {
  const fields = [
    page.arch,
    page.archtype,
    page.file?.tags
  ].flatMap(v => dv.array(v).array());

  return fields.some(v => String(v).includes(tag));
};

const fmt = value => {
  const arr = dv.array(value).array().filter(Boolean);
  if (!arr.length) return "";
  return String(arr[0]).replace(/^#/, "");
};

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const linkTo = page => {
  const path = esc(page.file.path);
  const name = esc(page.file.name);
  return `<a data-href="${path}" href="${path}" class="internal-link">${name}</a>`;
};

let html = `
<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  align-items: start;
">
`;

for (const group of groups) {
  const recent = pages
    .where(p => hasTag(p, group.tag))
    .sort(p => p.file.mtime, "desc")
    .limit(8);

  html += `<section style="border-top: 1px solid var(--background-modifier-border); padding-top: 8px;">`;
  html += `<h3 style="margin: 0 0 8px 0; font-size: 1em;">${group.title}</h3>`;

  if (!recent.length) {
    html += `<div style="opacity: .65;">No entries</div>`;
  } else {
    html += `<ul style="margin: 0; padding-left: 1.1em;">`;
    for (const page of recent) {
      const type = fmt(page.archtype);
      const status = fmt(page.status);
      const meta = [type, status].filter(Boolean).join(" - ");
      html += `<li style="margin-bottom: 6px;">${linkTo(page)}${meta ? `<br><small style="opacity: .65;">${esc(meta)}</small>` : ""}</li>`;
    }
    html += `</ul>`;
  }

  html += `</section>`;
}

html += `</div>`;
dv.container.innerHTML = html;
```
