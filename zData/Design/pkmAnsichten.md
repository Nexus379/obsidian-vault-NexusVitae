

# 🎓 StudyLog: 2026-03-11 pkm




> [!multi-column]
>> [!abstract] 🕒 Chronos Sync
>> **Date:** `VIEW[{cal-date}]`
>> 
>> **Energy:** `VIEW[{energy}]` / 5
>> 
>> **Brain-Drain:** `VIEW[{brain-drain}]` / 5
>
>> [!log]- 📜 On this day
>> ```dataview
>> LIST FROM "0_Calendar/3_Studylog"
>> WHERE file.day.month = this.file.day.month AND file.day.day = this.file.day.day
>> AND file.name != this.file.name
>> ```

---
## General Notes

# 🎓 StudyLog: 2026-03-11
> [!abstract] 🔱 Nexus Sync: 5/5 | Brain: 5/5

# 🎓 StudyLog: <%- dateStr %>

## 🚀 Fokus
(Hier nur Text, keine INPUT-Felder)

## 🎛️ Nexus Konsole
| 🐉 **Mythology** | `INPUT[text:mythology]` | (Sci: Humanities)
| 🏺 **Archaeology** | `INPUT[text:archaeology]` | (Sci: Humanities)
| 🏺 **Archaeology** | `INPUT[text:archaeology]` | (Sci: Humanities)
| 🌀 **Quantum Mechanics** | `INPUT[text:quantum_mech_114]` |
| 🌀 **Quantum Mechanics** | `INPUT[text:quantum_mech_63]` |
| ⛈️ **Meteorology** | `INPUT[text:meteorology]` | (Sci: Natural Sciences)
| ⛈️ **Meteorology** | `INPUT[text:meteorology]` | (Sci: Natural Sciences)
| 🌱 **Ecology** | `INPUT[text:ecology_63]` | <small>(undefined)</small> |
| 🌍 **Geology** | `INPUT[text:geology_174]` | <small>(undefined)</small> |
| 📜 **History** | `INPUT[text:history_688]` | <small>(Humanities)</small> |
| 📜 **History** | `INPUT[text:history_290]` | <small>(Humanities)</small> |
| 📐 **Mathematics** | `INPUT[text:mathematics_371]` | <small>(Natural Sciences)</small> |
| 📐 **Mathematics** | `INPUT[text:mathematics_314]` | <small>(Natural Sciences)</small> |
| 🎓 **Pedagogy** | `INPUT[text:pedagogy]` | (Sci: Education)
| 🧪 **Chemistry** | `INPUT[text:chemistry]` | (Sci: Natural Sciences)
Sciences)
| 🧪 **Chemistry** | `INPUT[text:chemistry_147]` | (Sci: Natural Sciences)
| 🧪 **Chemistry** | `INPUT[text:chemistry_156]` | (Sci: Natural Sciences)
| 📜 **History** | `INPUT[text:history_978]` | (Sci: Humanities)
| 📜 **History** | `INPUT[text:history_91]` | (Sci: Humanities)
| 🧬 **Biology** | `INPUT[text:biology_664]` | (Sci: Natural Sciences)
> [!info] 🔱 Klicke hier, um eine Disziplin zu loggen:
> `BUTTON[add-disc-pkm]`

| Fach      | Status                                                              |     |
| --------- | ------------------------------------------------------------------- | --- |
| 🧪 Chemie | `INPUT[select(Gelernt, Vertieft, Wiederholt, Offen):chemie_status]` |     |


---
energy: 5
fokus: 5
---
### 🔱 Nexus Dashboard

1. **Energie-Slider:** `INPUT[slider(0, 10):energy]`

2. **Fokus-Slider:** `INPUT[slider(0, 10):fokus]`

3. **Status (Berechnet):** `VIEW[energy + fokus > 15 ? "🚀 High Performance" : "💤 Ausruhen"]`

---
### 📊 Daten-Check
Deine Energie ist aktuell: `VIEW[energy]`
Dein Fokus ist aktuell: `VIEW[fokus]`0   

