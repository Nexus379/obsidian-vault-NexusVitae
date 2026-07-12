<%-*
/**
 * 🧘 NEXUS ENTROPY MASTER INJECTOR - Dynamic Persona Edition
 */

try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        new Notice("❌ Error: Dataview API not ready.");
        return;
    }

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;

    // 🔱 1. KATEGORIEN & ZIELFELDER
    const entropyModes = [
        { 
            display: "🎭 Entertainment", 
            type: "entertain_link", 
            arch: ["#6resource"], 
            query: '"6_Resources/Books" or "6_Resources/Films" or "6_Resources/Series" or "6_Resources/Games"',
            baseFolder: "6_Resources",
            subTypes: [
                { id: "book", icon: "📖", label: "Book" },
                { id: "film", icon: "🎬", label: "Film" },
                { id: "serie", icon: "📺", label: "Serie" }, // Wird zu "Series"
                { id: "game", icon: "🎮", label: "Game" }
            ]
        },
        { 
            display: "🎨 Creativity", 
            type: "creativity_link", 
            arch: ["#2area", "#3project"], 
            archtype: "#2area/5creativity",
            query: '"2_Areas/5_Creativity"',
            folder: "2_Areas/5_Creativity"
        },
        { 
            display: "🧘 Activity", 
            type: "activity_link", 
            arch: ["#2area"], 
            archtype: "#2area/6activity",
            query: '"2_Areas/6_Activity"',
            folder: "2_Areas/6_Activity"
        }
    ];

    const mode = await tp.system.suggester(entropyModes.map(m => m.display), entropyModes, false, "Entropy Category:");
    if (!mode) return;

    // 🔱 2. DATEN ABRUFEN ODER NEU ERSTELLEN
    const pages = dv.pages(mode.query);
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

        // --- 🎯 NEU: DYNAMISCHE PERSONA ABFRAGE ---
        let selectedPersona = "seeker"; // Fallback
        try {
            // Lade die Persona Engine dynamisch
            const file = app.vault.getAbstractFileByPath("zData/2scripts/personaEngine.js");
            if (file) {
                const code = await app.vault.read(file);
                const module = { exports: {} };
                new Function("module", "exports", code)(module, module.exports);
                const personaEngine = module.exports;
                
                if (typeof personaEngine === "function") {
                    const engine = personaEngine();
                    const pLabels = engine.getPersonaLabels();
                    
                    const pChoice = await tp.system.suggester(
                        pLabels.map(p => `${p.icon} ${p.label}`),
                        pLabels.map(p => p.key),
                        false,
                        `🧑‍💼 Which Persona for ${itemTitle}?`
                    );
                    
                    if (pChoice) selectedPersona = pChoice;
                }
            }
        } catch (e) {
            console.log("Persona Engine load failed, using fallback.", e);
        }
        // ------------------------------------------

        let subTag = mode.archtype || "";
        let subFolder = mode.folder || mode.baseFolder;
        
        if (mode.type === "entertain_link") {
            const sType = await tp.system.suggester(mode.subTypes.map(s => s.icon + " " + s.label), mode.subTypes, false, "Type:");
            if (sType) {
                subTag = `#6resource/${sType.id}`;
                subFolder = `${mode.baseFolder}/${sType.label}s`;
            } else {
                return;
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
persona: "${selectedPersona}"
created: ${tp.date.now("YYYY-MM-DD")}
---
# ${itemTitle}\n\n---`;

        await app.vault.create(fullPath, content);
        finalLink = `[[${fullPath}|${itemTitle}]]`;
        new Notice(`✅ Resource Created (${selectedPersona})`);
    } else {
        finalLink = choice.value;
        itemTitle = choice.title;
    }

    // 🔱 3. SICHERER FRONTMATTER-SYNC
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
        const targetField = mode.type;

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