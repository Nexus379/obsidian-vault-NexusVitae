---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/nutrition"
science: 
  - "#sci/Med-and-HealthSci"
discipline: 
  - "#disc/Biology"
  - "#disc/Chemistry"
note5:
nextstudy:
LID: "N202607010916172"
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
icon: "ðŸŸ"
sci: 
  - "#sci/Nutrition"
en: "Omega-3 Algae Oil"
label: "Omega-3 AlgenÃ¶l (EPA & DHA)"
brand: "Sunday Natural"
de: "Omega-3 AlgenÃ¶l (EPA & DHA)"
props: 
  - "Health & Optimization"
---

# ðŸŸ N202607010916172   Omega-3 AlgenÃ¶l (EPA & DHA)

## ðŸŒŸ Core Benefits & Science
> [!info] **Warum ist das wichtig?**
> - **Gehirnfunktion:** DHA ist ein massiver Baustein unseres Gehirns und fÃ¶rdert die Konzentration.
> - **Anti-EntzÃ¼ndlich:** EPA senkt stille EntzÃ¼ndungen im gesamten KÃ¶rper massiv.
> - **Herz-Kreislauf:** SchÃ¼tzt die BlutgefÃ¤ÃŸe und das Herz.

## ðŸ”¬ Dosage & Timing
> [!tip] **Einnahme-Empfehlung**
> - **Dosierung:** **1.000 mg bis 2.000 mg** kombiniertes EPA/DHA pro Tag.
> - **Timing:** Am besten **zu einer Hauptmahlzeit**, um die Aufnahme zu maximieren und fischiges AufstoÃŸen zu vermeiden.

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
>> FROM #6resource AND (outgoing([[#]]) OR [[#]])
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

``
`
