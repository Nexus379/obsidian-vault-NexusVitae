<%-*
/**
 * ❄️ NEXUS WEEKLY FREEZER v60 — Render-Capture Edition (for plans / reviews)
 * Freeze a weekly plan or review, then archive it. Executes each dataview/dataviewjs block
 * once and bakes the rendered output in as static HTML (no more blanked values).
 *   • dataview / dataviewjs -> rendered to static HTML (one line, stays in callouts)
 *   • `$= ...` inline        -> evaluated to its value
 *   • INPUT[...]             -> resolved to its frontmatter value
 *   • BUTTON[...]            -> removed (Archive kept, so a frozen note can still be archived)
 *   • Connexio section       -> shielded (kept live)
 */
const file = app.workspace.getActiveFile();
if (!file) { new Notice("❌ Freezer: No active note found."); return; }

const dvApi = app.plugins.plugins.dataview?.api;
if (!dvApi) { new Notice("❌ Freezer: Dataview is not available."); return; }

const fm = app.metadataCache.getFileCache(file)?.frontmatter || {};
if (fm.frozen) { new Notice("❄️ This weekly plan is already secured in the archive!"); return; }

const component = app.workspace.activeLeaf?.view;
if (!component) { new Notice("❌ Freezer: No active view to render into."); return; }

new Notice("⏳ Freezing weekly plan — rendering all live blocks, please wait...");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function renderToHtml(code, isJs) {
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "-9999px";
    document.body.appendChild(holder);
    try {
        if (isJs) await dvApi.executeJs(code, holder, component, file.path);
        else      await dvApi.execute(code, holder, component, file.path);
        await sleep(300);
        const html = holder.innerHTML.trim();
        return html || null;
    } finally {
        holder.remove();
    }
}

try {
    const content = await app.vault.read(file);
    const lines = content.split("\n");
    const out = [];
    let shield = false;
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];

        const fence = line.match(/^([ \t>]*)```(\w*)/);
        if (fence) {
            const pfx = fence[1];
            const lang = fence[2];
            const freezable = (lang === "dataviewjs" || lang === "dataview") && !shield;

            if (freezable) {
                const body = [];
                i++;
                while (i < lines.length && !lines[i].match(/^[ \t>]*```\s*$/)) {
                    body.push(lines[i].replace(/^[ \t>]*/, ""));
                    i++;
                }
                i++;
                let html = null;
                try { html = await renderToHtml(body.join("\n"), lang === "dataviewjs"); }
                catch (e) { html = null; }
                if (html) out.push(pfx + `<div class="nexus-frozen">` + html.replace(/\n/g, " ") + `</div>`);
                else      out.push(pfx + "> [!note] ❄️ Frozen (block produced no output).");
                continue;
            } else {
                out.push(line); i++;
                while (i < lines.length && !lines[i].match(/^[ \t>]*```\s*$/)) { out.push(lines[i]); i++; }
                if (i < lines.length) { out.push(lines[i]); i++; }
                continue;
            }
        }

        if (line.includes("Connexio")) shield = true;

        if (line.includes("$=")) {
            const matches = [...line.matchAll(/`\$=\s*([^`]+)`/g)];
            for (const m of matches) {
                let val = "❄️";
                try { val = String(eval(m[1])); } catch (e) { val = "❄️"; }
                line = line.replace(m[0], val);
            }
        }

        line = line.replace(/`?BUTTON\[(?!archive\])[^\]]*\]`?/g, "");

        if (line.includes("INPUT[")) {
            line = line.replace(/`?INPUT\[(.*?)\]`?/g, (match, inner) => {
                const parts = inner.split(":");
                let key = parts[parts.length - 1].trim().replace(/[\]\)]/g, "");
                let val = fm[key];
                if (typeof val === "boolean" || val === "true" || val === "false") return (val === true || val === "true") ? "✅" : "❌";
                if (val === undefined || val === null || val === "") return "—";
                if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
                return String(val);
            });
        }

        out.push(line);
        i++;
    }

    await app.vault.modify(file, out.join("\n"));
    await app.fileManager.processFrontMatter(file, (f) => { f.frozen = true; });
    new Notice("🏛️ Weekly freeze complete — live blocks baked in. Ready to archive.");

} catch (e) {
    new Notice("🔥 FREEZE ERROR:\n" + e.message, 15000);
}
-%>
