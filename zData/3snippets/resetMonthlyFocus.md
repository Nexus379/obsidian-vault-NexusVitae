<%*
// Reset monthly focus start fields (keys starting with focusMstart_) to today
await app.fileManager.processFrontMatter(tp.file.find_tfile(tp.file.path), fm => {
  const today = tp.date.now("YYYY-MM-DD");
  const keys = Object.keys(fm || {}).filter(k => k.startsWith("focusMstart_"));
  if (keys.length === 0) {
    fm.focusMstart_ = today;
  } else {
    keys.forEach(k => fm[k] = today);
  }
});
new Notice("Monthly focus start reset to today.");
%>
