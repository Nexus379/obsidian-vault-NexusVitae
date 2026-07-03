arch:
  - "#5note"
archtype:
  - "#5note/3atomic/larp"
science: 
  - "#sci/History"
  - "#sci/Art"
discipline: 
  - "#disc/Hobbies"
note5:
nextstudy:
LID: "N20260701101074"
parent: ""
tags:
  - "#entity/larp_gear"
aliases:
  - "Mytholon Priest Robe"
  - "Mytholon Priester/Engel Robe"
priority: 
subject: "LARP & Cosplay"
persona: "cosplayer"
status: 1active
entity_class: "larp_gear"
larp_type: "costume"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Flowing white fabric that looks heavenly"
  - "Very authentic medieval/fantasy cut"
  - "Can be tried on in their physical stores"
unit_type: "piece"
icon: "ðŸ‘—"
en: "Mytholon Priest Robe"
label: "Mytholon Priester/Engel Robe"
sci: 
  - "#sci/Physics"
pl_score: 9.0
brand: "Mytholon"
unit_price: 70.00
de: "Mytholon Priester/Engel Robe"
locations: 
  - "hobby_store"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/larp"
science: 
  - "#sci/History"
  - "#sci/Art"
discipline: 
  - "#disc/Hobbies"
note5:
nextstudy:
LID: "N20260701101074"
parent: ""
tags:
  - "#entity/larp_gear"
aliases:
explore_lvl: 5finish
priority: 
subject: "LARP & Cosplay"
persona: "cosplayer"
status: 1active
entity_class: "larp_gear"
larp_type: "costume"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Flowing white fabric that looks heavenly"
  - "Very authentic medieval/fantasy cut"
  - "Can be tried on in their physical stores"
unit_type: "piece"
icon: "ðŸ‘—"
en: "Mytholon Priest Robe"
label: "Mytholon Priester/Engel Robe"
sci: 
  - "#sci/Physics"
pl_score: 9.0
brand: "Mytholon"
unit_price: 70.00
de: "Mytholon Priester/Engel Robe"
locations: 
  - "hobby_store"
--- ðŸ§â€â™€ï¸ LARP SPECS ---
store_online: "mytholon.com"
store_local: "Mytholon Stores"
material: "Canvas / Cotton"
authenticity_lvl: 8
is_foam_weapon: false
---

# ðŸ‘—  N20260701101074   Mytholon Priester/Engel Robe

## ðŸ”¬ Forge & Tailor Lab
| ðŸ§â€â™€ï¸ Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(costume, ðŸ‘— Costume), option(armor, ðŸ›¡ï¸ Armor), option(weapon, âš”ï¸ Weapon), option(prop, ðŸ“œ Prop)):larp_type]` |     |
| ðŸ·ï¸ **Brand/Maker** | `INPUT[text:brand]` |     |
| ðŸŒ **Online Shop** | `INPUT[text:store_online]` |     |
| ðŸ° **Local Shop** | `INPUT[text:store_local]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| ðŸ§± **Material** | `INPUT[text:material]` |     |
| âš”ï¸ **Foam Weapon** | `INPUT[toggle:is_foam_weapon]` |     |
| ðŸŽ­ **Authenticity**| `INPUT[number:authenticity_lvl]` / 10 |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- Review: LARP Forums / Local Guilds
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
