<%-*
// 🔱 1. NEXUS-DATA-SYNC (Character-Modus)
const persona = tp.variables.persona || "";
const sci = tp.variables.sci || "";
const disc = tp.variables.disc || "";
const icon = tp.variables.discIcon || tp.variables.icon || "👤";
const area = tp.variables.currentArea || tp.variables.area || "#2area/2relationship";

let title = (tp.variables && tp.variables.title) ? tp.variables.title : tp.file.title;
let pLink = (tp.variables && tp.variables.pLink) ? tp.variables.pLink : "";

// 🔱 2. FALLBACK & PROMPTS (Name & Gruppe)
const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
let isNew = false;
let groupName = "Uncategorized";
let characterType = "real_life";
let sourceType = "";
let sourceLink = "";

// Abfrage des Namens
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    let nn = await tp.system.prompt("Name of the Character?", "");
    if (nn) {
        title = "Character_" + nn.trim().replace(/[\\/:*?"<>|]/g, "");
    } else {
        title = "Character-" + tp.date.now("HH-mm");
    }
    isNew = true;
} else if (!title.startsWith("Character_")) {
    // Falls Datei manuell benannt wurde, aber das Präfix fehlt
    title = "Character_" + title.trim().replace(/[\\/:*?"<>|]/g, "");
    isNew = true;
}

// Abfrage der Gruppe
if (isNew) {
    const typeOpts = ["Real Life", "Film / Series", "Game", "Book / Media", "Original Character"];
    const typeVals = ["real_life", "film_series", "game", "book_media", "oc"];
    characterType = await tp.system.suggester(typeOpts, typeVals, false, `Character type for ${title.replace("Character_", "")}:`) || "real_life";

    if (characterType !== "real_life") {
        const sourceModes = {
            film_series: [
                { label: "Film", folder: "6_Resources/Films", type: "film" },
                { label: "Series", folder: "6_Resources/Series", type: "serie" }
            ],
            game: [{ label: "Game", folder: "6_Resources/Games", type: "game" }],
            book_media: [
                { label: "Book", folder: "6_Resources/Books", type: "book" },
                { label: "Film", folder: "6_Resources/Films", type: "film" },
                { label: "Series", folder: "6_Resources/Series", type: "serie" },
                { label: "Game", folder: "6_Resources/Games", type: "game" }
            ],
            oc: [
                { label: "Original World / Reference", folder: "6_Resources/Reference", type: "reference" },
                { label: "Book", folder: "6_Resources/Books", type: "book" },
                { label: "Game", folder: "6_Resources/Games", type: "game" }
            ]
        };

        const modeList = sourceModes[characterType] || sourceModes.book_media;
        const sourceMode = await tp.system.suggester(
            ["No Source Yet", ...modeList.map(m => m.label)],
            [null, ...modeList],
            false,
            "Attach an existing source?"
        );

        if (sourceMode) {
            sourceType = sourceMode.type;
            const sourceFiles = app.vault.getFiles()
                .filter(f => f.extension === "md" && f.path.startsWith(sourceMode.folder + "/"))
                .sort((a, b) => b.stat.mtime - a.stat.mtime)
                .slice(0, 40);

            const sourceOptions = [
                ...sourceFiles.map(f => ({ label: f.basename, link: `[[${f.path}|${f.basename}]]`, isNew: false })),
                { label: "Create New Source...", link: "", isNew: true },
                { label: "Manual Link Later", link: "", isNew: false }
            ];

            const sourcePick = await tp.system.suggester(
                sourceOptions.map(s => s.label),
                sourceOptions,
                false,
                `Source for ${title.replace("Character_", "")}:`
            );

            if (sourcePick?.isNew) {
                const newSourceName = await tp.system.prompt(`New ${sourceMode.label} title?`, "");
                if (newSourceName) {
                    const cleanSourceName = newSourceName.trim().replace(/[\\/:*?"<>|]/g, "-");
                    let curr = "";
                    for (const seg of sourceMode.folder.split("/")) {
                        curr = curr ? `${curr}/${seg}` : seg;
                        if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
                    }
                    const sourcePath = `${sourceMode.folder}/${cleanSourceName}.md`;
                    if (!app.vault.getAbstractFileByPath(sourcePath)) {
                        const sourceContent = `---\narch:\n  - "#6resource"\narchtype:\n  - "#6resource/${sourceMode.type}"\nstatus: 1active\ncharacter:\n  - "${title.replace("Character_", "")}"\n---\n\n# ${cleanSourceName}\n`;
                        await app.vault.create(sourcePath, sourceContent);
                    }
                    sourceLink = `[[${sourcePath}|${cleanSourceName}]]`;
                }
            } else if (sourcePick?.link) {
                sourceLink = sourcePick.link;
            }
        }
    }

    const groupOpts = ["Family", "Friends", "Students", "Colleagues", "Partner", "Fictional", "Original Characters", "Custom Group..."];
    const groupVals = ["Family", "Friends", "Students", "Colleagues", "Partner", "Fictional", "Original Characters", "Custom"];
    groupName = await tp.system.suggester(groupOpts, groupVals, false, `Select Group/Folder for ${title.replace("Character_", "")}:`) || "Uncategorized";

    if (groupName === "Custom") {
        groupName = await tp.system.prompt("Enter custom group name:", "Acquaintance") || "Uncategorized";
        groupName = groupName.trim().replace(/[\\/:*?"<>|]/g, "-");
    }
}

// 🔱 3. PATH CREATION & RENAME/MOVE
const relFolder = "2_Areas/2_Relationship";
const targetDir = groupName !== "Uncategorized" ? `${relFolder}/${groupName}` : relFolder;

// Ordner erstellen, falls nicht existent
let currentPath = "";
for (const seg of targetDir.split("/")) { 
    currentPath = currentPath ? currentPath + "/" + seg : seg; 
    if (!app.vault.getAbstractFileByPath(currentPath)) await app.vault.createFolder(currentPath); 
}

// Physisches Umbenennen
if (tp.file.title !== title) {
    await tp.file.rename(title);
}

// Physisches Verschieben in den korrekten Gruppen-Ordner
const finalDest = `${targetDir}/${title}.md`;
if (tp.file.path !== finalDest && !app.vault.getAbstractFileByPath(finalDest)) {
    await new Promise(r => setTimeout(r, 200)); 
    await tp.file.move(finalDest);
}

// 🔱 4. CLEANING FÜR DIE ÜBERSCHRIFT (ohne "Character_")
let displayTitle = title.replace(/^Character_/, "").trim();

tR += "---"  
%>
banner: "![[xAttachment/Images/Banner/cat-art-yin-yang-cats-.jpg]]"
banner_y: 0.4
banner_icon: "<%- icon %>"
inbox: true
persona: "<%- persona %>"
arch:
  - "#2area"
archtype:
  - "#2area/2relationship"
status: 1active
priority:
  - "4"
science: ["<%- sci %>"]
discipline: ["<%- disc %>"]
relation: "<%- groupName %>"
character_type: "<%- characterType %>"
source_type: "<%- sourceType %>"
source_media: "<%- sourceLink %>"
due:
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:<%* if (sourceLink) { %>
  - "<%- sourceLink %>"<%* } %>
parent: "<%- pLink %>"
sibling: []
child: []
summary:
review:
---

# <%- icon %> <%- displayTitle %>

> [!quote] "The quality of your life is the quality of your relationships."

---

## 🤝 Profile & Base Data

> [!multi-column]
>
> > [!info|wide-1] 👤 Vitals
> > **Relation / Group:** `INPUT[text:relation]`
> > **Character Type:** `INPUT[inlineSelect(option(real_life), option(film_series), option(game), option(book_media), option(oc)):character_type]`
> > **Source Type:** `INPUT[inlineSelect(option(), option(film), option(serie), option(game), option(book), option(reference)):source_type]`
> > **Source:** `INPUT[inlineList:source_media]`
> > `BUTTON[add-character-source]`
> > **Birthday:** `INPUT[date:birthday]`
> > **Location:** `INPUT[text:location]`
>
> > [!love|wide-1] 🎁 Traits & Preferences
> > **Interests:** `INPUT[text:interests]`
> > **Gift Ideas:** `INPUT[text:gifts]`
> > **Allergies/Diet:** `INPUT[text:diet]`

---

## 🚀 Active Responsibilities
*(Hier erscheinen automatisch alle aktiven Projekte, die du für diesen Character managst).*

```dataview
TABLE status AS Status, persona AS Persona
FROM "3_Projects"
WHERE contains(area2, this.file.link) OR contains(parent, this.file.link)
SORT file.mtime DESC
```

## 📂 Reference & Documents
*(Hier sammeln sich Dokumente und Notizen, die mit diesem Character verlinkt sind).*

```dataview
TABLE file.folder AS Folder, file.mtime AS "Last Modified"
FROM "5_Notes" OR "6_Resources" OR "0_Calendar"
WHERE contains(area2, this.file.link) OR contains(parent, this.file.link) OR contains(source_media, this.file.link) OR contains(resource6, this.file.link)
SORT file.mtime DESC
```

## Source Characters

```dataview
TABLE character_type AS Type, relation AS Group, file.mtime AS "Last Modified"
FROM "2_Areas/2_Relationship"
WHERE source_media = this.source_media AND file.path != this.file.path AND source_media
SORT file.name ASC
```

---
**System Action:** [[fleet- |+ Create Note]] | [[p- |+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
