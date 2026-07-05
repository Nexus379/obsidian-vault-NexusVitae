---
banner: "![[anime-style-cozy-home-interior-with-furnishings.jpg]]"
banner_y: 0.5
banner_icon: 🛒
arch:
  - "#2area"
archtype:
  - "#2area/4organize"
inbox: false
status:
  - 1active
priority:
  - "1"
persona:
due:
do:
done:
cal0:
stars1:
area2:
project3:
task4:
note5:
resource6:
parent: ""
sibling: []
child: []
summary:
review:
shopping_strategy: value
shopping_extras: []
cssclasses:
  - dashboard-no-border
---

# 🛠️ Nexus Central Procurement Hub

> [!multi-column]
>
> > [!info] 🧊 Inventory & Strategy
> > **Look-Ahead Mode:** `$= (moment().day() === 1) ? "3 Days (Mon-Wed)" : (moment().day() === 4 ? "4 Days (Thu-Sun)" : "24h Focus")`
> > ---
> > **Status:** Data-sync active with [[2_Areas/1_Selfcare/Nutrition/Meal_Plan]] & [[6_Resources/Recipes/Recipes | Recipes Database]].
>
> > [!todo] ➕ Quick Actions
> > [[t-buy|+ New To-Buy (Horizon 0)]]
> > [[p-buy|+ New Pro-Buy (Horizon 1)]]

---

## 🥗 1. Atomic Need & Generator
> [!info] 🛒 Automatische Einkaufsliste
> Die Einkaufsliste generiert sich **vollautomatisch**, wenn du morgens dein Daily Log erstellst und an dem Tag im Timeblocking `groceries` ausgewählt hast! 
> Das System berechnet dann den Bedarf anhand der Dauer bis zum nächsten Einkauf (Lookahead) und speichert die fertige Einkaufsliste statisch in `0_Calendar/4_Projectlogs/Utilities`.
> 
> *Alternativ kannst du sie hier jederzeit manuell generieren:*

> [!multi-column]
>
> > [!todo] 1. Choose Strategy
> > `INPUT[inlineSelect(option(value, "💎 Value / Price-Perf."), option(budget, "💸 Budget / Discount"), option(pure, "🌿 Pure / Organic"), option(market, "🍎 Local Market")):shopping_strategy]`
>
> > [!todo] 2. Generate Manual List
> > `BUTTON[generate-shopping-list]`


---

## 🛒 2. Consensus Emptio (Manual Procurement)

> [!multi-column]
>
> > [!danger|flat] 💸 Horizon 0: To-Buy (Daily)
> > ```dataview
> > TABLE WITHOUT ID 
> >   ("🔗 " + file.link) AS "Item",
> >   due AS "Deadline"
> > FROM #4task/tobuy
> > WHERE !completed
> > SORT due ASC
> > ```
>
> > [!money|flat] 💎 Horizon 1: Pro-Buy (Acquisitions)
> > ```dataview
> > TABLE WITHOUT ID
> >   ("🏗️ " + file.link) AS "Project",
> >   cost AS "Price"
> > FROM #3project/probuy
> > WHERE status = "1active"
> > SORT due ASC
> > ```

---

## 📦 3. Household & Supply (Extras)
> [!todo] Quick-Add Household Extras
> `INPUT[inlineListSuggester(optionQuery("")):shopping_extras]`
> `BUTTON[reset-household]`

```dataview
TABLE WITHOUT ID
  rows.text AS "Extras",
  file.link AS "Origin"
FROM "0_Calendar"
WHERE shopping_extras AND !completed
GROUP BY file.link
```


## 🔄 4. Inventory Restock
> [!info] Items marked for refill in the Nexus Matrix

```dataviewjs
const pages = dv.pages('#6resource/entity').where(p => {
    // 1. Manual Refill Toggle
    for (let key in p) {
        if (key.startsWith("refill_") && p[key] === true) return true;
    }
    // 2. Numeric Stock Level Check
    if (p.stock_level !== undefined && p.min_stock !== undefined) {
        if (p.stock_level <= p.min_stock) return true;
    }
    return false;
});

if(pages.length > 0) {
    dv.table(['Item', 'Refill For / Stock', 'Action'], pages.map(p => {
        let targets = [];
        let actions = [];
        
        // 1. Handle manual refill toggles
        for (let key in p) {
            if (key.startsWith("refill_") && p[key] === true) {
                let name = key.replace("refill_", "");
                if (name === "me") name = "👩 Me";
                else if (name === "partner") name = "👨 Partner";
                else if (name === "household") name = "🏠 Household";
                else if (name === "medical") name = "💊 Medical";
                else name = `👤 ${name.charAt(0).toUpperCase() + name.slice(1)}`;
                
                targets.push(name);
                actions.push(`\`INPUT[toggle:${p.file.path}#${key}]\``);
            }
        }
        
        // 2. Handle stock levels
        if (p.stock_level !== undefined && p.min_stock !== undefined && p.stock_level <= p.min_stock) {
            targets.push(`📉 Low Stock (${p.stock_level} / ${p.min_stock})`);
            actions.push(`Stock: \`INPUT[number:${p.file.path}#stock_level]\``);
        }
        
        return [
            p.file.link, 
            targets.join('<br>'),
            actions.join('<br>')
        ];
    }));
} else {
    dv.paragraph('_All Inventory is fully stocked._');
}
```
