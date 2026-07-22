<%-*
// Software maintenance resource: apps, plugins, drivers, tools, services.
if (!tp.variables) tp.variables = {};

let luhmannId = tp.variables.luhmannId || "R" + tp.date.now("YYYYMMDDHHmm");
let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Software / Tool name?", "");
}
if (!title || title.trim() === "") title = "Software-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200));
}

const typeOptions = ["App", "Plugin", "Driver", "CLI Tool", "Web Service", "Local Service", "Library", "[+] Custom..."];
const typeValues = ["app", "plugin", "driver", "cli", "web_service", "local_service", "library", "custom"];
let softwareType = await tp.system.suggester(typeOptions, typeValues, false, "Software type?");
if (softwareType === "custom") softwareType = await tp.system.prompt("Software type?", "app");
if (!softwareType) softwareType = "app";

const stateOptions = ["Active", "Testing", "Needs Update", "Broken", "Archived"];
const stateValues = ["active", "testing", "needs_update", "broken", "archived"];
let maintenanceStatus = await tp.system.suggester(stateOptions, stateValues, false, "Maintenance status?");
if (!maintenanceStatus) maintenanceStatus = "active";

let platform = await tp.system.prompt("Platform / OS / Host?", "");
let url = await tp.system.prompt("URL / repo / download page?", "");

let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) displayTitle = title.substring(luhmannId.length);
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(software-|tool-|app-|r-)/i, "").trim();

tR += "---"
%>
banner: "![[xAttachment/Images/Banner/bubble.jpg]]"
banner_icon: 💻
inbox: true
arch:
  - "#6resource"
archtype:
  - "#6resource/software"
status:
  - "1active"
priority:
  - "1"
software_type: "<%- softwareType %>"
maintenance_status: "<%- maintenanceStatus %>"
plattform: "<%- platform %>"
version: ""
url: "<%- url %>"
license: ""
vendor: ""
install_path: ""
config_path: ""
data_path: ""
backup_path: ""
update_channel: ""
last_checked:
next_check:
rating:
ranking:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
sibling:
child:
summary:
review:
---
# 💻 Software Maintenance: <%- luhmannId %> <%- displayTitle %>

> [!reference] Software Details
> >[!multi-column]
> > > [!blank]
> > > **Type:** `INPUT[inlineSelect(option(app), option(plugin), option(driver), option(cli), option(web_service), option(local_service), option(library)):software_type]`
> > > 
> > > **Status:** `INPUT[inlineSelect(option(active), option(testing), option(needs_update), option(broken), option(archived)):maintenance_status]`
> > > 
> > > **Platform:** `INPUT[text:plattform]`
> > 
> > > [!blank]
> > > **Version:** `INPUT[text:version]`
> > > 
> > > **Vendor:** `INPUT[text:vendor]`
> > > 
> > > **URL:** `INPUT[text:url]`

## Maintenance
- Last checked: `INPUT[date:last_checked]`
- Next check: `INPUT[date:next_check]`
- Update channel: `INPUT[text:update_channel]`

## Paths
- Install: `INPUT[text:install_path]`
- Config: `INPUT[text:config_path]`
- Data: `INPUT[text:data_path]`
- Backup: `INPUT[text:backup_path]`

## Notes
- 

---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
