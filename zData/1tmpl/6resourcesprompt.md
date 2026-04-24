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
    { label: "AI 🤖", val: "sourceai", folder: "AI" },
    { label: "Article 🗞️", val: "sourcearticle", folder: "Articles" },
    { label: "Book 📔", val: "sourcebook", folder: "Books" },
    { label: "Class 🏫", val: "sourceclass", folder: "Classes" },
    { label: "Course 🗨", val: "sourcecourse", folder: "Courses" },
    { label: "Film 🎬", val: "sourcefilm", folder: "Films" },
    { label: "Game 🕹️", val: "sourcegame", folder: "Games" },
    { label: "Guide 🗺️", val: "sourceguide", folder: "Guides" },
    { label: "Museum 🖼️", val: "sourcemuseum", folder: "Museums" },
    { label: "Music 🎶", val: "sourcemusic", folder: "Music" },
    { label: "Paper 📃", val: "sourcepaper", folder: "Papers" },
    { label: "Recipe 🍰", val: "sourcerecipe", folder: "Recipes" },
    { label: "Reference 📚", val: "sourcereference", folder: "Reference" },
    { label: "Serie 🎞️", val: "sourceserie", folder: "Series" },
    { label: "Video 💻", val: "sourcevideo", folder: "Videos" },
    { label: "Boardgame 🎲", val: "sourceboardgame", folder: "Boardgame" }
];

let nIdx = null;
const preSub = tp.variables.preSelectedSub || "";

if (preSub) {
    nIdx = resources.findIndex(r => preSub.includes(r.folder));
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
await tp.file.move(`${targetFolder}/${title}`);
await new Promise(r => setTimeout(r, 850));

// 🔱 6. PASS TO CONTENT
tR += await tp.file.include(`[[${templatePath}]]`);
-%>