Nächste Wiederholung: `INPUT[date:next_date]`
**Deine Effizienz-Bilanz:**
`VIEW[fokus * energie]`
### 🧠 Session Status
Fokus: `INPUT[slider(0, 10):fokus]`
Energie: `INPUT[slider(0, 10):energie]`
### 🧠 Session-Analyse
Fokus-Level (0-10): `INPUT[slider(0, 10):fokus_level]`
Schwierigkeit (1-5): `INPUT[slider(1, 5):schwierigkeit]`

**Resümee:** Die Session war bei `VIEW[fokus_level]` Fokus-Punkten.
### 📡 Nexus Live-Log
```dataview
TABLE 
  item.name AS "Disziplin-ID",
  item.value AS "Eintrag"
FROM "0_Calendar/3_Studylog"
WHERE file.name = this.file.name
FLATTEN object(file.frontmatter) AS props
FLATTEN props AS item
WHERE startswith(item.name, "astro_") OR startswith(item.name, "math_") 
// Hier kannst du weitere Präfixe mit "OR startswith" hinzufügen
```

## 🎛️ Nexus Konsole
| 🏛️ **Latin Studies** | `INPUT[text:latin_849]` |
| 🏛️ **Latin Studies** | `INPUT[text:latin_285]` |
| ⚖️ **Ethics** | `INPUT[text:ethics_43]` |
> [!info]- 🔱 Log-Panel (Klicken zum Öffnen)
> `BUTTON[add-disc-pkm]`
```dataview
TABLE WITHOUT ID
  L.key AS "Disziplin",
  L.value AS "Eintrag"
FROM "0_Calendar/3_Studylog"
WHERE file.name = this.file.name
FLATTEN file.inline_fields AS L
WHERE contains(L.key, "astro_") OR contains(L.key, "math_")
```

| Disziplin | Eintrag |
| :--- | :--- |

| Disziplin | Log-Daten |
| :--- | :--- |
## 🎛️ Nexus Konsole
| 🌌 **Astrophysics** | `INPUT[text:astrophysics]` | (Sci: Natural Sciences)
| 🌌 **Astrophysics** | `INPUT[text:astrophysics]` | (Sci: Natural Sciences)
> [!info] Hier klicken zum Loggen
> `BUTTON[add-disc-pkm]`

(Alle deine INPUT-Felder kommen hier in einen eingeklappten Bereich, damit sie beim Tippen nicht stören)
> [!abstract]- Eingabe-Bereich
> (Hier deine INPUT-Felder)
## ♥️ Selfcare/Body
| Discipline                      | Nexus Log                        |
| :------------------------------ | :------------------------------- |
| 🎒 Primary Science              | `INPUT[text:sachunterricht]`     |
| 🌿 Natural History              | `INPUT[text:naturkunde]`ffffdfdf |
| 🧬 Biology                      | `INPUT[text:biology]`dfdsf       |
| 🫫 Microbiology                 | `INPUT[text:microbiology]`       |
| 🧬 Genetics                     | `INPUT[text:genetics]`           |
| 🧪 Chemistry                    | `INPUT[text:chemistry]`          |
| ⚗️ Biochemistry                 | `INPUT[text:biochemistry]`       |
| 🌍 Geology                      | `INPUT[text:geology]`            |
| 🌱 Ecology                      | `INPUT[text:ecology]`            |
| 🔴 1. Muladhara (Root)          | `INPUT[text:chakra_1]`           |
| 🍵 Ayurveda                     | `INPUT[text:ayurveda]`           |
| ☯️ Traditional Chinese Medicine | `INPUT[text:tcm]`                |
| 🏥 Medicine                     | `INPUT[text:medicine]`           |
| 🦴 Anatomy                      | `INPUT[text:anatomy]`            |
| 🍎 Nutrition Science            | `INPUT[text:nutrition]`          |
| 💊 Pharmacy                     | `INPUT[text:pharmacy]`           |
| ⚽ Physical Education            | `INPUT[text:sportunterricht]`    |
| 🏃 Sports Science               | `INPUT[text:sport_science]`      |
| 🔨 Craft & DIY                  | `INPUT[text:handwerk]`           |
| 🍳 Culinary Arts                | `INPUT[text:culinary]`           |
| 🚜 Agriculture & Forestry       | `INPUT[text:agri_forest]`        |
| ⚡ Biohacking                    | `INPUT[text:biohacking]`         |

