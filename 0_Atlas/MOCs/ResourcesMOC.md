---
cssclasses:
  - wide-page
  - dashboard-no-border
---
# 🔖 Resources MOC
![[zData/5design_modul/NavigationModul|NavigationModul]]

---

## 📑 Total Index (A-Z)
*A complete overview of all collected insights and materials, excluding system data.*

> [!abstract]+ Resource Directory
> ```dataview
> TABLE Rating as "⭐", status as "Status", file.folder as "Path"
> FROM "6_Resources" AND !"zData"
> WHERE !contains(file.path, "yArchive")
> SORT file.name ASC
> ```

---

## 📂 Quick Access by Folder
*Browsing through specific shelves:*

> [!multi-column]
>
>> [!book]- 📚 Library
>> ```dataview
>> LIST FROM "6_Resources/Books"
>> LIMIT 10
>> ```
>
>> [!utensils]- 🍳 Recipes
>> ```dataview
>> LIST FROM "6_Resources/Recipes"
>> LIMIT 10
>> ```
>
>> [!archive]- 📦 Other
>> ```dataview
>> LIST FROM "6_Resources"
>> WHERE !contains(file.path, "Library") AND !contains(file.path, "Recipes") AND !contains(file.path, "zData")
>> LIMIT 10
>> ```

---
*Stay humble and keep exploring.*

