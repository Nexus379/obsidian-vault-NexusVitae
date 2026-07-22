<%-*
// 🔱 1. INITIALIZATION & DATA-RECOVERY
if (!tp.variables) tp.variables = {}; // 🛡️ The ultimate crash protection

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let title = tp.variables.title || tp.file.title;

if (!title || title.trim() === "" || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("📑 Nexus Resource: Name of the source?", "");
}
if (!title || title.trim() === "") title = "Resource_" + tp.date.now("HH_mm");
tp.variables.title = title;

// 🔱 2. RESOURCE SELECTION (Object List)
const resources = [
    { label: "1 🤖 AI", val: "sourceai", folder: "AI" },
    { label: "2 🗞️ Article", val: "sourcearticle", folder: "Articles" },
    { label: "3 📔 Book", val: "sourcebook", folder: "Books" },
    { label: "4 🏫 Class", val: "sourceclass", folder: "Classes" },
    { label: "5 🗨 Course", val: "sourcecourse", folder: "Courses" },
    { label: "6 🎬 Film", val: "sourcefilm", folder: "Films" },
    { label: "7 🕹️ Game", val: "sourcegame", folder: "Games" },
    { label: "8 🗺️ Guide", val: "sourceguide", folder: "Guides" },
    { label: "9 🖼️ Museum", val: "sourcemuseum", folder: "Museums" },
    { label: "10 🎶 Music", val: "sourcemusic", folder: "Music" },
    { label: "11 📃 Paper", val: "sourcepaper", folder: "Papers" },
    { label: "12 🍰 Recipe", val: "sourcerecipe", folder: "Recipes" },
    { label: "13 📚 Reference", val: "sourcereference", folder: "Reference" },
    { label: "14 🎞️ Serie", val: "sourceserie", folder: "Series" },
    { label: "15 💻 Video", val: "sourcevideo", folder: "Videos" },
    { label: "16 🎲 Boardgame", val: "sourceboardgame", folder: "Boardgame" },
    { label: "17 🥦 Ingredient", val: "sourceentities_ingredients", folder: "_Entities/Nutrition/Ingredients" },
    { label: "18 ⛺ Camping Gear", val: "sourceentities_camping", folder: "_Entities/Camping_Outdoors" },
    { label: "19 🔌 Tech & Electronics", val: "sourceentities_tech", folder: "_Entities/Electronics_Tech" },
    { label: "20 🎨 Art & Stationery", val: "sourceentities_art", folder: "_Entities/Stationery_Art" },
    { label: "21 👕 Clothing", val: "sourceentities_clothing", folder: "_Entities/Clothing" },
    { label: "22 🏋️ Fitness Gear", val: "sourceentities_fitness", folder: "_Entities/Fitness" },
    { label: "23 🧹 Household Item", val: "sourceentities_household", folder: "_Entities/Home/Drugstore/Household" },
    { label: "24 💊 Medical", val: "sourceentities_medical", folder: "_Entities/Medical" },
    { label: "25 🎵 Music Gear", val: "sourceentities_music", folder: "_Entities/Music_Audio" },
    { label: "26 🧴 Personal Care", val: "sourceentities_personal", folder: "_Entities/Personal" },
    { label: "27 🐕 Pet Item", val: "sourceentities_pet", folder: "_Entities/Pets" },
    { label: "28 ⚔️ LARP Gear", val: "sourceentities_larp", folder: "_Entities/LARP" }
];

