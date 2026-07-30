
---
#### 🚀 Cockpit

<small>Tasks live in `4_Tasks` — they are their own GTD horizon. What ties them here is `project3`, which is what the queries below follow. Need a full page instead of these panels? The button spins one off.</small>

`BUTTON[add-project-overview]`

>[!multi-column]
>
>> [!log]- 🧩 Projectlogs
>> ```dataview
>> TABLE without ID file.link as Log, focus_LOG as Focus, cal_date as Date
>> FROM #0cal/4projectlog
>> WHERE contains(project3, this.file.link) OR contains(string(project3), this.file.name)
>> SORT cal_date DESC
>> ```
>
>> [!source]- 📜 Protocols
>> ```dataview
>> TABLE without ID file.link as Protocol, cal_date as Date
>> FROM #0cal/5protocol
>> WHERE contains(project3, this.file.link) OR contains(string(project3), this.file.name)
>> SORT cal_date DESC
>> ```

> [!todo]- ✅ Open here
> Checkboxes from this project, its logs and its protocols — tick them off right here.
> ```dataview
> TASK
> WHERE !completed
>   AND (contains(project3, this.file.link)
>     OR contains(string(project3), this.file.name)
>     OR file.path = this.file.path)
>   AND !contains(file.path, "zData")
>   AND !contains(file.path, "yArchive")
> ```

> [!abstract]- 📅 Timeline
> Everything dated that points at this project, newest first.
> ```dataview
> TABLE without ID file.link as Entry, archtype as Type, cal_date as Date
> FROM #0cal
> WHERE (contains(project3, this.file.link) OR contains(string(project3), this.file.name))
>   AND cal_date
> SORT cal_date DESC
> LIMIT 30
> ```
