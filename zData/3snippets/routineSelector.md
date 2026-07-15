<%*
// 1. Load the Routine Engine
const enginePath = app.vault.adapter.basePath + "/zData/2scripts/routineEngine.js";
const engine = (require(enginePath))();
const routines = engine.getRoutineLabels();

// 2. Present the Suggester
const selected = await tp.system.suggester(
    (r) => `${r.icon} ${r.label} (${r.key})`,
    routines
);

// 3. Copy the formatted string to clipboard
if (selected) {
    const textToCopy = `${selected.key}|${selected.label}`;
    await navigator.clipboard.writeText(textToCopy);
    new Notice(`✅ Copied: ${textToCopy}`);
}
%>