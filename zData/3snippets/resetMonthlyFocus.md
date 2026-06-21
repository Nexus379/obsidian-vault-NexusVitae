<%*
// Reset monthly focus start field to today
await app.fileManager.processFrontMatter(tp.file.find_tfile(tp.file.path), fm => {
  const today = tp.date.now("YYYY-MM-DD");
  fm.focusM_start = today;
});
new Notice("Monthly focus start reset to today.");
%>
