<%-*
const tFile = tp.config.target_file;
if (!tFile) return;

const dv = app.plugins.plugins.dataview?.api;
const hub = dv ? dv.page("2_Areas/4_Organize/Plan/Shopping_Hub") : null;
let strategy = String((hub && hub.shopping_strategy) || "value").toLowerCase();

if (strategy === "budget") strategy = "cheap";
if (strategy === "best") strategy = "value";
if (strategy === "preferred") strategy = "pref";

const priceKey = {
    pref: "pref_price",
    cheap: "price_cheap",
    value: "price_value",
    pure_cheap: "price_pure_cheap",
    pure: "price_pure",
    market: "price_market"
}[strategy] || "price_value";

let applied = 0;
await app.fileManager.processFrontMatter(tFile, (fm) => {
    applied = Number(fm[priceKey]) || 0;
    if (applied === 0 && strategy === "pref") applied = Number(fm.unit_price) || 0;
    if (applied === 0) applied = Number(fm.price_value) || Number(fm.pref_price) || Number(fm.unit_price) || 0;
    fm.unit_price = applied;
    fm.unit_price_strategy = strategy;
    fm.unit_price_updated = window.moment().format("YYYY-MM-DD");
});

new Notice(`Shopping price applied: ${strategy} -> ${applied}`);
-%>
