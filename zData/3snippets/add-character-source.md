<%-*
try {
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("No active character file.");
        return;
    }

    const cache = app.metadataCache.getFileCache(activeFile) || {};
    const fm = cache.frontmatter || {};
    const currentType = String(fm.character_type || "film_series");

    const modeMap = {
        real_life: [],
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

    let modes = modeMap[currentType] || modeMap.book_media;
    if (!modes.length) {
        const shouldContinue = await tp.system.suggester(
            ["Keep real-life character without source", "Attach source anyway"],
            ["stop", "continue"],
            false,
            "This character is real_life."
        );
        if (shouldContinue !== "continue") return;
        modes = modeMap.book_media;
    }

    const sourceMode = await tp.system.suggester(
        modes.map(m => m.label),
        modes,
        false,
        "Source type?"
    );
    if (!sourceMode) return;

    const sourceFiles = app.vault.getFiles()
        .filter(f => f.extension === "md" && f.path.startsWith(sourceMode.folder + "/"))
        .sort((a, b) => b.stat.mtime - a.stat.mtime)
        .slice(0, 60);

    const options = [
        ...sourceFiles.map(f => ({ label: f.basename, path: f.path, link: `[[${f.path}|${f.basename}]]`, isNew: false })),
        { label: "Create New Source...", path: "", link: "", isNew: true },
        { label: "Manual Link Later", path: "", link: "", isNew: false }
    ];

    const pick = await tp.system.suggester(
        options.map(o => o.label),
        options,
        false,
        "Attach source:"
    );
    if (!pick) return;

    let sourceLink = pick.link;
    let sourcePath = pick.path;

    if (pick.isNew) {
        const newTitle = await tp.system.prompt(`New ${sourceMode.label} title?`, "");
        if (!newTitle) return;

        const cleanTitle = newTitle.trim().replace(/[\\/:*?"<>|]/g, "-");
        let curr = "";
        for (const seg of sourceMode.folder.split("/")) {
            curr = curr ? `${curr}/${seg}` : seg;
            if (!app.vault.getAbstractFileByPath(curr)) await app.vault.createFolder(curr);
        }

        sourcePath = `${sourceMode.folder}/${cleanTitle}.md`;
        if (!app.vault.getAbstractFileByPath(sourcePath)) {
            const charName = activeFile.basename.replace(/^Character_/, "");
            const content = `---\narch:\n  - "#6resource"\narchtype:\n  - "#6resource/${sourceMode.type}"\nstatus: 1active\ncharacter:\n  - "[[${activeFile.path}|${charName}]]"\n---\n\n# ${cleanTitle}\n`;
            await app.vault.create(sourcePath, content);
        }
        sourceLink = `[[${sourcePath}|${cleanTitle}]]`;
    }

    await app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
        frontmatter.source_type = sourceMode.type;
        if (sourceLink) frontmatter.source_media = sourceLink;

        if (!frontmatter.resource6) frontmatter.resource6 = [];
        if (!Array.isArray(frontmatter.resource6)) frontmatter.resource6 = [frontmatter.resource6];
        if (sourceLink && !frontmatter.resource6.some(v => String(v).includes(sourcePath))) {
            frontmatter.resource6.push(sourceLink);
        }
    });

    if (sourceLink) new Notice("Character source linked.");
} catch (error) {
    new Notice("Character source error: " + error.message, 10000);
}
-%>
