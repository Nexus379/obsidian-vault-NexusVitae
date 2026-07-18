<%-*
// 🔱 1. NEXUS-DATA-SYNC (Autark-Modus)
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

// Abfrage des Namens
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    let nn = await tp.system.prompt("👤 Name of the Person?", "");
    if (nn) {
        title = "Person_" + nn.trim().replace(/[\\/:*?"<>|]/g, "");
    } else {
        title = "Person-" + tp.date.now("HH-mm");
    }
    isNew = true;
} else if (!title.startsWith("Person_")) {
    // Falls Datei manuell benannt wurde, aber das Präfix fehlt
    title = "Person_" + title.trim().replace(/[\\/:*?"<>|]/g, "");
    isNew = true;
}

// Abfrage der Gruppe
if (isNew) {
    const groupOpts = ["👨‍👩‍👧‍👦 Family", "👯 Friends", "🎓 Students", "💼 Colleagues", "❤️ Partner", "➕ Custom Group..."];
    const groupVals = ["Family", "Friends", "Students", "Colleagues", "Partner", "Custom"];
    groupName = await tp.system.suggester(groupOpts, groupVals, false, `📂 Select Group/Folder for ${title.replace("Person_", "")}:`) || "Uncategorized";

    if (groupName === "Custom") {
        groupName = await tp.system.prompt("📂 Enter custom group name:", "Acquaintance") || "Uncategorized";
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

// 🔱 4. CLEANING FÜR DIE ÜBERSCHRIFT (ohne "Person_")
let displayTitle = title.replace(/^Person_/, "").trim();

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
due:
cal0:
stars1:
area2: "<%- area %>"
project3:
task4:
note5:
  - "[[<%- tp.variables.SYS?.inbox || '0_Inbox' %>/GTD - Purpose Vision Area Project Task|GTD - Purpose Vision Area Project Task]]"
resource6:
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
> > **Relation:** `INPUT[text:relation]`
> > **Birthday:** `INPUT[date:birthday]`
> > **Location:** `INPUT[text:location]`
>
> > [!love|wide-1] 🎁 Traits & Preferences
> > **Interests:** `INPUT[text:interests]`
> > **Gift Ideas:** `INPUT[text:gifts]`
> > **Allergies/Diet:** `INPUT[text:diet]`

---

## 🚀 Active Responsibilities
*(Hier erscheinen automatisch alle aktiven Projekte, die du für diese Person managst).*

```dataview
TABLE status AS Status, persona AS Persona
FROM "3_Projects"
WHERE contains(area2, this.file.link) OR contains(parent, this.file.link)
SORT file.mtime DESC
```

## 📂 Reference & Documents
*(Hier sammeln sich Dokumente und Notizen, die mit dieser Person verlinkt sind).*

```dataview
TABLE file.folder AS Folder, file.mtime AS "Last Modified"
FROM "5_Notes" OR "6_Resources" OR "0_Calendar"
WHERE contains(area2, this.file.link) OR contains(parent, this.file.link)
SORT file.mtime DESC
```

---
**System Action:** [[fleet- |+ Create Note]] | [[p- |+ Create Project]] 

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>