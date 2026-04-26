---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# Recipes Resources
| [[0_Atlas/0_Dashboard/6-Resources|Resources]] | [[0_Atlas/0_Dashboard/6-Resources/AI|🤖 AI]] | [[0_Atlas/0_Dashboard/6-Resources/Articles|📄 Articles]] | [[0_Atlas/0_Dashboard/6-Resources/Books|📚 Books]] | [[0_Atlas/0_Dashboard/6-Resources/Recipes|🍳 Recipes]] | [[0_Atlas/0_Dashboard/6-Resources/Videos|🎬 Videos]] |

![[zData/5design_modul/NavigationModul|NavigationModul]]

---

>[!multi-column]
>
> > [!blank|wide-0]
> > ### NEXUS NAVIGATOR
> > ```dataviewjs
> > const pages = dv.pages('("6_Resources/Recipes" OR #6resou/recipe) AND -"zData" AND -"yArchive"').where(p => p.inbox !== true);
> > const values = [pages.length, pages.where(p => p.cover).length, pages.where(p => p.rating).length];
> > const textColor = getComputedStyle(document.body).getPropertyValue('--text-normal').trim() || '#cdd6f4';
> > window.renderChart && window.renderChart({ type: 'doughnut', data: { labels: ['Recipes', 'Cover', 'Rated'], datasets: [{ data: values.some(v => v > 0) ? values : [1], backgroundColor: ['#a6e3a1', '#cba6f7', '#fab387'], borderWidth: 0 }] }, options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 9, weight: 'bold' }, usePointStyle: true } } } } }, this.container);
> > ```
> >
> > ![[zData/5design_modul/QuickCaptureModul|QuickCaptureModul]]
>
> > [!blank|wide-5]
> > ### Currently
> > ```dataviewjs
> > const clean = value => String(value ?? "").toLowerCase();
> > const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
> > const activeItems = dv.pages('("6_Resources/Recipes" OR #6resou/recipe) AND -"zData" AND -"yArchive"')
> >     .where(p => p.inbox !== true)
> >     .where(p => clean(p.status).includes("1active") || clean(p.status).includes("0start"));
> > 
> > let html = `<div style="display:flex; flex-direction:column; gap:4px;">`;
> > if (activeItems.length === 0) {
> >     html += `<div style="font-size:.8em; color:var(--text-faint);">No recipes currently in progress.</div>`;
> > } else {
> >     for (let it of activeItems.sort(it => it.file.mtime, 'desc').slice(0, 10)) {
> >         const meta = it.plattform || it.publisher || "";
> >         const statusLabel = clean(it.status).includes("0start") ? "Start" : "Active";
> >         html += `<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 10px; border-bottom:1px solid var(--background-modifier-border);">`;
> >         html += `<div style="min-width:0;"><a class="internal-link" href="${it.file.path}" style="font-weight:650; color:var(--text-normal); text-decoration:none; font-size:.9em;">${esc(it.file.name)}</a>` + (meta ? `<div style="font-size:.65em; color:var(--text-muted);">${esc(meta)}</div>` : "") + `</div>`;
> >         html += `<div style="font-size:.7em; color:var(--text-accent); font-weight:800; white-space:nowrap;">${esc(statusLabel)}</div>`;
> >         html += `</div>`;
> >     }
> > }
> > html += `</div>`;
> > dv.el("div", html);
> > ```

> [!source] **🍳 Recipes Library**
> ![[0_Atlas/Bases/6-Resources/Recipes.base]]
