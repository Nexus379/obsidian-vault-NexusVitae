arch:
  - "#5note"
archtype:
  - "#5note/3atomic/household"
science: 
  - "#sci/Chemistry"
discipline: 
  - "#disc/Household"
note5:
nextstudy:
LID: "N2026063012484195"
parent: ""
tags:
  - "#entity/household_item"
aliases:
  - "Zewa Kitchen Towels"
  - "Zewa Wisch&Weg"
  - "Zewa Wisch&Weg (Klassik)"
priority: 
subject: "Household"
persona: "chemist"
status: 1active
entity_class: "household_item"
household_type: "cleaning_supply"
state: "storage"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Technologische Wabenstruktur für maximale Flüssigkeitsaufnahme"
  - "Kann ausgewrungen und weiterbenutzt werden"
  - "Sehr reißfest im nassen Zustand"
unit_type: "piece"
icon: "🧻"
en: "Zewa Kitchen Towels"
label: "Zewa Wisch&Weg (Klassik)"
sci: 
  - "#sci/Physics"
absorbency_tech: "Power-X-Struktur"
pl_score: 6.5
brand: "Zewa"
room: "kitchen"
unit_price: 5.00
de: "Zewa Wisch&Weg"
locations: 
  - "everywhere"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/household"
science: 
  - "#sci/Chemistry"
discipline: 
  - "#disc/Household"
note5:
nextstudy:
LID: "N2026063012484195"
parent: ""
tags:
  - "#entity/household_item"
aliases:
explore_lvl: 5finish
priority: 
subject: "Household"
persona: "chemist"
status: 1active
entity_class: "household_item"
household_type: "cleaning_supply"
state: "storage"
needs_refill: false
shelf_life_months: 24
# props: 
  - "Technologische Wabenstruktur für maximale Flüssigkeitsaufnahme"
  - "Kann ausgewrungen und weiterbenutzt werden"
  - "Sehr reißfest im nassen Zustand"
unit_type: "piece"
icon: "🧻"
en: "Zewa Kitchen Towels"
label: "Zewa Wisch&Weg (Klassik)"
sci: 
  - "#sci/Physics"
absorbency_tech: "Power-X-Struktur"
pl_score: 6.5
brand: "Zewa"
room: "kitchen"
unit_price: 5.00
de: "Zewa Wisch&Weg"
locations: 
  - "everywhere"
--- 🧼 CHEMICAL SPECS ---
unit_price: 0
pref_vendor: ""
vendors: []
brand: ""
ph_level: 7.0
solvent_type: ""
surfactant_conc: ""
pl_score: 0
---

# 🧼  N2026063012484195   Zewa Wisch&Weg (Klassik)

## 🔬 Chemical Lab
| 🧼 Property | ⚖️ Value |     |
| :------------- | :------- | --- |
| 🏷️ **Type** | `INPUT[suggester(option(cleaning_supply, 🧽 Cleaning), option(tool, 🛠️ Tool), option(textile, 🧺 Textile), option(organization, 📦 Org)):household_type]` |     |
| 🏷️ **Brand** | `INPUT[text:brand]` |     |
| 🏪 **Vendor** | `INPUT[text:pref_vendor]` |     |
| 💰 **Price** | `INPUT[number:unit_price]` € |     |
| 🧪 **pH Level** | `INPUT[number:ph_level]` |     |
| 💧 **Solvent Type** | `INPUT[text:solvent_type]` |     |
| 🫧 **Surfactants** | `INPUT[text:surfactant_conc]` |     |
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






