---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/personal_care"
science: 
  - "#sci/Dermatology"
  - "#sci/MaterialsScience"
discipline: 
  - "#disc/Health"
note5:
nextstudy:
LID: "N2026063012484171"
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
  - "Technologischer Klassiker: Putzen mit Salz-Kristallen"
  - "Neutralisiert Säuren molekular durch Natron"
  - "Regt den Speichelfluss zur natürlichen Selbstreinigung an"
unit_type: "piece"
icon: "🌊"
form: "Non-foaming"
en: "Weleda Salt Toothpaste"
label: "Weleda Sole-Zahncreme"
sci: 
  - "#sci/Chemistry"
pl_score: 8.5
cleaning_agent: "Salt (Sodium Bicarbonate)"
brand: "Weleda"
room: "bathroom"
de: "Weleda Sole"
locations: 
  - "budni"
  - "dm"
  - "pharmacy"
price_pure: 0.00
vendor_pure: ""
price_budget: 0.00
vendor_budget: ""
price_value: 6.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
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

# 🧴  N2026063012484171   Weleda Sole-Zahncreme

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
>> FROM #6resource AND (outgoing([[#]]) OR [[#]])
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

```meta-bind-button
label: "Archivieren"
icon: "archive"
style: primary
actions:
  - type: runTemplaterFile
    # Nutze den kompletten Pfad ohne führenden Slash
    templateFile: "zData/2scripts/archiveall.md" 

```






