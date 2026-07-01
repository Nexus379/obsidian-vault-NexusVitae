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
LID: "N20260701095035"
parent: ""
tags:
  - "#entity/pet_supply"
aliases:
  - "KONG Kickeroo"
  - "KONG Kickeroo (Kuschelspielzeug)"
priority: 
subject: "Pets & Animals"
persona: "vet"
status: 1active
entity_class: "pet_supply"
pet_type: "cat"
item_type: "toy"
state: "active"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Perfect shape for cats to grab and bunny-kick"
  - "Infused with strong North American catnip"
  - "Fluffy tail mimics prey"
unit_type: "piece"
icon: "ðŸ§¶"
en: "KONG Kickeroo"
label: "KONG Kickeroo (Kuschelspielzeug)"
sci: 
  - "#sci/Biology"
pl_score: 8.0
brand: "KONG"
unit_price: 10.00
de: "KONG Kickeroo (Kuschelspielzeug)"
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
LID: "N20260701095035"
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
item_type: "toy"
state: "active"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Perfect shape for cats to grab and bunny-kick"
  - "Infused with strong North American catnip"
  - "Fluffy tail mimics prey"
unit_type: "piece"
icon: "ðŸ§¶"
en: "KONG Kickeroo"
label: "KONG Kickeroo (Kuschelspielzeug)"
sci: 
  - "#sci/Biology"
pl_score: 8.0
brand: "KONG"
unit_price: 10.00
de: "KONG Kickeroo (Kuschelspielzeug)"
locations: 
  - "pet_store"
--- ðŸ¾ PET SPECS ---
pref_vendor: "Fressnapf / Zooplus"
vendors: []
material: "Plush / Catnip"
durability: 7
---

# ðŸ§¶  N20260701095035   KONG Kickeroo (Kuschelspielzeug)

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