let nIdx = null;
const preSub = tp.variables.preSelectedSub || "";
const originTrigger = String(tp.variables.originTrigger || tp.variables.activeTrigger || "").toLowerCase();
const resourceTriggerMap = {
    ai: "sourceai",
    article: "sourcearticle",
    book: "sourcebook",
    class: "sourceclass",
    course: "sourcecourse",
    film: "sourcefilm",
    game: "sourcegame",
    guide: "sourceguide",
    museum: "sourcemuseum",
    music: "sourcemusic",
    paper: "sourcepaper",
    recipe: "sourcerecipe",
    reference: "sourcereference",
    serie: "sourceserie",
    series: "sourceserie",
    video: "sourcevideo",
    boardgame: "sourceboardgame",
    ingredient: "sourceentities_ingredients",
    camping: "sourceentities_camping",
    tech: "sourceentities_tech",
    art: "sourceentities_art",
    clothing: "sourceentities_clothing",
    fitness: "sourceentities_fitness",
    household: "sourceentities_household",
    medical: "sourceentities_medical",
    musicgear: "sourceentities_music",
    personal: "sourceentities_personal",
    pet: "sourceentities_pet",
    larp: "sourceentities_larp"
};

if (preSub) {
    nIdx = resources.findIndex(r => preSub.includes(r.folder));
}

if ((nIdx === null || nIdx === -1) && resourceTriggerMap[originTrigger]) {
    nIdx = resources.findIndex(r => r.val === resourceTriggerMap[originTrigger]);
}

if (nIdx === null || nIdx === -1) {
    // We use .map(r => r.label) to only show the names in the menu
    nIdx = await tp.system.suggester(resources.map(r => r.label), Array.from(resources.keys()));
}

if (nIdx === null) return;

let choice = resources[nIdx]; // The selected object

// Additional prompt: Book or Reference?
if (choice.val === "sourcebook") {
    const refPick = await tp.system.suggester(
        ["Keep as Book", "Switch to Reference"],
        ["book", "reference"],
        false,
        "Is this more a reference/lexicon?"
    );
    if (refPick === "reference") {
        const refObj = resources.find(r => r.val === "sourcereference");
        if (refObj) choice = refObj;
    }
}

const nChoice = choice.val;
const targetFolder = `6_Resources/${choice.folder}`;
const SYS = tp.variables.SYS || { tmpl: "zData/1tmpl" };
const templatePath = `${SYS.tmpl}/6resources/${nChoice}.md`;

// 🔱 3. TAXONOMY (Calls your English ScienceModule)
const knowledgeTypes = ["sourcearticle", "sourceclass", "sourcecourse", "sourcepaper", "sourcereference"];
if (knowledgeTypes.includes(nChoice)) {
    if (typeof tp.user.disciplineEngine === "function") {
        const engine = tp.user.disciplineEngine();
        const discList = engine.getDisciplineLabels();
        const selectedDisc = await tp.system.suggester(
            discList.map(d => `${d.icon} ${d.label}`),
            discList,
            false,
            "Science / Discipline?"
        );
        if (selectedDisc) {
            tp.variables.sciTag = selectedDisc.sci.join('", "');
            tp.variables.discTag = selectedDisc.disc;
            tp.variables.subText = selectedDisc.label;
        }
    }
}

// 🔱 4. ID-GENERATION
tp.variables.luhmannId = "R" + tp.date.now("YYYYMMDDHHmm");

// 🔱 5. LOGISTICS
if (tp.file.title !== title) await tp.file.rename(title);
await new Promise(r => setTimeout(r, 450));

let current = "";
for (const seg of targetFolder.split('/')) {
    current = current === "" ? seg : `${current}/${seg}`;
    if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
}
const targetPath = `${targetFolder}/${title}.md`;
if (tp.file.path !== targetPath) {
    const existing = app.vault.getAbstractFileByPath(targetPath);
    if (existing instanceof tp.obsidian.TFile) {
        new Notice(`ℹ️ Resource already exists: ${title}. Opening & revealing...`);
        const leaf = app.workspace.getLeaf(false);
        await leaf.openFile(existing);
        app.commands.executeCommandById("file-explorer:reveal-active-file");
        return;
    }
    try { await tp.file.move(targetPath); } catch(e) {}
}
await new Promise(r => setTimeout(r, 850));

// 🔱 6. PASS TO CONTENT
tR += await tp.file.include(`[[${templatePath}]]`);
-%>
