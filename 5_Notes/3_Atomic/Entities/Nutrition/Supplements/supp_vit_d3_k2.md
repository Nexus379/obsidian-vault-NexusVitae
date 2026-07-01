arch:
  - "#5note"
archtype:
  - "#5note/3atomic/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N202607010916171"
parent: ""
tags:
  - "#entity/ingredient"
aliases:
  - "Vitamin D3 + K2"
priority: 
subject: "Nutrition"
persona: "alchemist"
status: 1active
entity_class: "ingredient"
ingre_type: "supplement"
pref_vendor: "sunday_natural"
vendors: []
state: "pantry"
needs_refill: false
shelf_life_months: 24
icon: "â˜€ï¸"
sci: 
  - "#sci/Nutrition"
en: "Vitamin D3 + K2"
label: "Vitamin D3 + K2"
brand: "Sunday Natural"
de: "Vitamin D3 + K2"
props: 
  - "Health & Optimization"--
arch:
  - "#5note"
archtype:
  - "#5note/3atomic/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N202607010916171"
parent: ""
tags:
  - "#entity/ingredient"
aliases:
explore_lvl: 5finish
priority: 
subject: "Nutrition"
persona: "alchemist"
status: 1active
entity_class: "ingredient"
ingre_type: "supplement"
pref_vendor: "sunday_natural"
vendors: []
state: "pantry"
needs_refill: false
shelf_life_months: 24
icon: "â˜€ï¸"
sci: 
  - "#sci/Nutrition"
en: "Vitamin D3 + K2"
label: "Vitamin D3 + K2"
brand: "Sunday Natural"
de: "Vitamin D3 + K2"
props: 
  - "Health & Optimization"
---

# â˜€ï¸ N202607010916171   Vitamin D3 + K2

## ðŸŒŸ Core Benefits & Science
> [!info] **Warum ist das wichtig?**
> - **Knochen & Immunsystem:** D3 ist essentiell fÃ¼r ein starkes Immunsystem und die Knochendichte.
> - **Kalzium-Verwertung:** K2 sorgt dafÃ¼r, dass Kalzium in die Knochen und nicht in die Arterien (Verkalkung) wandert.
> - **Stimmungsaufheller:** Wirkt in den dunklen Wintermonaten gegen die 'Winterdepression'.

## ðŸ”¬ Dosage & Timing
> [!tip] **Einnahme-Empfehlung**
> - **Dosierung:** **5.000 IE** (Internationale Einheiten) pro Tag in den Wintermonaten (Okt-Apr).
> - **Timing:** Immer **mit einer Mahlzeit (die Fett enthÃ¤lt)** einnehmen, da D3 und K2 fettlÃ¶slich sind!

---


---
#### ðŸ”± Connexio
> [!link]- ðŸ”— Nexus
>>[!multi-column]
>>>[!task] ðŸ› ï¸ Tasks
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
>>>[!project] ðŸš§ Projects
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
>>> [!note] âœï¸ Notes
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
>> [!source]- ðŸ”– Sources
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resou AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!area]- ðŸ’  Areas
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
>>> [!stars]- âœ¨ Stellae
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
>> [!abstract]- ðŸ”™ Hub & Backlinks
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
    # Nutze den kompletten Pfad ohne fÃ¼hrenden Slash
    templateFile: "zData/2scripts/archiveall.md" 

```







