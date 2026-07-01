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
LID: "N20260701101076"
parent: ""
tags:
  - "#entity/larp_gear"
aliases:
  - "Epic Armoury DÃ¤monenhÃ¶rner"
  - "Epic Armoury Demon Horns"
priority: 
subject: "LARP & Cosplay"
persona: "cosplayer"
status: 1active
entity_class: "larp_gear"
larp_type: "prop"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Lightweight hollow latex, won't fall off easily"
  - "Apply with spirit gum directly to forehead"
  - "Available from small nubs to massive ram horns"
unit_type: "piece"
icon: "ðŸ˜ˆ"
en: "Epic Armoury Demon Horns"
label: "Epic Armoury DÃ¤monenhÃ¶rner"
sci: 
  - "#sci/Physics"
pl_score: 10.0
brand: "Epic Armoury"
unit_price: 25.00
de: "Epic Armoury DÃ¤monenhÃ¶rner"
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
LID: "N20260701101076"
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
larp_type: "prop"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Lightweight hollow latex, won't fall off easily"
  - "Apply with spirit gum directly to forehead"
  - "Available from small nubs to massive ram horns"
unit_type: "piece"
icon: "ðŸ˜ˆ"
en: "Epic Armoury Demon Horns"
label: "Epic Armoury DÃ¤monenhÃ¶rner"
sci: 
  - "#sci/Physics"
pl_score: 10.0
brand: "Epic Armoury"
unit_price: 25.00
de: "Epic Armoury DÃ¤monenhÃ¶rner"
locations: 
  - "hobby_store"
--- ðŸ§â€â™€ï¸ LARP SPECS ---
store_online: "epicarmoury.com"
store_local: "Elbenwald"
material: "Latex"
authenticity_lvl: 9
is_foam_weapon: false
---

# ðŸ˜ˆ  N20260701101076   Epic Armoury DÃ¤monenhÃ¶rner

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

```meta-bind-button
label: "Archivieren"
icon: "archive"
style: primary
actions:
  - type: runTemplaterFile
    # Nutze den kompletten Pfad ohne führenden Slash
    templateFile: "zData/2scripts/archiveall.md" 

```






