---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/art"
science: 
  - "#sci/MaterialsScience"
  - "#sci/Optics"
discipline: 
  - "#disc/Art"
note5:
nextstudy:
LID: "N2026063012484213"
parent: ""
tags:
  - "#entity/art_supply"
aliases:
explore_lvl: 5finish
priority: 
subject: "Leisure & Art"
persona: "artist"
status: 1active
entity_class: "art_supply"
art_type: "medium_dry"
state: "studio"
qty: 0
needs_refill: false
shelf_life_months: 60
# de: "K-Pur Getreidefrei"
props: 
  - "Bestes P/L-Verhältnis für Allergiker"
  - "Technologisch perfektionierte Krokettenform"
label: "K-Pur Getreidefrei (Kaufland)"
brand: "K-Pur"
room: "pantry"
locations: 
  - "kaufland"
en: "Kaufland Grain Free"
unit_type: "piece"
pl_score: 9.5
grain_free: "Yes"
main_ingredient: "Potato/Beef"
price_pure: 0.00
vendor_pure: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_cheap: 0.00
vendor_cheap: ""
price_value: 15.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
--- 🎨 ART SPECS ---
brand: ""
core_type: ""
ink_type: ""
lightfastness: ""
pl_score: 0
---

# 🎨  N2026063012484213   K-Pur Getreidefrei (Kaufland)

## 🔬 Studio Lab
| 🎨 Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(medium_dry, ✏️ Dry Medium), option(medium_wet, 🖌️ Wet Medium), option(paper_canvas, 📜 Paper/Canvas), option(tool, 🛠️ Tool)):art_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| ✏️ **Core Type** | `INPUT[text:core_type]` |     |
| 🖋️ **Ink Type** | `INPUT[text:ink_type]` |     |
| ☀️ **Lightfastness**| `INPUT[text:lightfastness]` |     |
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

``
`



