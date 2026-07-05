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
LID: "N202607010816164"
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
# de: "Alverde Bodylotion"
skin_type: "Very Dry"
icon: "ðŸ§´"
label: "Primavera Lavendel fein (AromaÃ¶l 100% naturrein)"
brand: "Primavera"
room: "bathroom"
unit_price: 3.00
locations: 
  - "budni"
  - "dm"
en: "Primavera Lavender Essential Oil"
unit_type: "piece"
pl_score: 9.0
props:
  - "Ofuro / Entspannung (Premium)"
--- ðŸ§´ MATERIAL SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
material: ""
chlorine_free: "Yes"
absorption: ""
pl_score: 0
---

# ðŸ§´  N2026063012484113   Alverde Bodylotion Bio-Olive

## ðŸ”¬ Material Lab
| ðŸ§´ Property | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(skincare, ðŸ§´ Skincare), option(haircare, ðŸ’‡ Haircare), option(makeup, ðŸ’„ Makeup), option(hygiene, ðŸ§¼ Hygiene), option(dental, ðŸ¦· Dental)):personal_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| ðŸ§¬ **Material** | `INPUT[text:material]` |     |
| â˜ï¸ **Absorption** | `INPUT[text:absorption]` |     |
| ðŸŒ¿ **Chlorine Free** | `INPUT[text:chlorine_free]` |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- 
- 
- 

---

---
#### ðŸ”± Connexio
> [!link]- ðŸ”— Nexus
>>[!multi-column]
>>>[!task] ðŸ› ï¸ Tasks
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
>>>[!project] ðŸš§ Projects
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
>>> [!note] âœï¸ Notes
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
>> [!source]- ðŸ”– Sources
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resource AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!area]- ðŸ’  Areas
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
>>> [!stars]- âœ¨ Stellae
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
>> [!abstract]- ðŸ”™ Hub & Backlinks
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
    # Nutze den kompletten Pfad ohne fÃ¼hrenden Slash
    templateFile: "zData/2scripts/archiveall.md" 

```







