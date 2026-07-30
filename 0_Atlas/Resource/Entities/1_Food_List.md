---
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.5
banner_icon: 🍎
cssclasses:
  - dashboard
---

# 🍎 Food & Nutrition (Home)

## 🧊 Inventory List

> [!tip] Food entities stored at home. Field names match the ingredient template.

```dataview
TABLE
    unit_price AS "💶 Price",
    pref_vendor AS "⭐ Vendor",
    kcal AS "🔥 Kcal (per 100g)",
    qty AS "🔢 Qty",
    choice(needs_refill, "🔴 refill", "🟢 ok") AS "🛒 Stock"
FROM "6_Resources/_Entities/Home/Nutrition"
SORT file.name ASC
```
