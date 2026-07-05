---
banner: "![[xAttachment/Images/Banner/fantasy-landscape-sunset.jpg]]"
banner_y: 0.5
banner_icon: 📦
cssclasses:
  - dashboard
---

# 📦 Nexus Entities Master Overview

> [!multi-column]
>
> > [!abstract|flat] 🏠 **Home Base**
> > 
> > **Quick Links:**
> > 🍎 [[1_Food_List|Food & Nutrition]]
> > 💊 Medical & Health
> > 💻 Electronics & Tech
>
> > [!info|flat] ✈️ **Travel (Tokyo)**
> >
> > **Quick Links:**
> > 🍎 Food & Nutrition (Tokyo)
> > 👘 Fashion & Cosplay

---

## 📋 Global Inventory Database

> [!tip] Alle physischen Ressourcen im gesamten Nexus-System.

```dataview
TABLE 
    price AS "Price",
    shop AS "Shop",
    kcal AS "Kcal",
    stock_level AS "Stock"
FROM "6_Resources/_Entities"
SORT file.name ASC
```