## 🧡 Relationship
| Discipline | Nexus Log |
| :--- | :--- |
| 🎓 Pedagogy | `INPUT[text:pedagogy]` |
| 🟠 2. Svadhisthana (Sacral) | `INPUT[text:chakra_2]` |
| 🏡 Local Studies | `INPUT[text:heimatkunde]` |
| 🎭 Psychology | `INPUT[text:psychology]` |
| 👥 Sociology | `INPUT[text:sociology]` |
| 🔍 Criminology | `INPUT[text:criminology]` |

## 💛 Mind/Will
| Discipline | Nexus Log |
| :--- | :--- |
| 🧮 Arithmetic | `INPUT[text:rechnen]` |
| 📐 Mathematics | `INPUT[text:mathematics]` |
| 📊 Statistics & Logic | `INPUT[text:statistics]` |
| 🟡 3. Manipura (Solar Plexus) | `INPUT[text:chakra_3]` |
| 💰 Economics | `INPUT[text:economics]` |
| 📈 Business Management | `INPUT[text:management]` |
| 💵 Financial Literacy | `INPUT[text:fin_lit]` |
| 💾 Computer Science | `INPUT[text:informatik]` |
| 🌐 Cyber Security | `INPUT[text:cyber_sec]` |

## 💚 Organize
| Discipline | Nexus Log |
| :--- | :--- |
| 📜 History | `INPUT[text:history]` |
| ⚖️ Ethics | `INPUT[text:ethics]` |
| 🏺 Archaeology | `INPUT[text:archaeology]` |
| 💠 Chakra Studies | `INPUT[text:chakra_gen]` |
| 🟢 4. Anahata (Heart) | `INPUT[text:chakra_4]` |
| 🏛️ Politics | `INPUT[text:politics]` |
| ⚖️ Law | `INPUT[text:law]` |
| 🔱 Productivity | `INPUT[text:productivity]` |

## 💙 Creativity
| Discipline | Nexus Log |
| :--- | :--- |
| ✍️ Literacy (Writing) | `INPUT[text:schreiben]` |
| 🇩🇪 German Studies | `INPUT[text:germanistik]` |
| 🇬🇧 English Studies | `INPUT[text:anglistik]` |
| 🏛️ Latin Studies | `INPUT[text:latin]` |
| 🇫🇷 Romance Studies | `INPUT[text:romanistik]` |
| 🕉️ Sanskrit | `INPUT[text:sanskrit]` |
| 🗣️ Linguistics | `INPUT[text:linguistics]` |
| 🔵 5. Vishuddha (Throat) | `INPUT[text:chakra_5]` |
| 🎨 School Arts | `INPUT[text:kunstunterricht]` |
| 🎨 Art History | `INPUT[text:art_history]` |
| 🎶 Musicology | `INPUT[text:musicology]` |
| 🖌️ Design & UX | `INPUT[text:design]` |
| 📸 Photography | `INPUT[text:photography]` |

## 💜 Activity
| Discipline | Nexus Log |
| :--- | :--- |
| ⚛️ Physics | `INPUT[text:physics]` |
| 🔭 Astronomy | `INPUT[text:astronomy]` |
| 🌌 Astrophysics | `INPUT[text:astrophysics]` |
| ⛈️ Meteorology | `INPUT[text:meteorology]` |
| 🟣 6. Ajna (Third Eye) | `INPUT[text:chakra_6]` |
| 🌌 Astrology | `INPUT[text:astrology]` |
| 🧠 Neuroscience | `INPUT[text:neuroscience]` |
| 🤖 Artificial Intelligence | `INPUT[text:ai]` |
| ⚙️ Engineering | `INPUT[text:engineering]` |
| 🦾 Robotics | `INPUT[text:robotics]` |
| 🏗️ Architecture | `INPUT[text:architecture]` |

