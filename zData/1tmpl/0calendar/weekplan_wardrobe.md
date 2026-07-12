<%-*
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const year = targetMoment.format("YYYY");
const kw = targetMoment.format("WW");
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/anime-style-wardrobe.jpg]]"
banner_y: 0.5
banner_icon: 👗
fileTitle: "<%- tp.variables.title || (year + '-W' + kw + '_wardrobe') %>"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/wardrobe"
frozen: false
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
---

# 👗 Nexus Wardrobe Plan: <%- year %>-W<%- kw %>

## 👗 1. Outfits of the Week
- [ ] Monday: 
- [ ] Tuesday: 
- [ ] Wednesday: 
- [ ] Thursday: 
- [ ] Friday: 
- [ ] Weekend: 

## 🧺 2. Laundry & Maintenance
- [ ] 

## 📝 3. Notes / Wishlist
- 
