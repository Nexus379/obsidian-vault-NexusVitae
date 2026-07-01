# 📦 Nexus Inventory Matrix

> [!info] 💡 System Workflow
> 1. Erstelle ein Item (z.B. "Shampoo").
> 2. Klicke im Item auf **`BUTTON[add-wardrobe-owner]`** und wähle die Person.
> 3. Die Person taucht hier in der Matrix auf! Aktiviere `🔄` (Refill), damit es im Shopping Hub landet!

## 👕 Wardrobe (Kleidung & Schuhe)
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/clothing").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 📏 \`INPUT[text:${p.file.path}#size_me]\`<br>🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 📏 \`INPUT[text:${p.file.path}#size_partner]\`<br>🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## 🧴 Selfcare & Personal
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/personal_care").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## 🏠 Household & Cleaning
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/household").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## 🏋️ Fitness & Sport
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/fitness").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## 🎧 Music & Audio
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/music").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## 💻 Tech & Devices
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/tech").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## ⚔️ LARP & Cosplay
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/larp").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```

## ⛺ Camping & Outdoor
```dataviewjs
dv.table(["Item", "👩 Me", "👨 Partner", "🏠 Household"], 
    dv.pages("#5note/3atomic/camping").map(p => [
        p.file.link,
        p.qty_me !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_me]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_me]\`` : "",
        p.qty_partner !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_partner]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_partner]\`` : "",
        p.qty_household !== undefined ? `📦 \`INPUT[number:${p.file.path}#qty_household]\` 🔄 \`INPUT[toggle:${p.file.path}#refill_household]\`` : ""
    ])
);
```
