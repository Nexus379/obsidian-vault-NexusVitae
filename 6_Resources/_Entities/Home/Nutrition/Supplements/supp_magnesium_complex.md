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
LID: "N202607010916173"
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
state: "pantry"
qty: 0
needs_refill: false
shelf_life_months: 24
icon: "âš¡"
sci: 
  - "#sci/Nutrition"
en: "Magnesium Complex"
label: "Magnesium Komplex"
brand: "Sunday Natural"
de: "Magnesium Komplex"
props: 
  - "Health & Optimization"
price_pure: 0.00
vendor_pure: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_cheap: 0.00
vendor_cheap: ""
price_value: 0.00
vendor_value: "sunday_natural"
price_market: 0.00
vendor_market: ""
---

# âš¡ N202607010916173   Magnesium Komplex

## ðŸŒŸ Core Benefits & Science
> [!info] **Warum ist das wichtig?**
> - **Muskelentspannung:** Verhindert KrÃ¤mpfe und hilft der Muskulatur nach dem Sport zu regenerieren.
> - **Schlaf & Nerven:** Beruhigt das zentrale Nervensystem und sorgt fÃ¼r tieferen Schlaf.
> - **Energieproduktion:** Ohne Magnesium kann der KÃ¶rper kein ATP (Zellenergie) herstellen.

## ðŸ”¬ Dosage & Timing
> [!tip] **Einnahme-Empfehlung**
> - **Dosierung:** **300 mg bis 400 mg** elementares Magnesium pro Tag.
> - **Timing:** Ideal **abends ca. 1 Stunde vor dem Schlafengehen** fÃ¼r maximale Entspannung.

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



