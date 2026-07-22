<%-*
if (!tp.variables) tp.variables = {};
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const dateStr = targetMoment.format("YYYY-MM-DD");
const energy = tp.variables.energy || "3";
const year = tp.variables.planYear || targetMoment.format("YYYY");
const kw = tp.variables.planKw || targetMoment.format("WW");
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/anime-style-library-study.jpg]]"
banner_y: 0.5
banner_icon: 🧠
fileTitle: "<%- tp.variables.title || (year + '-W' + kw + '_srs') %>"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan/srs"
cal_date: <%- dateStr %>
energy: "<%- energy %>"
frozen: false
plan_type: srs
plan_year: "<%- year %>"
plan_kw: "<%- kw %>"
---

# 🧠 Nexus Spaced Repetition Plan: <%- year %>-W<%- kw %>

## 📚 1. Focus Topics (This Week)
- [ ] 

## 🔄 2. Review Pipeline
- [ ] 

## 📝 3. Notes & Progress
- 
