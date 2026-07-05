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
LID: "N202607010916174"
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
icon: "ðŸ’ª"
sci: 
  - "#sci/Nutrition"
en: "Creatine Monohydrate"
label: "Creatine Monohydrate"
brand: "ESN"
de: "Creatine Monohydrate"
props: 
  - "Health & Optimization"
---

# ðŸ’ª N202607010916174   Creatine Monohydrate

## ðŸŒŸ Core Benefits & Science
> [!info] **Warum ist das wichtig?**
> - **Kraft & Leistung:** ErhÃ¶ht die Schnellkraft und Ausdauer der Muskeln im Training messbar.
> - **Muskelschutz:** Zieht Wasser in die Muskelzellen (pralleres Aussehen) und schÃ¼tzt vor Abbau.
> - **Kognition:** Neuere Studien zeigen, dass Kreatin auch das Gehirn vor ErmÃ¼dung schÃ¼tzt.

## ðŸ”¬ Dosage & Timing
> [!tip] **Einnahme-Empfehlung**
> - **Dosierung:** **3g bis 5g** jeden Tag (auch an trainingsfreien Tagen!). Eine Ladephase ist nicht nÃ¶tig.
> - **Timing:** **Egal wann**, Hauptsache jeden Tag. (Gern morgens ins Wasser oder in den Proteinshake).

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
