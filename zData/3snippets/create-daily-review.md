<%*
// 🛰️ Create Daily Review (revD) for THIS note's day — not "today".
// Runs in the dailyplm/ppm/pkm context (runTemplaterFile), reads the date from cal_date
// or the note title, then instantiates revd.md named "<date> revD" (revd.md reads the date
// from its own title and self-moves into 6_Reviews/0_Master/YYYY/MM/).
try {
    const dv = app.plugins.plugins.dataview?.api;
    const cur = dv ? dv.current() : null;

    let dateStr = (cur && cur.cal_date) ? String(cur.cal_date).substring(0, 10) : null;
    if (!dateStr) {
        const m = String(tp.file.title).match(/\d{4}-\d{2}-\d{2}/);
        dateStr = m ? m[0] : tp.date.now("YYYY-MM-DD");
    }

    const [yy, mm] = dateStr.split("-");
    const targetFolder = `0_Calendar/6_Reviews/0_Master/${yy}/${mm}`;
    const finalTitle = `${dateStr} revD`;
    const dest = `${targetFolder}/${finalTitle}.md`;

    // Already reviewed? Just open it.
    const existing = app.vault.getAbstractFileByPath(dest);
    if (existing) {
        new Notice(`🛰️ Daily Review for ${dateStr} already exists — opening it.`);
        await app.workspace.getLeaf(false).openFile(existing);
        return;
    }

    // Hand the date to revd.md (belt) — it also reads it from the title (suspenders).
    tp.variables.targetDate = dateStr;

    const tmpl = tp.file.find_tfile("revd");
    if (!tmpl) { new Notice("❌ revd.md template not found."); return; }

    // Create in 0_Inbox; revd.md moves it to its final Reviews folder itself.
    await tp.file.create_new(tmpl, finalTitle, true, "0_Inbox");
} catch (e) {
    console.error("create-daily-review failed:", e);
    new Notice("❌ Create Daily Review failed — see console.");
}
_%>
