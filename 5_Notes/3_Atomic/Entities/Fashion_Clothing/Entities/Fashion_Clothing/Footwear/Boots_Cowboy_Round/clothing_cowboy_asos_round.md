arch:
  - "#5note"
archtype:
  - "#5note/3atomic/clothing"
science: 
  - "#sci/Sociology"
  - "#sci/Chemistry"
discipline: 
  - "#disc/Fashion"
note5:
nextstudy:
LID: "N20260701101030"
parent: ""
tags:
  - "#entity/apparel"
aliases:
  - "ASOS Design Roper (Runde Kappe)"
  - "ASOS Design Roper Boot"
priority: 
subject: "Wardrobe & Apparel"
persona: "stylist"
status: 1active
entity_class: "apparel"
clothing_type: "footwear"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Budget friendly way to test the roper style"
  - "Completely round toe, no squeezing"
  - "Faux leather"
unit_type: "piece"
icon: "ðŸ¤ "
en: "ASOS Design Roper Boot"
label: "ASOS Design Roper (Runde Kappe)"
sci: 
  - "#sci/Physics"
pl_score: 6.0
brand: "ASOS Design"
unit_price: 60.00
de: "ASOS Design Roper (Runde Kappe)"
locations: 
  - "fashion_boutique"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/clothing"
science: 
  - "#sci/Sociology"
  - "#sci/Chemistry"
discipline: 
  - "#disc/Fashion"
note5:
nextstudy:
LID: "N20260701101030"
parent: ""
tags:
  - "#entity/apparel"
aliases:
explore_lvl: 5finish
priority: 
subject: "Wardrobe & Apparel"
persona: "stylist"
status: 1active
entity_class: "apparel"
clothing_type: "footwear"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "Budget friendly way to test the roper style"
  - "Completely round toe, no squeezing"
  - "Faux leather"
unit_type: "piece"
icon: "ðŸ¤ "
en: "ASOS Design Roper Boot"
label: "ASOS Design Roper (Runde Kappe)"
sci: 
  - "#sci/Physics"
pl_score: 6.0
brand: "ASOS Design"
unit_price: 60.00
de: "ASOS Design Roper (Runde Kappe)"
locations: 
  - "fashion_boutique"
--- ðŸ‘• WARDROBE SPECS ---
pref_vendor: "Online / Brand Store"
vendors: []
size: "38 / 39"
color: "Brown / Black"
material_primary: "Faux Leather"
toe_shape: "round"
care_wash_temp: 0
care_tumble_dry: false
is_waterproof: false
---

# ðŸ¤   N20260701101030   ASOS Design Roper (Runde Kappe)

## ðŸ”¬ Style & Fabric Lab
| ðŸ‘• Specification | âš–ï¸ Value |     |
| :------------- | :------- | --- |
| ðŸ·ï¸ **Type** | `INPUT[suggester(option(casual, ðŸ‘• Casual), option(formal, ðŸ‘” Formal), option(footwear, ðŸ‘ž Footwear), option(outerwear, ðŸ§¥ Outerwear), option(activewear, ðŸƒ Activewear), option(accessory, ðŸ•¶ï¸ Accessory)):clothing_type]` |     |
| ðŸ·ï¸ **Brand** | `INPUT[text:brand]` |     |
| ðŸª **Vendor** | `INPUT[text:pref_vendor]` |     |
| ðŸ’° **Price** | `INPUT[number:unit_price]` â‚¬ |     |
| ðŸ“ **Size** | `INPUT[text:size]` |     |
| ðŸŽ¨ **Color** | `INPUT[text:color]` |     |
| ðŸ§± **Material** | `INPUT[text:material_primary]` |     |
| ðŸ‘¢ **Toe Shape** | `INPUT[suggester(option(round, â­• Round), option(square, ðŸ”² Square), option(pointed, ðŸ”º Pointed), option(none, âž– None)):toe_shape]` |     |
| ðŸŒ¡ï¸ **Wash Temp** | `INPUT[number:care_wash_temp]` Â°C |     |
| ðŸŒªï¸ **Tumble Dry** | `INPUT[toggle:care_tumble_dry]` |     |
| ðŸŒ§ï¸ **Waterproof** | `INPUT[toggle:is_waterproof]` |     |
| â­ **PL Score** | `INPUT[number:pl_score]` / 10 |     |

---
## ðŸ“ Source & Notes
- Review: Fashion Forums / Tailors
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
