---
banner: "![[xAttachment/Images/Banner/violet sky ocean.jpg]]"
---
# 🗺️ NEXUS MASTER-MOC

> [!multi-column]
>
>> [!star]+ ✨ STELLAE (Sterne)
>> *Vision & Ziele*
>> ```dataview
>> LIST FROM #1stars AND !"zData"
>> SORT file.name ASC
>> ```
>
>> [!layers]+ 💠 AREAS (Chakren)
>> *Lebensbereiche*
>> ```dataview
>> LIST FROM #2area AND !"zData"
>> SORT file.name ASC
>> ```
>
>> [!construction]+ 🚧 PROJECTS
>> *Aktive Vorhaben*
>> ```dataview
>> LIST FROM #3project AND #status/1active
>> WHERE !contains(file.path, "zData")
>> ```

---

> [!multi-column]
>
>> [!todo]+ 🛠️ TASKS (Nächste Schritte)
>> ```dataview
>> TASK FROM #4task
>> WHERE !completed AND priority = "🔴"
>> LIMIT 5
>> ```
>
>> [!edit]+ ✏️ NOTES (Wissens-Garten)
>> *Zuletzt bearbeitet*
>> ```dataview
>> LIST FROM #5note 
>> SORT file.mtime DESC
>> LIMIT 8
>> ```
>
>> [!bookmark]+ 🔖 SOURCES (Mediathek)
>> ```dataview
>> TABLE without ID 
>>   file.link as Titel, 
>>   Rating as "⭐"
>> FROM #6resou 
>> WHERE status != "❇️done"
>> LIMIT 5
>> ```

---
## 🕸️ System-Health (Unverknüpft)
> [!info]- Orphaned Notes (Verwaist)
> ```dataview
> LIST FROM !"zData"
> WHERE length(file.inlinks) = 0 
> AND !contains(file.path, "Archive")
> ```



```dataviewjs
const content = `
> [!multi-column]
>
>> [!construction] **Aktive Projekte (#3project)**
>> ${dv.pages('#3project').filter(p => p.status == "1⚡active").limit(5).file.link.join("<br>")}
>
>> [!edit] **Frisches Wissen (#5note)**
>> ${dv.pages('#5note').sort(p => p.file.mtime, "desc").limit(5).file.link.join("<br>")}
>
>> [!bookmark] **Offene Quellen (#6resou)**
>> ${dv.pages('#6resou').filter(p => p.status != "❇️done").limit(5).file.link.join("<br>")}
`;

dv.el("div", content);

```
