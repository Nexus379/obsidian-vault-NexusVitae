<%-*
/**
 * ❄️ NEXUS FREEZER v60 — Render-Capture Edition
 *
 * Turns a live note into a permanent archive. Evaluates dataview blocks,
 * inline expressions, widgets, and locks frontmatter status to "archived".
 */
const file = app.workspace.getActiveFile();
if (!file) { new Notice("❌ Freezer: No active note found."); return; }

const dvApi = app.plugins.plugins.dataview?.api;
if (!dvApi) { new Notice("❌ Freezer: Dataview is not available."); return; }

const fm = app.metadataCache.getFileCache(file)?.frontmatter || {};
if (fm.frozen) { new Notice("❄️ This matrix is already secured in the archive!"); return; }

const component = app.workspace.activeLeaf?.view;
if (!component) { new Notice("❌ Freezer: No active view to render into."); return; }

new Notice("⏳ Freezing — rendering all live blocks, please wait...");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function renderToHtml(code, isJs) {
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "-9999px";
    document.body.appendChild(holder);
    try {
        if (isJs) await dvApi.executeJs(code, holder, component, file.path);
        else      await dvApi.execute(code, holder, component, file.path);
        await sleep(150);
        return holder.innerHTML;
    } catch (e) {
        return `<div class="freezer-error">⚠️ Freezing error: ${e.message}</div>`;
    } finally {
        holder.remove();
    }
}

let content = await app.vault.read(file);

// Preserve Connexio section if present
let connexioText = "";
const connexioMatch = content.match(/(\n---\n#### 🔱 Connexio[\s\S]*$)/);
if (connexioMatch) {
    connexioText = connexioMatch[1];
    content = content.slice(0, connexioMatch.index);
}

// 1. Replace ```dataviewjs ... ``` blocks
const dvjsRegex = /```dataviewjs\n([\s\S]*?)\n```/g;
const dvjsMatches = Array.from(content.matchAll(dvjsRegex));
for (const m of dvjsMatches) {
    const rawCode = m[1];
    const html = await renderToHtml(rawCode, true);
    const cleanHtml = html.replace(/\s+/g, " ").trim();
    content = content.replace(m[0], `<div class="nexus-frozen-block">\n${cleanHtml}\n</div>`);
}

// 2. Replace ```dataview ... ``` blocks
const dvRegex = /```dataview\n([\s\S]*?)\n```/g;
const dvMatches = Array.from(content.matchAll(dvRegex));
for (const m of dvMatches) {
    const rawCode = m[1];
    const html = await renderToHtml(rawCode, false);
    const cleanHtml = html.replace(/\s+/g, " ").trim();
    content = content.replace(m[0], `<div class="nexus-frozen-block">\n${cleanHtml}\n</div>`);
}

// 3. Evaluate inline expressions `$= ... `
const inlineRegex = /`\$=\s*([^`]+)`/g;
const inlineMatches = Array.from(content.matchAll(inlineRegex));
for (const m of inlineMatches) {
    try {
        const val = eval(m[1]);
        content = content.replace(m[0], String(val ?? ""));
    } catch(e) {}
}

// 4. Remove BUTTON[...] widgets
content = content.replace(/`BUTTON\[[^\]]+\]`/g, "");

// Re-append Connexio
if (connexioText) content += connexioText;

await app.vault.modify(file, content);

await app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["frozen"] = true;
    frontmatter["status"] = "archived";
    frontmatter["frozen_at"] = tp.date.now("YYYY-MM-DD HH:mm");
});

new Notice("❄️ Matrix secured into permanent archive!");
-%>
