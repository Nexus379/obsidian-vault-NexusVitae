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
LID: "N202607010916175"
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
icon: "ðŸ©¸"
sci: 
  - "#sci/Nutrition"
en: "Vitamin B12"
label: "Vitamin B12"
brand: "Sunday Natural"
de: "Vitamin B12"
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

# ðŸ©¸ N202607010916175   Vitamin B12

## ðŸŒŸ Core Benefits & Science
> [!info] **Warum ist das wichtig?**
> - **Nervensystem:** Essenziell fÃ¼r die Erhaltung und den Aufbau der Nervenbahnen.
> - **Blutbildung:** Wird benÃ¶tigt, um gesunde rote BlutkÃ¶rperchen zu bilden.
> - **Energie:** Ein Mangel fÃ¼hrt zu extremer MÃ¼digkeit und Abgeschlagenheit.

## ðŸ”¬ Dosage & Timing
> [!tip] **Einnahme-Empfehlung**
> - **Dosierung:** **250 mcg bis 500 mcg** tÃ¤glich (oder hochdosiert 1x pro Woche), besonders bei fleischarmer/veganer ErnÃ¤hrung.
> - **Timing:** **Morgens auf nÃ¼chternen Magen** oder zwischen den Mahlzeiten fÃ¼r beste Aufnahme.

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



