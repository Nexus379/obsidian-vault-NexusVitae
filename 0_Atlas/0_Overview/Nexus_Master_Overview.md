---
cssclasses:
  - wide-page
---

# 🏛️ Nexus Master System Overview

![[zData/5design_modul/OverviewNavigationModul]]

---

## 📊 Existing Elements Count Across All Archtypes

```dataviewjs
const archs = [
    { title: "📅 0_Calendar", folder: '"0_Calendar"' },
    { title: "⭐ 1_Stars", folder: '"1_Stars"' },
    { title: "🏔️ 2_Areas", folder: '"2_Areas"' },
    { title: "🧩 3_Projects", folder: '"3_Projects"' },
    { title: "🎯 4_Tasks", folder: '"4_Tasks"' },
    { title: "🗃️ 5_Notes", folder: '"5_Notes"' },
    { title: "🔖 6_Resources", folder: '"6_Resources"' }
];

const rows = archs.map(a => {
    const pCount = dv.pages(a.folder).where(p => !p.file.path.includes("zData")).length;
    return [a.title, pCount, pCount > 0 ? "🟢 Active" : "⚪ Empty"];
});

dv.table(["📂 Domain / Arch", "🔢 Existing Notes", "⚡ State"], rows);
```
