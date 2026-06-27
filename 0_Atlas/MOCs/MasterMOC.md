---
banner: "![[xAttachment/Images/Banner/violet sky ocean.jpg]]"
---
# 🗺️ NEXUS MASTER-MOC

> [!multi-column]
>
>> [!star]+ ✨ STELLAE (Stars)
>> *Vision & Goals*
>> ```dataview
>> LIST FROM #1stars AND !"zData"
>> SORT file.name ASC
>> ```
>
>> [!layers]+ 💠 AREAS (Chakras)
>> *Life Areas*
>> ```dataview
>> LIST FROM #2area AND !"zData"
>> SORT file.name ASC
>> ```
>
>> [!construction]+ 🚧 PROJECTS
>> *Active Projects*
>> ```dataview
>> LIST FROM #3project
>> WHERE status = "1active" AND !contains(file.path, "zData")
>> ```

---

> [!multi-column]
>
>> [!todo]+ 🛠️ TASKS (Next Steps)
>> ```dataview
>> TASK FROM #4task
>> WHERE !completed AND priority = "🔴"
>> LIMIT 5
>> ```
>
>> [!edit]+ ✏️ NOTES (Knowledge Garden)
>> *Recently edited*
>> ```dataview
>> LIST FROM #5note 
>> SORT file.mtime DESC
>> LIMIT 8
>> ```
>
>> [!bookmark]+ 🔖 SOURCES (Media Library)
>> ```dataview
>> TABLE without ID 
>>   file.link as Titel, 
>>   Rating as "⭐"
>> FROM #6resou 
>> WHERE status != "done" AND status != "archived" AND status != "bin"
>> LIMIT 5
>> ```

---
## 🕸️ System Health (Unlinked)
> [!info]- Orphaned Notes
> ```dataview
> LIST FROM !"zData"
> WHERE length(file.inlinks) = 0 
> AND !contains(file.path, "Archive")
> ```



```dataviewjs
const content = `
> [!multi-column]
>
>> [!construction] **Active Projects (#3project)**
>> ${dv.pages('#3project').filter(p => p.status == "1active").limit(5).file.link.join("<br>")}
>
>> [!edit] **Recent Knowledge (#5note)**
>> ${dv.pages('#5note').sort(p => p.file.mtime, "desc").limit(5).file.link.join("<br>")}
>
>> [!bookmark] **Open Sources (#6resou)**
>> ${dv.pages('#6resou').filter(p => !["done", "archived", "bin"].includes(String(p.status))).limit(5).file.link.join("<br>")}
`;

dv.el("div", content);

```
