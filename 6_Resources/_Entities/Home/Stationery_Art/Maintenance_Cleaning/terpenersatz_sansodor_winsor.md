---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/tech"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "N2026063012483915"
parent: ""
tags:
  - "#entity/tech_gear"
aliases:
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "component"
state: "active"
needs_refill: false
shelf_life_months: 60
# odorless: "Yes"
props: 
  - "Technologisch sicherere Alternative zu Terpentin"
  - "Löst Ölfarben effizient ohne Kopfschmerz-Gefahr"
  - "Ideal für die Reinigung von Paletten und Pinseln"
unit_type: "piece"
icon: "💧"
en: "Odorless Mineral Spirits"
label: "Winsor & Newton Sansodor (Geruchloses Lösungsmittel)"
evaporation_rate: "Low"
pl_score: 7.5
brand: "Winsor & Newton"
room: "studio"
sci: 
  - "#sci/OrganicChemistry"
unit_price: 15.00
de: "Geruchloser Verdünner"
--- ⚙️ TECH SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
ghz: 0
ram_gb: 0
storage_gb: 0
rpm: 0
has_camera: false
adapter_type: "USB-C"
socket: ""
material: ""
pl_score: 0
---

# ⚙️  N2026063012483915   Winsor & Newton Sansodor (Geruchloses Lösungsmittel)

## 🔬 Specs Lab
| ⚙️ Specification     | ⚖️ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 🏷️ **Type**         | `INPUT[suggester(option(component, ⚙️ Component), option(peripheral, 🖱️ Peripheral), option(appliance, 📺 Appliance), option(mobile, 📱 Mobile), option(display, 🖥️ Display), option(audio, 🎧 Audio), option(cable_adapter, 🔌 Cable/Adapter)):tech_type]`                                                          |     |
| 🏷️ **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| 🏪 **Vendor**        | `INPUT[text:pref_vendor]`                                                                                                                                      |     |
| 💰 **Price**         | `INPUT[number:unit_price]` €                                                                                                                                   |     |
| 🧠 **RAM**           | `INPUT[number:ram_gb]` GB                                                                                                                                      |     |
| ⚡ **GHz**            | `INPUT[number:ghz]` GHz                                                                                                                                        |     |
| 💾 **Storage**       | `INPUT[number:storage_gb]` GB                                                                                                                                  |     |
| 🔄 **RPM**           | `INPUT[number:rpm]`                                                                                                                                            |     |
| 📷 **Camera**        | `INPUT[toggle:has_camera]`                                                                                                                                     |     |
| 🔌 **Adapter/Ports** | `INPUT[suggester(option(USB-C, USB-C), option(USB-A, USB-A), option(Micro-USB, Micro-USB), option(Lightning, Lightning), option(HDMI, HDMI), option(DisplayPort, DisplayPort), option(VGA, VGA), option(SD, SD), option(MicroSD, MicroSD), option(Audio, Audio 3.5mm), option(Ethernet, Ethernet), option(Power, Power)):adapter_type]` |     |
| 🔌 **Socket**        | `INPUT[text:socket]`                                                                                                                                           |     |
| ⭐ **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

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
