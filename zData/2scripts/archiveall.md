---
shopping_extras: []
---
<%-*
// 🔱 1. INITIALISIERUNG & STABILISIERUNG (Gegen Sync-Fehler)
await new Promise(r => setTimeout(r, 150)); 
const file = tp.config.target_file;
const currentPath = file.path;
const title = tp.file.title;

// Date variables for the folder structure — use the NOTE'S OWN date, not today,
// so a note always lands in the year/month folder of its real date.
const fmCache = app.metadataCache.getFileCache(file)?.frontmatter || {};
let noteDate = fmCache.cal_date || fmCache.rev_end || null;   // calendar notes / reviews
if (!noteDate) {
    const titleMatch = title.match(/(\d{4}-\d{2}-\d{2})/);    // leading date in the title
    if (titleMatch) noteDate = titleMatch[1];
}
let noteMoment = noteDate ? moment(String(noteDate), "YYYY-MM-DD") : null;
if (!noteMoment || !noteMoment.isValid()) {
    // undated note (area/project/resource…) -> fall back to its creation date, then today
    noteMoment = file.stat && file.stat.ctime ? moment(file.stat.ctime) : moment();
}
const year = noteMoment.format("YYYY");
const month = noteMoment.format("MM_MMMM"); // e.g. "07_Juli" (keeps existing locale/format)

// 🔱 2. SMART-DETECTION (Herkunftsanalyse)
let category = "7_Misc";
if (currentPath.includes("0_Calendar")) category = "0_Calendar";
else if (currentPath.includes("1_Stars")) category = "1_Stars";
else if (currentPath.includes("2_Areas")) category = "2_Areas";
else if (currentPath.includes("3_Projects")) category = "3_Projects";
else if (currentPath.includes("4_Tasks")) category = "4_Tasks";
else if (currentPath.includes("5_Notes")) category = "5_Notes";
else if (currentPath.includes("6_Resources")) category = "6_Resources";

// 🔱 3. UNTERSTRUKTUR (Spezial-Handling für Kalender-Module)
let subPath = "";
if (category === "0_Calendar") {
    const mods = ["1_PLM", "2_PPM", "3_PKM", "4_Projectlogs", "5_Protocols", "6_Reviews"];
    const foundMod = mods.find(m => currentPath.includes(m));
    subPath = foundMod ? `/${foundMod}` : "/DailyLogs";
}

// 🔱 4. ZIEL-PFAD BAUEN (Logik: Archiv > Jahr > Monat > Kategorie > [SubModul])
// Das hält jeden Ordner klein und das System schnell.
const targetBase = `yArchive/${year}/${month}/${category}${subPath}`;

// 🔱 5. YAML-UPDATE (Status-Sicherung)
await app.fileManager.processFrontMatter(file, (fm) => {
    fm["status"] = "archived";
    fm["archived_at"] = tp.date.now("YYYY-MM-DD HH:mm");
});

// 🔱 6. ORDNER-BOT MIT SICHERHEITS-PAUSEN
let checkPath = "";
const segments = targetBase.split('/');
for (const seg of segments) {
    checkPath = checkPath === "" ? seg : `${checkPath}/${seg}`;
    if (!app.vault.getAbstractFileByPath(checkPath)) {
        await app.vault.createFolder(checkPath);
        await new Promise(r => setTimeout(r, 100)); // Kurze Pause für das System
    }
}

// 🔱 7. FINALES VERSCHIEBEN (Systemunabhängig)
await new Promise(r => setTimeout(r, 300)); 
const finalDestination = `${targetBase}/${title}.md`;

if (app.vault.getAbstractFileByPath(finalDestination)) {
    const uniqueTitle = `${title}_${tp.date.now("HHmm")}`;
    new Notice("⚠️ Dublette im Archiv: Umbenannt.");
    await tp.file.move(`${targetBase}/${uniqueTitle}.md`);
} else {
    new Notice(`📦 Archiviert: ${month} / ${category}`);
    await tp.file.move(finalDestination);
}
-%>


