```dataviewjs
const btn = this.container.createEl('button', { text: "🔄 Update Sort Names" });
btn.style.margin = "10px 0";
btn.style.padding = "4px 12px";
btn.style.cursor = "pointer";
btn.style.borderRadius = "4px";

btn.onclick = async () => {
    const file = app.vault.getAbstractFileByPath(dv.current().file.path);
    await app.fileManager.processFrontMatter(file, (fm) => {
        // "publisher" or "company" are excluded here as requested!
        const fields = ["author", "creator", "director", "actor", "actors"];
        fields.forEach(field => {
            let val = fm[field];
            if (!val) return;
            
            // Handle single string
            if (typeof val === "string" && val.trim() !== "") {
                if (val.includes(",")) {
                    fm[field + "_sort"] = val; // Already sorted or comma separated
                    return;
                }
                const parts = val.trim().split(/\s+/);
                let sortName = val;
                if (parts.length > 1) {
                    const last = parts.pop();
                    const first = parts.join(" ");
                    sortName = last + ", " + first;
                }
                fm[field + "_sort"] = sortName;
            } 
            // Handle lists (z.B. mehrere Actors)
            else if (Array.isArray(val)) {
                let sortedArray = val.map(name => {
                    if (typeof name !== "string") return name;
                    if (name.includes(",")) return name;
                    const parts = name.trim().split(/\s+/);
                    if (parts.length > 1) {
                        return parts.pop() + ", " + parts.join(" ");
                    }
                    return name;
                });
                fm[field + "_sort"] = sortedArray;
            }
        });
    });
    new Notice("✅ Sort Names updated successfully!");
}
```
