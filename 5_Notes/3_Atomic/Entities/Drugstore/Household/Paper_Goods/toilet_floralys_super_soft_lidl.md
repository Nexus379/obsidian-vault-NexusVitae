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
LID: "N2026063012484136"
parent: ""
tags:
  - "#entity/household_item"
aliases:
  - "Floralys Super Soft (4-lagig)"
  - "Lidl 4-ply Toilet Paper"
  - "Lidl Floralys 4-lagig"
priority: 
subject: "Household"
persona: "chemist"
status: 1active
entity_class: "household_item"
household_type: "cleaning_supply"
state: "storage"
needs_refill: false
shelf_life_months: 24
# softness: "High"
props: 
  - "Technologisch optimierte Prägung für maximale Weichheit"
  - "4-Lagen-Struktur verhindert Durchreißen bei Nässe"
  - "Preis-Leistungs-Sieger im Discounter-Segment"
unit_type: "piece"
icon: "🧻"
en: "Lidl 4-ply Toilet Paper"
layers: 4
material: "100% Virgin Pulp"
label: "Floralys Super Soft (4-lagig)"
sci: 
  - "#sci/MaterialsScience"
tear_resistance: "Excellent"
pl_score: 9.5
brand: "Floralys"
room: "bathroom"
unit_price: 6.00
de: "Lidl Floralys 4-lagig"
locations: 
  - "lidl"--
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
LID: "N2026063012484136"
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
# softness: "High"
props: 
  - "Technologisch optimierte Prägung für maximale Weichheit"
  - "4-Lagen-Struktur verhindert Durchreißen bei Nässe"
  - "Preis-Leistungs-Sieger im Discounter-Segment"
unit_type: "piece"
icon: "🧻"
en: "Lidl 4-ply Toilet Paper"
layers: 4
material: "100% Virgin Pulp"
label: "Floralys Super Soft (4-lagig)"
sci: 
  - "#sci/MaterialsScience"
tear_resistance: "Excellent"
pl_score: 9.5
brand: "Floralys"
room: "bathroom"
unit_price: 6.00
de: "Lidl Floralys 4-lagig"
locations: 
  - "lidl"
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

# 🧼  N2026063012484136   Floralys Super Soft (4-lagig)

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






