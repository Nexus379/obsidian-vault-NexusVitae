---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/pet"
science: 
  - "#sci/Biology"
discipline: 
  - "#disc/Veterinary"
note5:
nextstudy:
LID: "N20260701095031"
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
item_type: "hygiene"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 24
# props: 
  - "The only brush that actually reaches the undercoat"
  - "Reduces shedding by up to 90%"
  - "Only needs to be used once a week"
unit_type: "piece"
icon: "ðŸ§½"
en: "Furminator for Cats"
label: "Furminator fÃ¼r Katzen (BÃ¼rste)"
sci: 
  - "#sci/Biology"
pl_score: 8.0
brand: "Furminator"
de: "Furminator fÃ¼r Katzen (BÃ¼rste)"
locations: 
  - "pet_store"
price_pure: 0.00
vendor_pure: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_cheap: 0.00
vendor_cheap: ""
price_value: 25.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
--- ðŸ¾ PET SPECS ---
material: "Stainless Steel / Rubber"
durability: 10
---

# ðŸ§½  N20260701095031   Furminator fÃ¼r Katzen (BÃ¼rste)

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

``
`



