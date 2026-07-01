arch:
  - "#5note"
archtype:
  - "#5note/3atomic/pet"
science: 
  - "#sci/Biology"
discipline: 
  - "#disc/Veterinary"
note5:
nextstudy:
LID: "N20260701095036"
parent: ""
tags:
  - "#entity/pet_supply"
aliases:
  - "Natural Paradise XL (Kratzbaum)"
  - "Natural Paradise XL Compact"
priority: 
subject: "Pets & Animals"
persona: "vet"
status: 1active
entity_class: "pet_supply"
pet_type: "cat"
item_type: "furniture"
state: "active"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Made of real, heavy wood instead of cheap cardboard"
  - "Washable and replaceable beds"
  - "Extremely thick sisal pillars (15cm) for large cats"
unit_type: "piece"
icon: "ðŸ›‹ï¸"
en: "Natural Paradise XL Compact"
label: "Natural Paradise XL (Kratzbaum)"
sci: 
  - "#sci/Biology"
pl_score: 8.0
brand: "Natural Paradise"
unit_price: 120.00
de: "Natural Paradise XL (Kratzbaum)"
locations: 
  - "pet_store"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/pet"
science: 
  - "#sci/Biology"
discipline: 
  - "#disc/Veterinary"
note5:
nextstudy:
LID: "N20260701095036"
parent: ""
tags:
  - "#entity/pet_supply"
aliases:
explore_lvl: 5finish
priority: 
subject: "Pets & Animals"
persona: "vet"
status: 1active
entity_class: "pet_supply"
pet_type: "cat"
item_type: "furniture"
state: "active"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Made of real, heavy wood instead of cheap cardboard"
  - "Washable and replaceable beds"
  - "Extremely thick sisal pillars (15cm) for large cats"
unit_type: "piece"
icon: "ðŸ›‹ï¸"
en: "Natural Paradise XL Compact"
label: "Natural Paradise XL (Kratzbaum)"
sci: 
  - "#sci/Biology"
pl_score: 8.0
brand: "Natural Paradise"
unit_price: 120.00
de: "Natural Paradise XL (Kratzbaum)"
locations: 
  - "pet_store"
--- ðŸ¾ PET SPECS ---
pref_vendor: "Fressnapf / Zooplus"
vendors: []
material: "Wood / Sisal"
durability: 9
---

# ðŸ›‹ï¸  N20260701095036   Natural Paradise XL (Kratzbaum)

## ðŸ”¬ Pet Lab
| ðŸ¾ Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ¾ **Pet** | `INPUT[suggester(option(cat, ðŸˆ Cat), option(dog, ðŸ• Dog), option(bird, ðŸ¦œ Bird), option(fish, ðŸŸ Fish)):pet_type]` |     |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(toy, ðŸ§¶ Toy), option(hygiene, ðŸ§½ Hygiene), option(furniture, ðŸ›‹ï¸ Furniture), option(food_bowl, ðŸ¥£ Bowl), option(carrier, ðŸŽ’ Carrier)):item_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| ðŸ§± **Material** | `INPUT[text:material]` |     |
| ðŸ›¡ï¸ **Durability**| `INPUT[number:durability]` / 10 |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- Review: Jackson Galaxy
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






