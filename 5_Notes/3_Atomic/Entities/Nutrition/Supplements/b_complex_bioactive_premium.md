arch:
  - "#5note"
archtype:
  - "#5note/3atomic/personal_care"
science: 
  - "#sci/Dermatology"
  - "#sci/MaterialsScience"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "N2026063012484245"
parent: ""
tags:
  - "#entity/personal_care"
aliases:
  - "B-Complex Methylated (Bioaktiv)"
  - "B-Komplex Bioaktiv"
  - "Vitamina B methylata"
priority: 
subject: "Personal Care"
persona: "dermatologist"
status: 1active
entity_class: "personal_care"
personal_type: "skincare"
state: "bathroom"
needs_refill: false
shelf_life_months: 12
# props: 
  - "Enthält Methylfolat (5-MTHF) und Methylcobalamin"
  - "Direkt vom Körper verwertbar ohne Umwandlungsschritte in der Leber"
  - "Ideal bei genetischen Methylierungs-Engpässen"
vit_b12_mcg: 500.0
icon: "🧬"
de: "B-Komplex Bioaktiv"
vit_b6_mg: 20.0
folic_acid_mcg: 400.0
vit_b2_mg: 50.0
label: "B-Complex Methylated (Bioaktiv)"
sci: 
  - "#sci/Epigenetics"
unit_type: "piece"
latin: "Vitamina B methylata"
vit_b1_mg: 50.0
brand: "Thorne/Sunday"
kcal: 0
unit_price: 40.00
vegan: true
locations: 
  - "online"
vit_b7_mcg: 500.0--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/personal_care"
science: 
  - "#sci/Dermatology"
  - "#sci/MaterialsScience"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "N2026063012484245"
parent: ""
tags:
  - "#entity/personal_care"
aliases:
explore_lvl: 5finish
priority: 
subject: "Personal Care"
persona: "dermatologist"
status: 1active
entity_class: "personal_care"
personal_type: "skincare"
state: "bathroom"
needs_refill: false
shelf_life_months: 12
# props: 
  - "Enthält Methylfolat (5-MTHF) und Methylcobalamin"
  - "Direkt vom Körper verwertbar ohne Umwandlungsschritte in der Leber"
  - "Ideal bei genetischen Methylierungs-Engpässen"
vit_b12_mcg: 500.0
icon: "🧬"
de: "B-Komplex Bioaktiv"
vit_b6_mg: 20.0
folic_acid_mcg: 400.0
vit_b2_mg: 50.0
label: "B-Complex Methylated (Bioaktiv)"
sci: 
  - "#sci/Epigenetics"
unit_type: "piece"
latin: "Vitamina B methylata"
vit_b1_mg: 50.0
brand: "Thorne/Sunday"
kcal: 0
unit_price: 40.00
vegan: true
locations: 
  - "online"
vit_b7_mcg: 500.0
--- 🧴 MATERIAL SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
material: ""
chlorine_free: "Yes"
absorption: ""
pl_score: 0
---

# 🧴  N2026063012484245   B-Complex Methylated (Bioaktiv)

## 🔬 Material Lab
| 🧴 Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(skincare, 🧴 Skincare), option(haircare, 💇 Haircare), option(makeup, 💄 Makeup), option(hygiene, 🧼 Hygiene), option(dental, 🦷 Dental)):personal_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| 🧬 **Material** | `INPUT[text:material]` |     |
| ☁️ **Absorption** | `INPUT[text:absorption]` |     |
| 🌿 **Chlorine Free** | `INPUT[text:chlorine_free]` |     |
| ⭐ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## 📝 Source & Notes
- 
- 
- 

---

---
#### 🔱 Connexio
> [!link]- 🔗 Nexus
>>[!multi-column]
>>>[!task] 🛠️ Tasks
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #4task
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #4task WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>>[!project] 🚧 Projects
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #3project
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #3project WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>> [!note] ✏️ Notes
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #5note
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #5note WHERE contains(this.file.inlinks, file.link) OR contains(this.file.outlinks, file.link)
>>>```
>
>> [!source]- 🔖 Sources
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resou AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!area]- 💠 Areas
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #2area
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #2area WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>>
>>> [!stars]- ✨ Stellae
>>>##### Excedens
>>>```dataview
>>>LIST FROM outgoing([[#]]) AND #1stars
>>>WHERE !contains(file.path, "zData")
>>>```
>>>##### Adveniens
>>>```dataview
>>>LIST FROM #1stars WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>
>> [!abstract]- 🔙 Hub & Backlinks
>> ```dataview
>> LIST FROM [[#]]
>> ```

---

``
`
