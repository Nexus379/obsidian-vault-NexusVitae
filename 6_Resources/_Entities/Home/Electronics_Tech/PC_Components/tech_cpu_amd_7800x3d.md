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
LID: "N20260701081902"
parent: ""
tags:
  - "#entity/tech_gear"
aliases:
compatibility: ["[[tech_mobo_msi_b650_tomahawk]]", "[[tech_mobo_asrock_b650m_pro_rs]]"]
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "component"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 60
# props: 
  - "The fastest gaming CPU in the world"
  - "Massive L3 cache for extreme frame rates"
  - "Extremely power efficient"
unit_type: "piece"
icon: "ðŸ§ "
en: "AMD Ryzen 7 7800X3D"
label: "Ryzen 7 7800X3D"
sci: 
  - "#sci/Chemistry"
pl_score: 8.0
brand: "AMD"
core: "Silicon (3D V-Cache)"
room: "studio"
de: "Ryzen 7 7800X3D"
locations: 
  - "specialty_stores"
price_pure: 0.00
vendor_pure: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_cheap: 0.00
vendor_cheap: ""
price_value: 350.00
vendor_value: ""
price_market: 0.00
vendor_market: ""
--- âš™ï¸ TECH SPECS ---
ghz: 0
ram_gb: 0
storage_gb: 0
rpm: 0
has_camera: false
adapter_type: "USB-C"
socket: ""
material: ""
---

# ðŸ§   N20260701081902   Ryzen 7 7800X3D

## ðŸ”¬ Specs Lab
| âš™ï¸ Specification     | âš–ï¸ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| ðŸ·ï¸ **Type**         | `INPUT[suggester(option(component, âš™ï¸ Component), option(peripheral, ðŸ–±ï¸ Peripheral), option(appliance, ðŸ“º Appliance), option(mobile, ðŸ“± Mobile), option(display, ðŸ–¥ï¸ Display), option(audio, ðŸŽ§ Audio), option(cable_adapter, ðŸ”Œ Cable/Adapter)):tech_type]`                                                          |     |
| ðŸ·ï¸ **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| ðŸª **Vendor**        | `INPUT[text:pref_vendor]`                                                                                                                                      |     |
| ðŸ’° **Price**         | `INPUT[number:unit_price]` â‚¬                                                                                                                                   |     |
| ðŸ§  **RAM**           | `INPUT[number:ram_gb]` GB                                                                                                                                      |     |
| âš¡ **GHz**            | `INPUT[number:ghz]` GHz                                                                                                                                        |     |
| ðŸ’¾ **Storage**       | `INPUT[number:storage_gb]` GB                                                                                                                                  |     |
| ðŸ”„ **RPM**           | `INPUT[number:rpm]`                                                                                                                                            |     |
| ðŸ“· **Camera**        | `INPUT[toggle:has_camera]`                                                                                                                                     |     |
| ðŸ”Œ **Adapter/Ports** | `INPUT[suggester(option(USB-C, USB-C), option(USB-A, USB-A), option(Micro-USB, Micro-USB), option(Lightning, Lightning), option(HDMI, HDMI), option(DisplayPort, DisplayPort), option(VGA, VGA), option(SD, SD), option(MicroSD, MicroSD), option(Audio, Audio 3.5mm), option(Ethernet, Ethernet), option(Power, Power)):adapter_type]` |     |
| ðŸ”Œ **Socket**        | `INPUT[text:socket]`                                                                                                                                           |     |
| â­ **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

---
## ðŸ“ Source & Notes
- Compability Check: Mindfactory / PCPartPicker
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



