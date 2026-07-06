---
arch:
  - "#6resource"
archtype:
  - "#6resource/entity/tech"
science: 
  - "#sci/ComputerScience"
  - "#sci/Engineering"
discipline: 
  - "#disc/Technology"
note5:
nextstudy:
LID: ""
parent: ""
tags:
aliases:
compatibility: []
explore_lvl: 5finish
priority: 
subject: "Tech Gear"
persona: "engineer"
status: 1active
entity_class: "tech_gear"
tech_type: "component"
state: "active"
needs_refill: false
shelf_life_months: 60
# TECH SPECS
brand: ""
ghz: 0
ram_gb: 0
storage_gb: 0
rpm: 0
has_camera: false
adapter_type: "HDMI"
socket: ""
material: ""
screen_inches: 0
battery_h: 0
hz: 0
is_curved: false
battery_mah: 0
camera_mp: 0
condition: "new"
pl_score: 0
# INVENTORY & VENDOR
qty: 0
vendor_pref: ""
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
room: "storage"

---

# 🔋    Powerbank

## Specs Lab
| Specification | ⚖️ Value                                                                                                                                                       |     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **Type**         | `INPUT[suggester(option(component, ⚙️ Component), option(peripheral, 🖱️ Peripheral), option(appliance, 📺 Appliance), option(mobile, 📱 Mobile), option(display, 🖥️ Display), option(audio, 🎧 Audio), option(cable_adapter, 🔌 Cable/Adapter)):tech_type]`                                                          |     |
| **Condition**    | `INPUT[suggester(option(new, 🆕 New), option(refurbished, ♻️ Refurbished), option(used, 🩹 Used)):condition]`                                                                                                                                           |     |
| **Brand**        | `INPUT[text:brand]`                                                                                                                                            |     |
| **Vendor**        | `INPUT[text:vendor_pref]`                                                                                                                                      |     |
| **Price**         | `INPUT[number:unit_price]` €                                                                                                                                   |     |
| **RAM**           | `INPUT[number:ram_gb]` GB                                                                                                                                      |     |
| **GHz**            | `INPUT[number:ghz]` GHz                                                                                                                                        |     |
| **Storage**       | `INPUT[number:storage_gb]` GB                                                                                                                                  |     |
| **RPM**           | `INPUT[number:rpm]`                                                                                                                                            |     |
| **Battery (h)**  | `INPUT[number:battery_h]` h                                                                                                                                      |     |
| **Battery (mAh)**| `INPUT[number:battery_mah]` mAh                                                                                                                                    |     |
| **Camera (MP)**  | `INPUT[number:camera_mp]` MP                                                                                                                                       |     |
| **Screen (")**   | `INPUT[number:screen_inches]` Zoll                                                                                                                                  |     |
| **Refresh (Hz)** | `INPUT[number:hz]` Hz                                                                                                                                              |     |
| **Curved**       | `INPUT[toggle:is_curved]`                                                                                                                                           |     |
| **Camera**        | `INPUT[toggle:has_camera]`                                                                                                                                     |     |
| **Adapter/Ports** | `INPUT[suggester(option(USB-C, USB-C), option(USB-A, USB-A), option(Micro-USB, Micro-USB), option(Lightning, Lightning), option(HDMI, HDMI), option(DisplayPort, DisplayPort), option(VGA, VGA), option(SD, SD), option(MicroSD, MicroSD), option(Audio, Audio 3.5mm), option(Ethernet, Ethernet), option(Power, Power)):adapter_type]` |     |
| **Socket**        | `INPUT[text:socket]`                                                                                                                                           |     |
| **PL Score**       | `INPUT[number:pl_score]` / 10                                                                                                                                  |     |

---
## Source & Notes
- 
- 
- 

---
<%- tp.file.include("[[zData/5design_modul/ConnexioModul]]") %>

---

> [!info] Ownership & Inventory
> Click here to add an owner to this item:
> `BUTTON[add-wardrobe-owner]`
