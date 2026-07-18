<%-*
const targetMoment = moment(tp.variables.targetDate || tp.date.now("YYYY-MM-DD"), "YYYY-MM-DD");
const year = targetMoment.format("YYYY");
const kw = targetMoment.format("WW");
tR = "---\n";
%>
banner: "![[xAttachment/Images/Banner/anime-style-library-study.jpg]]"
banner_y: 0.5
banner_icon: 🧠
fileTitle: "<%- tp.variables.title || (year + '-W' + kw + '_srs') %>"
arch:
  - "#0cal"
archtype:
  - "#0cal/7plan"
frozen: false
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