## 🩷 Entertainment
| Discipline | Nexus Log |
| :--- | :--- |
| 🌀 Quantum Mechanics | `INPUT[text:quantum_mech]` |
| 🧠 Philosophy | `INPUT[text:philosophy]` |
| 🛐 Theology | `INPUT[text:theology]` |
| 🐉 Mythology | `INPUT[text:mythology]` |
| ⚪ 7. Sahasrara (Crown) | `INPUT[text:chakra_7]` |
| ✨ Hermeticism | `INPUT[text:hermetics]` |
| ⚗️ Alchemy | `INPUT[text:alchemy]` |
| 🔯 Kabbalah | `INPUT[text:kabbalah]` |
| 🧘🏽‍♀️ Yoga Philosophy | `INPUT[text:yoga_phi]` |
| 🕯️ Theosophy | `INPUT[text:theosophy]` |
| 🧘 Meditation | `INPUT[text:meditation]` |
| 🎬 Film Studies | `INPUT[text:film_studies]` |


---
### 🎓 Daily Study Tracker
`BUTTON[add-disc-pkm]`
**Select Discipline:**
`INPUT[inlineListSuggester(optionQuery("5_Notes/4_Atomic/")):study_disc]`

**Add Topics (Matching Order):**
`INPUT[text:study_topics]`

**Add Progress/Values:**
`INPUT[text:study_values]`

## Studylog
### 🏫 Academy Logistics

## 🌍 I. Languages & Linguistics (disc)
* 🇩🇪 German: `INPUT[text:german]` | 🇬🇧 English: `INPUT[text:english]`
* 🇫🇷 French: `INPUT[text:french]` | 🇪🇸 Spanish: `INPUT[text:spanish]`
* 🇮🇹 Italian: `INPUT[text:italian]` | 🏛️ Latin: `INPUT[text:latin]`
* 🕉️ Sanskrit: `INPUT[text:sanskrit]` | 🗣️ Linguistics: `INPUT[text:linguistics]`

## 🧪 II. Natural Sciences (sci)
* ⚛️ Physics: `INPUT[text:physics]` | 🌀 Quantum: `INPUT[text:quantum]`
* 🧪 Chemistry: `INPUT[text:chemistry]` | 🧬 Biology: `INPUT[text:biology]`
* 🧬 Genetics: `INPUT[text:genetics]` | 🫫 MicroBio: `INPUT[text:microbiology]`
* 🌍 Geology: `INPUT[text:geology]` | 🔭 Astronomy: `INPUT[text:astronomy]`

## 💾 III. Informatics & Applied Nexus (sci)
* 💾 CS: `INPUT[text:cs]` | 🤖 AI: `INPUT[text:ai]`
* 🌐 CyberSec: `INPUT[text:cybersec]` | ⚙️ Engineering: `INPUT[text:eng]`
* 🦾 Robotics: `INPUT[text:robotics]` | 🏗️ Architecture: `INPUT[text:arch]`
* 📊 Stats: `INPUT[text:stats]` | 📐 Math: `INPUT[text:math]`

## 💰 IV. Economic & Social Humanities (disc)
* 💰 Economics: `INPUT[text:econ]` | 📈 Management: `INPUT[text:mgmt]`
* ⚖️ Law: `INPUT[text:law]` | 🏛️ Politics: `INPUT[text:politics]`
* 👥 Sociology: `INPUT[text:soc]` | 🎭 Psychology: `INPUT[text:psych]`
* 🎓 Pedagogy: `INPUT[text:pedagogy]` | 📜 History: `INPUT[text:history]`

