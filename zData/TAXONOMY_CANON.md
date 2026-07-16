---
frozen: true
type: canon
status: work-in-progress
---
# 🧭 Nexus Vitae — Taxonomie-Kanon (Single Source of Truth)

> Diese Datei ist die **eine wahre Quelle** für Tags, Frontmatter-Keys und Namen.
> Vault (Templater) UND Plugin werden hiergegen geprüft. Bei Widerspruch gewinnt DIESE Datei.
>
> Aufbau in 3 Ebenen: **0 Domäne (arch)** → **1 Spezialist** → **2 archtype**.
> Legende: ✅ kanonisch · 🔀 nur Eingabe-Alias (kein Tag) · ⚠️ offen/zu entscheiden

---

## 📐 Grundregeln

1. **Tag = Singular, Ordner = Plural.** `#2area` ↔ `2_Areas`, `#6resource/serie` ↔ `6_Resources/Series`.
2. **Frontmatter-Keys mit Unterstrich, nie Bindestrich.** `mobility_am`, nicht `mobility-am`.
   (Bindestrich-Keys in Bases sind Bugs — siehe Reparaturliste.)
3. **Aliase leben nur im Router-`promptMap`**, nie in `arch`/`archtype`. Ein Alias erzeugt nie einen Tag.
4. **Status-Wort ausgeschrieben:** `archived`, nicht `archive`. `recurring`, nicht `reccurring`.

---

## Ebene 0 — Die 7 Domänen  ✅ konsistent

| # | Tag (`arch`) | Ordner        | Trigger        |
|---|--------------|---------------|----------------|
| 0 | `#0cal`      | `0_Calendar`  | `c`, `cal`     |
| 1 | `#1stars`    | `1_Stars`     | `s`, `stars`   |
| 2 | `#2area`     | `2_Areas`     | `a`, `areas`   |
| 3 | `#3project`  | `3_Projects`  | `p`, `projects`|
| 4 | `#4task`     | `4_Tasks`     | `t`, `tasks`   |
| 5 | `#5note`     | `5_Notes`     | `n`, `notes`   |
| 6 | `#6resource` | `6_Resources` | `r`, `resources`|

---

## Ebene 1+2 — Archtypes je Domäne
<!-- Wird Schritt für Schritt gefüllt, während wir den Router durchgehen. -->

### 0 Calendar  ✅ durchgegangen

Die 7 Module (Reihenfolge = Ordner-Nummerierung):

| id     | Label      | Ordner          | Template   | archtype-Tag        |
|--------|------------|-----------------|------------|---------------------|
| plm    | Journal    | `1_PLM`         | dailyplm   | `#0cal/1plm`        |
| ppm    | Log        | `2_PPM`         | dailyppm   | `#0cal/2ppm`        |
| pkm    | Studylog   | `3_PKM`         | dailypkm   | `#0cal/3pkm`        |
| proj   | Projectlog | `4_Projectlogs` | projectlog | `#0cal/4projectlog` |
| prot   | Protocol   | `5_Protocols`   | protocol   | `#0cal/5protocol`   |
| rev    | Review     | `6_Reviews`     | rev        | `#0cal/6review`     |
| plan   | Plan       | `7_Plan`        | weekplan   | `#0cal/7plan`       |

**Entscheidung A — Review-Präfix:** `#0cal/6review` (NICHT `1review`). Passt zu Ordner `6_Reviews`.

**Entscheidung B — Plan-Tag NEU:** `#0cal/7plan` wird aufgenommen (fehlte bisher komplett).

**Entscheidung C — Review = 2 Achsen, aber nur PHASE im Tag:**
Phase-Subtags (inkl. Daily, das behalten wird):
- `#0cal/6review/daily`
- `#0cal/6review/weekly`
- `#0cal/6review/monthly`
- `#0cal/6review/quarterly`
- `#0cal/6review/halfyear`
- `#0cal/6review/yearly`

Die zweite Achse (welches Modul wird reviewt: master/plm/ppm/pkm/proj) lebt NICHT im Tag,
sondern in einem Frontmatter-Feld → **`rev_module`** (Werte: master, plm, ppm, pkm, proj).

**Entscheidung D — Plan-Untertypen** (`#0cal/7plan/…`):
`fitness`, `inpra` (Instrument-Üben), `routine` (Timeblocking), `meal`, `shopping`, `srs`, `wardrobe`.
Merke: `inpra` = Instrument-Übungsplan. `music` gehört NICHT hierher, sondern zu Resources (`#6resource/music`).

### 1 Stars

### 2 Areas

### 3 Projects

### 4 Tasks

### 5 Notes

### 6 Resources

---

## 🏷️ Property-Wertelisten (nicht-arch)
<!-- status, persona, disc, sci, genre, mealtime, mealtype, difficulty … -->

---

## 🔧 Reparaturliste (Vault & Plugin gegen diesen Kanon)

### Aus dem Calendar-Weg:
- [ ] Taxonomie-Frontmatter: `1review` → `6review` (+ alle Sub-Tags), Daily ergänzen.
- [ ] Taxonomie: `#0cal/7plan` + Plan-Untertypen neu aufnehmen.
- [ ] Neues Frontmatter-Feld `rev_module` (master/plm/ppm/pkm/proj) in rev-Templates.
- [ ] Router `0calendarprompt.md` Z.268: Plan-Key `music` → `inpra`; `planMap` Z.274 Key `inpra`→`weekplan_inpra` ergänzen (aktuell nur `music`, läuft für `inpra` ins Leere).
- [ ] Prüfen ob Template `weekplan.md` (Fallback) existiert — sonst Fallback absichern.
