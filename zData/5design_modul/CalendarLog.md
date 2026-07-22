```dataviewjs
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/calendarEngine.js";
try {
    const renderCalendarLog = require(enginePath);
    await renderCalendarLog(app, dv, moment);
} catch(e) {
    dv.paragraph("❌ CalendarEngine Fehler: " + e.message);
}
```
