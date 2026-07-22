### Log Cockpit

`BUTTON[log-plm-btn]` `BUTTON[log-ppm-btn]` `BUTTON[log-pkm-btn]` `BUTTON[log-rev-btn]` `BUTTON[log-plan-btn]`

> [!blank]
> ```dataviewjs
> const pages = dv.pages('"0_Calendar"')
>   .where(p => !p.file.path.includes("zData"))
>   .sort(p => p.file.name, "desc");
>
> const slots = [
>   { label: "PLM", needle: "1plm", fallback: "plm" },
>   { label: "PPM", needle: "2ppm", fallback: "ppm" },
>   { label: "PKM", needle: "3pkm", fallback: "pkm" },
>   { label: "Projectlog", needle: "4projectlog", fallback: "prjlog" },
>   { label: "Protocol", needle: "5protocol", fallback: "prtcl" },
>   { label: "Review", needle: "review", fallback: "rev" }
> ];
>
> const html = slots.map(slot => {
>   const hit = pages
>     .where(p => {
>       const hay = [p.file.path, p.file.name, String(p.archtype ?? "")].join(" ").toLowerCase();
>       return hay.includes(slot.needle) || hay.includes(slot.fallback);
>     })
>     .first();
>
>   const link = hit
>     ? `<a class="internal-link" data-href="${hit.file.path}" href="${hit.file.path}">${hit.file.name}</a>`
>     : `<span style="color: var(--text-faint);">pending</span>`;
>
>   return `
>     <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:6px 10px; border:1px solid var(--background-modifier-border); border-radius:8px; background:var(--background-secondary);">
>       <span style="font-size:0.78em; color:var(--text-muted); font-weight:700;">${slot.label}</span>
>       <span style="font-size:0.78em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${link}</span>
>     </div>`;
> }).join("");
>
> dv.el("div", html, { attr: { style: "display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:8px; margin:8px 0 14px;" } });
> ```
