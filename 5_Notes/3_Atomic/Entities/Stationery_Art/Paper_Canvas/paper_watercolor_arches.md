arch:
  - "#5note"
archtype:
  - "#5note/3atomic/stationery"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "N20260701074101"
parent: ""
tags:
  - "#entity/art_supply"
aliases:
  - "Aquarellpapier Arches"
  - "Arches Watercolor Paper (Cold Pressed)"
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "art_supply"
tech_type: "paper"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "100% Cotton for maximum absorbency"
  - "Cold Pressed (fine grain) for perfect texture"
  - "The world's best watercolor paper, very expensive but worth every cent"
unit_type: "piece"
icon: "📄"
en: "Arches Watercolor Paper (Cold Pressed)"
label: "Aquarellpapier Arches"
sci: 
  - "#sci/Chemistry"
pl_score: 7.0
brand: "Arches"
core: "100% Cotton, 300g/m²"
room: "studio"
unit_price: 15.00
de: "Aquarellpapier Arches"
locations: 
  - "specialty_stores"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/stationery"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "N20260701074101"
parent: ""
tags:
  - "#entity/art_supply"
aliases:
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "art_supply"
tech_type: "paper"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "100% Cotton for maximum absorbency"
  - "Cold Pressed (fine grain) for perfect texture"
  - "The world's best watercolor paper, very expensive but worth every cent"
unit_type: "piece"
icon: "📄"
en: "Arches Watercolor Paper (Cold Pressed)"
label: "Aquarellpapier Arches"
sci: 
  - "#sci/Chemistry"
pl_score: 7.0
brand: "Arches"
core: "100% Cotton, 300g/m²"
room: "studio"
unit_price: 15.00
de: "Aquarellpapier Arches"
locations: 
  - "specialty_stores"
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

# 📄  N20260701074101   Aquarellpapier Arches

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