## 🧠 V. Philosophy & Resonance (disc)
* 🧠 Philosophy: `INPUT[text:phil]` | ⚖️ Ethics: `INPUT[text:ethics]`
* 🛐 Theology: `INPUT[text:theo]` | 🐉 Mythology: `INPUT[text:myth]`
* 🧘 Meditation: `INPUT[text:meditation]` | ✨ Hermeticism: `INPUT[text:hermetics]`
* ⚗️ Alchemy: `INPUT[text:alchemy]` | 🌌 Astrology: `INPUT[text:astro]`

### 💠 Chakra Resonance (disc)
* ❤️ 1. Root: `INPUT[text:chakra_1]` | 🧡 2. Sacral: `INPUT[text:chakra_2]`
* 💛 3. SolarPlexus: `INPUT[text:chakra_3]` | 💚 4. Heart: `INPUT[text:chakra_4]`
* 💙 5. Throat: `INPUT[text:chakra_5]` | 💜 6. ThirdEye: `INPUT[text:chakra_6]`
* 🤍 7. Crown: `INPUT[text:chakra_7]`### 💠 Chakra Resonance (disc)
* ❤️ 1. Root: `INPUT[text:chakra_1]` | 🧡 2. Sacral: `INPUT[text:chakra_2]`
* 💛 3. SolarPlexus: `INPUT[text:chakra_3]` | 💚 4. Heart: `INPUT[text:chakra_4]`
* 💙 5. Throat: `INPUT[text:chakra_5]` | 💜 6. ThirdEye: `INPUT[text:chakra_6]`
* 🩷 7. Crown: `INPUT[text:chakra_7]`

## 🏥 VI. Medicine & Bio-Systemics (sci)
* 🏥 Medicine: `INPUT[text:med]` | 🧠 Neuroscience: `INPUT[text:neuro]`
* 🦴 Anatomy: `INPUT[text:anat]` | 🍎 Nutrition: `INPUT[text:nutri]`
* 💊 Pharmacy: `INPUT[text:pharm]` | 🏃 SportsSci: `INPUT[text:sport]`
* ⚡ Biohacking: `INPUT[text:biohack]`

## 🎨 VII. Expression & Entropy (disc)
* 🎨 ArtHistory: `INPUT[text:art_hist]` | 🎶 Musicology: `INPUT[text:music]`
* 🖌️ Design: `INPUT[text:design]` | 📸 Photo: `INPUT[text:photo]`
* 🔨 Craft: `INPUT[text:craft]` | 🍳 Culinary: `INPUT[text:culi]`
* 🔱 Productivity: `INPUT[text:prod]` | 🚜 Agri/Forest: `INPUT[text:agri]`




## Studyplan
```dataview
TABLE WITHOUT ID
  spacerank as "Rank",
  file.link as "Mission / Topic",
  nextstudy as "Due Stardate"
FROM "4_Tasks"
WHERE contains(archtype, "#4task/tostudy/spaced")
AND nextstudy <= date(today) 
AND status != "archive"
SORT nextstudy ASC
LIMIT 5

```

#### ! Delay
```dataview
TABLE WITHOUT ID
  spacerank as "Rank",
  file.link as "Mission / Topic",
  nextstudy as "Stardate Due"
FROM "4_Tasks"
WHERE contains(archtype, "#4task/tostudy/spaced")
  AND nextstudy != null
  AND nextstudy <= date(today) 
  AND status != "archive"
SORT nextstudy ASC
LIMIT 8

```




## 🌍 I. Linguistics & Philology (The Word)
* 🇩🇪 Germanistik: `INPUT[text:germanistik]`
* 🇬🇧 Anglistik: `INPUT[text:anglistik]`
* 🏛️ Latin: `INPUT[text:latin]`
* 🇫🇷 Romanistik: `INPUT[text:romanistik]`
* 🕉️ Sanskrit: `INPUT[text:sanskrit]`
* 🗣️ General Linguistics: `INPUT[text:linguistics]`

