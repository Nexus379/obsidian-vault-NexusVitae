<%-*
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const year = targetMoment.format("YYYY");
const kw = targetMoment.format("WW");
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/anime-style-shopping.jpg]]"
banner_y: 0.5
banner_icon: 🛒
fileTitle: "<%- tp.variables.title || (year + '-W' + kw + '_shopping') %>"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/shopping"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
---

# 🛒 Nexus Shopping Plan: <%- year %>-W<%- kw %>

## 🛒 1. Groceries & Essentials
- [ ] 

## 📦 2. Orders & Deliveries
- [ ] 

## 📝 3. Notes / Budget
- 
