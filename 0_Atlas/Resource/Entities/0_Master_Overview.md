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
> > 🛒 [[Entities.base#🛒 Restock|What needs buying]]
> > 💶 [[Entities.base#💶 Price Matrix|Where it is cheapest]]
> > 📍 [[Entities.base#📍 By Storage|Where things live]]
>
> > [!info|flat] ✈️ **Travel**
> >
> > ```dataviewjs
> > const hub = dv.page("2_Areas/1_Selfcare/Household/Shopping_Hub");
> > const city = hub && hub.shopping_travel_city ? String(hub.shopping_travel_city).trim() : "";
> > if (city) {
> >     dv.paragraph(`Active: **${city}** — prices come from \`Travel/${city}/ingre_prices.json\`.`);
> > } else {
> >     dv.paragraph("_At home. Set **shopping_travel_city** in the [[Shopping_Hub]] to switch to local prices._");
> > }
> > ```

---

## 📋 Global Inventory Database

> [!tip] Every physical resource across the Nexus, indexed by Bases.

![[Entities.base#📦 All Entities]]

---

## 🛒 What needs buying

![[Entities.base#🛒 Restock]]

---

## 💶 Where it is cheapest

![[Entities.base#💶 Price Matrix]]

---

## ⚖️ Worth the money

![[Entities.base#⚖️ Value Ranking]]

---

## 📍 Where it lives

![[Entities.base#📍 By Storage]]