## 🧪 II. Natural Sciences & Bio-Systemics (The Laws)
* ⚛️ Physics: `INPUT[text:physics]`
* 🌀 Quantum Mechanics: `INPUT[text:quantum_mech]`
* 🧪 Chemistry: `INPUT[text:chemistry]`
* 🧬 Biology: `INPUT[text:biology]`
* 🧬 Genetics: `INPUT[text:genetics]`
* 🫫 Microbiology: `INPUT[text:microbiology]`
* 🏥 Medicine: `INPUT[text:medicine]`
* 🧠 Neuroscience: `INPUT[text:neuroscience]`
* 🦴 Anatomy: `INPUT[text:anatomy]`
* 🍎 Nutrition Science: `INPUT[text:nutrition]`
* 💊 Pharmacy: `INPUT[text:pharmacy]`
* ⚡ Biohacking: `INPUT[text:biohacking]`

## 📜 III. Historical & Social Humanities (The Collective)
* 📜 History: `INPUT[text:history]`
* 🏺 Archaeology: `INPUT[text:archaeology]`
* ⚖️ Law: `INPUT[text:law]`
* 🏛️ Politics: `INPUT[text:politics]`
* 👥 Sociology: `INPUT[text:sociology]`
* 💰 Economics: `INPUT[text:economics]`
* 📈 Business Management: `INPUT[text:management]`
* 🎓 Pedagogy: `INPUT[text:pedagogy]`
* 🔍 Criminology: `INPUT[text:criminology]`

## 🧠 IV. Philosophy & Resonance (The Self)
* 🧠 Philosophy: `INPUT[text:philosophy]`
* ⚖️ Ethics: `INPUT[text:ethics]`
* 🛐 Theology: `INPUT[text:theology]`
* 🐉 Mythology: `INPUT[text:mythology]`
* 🎭 Psychology: `INPUT[text:psychology]`
* 🧘 Meditation: `INPUT[text:meditation]`
* 🧘🏽‍♀️ Yoga Philosophy: `INPUT[text:yoga_phi]`
* ✨ Hermeticism: `INPUT[text:hermetics]`
* ⚗️ Alchemy: `INPUT[text:alchemy]`
* 🌌 Astrology: `INPUT[text:astrology]`
* 🔯 Kabbalah: `INPUT[text:kabbalah]`
* 🕯️ Theosophy: `INPUT[text:theosophy]`

### 💠 The Chakra Resonance
* 🔴 1. Muladhara: `INPUT[text:chakra_1]`
* 🟠 2. Svadhisthana: `INPUT[text:chakra_2]`
* 🟡 3. Manipura: `INPUT[text:chakra_3]`
* 🟢 4. Anahata: `INPUT[text:chakra_4]`
* 🔵 5. Vishuddha: `INPUT[text:chakra_5]`
* 🟣 6. Ajna: `INPUT[text:chakra_6]`
* ⚪ 7. Sahasrara: `INPUT[text:chakra_7]`

## 📐 V. Applied & Foundational Nexus (Tools)
* 📐 Mathematics: `INPUT[text:mathematics]`
* 🧮 Arithmetic: `INPUT[text:rechnen]`
* 📊 Statistics & Logic: `INPUT[text:statistics]`
* 💾 Computer Science: `INPUT[text:informatik]`
* 🤖 Artificial Intelligence: `INPUT[text:ai]`
* 🌐 Cyber Security: `INPUT[text:cyber_sec]`
* ⚙️ Engineering: `INPUT[text:engineering]`
* 🦾 Robotics: `INPUT[text:robotics]`
* 🏗️ Architecture: `INPUT[text:architecture]`

## 🎒 VI. Developmental Foundations (Childhood Phase)
* 🎒 Primary Science: `INPUT[text:sachunterricht]`
* 🌿 Natural History: `INPUT[text:naturkunde]`
* ✍️ Writing/Literacy: `INPUT[text:schreiben]`
* 🏡 Local Studies: `INPUT[text:heimatkunde]`
* 🎨 School Arts: `INPUT[text:kunstunterricht]`
* ⚽ Physical Education: `INPUT[text:sportunterricht]`

