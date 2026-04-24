<%-*
/**
 * 🧘 NEXUS ENTROPY MASTER INJECTOR - Array Fixed Edition
 */

try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        new Notice("❌ Error: Dataview API not ready. Please wait a second.");
        return;
    }

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("❌ Error: Active file lost. Please click the button again.");
        return;
    }

    // 🔱 1. KATEGORIEN
    const entropyModes = [
        { 
            display: "🎭 Entertainment", 
            type: "ent", 
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
            type: "crea", 
            arch: ["#2area", "#3project"], 
            archtype: "#2area/5creativity",
            folder: "2_Areas/5_Creativity", 
            persona: "creator"
        },
        { 
            display: "🧘 Activity", 
            type: "act", 
            arch: ["#2area"], 
            archtype: "#2area/6activity",
            folder: "2_Areas/6_Activity", 
            persona: "healer"
        }
    ];

    const mode = await tp.system.suggester(entropyModes.map(m => m.display), entropyModes, false, "Entropy Category:");
    if (!mode) return;

    // 🔱 2. SUCHE BESTEHENDE (MIT .array() FIX)
    const pages = dv.pages(`"${mode.folder}"`);
    const existingItems = pages
        .sort(p => p.file.mtime, "desc")
        .limit(20)
        .map(p => ({ display: `✨ ${p.file.name}`, value: `[[${p.file.path}|${p.file.name}]]`, title: p.file.name, isNew: false }))
        .array(); // <-- Das verwandelt es in ein echtes Array!

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
        
        if (mode.type === "ent") {
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

    // 🔱 3. UNIFIED SYNC TO FRONTMATTER
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
        if (fm.entertain_link) delete fm.entertain_link;

        if (!fm.entropy_link) fm.entropy_link = [];
        if (!Array.isArray(fm.entropy_link)) fm.entropy_link = [fm.entropy_link];
        
        const cleanPath = finalLink.replace(/[\[\]]/g, "").split("|")[0];
        
        if (!fm.entropy_link.some(l => String(l).includes(cleanPath))) {
            fm.entropy_link.push(finalLink);
            new Notice(`➕ Added ${itemTitle} to Entropy Log`);
        } else {
            new Notice("ℹ️ Already in Log");
        }
    });

} catch (error) {
    new Notice("🔥 CRITICAL ERROR: " + error.message, 10000);
    console.error("Entropy Script Error:", error);
}
-%>