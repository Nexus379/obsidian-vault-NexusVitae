<%-*
/**
 * ❄️ NEXUS FREEZER v60 — Render-Capture Edition
 *
 * Turns a live note into a permanent archive. Instead of BLANKING computed blocks
 * (the old v59 flaw), it EXECUTES each dataview/dataviewjs block once and bakes the
 * rendered output in as static HTML — so averages, chakra bars, heatmaps, tables and
 * lists all stay exactly as they were at freeze time.
 *   • dataview / dataviewjs blocks  -> rendered to static HTML (one line, stays in callouts)
 *   • `$= ...` inline               -> evaluated to its value
 *   • INPUT[...] widgets            -> resolved to their frontmatter value
 *   • BUTTON[...]                   -> removed
 *   • Connexio section              -> shielded (kept live, so backlinks stay dynamic)
 */
const file = app.workspace.getActiveFile();
if (!file) { new Notice("❌ Freezer: No active note found."); return; }

const dvApi = app.plugins.plugins.dataview?.api;
if (!dvApi) { new Notice("❌ Freezer: Dataview is not available."); return; }

const fm = app.metadataCache.getFileCache(file)?.frontmatter || {};
if (fm.frozen) { new Notice("❄️ This matrix is already secured in the archive!"); return; }

// The open note's view is a valid Obsidian Component — dataview needs one for rendering lifecycle.
const component = app.workspace.activeLeaf?.view;
if (!component) { new Notice("❌ Freezer: No active view to render into."); return; }

new Notice("⏳ Freezing — rendering all live blocks, please wait...");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Render dataview(js) source into a detached (off-screen) node and return its HTML.
async function renderToHtml(code, isJs) {
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "-9999px";
    document.body.appendChild(holder);
    try {
        if (isJs) await dvApi.executeJs(code, holder, component, file.path);
        else      await dvApi.execute(code, holder, component, file.path);
        await sleep(300); // let async queries + heatmaps finish painting
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
    let shield = false; // once true (Connexio section), blocks pass through untouched
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];

        // --- Fenced code block? ---
        const fence = line.match(/^([ \t>]*)```(\w*)/);
        if (fence) {
            const pfx = fence[1];
            const lang = fence[2];
            const freezable = (lang === "dataviewjs" || lang === "dataview") && !shield;

            if (freezable) {
                // collect the code body (strip callout prefixes so it runs clean)
                const body = [];
                i++;
                while (i < lines.length && !lines[i].match(/^[ \t>]*```\s*$/)) {
                    body.push(lines[i].replace(/^[ \t>]*/, ""));
                    i++;
                }
                i++; // consume closing fence
                let html = null;
                try { html = await renderToHtml(body.join("\n"), lang === "dataviewjs"); }
                catch (e) { html = null; }
                if (html) out.push(pfx + `<div class="nexus-frozen">` + html.replace(/\n/g, " ") + `</div>`);
                else      out.push(pfx + "> [!note] ❄️ Frozen (block produced no output).");
                continue;
            } else {
                // non-dataview OR shielded: copy the whole block verbatim
                out.push(line); i++;
                while (i < lines.length && !lines[i].match(/^[ \t>]*```\s*$/)) { out.push(lines[i]); i++; }
                if (i < lines.length) { out.push(lines[i]); i++; }
                continue;
            }
        }

        // --- Connexio shield: from its header on, keep dynamic (backlinks stay live) ---
        if (line.includes("Connexio")) shield = true;

        // --- Inline `$= ...` -> evaluate to value (safe eval of the user's own expression) ---
        if (line.includes("$=")) {
            const matches = [...line.matchAll(/`\$=\s*([^`]+)`/g)];
            for (const m of matches) {
                let val = "❄️";
                try { val = String(eval(m[1])); } catch (e) { val = "❄️"; }
                line = line.replace(m[0], val);
            }
        }

        // --- Buttons removed (but KEEP Archive, so you can still archive a frozen note) ---
        line = line.replace(/`?BUTTON\[(?!archive\])[^\]]*\]`?/g, "");

        // --- INPUT[...] -> its frontmatter value ---
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
    new Notice("🏛️ Freeze complete — every live block baked in as static output.");

} catch (e) {
    new Notice("🔥 FREEZE ERROR:\n" + e.message, 15000);
}
-%>
