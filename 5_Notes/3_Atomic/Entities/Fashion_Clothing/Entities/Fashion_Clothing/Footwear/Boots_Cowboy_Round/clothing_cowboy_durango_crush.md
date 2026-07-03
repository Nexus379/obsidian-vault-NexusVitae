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
LID: "N20260701101034"
parent: ""
tags:
  - "#entity/apparel"
aliases:
  - "Durango Crush"
  - "Durango Crush (Square/Round Toe)"
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
  - "Lightweight and highly decorated shafts"
  - "Square/Round hybrid toe provides ultimate comfort"
  - "Steel shank for arch support"
unit_type: "piece"
icon: "ðŸ¤ "
en: "Durango Crush"
label: "Durango Crush (Square/Round Toe)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Durango"
unit_price: 180.00
de: "Durango Crush (Square/Round Toe)"
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
LID: "N20260701101034"
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
  - "Lightweight and highly decorated shafts"
  - "Square/Round hybrid toe provides ultimate comfort"
  - "Steel shank for arch support"
unit_type: "piece"
icon: "ðŸ¤ "
en: "Durango Crush"
label: "Durango Crush (Square/Round Toe)"
sci: 
  - "#sci/Physics"
pl_score: 8.0
brand: "Durango"
unit_price: 180.00
de: "Durango Crush (Square/Round Toe)"
locations: 
  - "fashion_boutique"
--- ðŸ‘• WARDROBE SPECS ---
pref_vendor: "Online / Brand Store"
vendors: []
size: "38 / 39"
color: "Brown / Black"
material_primary: "Full-Grain Leather"
toe_shape: "square"
care_wash_temp: 0
care_tumble_dry: false
is_waterproof: false
---

# ðŸ¤   N20260701101034   Durango Crush (Square/Round Toe)

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
