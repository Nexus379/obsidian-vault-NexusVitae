### 📊 Status & Records
> [!multi-column]
>
>> [!zettelkasten] ✍️ Zettelkasten
<%-* 
let zettelFiles = dv.pages('"5 ✏️ Notes"').sort(p => p.file.mtime, "desc").limit(5);
if (zettelFiles.length > 0) {
    tR += "\n>> " + zettelFiles.map(p => "- [[" + p.file.name + "]]").join("\n>> ");
} else { tR += "\n>> - _Keine Einträge._"; }
%>
>
>> [!log] 🌙 Letzte Logs
<%-*
// Wir nutzen Dataview, um die neuesten Dateien aus den drei Ordnern zu holen
const jour = dv.pages('"📅 Calendar/🌷 Journal"').sort(p => p.file.name, "desc").limit(1).file.link[0];
const log = dv.pages('"📅 Calendar/🌻 Log"').sort(p => p.file.name, "desc").limit(1).file.link[0];
const rev = dv.pages('"📅 Calendar/🛰️ Review"').sort(p => p.file.name, "desc").limit(1).file.link[0];

let logs = [];
if (jour) logs.push(">> - **Journal:** " + jour);
if (log)  logs.push(">> - **Log:** " + log);
if (rev)  logs.push(">> - **Review:** " + rev);

if (logs.length > 0) {
    tR += "\n" + logs.join("\n");
} else {
    tR += "\n>> - _Keine Logs gefunden (Pfad prüfen!)_";
}
%>

