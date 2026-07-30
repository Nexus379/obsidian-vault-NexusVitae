<%-*
// 💶 SYNC ITEM PRICES — thin caller. All logic lives in zData/2scripts/syncItemPrices.js.
// Runs a dry pass first and asks before writing, because it edits the master databases.
try {
    const enginePath = app.vault.adapter.basePath + "/zData/2scripts/syncItemPrices.js";
    delete require.cache[require.resolve(enginePath)];
    const sync = require(enginePath);

    const preview = await sync(app, { dryRun: true });

    if (!preview.changed) {
        new Notice(`💶 Nothing to sync — ${preview.notes} priced note(s), ${preview.matched} matched, 0 differ.`);
        return;
    }

    const go = await tp.system.suggester(
        [`✅ Write ${preview.changed} price update(s)`, "❌ Cancel"],
        [true, false],
        false,
        `Sync into: ${preview.files.join(", ")}`
    );
    if (!go) return;

    const res = await sync(app);
    new Notice(`💶 ${res.changed} item(s) updated in ${res.files.join(", ")}. Backups written alongside.`);
    console.log("[Nexus] Price sync:", res.details);
} catch (e) {
    new Notice("🔥 Price sync failed: " + e.message);
    console.error(e);
}
-%>
