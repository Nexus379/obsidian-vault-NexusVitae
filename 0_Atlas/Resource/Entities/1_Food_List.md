---
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.5
banner_icon: 🍎
cssclasses:
  - dashboard
---

# 🍎 Food & Nutrition (Home)

## 🧊 Inventory List

> [!tip] Lebensmittel-Übersicht für dein Zuhause

```dataview
TABLE 
    price AS "Price",
    shop AS "Shop",
    kcal AS "Kcal (per 100g)",
    stock_level AS "Stock"
FROM "6_Resources/_Entities/Home/Nutrition"
SORT file.name ASC
```
