<%-*
/**
 * 🧘 NEXUS ENTROPY MASTER INJECTOR - The Sorting Hat Edition
 */

try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        new Notice("❌ Error: Dataview API not ready.");
        return;
    }

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;

    // 🔱 1. KATEGORIEN & ZIELFELDER (Hier liegt die Magie!)
    const entropyModes = [
        { 
            display: "🎭 Entertainment", 
            type: "entertain_link", // Landet unter der Entertainment-Überschrift
            arch: ["#6resou"], 
            folder: "6_Resources/Entertainment", 
            persona: "player",
            subTypes: [
                { id: "book", icon: "📖", label: "Book" },
                { id: "film", icon: "🎬", label: "Film" },
                { id: "serie", icon: "📺", label: "Serie" },
                { id: "game", icon: "🎮", label: "Game" }
            ]
        },
        { 
            display: "🎨 Creativity", 
            type: "creativity_link", // Landet unter der Creativity-Überschrift
            arch: ["#2area", "#3project"], 
            archtype: "#2area/5creativity",
            folder: "2_Areas/5_Creativity", 
            persona: "creator"
        },
        { 
            display: "🧘 Activity", 
            type: "activity_link", // Landet unter der Activity-Überschrift
            arch: ["#2area"], 
            archtype: "#2area/6activity",
            folder: "2_Areas/6_Activity", 
            persona: "healer"
        }
    ];

    const mode = await tp.system.suggester(entropyModes.map(m => m.display), entropyModes, false, "Entropy Category:");
    if (!mode) return;

    // 🔱 2. DATEN ABRUFEN ODER NEU ERSTELLEN
    const pages = dv.pages(`"${mode.folder}"`);
    const existingItems = pages
        .sort(p => p.file.mtime, "desc")
        .limit(20)
        .map(p => ({ display: `✨ ${p.file.name}`, value: `[[${p.file.path}|${p.file.name}]]`, title: p.file.name, isNew: false }))
        .array(); 

    existingItems.unshift({ display: "➕ [CREATE NEW...]", value: null, isNew: true });

    const choice = await tp.system.suggester(existingItems.map(i => i.display), existingItems, false, "Selection:");
    if (!choice) return;

    let finalLink = "";
    let itemTitle = "";

    if (choice.isNew) {
        itemTitle = await tp.system.prompt(`Enter Title for ${mode.display}:`);
        if (!itemTitle) return;

        let subTag = mode.archtype || "";
        let subFolder = mode.folder;
        
        if (mode.type === "entertain_link") {
            const sType = await tp.system.suggester(mode.subTypes.map(s => s.icon + " " + s.label), mode.subTypes, false, "Type:");
            if (sType) {
                subTag = `#6resou/${sType.id}`;
                subFolder = `${mode.folder}/${sType.label}s`;
            }
        }

        const fileName = itemTitle.replace(/[/\\?%*:|"<>\.]/g, '-');
        const fullPath = `${subFolder}/${fileName}.md`;

        if (!app.vault.getAbstractFileByPath(subFolder)) {
            let parts = subFolder.split('/');
            let cur = "";
            for (let p of parts) {
                cur += (cur ? "/" : "") + p;
                if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur);
            }
        }

        const content = `---
arch: ${JSON.stringify(mode.arch)}
archtype: ["${subTag}"]
status: "1active"
persona: "${mode.persona}"
created: ${tp.date.now("YYYY-MM-DD")}
---
# ${itemTitle}\n\n---`;

        await app.vault.create(fullPath, content);
        finalLink = `[[${fullPath}|${itemTitle}]]`;
        new Notice("✅ Resource Created");
    } else {
        finalLink = choice.value;
        itemTitle = choice.title;
    }

    // 🔱 3. SICHERER FRONTMATTER-SYNC
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
        const targetField = mode.type; // Holt sich genau das richtige Fach!

        let existingData = fm[targetField];

        if (!existingData) {
            fm[targetField] = [];
        } else if (!Array.isArray(existingData)) {
            fm[targetField] = [existingData];
        }

        const cleanPath = finalLink.replace(/[\[\]]/g, "").split("|")[0];
        
        if (!fm[targetField].some(l => String(l).includes(cleanPath))) {
            fm[targetField].push(finalLink);
            new Notice(`➕ Added ${itemTitle} to ${mode.display}`);
        } else {
            new Notice("ℹ️ Already in Log");
        }
    });

} catch (error) {
    new Notice("🔥 CRITICAL ERROR: " + error.message, 10000);
}
-%>