## 🎨 VII. Expression & Entropy (Creative Output)
* 🎨 Art History: `INPUT[text:art_history]`
* 🎶 Musicology: `INPUT[text:musicology]`
* 🖌️ Design & UX: `INPUT[text:design]`
* 📸 Photography: `INPUT[text:photography]`
* 🎬 Film Studies: `INPUT[text:film_studies]`
* 🔨 Craft & DIY: `INPUT[text:handwerk]`
* 🍳 Culinary Arts: `INPUT[text:culinary]`
* 🚜 Agriculture & Forestry: `INPUT[text:agri_forest]`
* 🔱 Productivity: `INPUT[text:productivity]`



### 🌍 Languages
🇬🇧 **English:** `INPUT[text:english]`
🇩🇪 **German:** `INPUT[text:german]`
🏛️ **Latin:** `INPUT[text:latin]`

### 📐 MINT / STEM
📐 **Math:** `INPUT[text:math]`
⚛️ **Physics:** `INPUT[text:physics]`
🧬 **Biology:** `INPUT[text:biology]`
🧪 **Chemistry:** `INPUT[text:chemistry]`
💻 **Informatik:** `INPUT[text:comsci]`

### 📜 Humanities & Social
📜 **History:** `INPUT[text:history]`
🧘 **Philosophy:** `INPUT[text:philosophy]`
⚖️ **Politics:** `INPUT[text:politics]`
🧠 **Psychology:** `INPUT[text:psychology]`
👥 **Sociology:** `INPUT[text:sociology]`
👩🏽‍⚖️ **Law:** `INPUT[text:law]`
💹 **Economics:** `INPUT[text:economics]`

### 🎨 Arts & Specials
🎨 **Art:** `INPUT[text:art]`
🎶 **Music:** `INPUT[text:music]`
✨ **Spirituality:** `INPUT[text:spirituality]`
🔱 **Productivity:** `INPUT[text:productivity]`

--&--

---
### 🌑 Safe Sync; Knowledge Secured 🌑

The mind is not a vessel to be filled, but a fire to be kindled. 🎻🌊




---
[[n-lit|+ Create Literature Note]] | [[n-perma|+ Distill to Permanent]]

---

---
#### 🔱 Connexio
> [!link]- Nexus
>>[!multi-column]
>>>[!todo] 🛠️ Tasks
>>>##### Adveniens (Inbound)
>>>```dataview
>>>LIST FROM #4task WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>>[!caution] 🚧 Projects
>>>##### Adveniens (Inbound)
>>>```dataview
>>>LIST FROM #3project WHERE contains(this.file.inlinks, file.link) OR parent = this.file.link
>>>```
>>
>>> [!edit] ✏️ Notes
>>>##### Nexus (Linked)
>>>```dataview
>>>LIST FROM #5note WHERE contains(this.file.inlinks, file.link) OR contains(this.file.outlinks, file.link)
>>>```
>
>> [!bookmark]- 🔖 Fontes (Sources)
>> ```dataview
>> TABLE without ID
>> ("![|60](" + Cover + ")") as Cover, file.link as Title, Author as Author, Rating as Rating
>> FROM #6resou AND (outgoing([[#]]) OR [[#]])
>> ```
>
>>[!multi-column]
>>> [!layers]- 💠 Area Supra
>>>```dataview
>>>LIST FROM #2area WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>>
>>> [!star]- ✨ Stella Supra
>>>```dataview
>>>LIST FROM #1stars WHERE contains(this.file.outlinks, file.link) OR parent = file.link
>>>```
>
>> [!info]- 🔙 Backlinks & Hub
>> ```dataview
>> LIST FROM [[#]]
>> ```

---

```meta-bind-button
label: "Archivieren"
icon: "archive"
style: primary
actions:
  - type: runTemplaterFile
    # Nutze den kompletten Pfad ohne führenden Slash
    templateFile: "zData/1temp/archiveall.md" 

```




`BUTTON[freezer]`
