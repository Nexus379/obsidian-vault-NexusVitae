arch:
  - "#5note"
archtype:
  - "#5note/3atomic/tech"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "N20260701083003"
parent: ""
tags:
  - "#entity/tech_gear"
aliases:
  - "Apple iPad (10th Gen)"
  - "iPad 10. Gen"
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "mobile"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "The best value tablet in the world"
  - "Pairs perfectly with a Bluetooth keyboard for writing"
  - "Unbeatable battery life and standby time"
unit_type: "piece"
icon: "ðŸ“±"
en: "Apple iPad (10th Gen)"
label: "iPad 10. Gen"
sci: 
  - "#sci/Chemistry"
pl_score: 8.0
brand: "Apple"
core: "A14 Bionic"
room: "studio"
unit_price: 350.00
de: "iPad 10. Gen"
locations: 
  - "specialty_stores"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/tech"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: "N20260701083003"
parent: ""
tags:
  - "#entity/tech_gear"
aliases:
compatibility: []
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "mobile"
state: "active"
needs_refill: false
shelf_life_months: 60
# props: 
  - "The best value tablet in the world"
  - "Pairs perfectly with a Bluetooth keyboard for writing"
  - "Unbeatable battery life and standby time"
unit_type: "piece"
icon: "ðŸ“±"
en: "Apple iPad (10th Gen)"
label: "iPad 10. Gen"
sci: 
  - "#sci/Chemistry"
pl_score: 8.0
brand: "Apple"
core: "A14 Bionic"
room: "studio"
unit_price: 350.00
de: "iPad 10. Gen"
locations: 
  - "specialty_stores"
--- âš™ï¸ TECH SPECS ---
pref_vendor: "Mindfactory"
vendors: []
ghz: 0
ram_gb: 16
storage_gb: 512
rpm: 0
has_camera: true
adapter_type: "USB-C"
socket: ""
material: "Aluminum"
screen_inches: 10.9
battery_h: 10
condition: "new"
---

# ðŸ“±  N20260701083003   iPad 10. Gen

## ðŸ”¬ Specs Lab
| âš™ï¸ Specification     | âš–ï¸ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| ðŸ·ï¸ **Type**         | `INPUT[suggester(option(component, âš™ï¸ Component), option(peripheral, ðŸ–±ï¸ Peripheral), option(appliance, ðŸ“º Appliance), option(mobile, ðŸ“± Mobile), option(display, ðŸ–¥ï¸ Display), option(audio, ðŸŽ§ Audio), option(cable_adapter, ðŸ”Œ Cable/Adapter)):tech_type]`                                                          |     |
| âœ¨ **Condition**    | `INPUT[suggester(option(new, ðŸ†• New), option(refurbished, â™»ï¸ Refurbished), option(used, ðŸ©¹ Used)):condition]`                                                                                                                                           |     |
| ðŸ·ï¸ **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| ðŸª **Vendor**        | `INPUT[text:pref_vendor]`                                                                                                                                      |     |
| ðŸ’° **Price**         | `INPUT[number:unit_price]` â‚¬                                                                                                                                   |     |
| ðŸ§  **RAM**           | `INPUT[number:ram_gb]` GB                                                                                                                                      |     |
| âš¡ **GHz**            | `INPUT[number:ghz]` GHz                                                                                                                                        |     |
| ðŸ’¾ **Storage**       | `INPUT[number:storage_gb]` GB                                                                                                                                  |     |
| ðŸ”„ **RPM**           | `INPUT[number:rpm]`                                                                                                                                            |     |
| ðŸ”‹ **Battery (h)**  | `INPUT[number:battery_h]` h                                                                                                                                      |     |
| ðŸ“ **Screen (")**   | `INPUT[number:screen_inches]` Zoll                                                                                                                                  |     |
| ðŸ“· **Camera**        | `INPUT[toggle:has_camera]`                                                                                                                                     |     |
| ðŸ”Œ **Adapter/Ports** | `INPUT[suggester(option(USB-C, USB-C), option(USB-A, USB-A), option(Micro-USB, Micro-USB), option(Lightning, Lightning), option(HDMI, HDMI), option(DisplayPort, DisplayPort), option(VGA, VGA), option(SD, SD), option(MicroSD, MicroSD), option(Audio, Audio 3.5mm), option(Ethernet, Ethernet), option(Power, Power)):adapter_type]` |     |
| ðŸ”Œ **Socket**        | `INPUT[text:socket]`                                                                                                                                           |     |
| â­ **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

---
## ðŸ“ Source & Notes
- Review: Notebookcheck.com
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






