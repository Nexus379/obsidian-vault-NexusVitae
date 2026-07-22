<%-*
if (!tp.variables) tp.variables = {};

let title = tp.variables.title || tp.file.title;
let pLink = tp.variables.pLink || "";
let luhmannId = tp.variables.luhmannId || "";

const defaultName = String(app.vault.getConfig("newFileName") || "Untitled");
if (!title || title.toLowerCase().includes(defaultName.toLowerCase())) {
    title = await tp.system.prompt("Household Note: Name of Item?", "");
}
if (!title || title.trim() === "") title = "AtomicHousehold-" + tp.date.now("HH-mm");

if (tp.file.title !== title) {
    await tp.file.rename(title);
    await new Promise(r => setTimeout(r, 200));
}

let displayTitle = title;
if (luhmannId && title.startsWith(luhmannId)) displayTitle = title.substring(luhmannId.length);
displayTitle = displayTitle.replace(/^[-\s]+/, "").replace(/^(household-|h-)/i, "").trim();

tR += "---"
%>
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/household"
science:
  - "#sci/Chemistry"
  - "#sci/MaterialsScience"
discipline:
  - "#disc/Household"
note5:
nextstudy:
LID: "<%- luhmannId %>"
parent: "<%- pLink %>"
tags:
aliases:
explore_lvl: 5finish
priority:
subject: "Household"
persona: "organizer"
status: 1active
entity_class: "household_supply"
household_type: "cleaning_supply"
state: "active"
qty: 0
needs_refill: false
shelf_life_months: 36
brand: ""
ph_level: 0
solvent_type: ""
surfactant_conc: ""
pl_score: 0
pref_vendor: ""
pref_price: 0.00
unit_price: 0.00
price_cheap: 0.00
vendor_cheap: ""
price_value: 0.00
vendor_value: ""
price_pure_cheap: 0.00
vendor_pure_cheap: ""
price_pure: 0.00
vendor_pure: ""
price_market: 0.00
vendor_market: ""
---

# <%- luhmannId %> <%- displayTitle %>

## Chemical Lab
| Property | Value |     |
| :--- | :--- | --- |
| Type | `INPUT[suggester(option(cleaning_supply, Cleaning), option(tool, Tool), option(textile, Textile), option(organization, Organization)):household_type]` |     |
| Brand | `INPUT[text:brand]` |     |
| Preferred Vendor | `INPUT[text:pref_vendor]` |     |
| Finance Unit Price | `VIEW[{unit_price}]` |     |
| pH Level | `INPUT[number:ph_level]` |     |
| Solvent Type | `INPUT[text:solvent_type]` |     |
| Surfactants | `INPUT[text:surfactant_conc]` |     |
| PL Score | `INPUT[number:pl_score]` / 10 |     |

<%- tp.file.include("[[zData/5design_modul/ShoppingPriceMatrix]]") %>

## Source & Notes
-
-
-

> [!info] Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`

<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>
