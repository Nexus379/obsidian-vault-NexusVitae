<%-*
/**
 * ⚙️ NEXUS TIMETABLE SETUP
 */
try {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const start = await tp.system.prompt("⏰ Start Time (e.g., 08:00, 8:00 AM, 8 pm):", fm.tt_start || "08:00");
    if(start === null) return;

    const duration = await tp.system.prompt("⏳ Duration of ONE period (in minutes):", String(fm.tt_duration || 45));
    if(duration === null) return;

    const periods = await tp.system.prompt("🔢 Total number of periods per day:", String(fm.tt_periods || 8));
    if(periods === null) return;

    const breaks = await tp.system.prompt("☕ Breaks. Format -> Period:Minutes (e.g., '2:20' means a 20 min break AFTER period 2):", fm.tt_breaks || "2:20, 4:15");
    if(breaks === null) return;

    await app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter.tt_start = start;
        frontmatter.tt_duration = Number(duration);
        frontmatter.tt_periods = Number(periods);
        frontmatter.tt_breaks = breaks;
    });

    new Notice("✅ Timetable configured successfully!");

} catch(e) {
    new Notice("🔥 Error: " + e.message, 10000);
}
-%>