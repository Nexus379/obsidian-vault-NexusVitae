# 📦 Nexus Inventory Matrix

> [!info] 💡 System Workflow
> 1. Create an item (e.g., "Shampoo").
> 2. Click on **`BUTTON[add-wardrobe-owner]`** inside the item and select the person.
> 3. The person will appear here in the matrix! Toggle `🔄` (Refill) to add it to the Shopping Hub!
> **`BUTTON[add-wardrobe-owner]`** ⬅️ **Click here to assign an item from the Vault to a person!**

```dataviewjs
const categories = [
    { title: "👕 Wardrobe (Clothing & Footwear)", tag: "#6resource/entity/clothing" },
    { title: "🧴 Selfcare & Personal", tag: "#6resource/entity/personal_care" },
    { title: "🏠 Household & Cleaning", tag: "#6resource/entity/household" },
    { title: "🏋️ Fitness & Sport", tag: "#6resource/entity/fitness" },
    { title: "🎧 Music & Audio", tag: "#6resource/entity/music" },
    { title: "💻 Tech & Devices", tag: "#6resource/entity/tech" },
    { title: "⚔️ LARP & Cosplay", tag: "#6resource/entity/larp" },
    { title: "⛺ Camping & Outdoor", tag: "#6resource/entity/camping" }
];

for (let cat of categories) {
    dv.header(2, cat.title);
    const pages = dv.pages(cat.tag);
    
    // Find all unique owners dynamically
    let owners = new Set();
    for (let p of pages) {
        for (let k in p) {
            if (k.startsWith("qty_") && p[k] !== undefined) {
                owners.add(k.replace("qty_", ""));
            }
        }
    }
    
    let ownerArr = Array.from(owners).sort();
    
    if (ownerArr.length === 0) {
        dv.paragraph("_No items assigned yet._");
        continue;
    }
    
    // Format headers
    let headers = ["Item"].concat(ownerArr.map(o => {
        if (o === "me") return "👩 Me";
        if (o === "partner") return "👨 Partner";
        if (o === "household") return "🏠 Household";
        return `👤 ${o.charAt(0).toUpperCase() + o.slice(1)}`;
    }));

    // Filter pages that actually have an owner
    const ownedPages = pages.where(p => ownerArr.some(o => p[`qty_${o}`] !== undefined));

    let rows = ownedPages.map(p => {
        let row = [p.file.link];
        for (let o of ownerArr) {
            if (p[`qty_${o}`] !== undefined) {
                // Clothing uses sizes, other categories usually don't need it
                if (cat.tag === "#6resource/entity/clothing") {
                    row.push(`📦 \`INPUT[number:${p.file.path}#qty_${o}]\` 📏 \`INPUT[text:${p.file.path}#size_${o}]\`<br>🔄 \`INPUT[toggle:${p.file.path}#refill_${o}]\``);
                } else {
                    row.push(`📦 \`INPUT[number:${p.file.path}#qty_${o}]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_${o}]\``);
                }
            } else {
                row.push("");
            }
        }
        return row;
    });

    dv.table(headers, rows);
}
```

```meta-bind-button
label: "➕ Assign Item from Vault"
id: "add-wardrobe-owner"
icon: "plus-circle"
style: primary
actions:
  - type: runTemplaterFile
    templateFile: "zData/3snippets/add-wardrobe-owner.md"
```
