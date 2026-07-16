---
frozen: true
type: roadmap
---
# 🗺️ Nexus Vitae — Roadmap (Vault-Logik → Plugin → Release)

> Ziel: Vault-Logik sauber ausbauen → ins Plugin spiegeln → als Community-Plugin veröffentlichen.
> Methode: EIN Faden ganz zu Ende, verifizieren statt raten, Kanon-Docs pflegen.
> Kanon: [[TAXONOMY_CANON]] · [[ITEM_SCHEMA]]
> Legende: ✅ fertig · 🔨 in Arbeit · ⬜ offen · 🐛 Bug

---

## ✅ Fertig
- Router (routertemp) + calendarprompt — vom User als „perfekt" gesetzt, nicht anfassen.
- Calendar-Taxonomie (7 Module, review=6review, plan=7plan, rev_module, inpra≠music).
- Meal-Plan-Subsystem gemappt; Duplikat 4_Organize/Plan/Meal_Plan.md gelöscht.
- Item-Datenschicht KOMPLETT designt (ITEM_SCHEMA.md): Schema, Vendor, Öko, Materialisieren/Sync.
- Meal-Buttons gegen Absicht verifiziert (add-remove-meal / add-remove-alchemy / sync-fridge = wie gedacht).

## 🔨 Aktueller Bereich: dailyplm von oben nach unten
### Meal / Nutrition
- ✅ Buttons-Logik stimmt mit Absicht überein.
- [x] 🐛 sync-fridge-meals liest nur Master-Meal_Plan, nicht Wochenplan (7_Plan). dailyplm prüft Wochenplan zuerst → inkonsistent. — **GEFIXT:** liest jetzt Wochenplan zuerst.
- [x] 🐛 sync-fridge-meals nutzt heutiges echtes Datum statt Notiz-Datum. — **GEFIXT:** nutzt Notiz-Datum (cal_date/Dateiname).
- [x] 🐛 add-remove-alchemy schreibt auf getActiveFile() → falsches File möglich; absichern. — **GEFIXT:** tp.config.active_file (auch edit-meal + resetNutrition gehärtet).
- [x] 🐛 Nährwert-Keys an 4 Stellen verschieden benannt → stille 0-Werte (Eisen/Magnesium/Omega3). — **GEFIXT:** JSON-Migration + itemsNexusEngine liest jetzt JSON mit voller val (Whitelist raus). In Node getestet: Eisen/Magnesium/Kcal kommen an. Rest: omega3 (Key omega3_total_mg→omega3_mg in dailyplm-Gaps + Daten sparse).
- [ ] Extra-Käufe erfassen (z.B. extra Gurke) + Verderb-Warnung ("könnte bald schlecht werden").
- [ ] Kleinigkeit: BOM in resetNutrition.md (+ evtl. andere) entfernen (systemunabhängig).

### Shopping (hängt an Meal + Routine)
- ⬜ Shopping-Liste wird in 0_Calendar/Plan generiert (generateShoppingList.js) — Reste-Logik (portions_stored/prep_shelf_life) da.
- ⬜ dailyplm passt Einkaufsliste an je nach WANN Shopping im Routine-Timeblock geplant ist.
- ⬜ Spontane Adds ("brauch noch Alufolie") → in Shopping-Liste.
- ⬜ Fridge-Inventar: "was ist im Kühlschrank" immer aktuell.

### Fitness (eigene Engine; Ziel: fit wie Bruce Lee, im Flow)
- ⬜ Vorplanbare Fitness (weekplan_fitness).
- ⬜ Workout-Ersteller → landet unter 0_Calendar/Plan. Logik: Woche 1, keine Ausstattung → nur Körperübungen → generate workout (Bruce-Lee-Philosophie: "10000 Wiederholungen statt 10000 verschiedene Kicks").
- ⬜ Bei viel Sport: Essen anpassen / Hinweis.

### E — Entropy
- ⬜ Zeigt die im Routine-Timeblock NICHT geblockte Zeit (Freizeit). Template weekplan_routine für planbare Wochen.

### Metadaten-Umbenennung (LOGISCH, vom User bestätigt)
- [x] fitness_am / fitness_pm dienen zum STRETCHEN/Mobility → **GEFIXT:** umbenannt zu mobility_am / mobility_pm
      in 15 Dateien (66 Vorkommen), 0 echte Tages-Notizen betroffen. Bindestrich-Varianten (fitness-am) gleich mit auf Unterstrich.
- [x] Calendarbase Bindestrich-Bug: selfcare-am/pm + journal-am/pm → Unterstrich. — **GEFIXT** (Spalten füllen sich jetzt).
- [ ] Calendarbase `Fitnessum`-Formel nutzt Dataview `$=` in Bases-Formel → tot. Neu schreiben (Bases-Syntax) oder entfernen.

### Noch offen in dailyplm
- [x] L-E-B-E-N-Rechner: P3-Keys auf mobility_am/pm umgestellt (Rename); P2 journal/selfcare_am korrekt (Unterstrich).
- [x] 🐛 L-E-B-E-N "Music Bonus" sucht `_music`-Plan + `mus_${day}_min` → existiert nicht (Kanon = inpra). Bonus feuerte nie. — **GEFIXT:** liest jetzt `inpra_min` aus der Tagesnotiz, toter `_music`-Lookup entfernt.
- [x] Routine-Sync: Entropy „Free Blocks"-Block las nur Master → jetzt Wochenplan zuerst + Fallback auf Hauptroutine (wie 5.5 & Grocery-Sync). Alle 3 Routine-Blöcke konsistent.
- [x] Snapshot-Prinzip geklärt (= Archive-Button, aber vorwärts + editierbar). Master=Standard bleibt, Wochen=Overrides, kein destruktiver Reset nötig.
- [x] Snapshot-Button (Routine) gebaut: `3snippets/snapshot-week-routine.md` + Form `1tmpl/0calendar/_snapshot_shape_routine.md`. Kopiert Master-rt_* in editierbare `7_Plan`-Wochendatei, Kollisionsschutz. Shape-Mechanik in Node getestet.
- [ ] Button noch als `BUTTON[snapshot-week-routine]` registrieren + auf Master-Routine platzieren (wie setup-routine etc.). In Obsidian testen.
- Snapshot-Pattern ausrollen:
  - [x] **Fitness** gebaut: `snapshot-week-fitness.md` + `_snapshot_shape_fitness.md`. Kopiert `fit_*`, `training_week` wird AUTO-erkannt (letzte _fitness-Woche +1, nicht kopiert). Shape getestet.
  - [ ] **Inpra:** noch NICHT fertig (jüngstes Modul, kein Master, keine Engine). Snapshot verfrüht.
        → Eigener Bau-Faden: Modul erst fertigstellen. Datenmodell einer Session:
        instrument (instr_active) · Quelle (Übung X aus Übungsbuch / Stück) · Part (1/2/…) ·
        Minuten · Wie-lief-es (Rating, vgl. inpra_*_lvl) · Notiz "nächstes Mal …".
        Dazu kleine `inpraEngine` (analog routineEngine/fitnessEngine) — FEHLT. Danach erst Snapshot.
  - [x] **Meal** gebaut: `snapshot-week-meal.md` + `_snapshot_shape_meal.md`. Copy-Regel alle `${day}_*` (Slots+add/rem); Nährwerte rechnet Diagnostics-Block neu. Shape getestet. (µg→mcg im Molecular-Profile-Label mitgefixt.)
  - [x] Alle 3 Snapshot-Buttons in metabind data.json registriert (buttonTemplates, +.bak-Sicherung) + `BUTTON[snapshot-week-*]` auf die Master (Routine/Fitness/Meal) gesetzt. In Obsidian testen (Reload nötig).
  - [x] Live-Test-Fixes (Routine): (1) Snapshot-Shape nutzte einfache getD → reiche getD vom Master übernommen (Chakra-Farben/Glow/Courier-Labels/AM-PM-Links). (2) Default springt jetzt auf erste FREIE Woche (überspringt geplante) — alle 3 Buttons. (3) Uhrzeiten+Tage in Courier (Master + Snapshot identisch).
  - [x] Fuzzy-Suche für Routinen — GEBAUT + GETESTET: add-routine-slot hat Such-Schritt (nutzt searchRoutines über
        key+label+aliases; Enter=alle). 38 Routinen mit deutschen Aliasen erweitert (.bak). In Node getestet:
        zähneputzen→Hygiene, ausmisten→Deep Clean, joggen→Cardio, gassi→Pet Care etc. Live-Test in Obsidian offen.
  - [x] Fuzzy zweisprachig: +englische Aliase (34 Routinen). teeth+zähneputzen→Hygiene, coding+programmieren→Deep Work.
  - [x] add-routine-slot: getipptes Suchwort wird als Default im Detail-/Custom-Prompt vorgeschlagen (→ bold Detail).
  - [ ] FEATURE Chakra-Zeit: aus Routine-Timeblock Minuten pro Chakra (Block×Dauer, group=Chakra) → dailyplm/revD → revW-Rollup. Design offen (geplant vs geloggt).
- [ ] HIGH-END später (atlas/dashboard): Gesamtansicht Monat×Tag, Slots editierbar/dynamisch.
- ⬜ Energy-Slider · Mantra · restliche ~15 Buttons · VitaminTracker.

## ⬜ Kalender: weitere Module
- dailyppm (Log) · dailypkm (Studylog + disciplineEngine + Spaced Rep)
- Reviews (revD/W/M/Q/H/Y × Module) · Wochenpläne · projectlog · protocol

## 🔨 Item-Schicht BAUEN
- [x] 6items normalisiert migriert nach zData/6items/ (fresh 376 / pantry 407 / consumables 476 = 1259 Items).
  Safe transforms: kcal→energy{kcal,kj}, carbs_g→carbs_total_g, sugar_total_g→sugar_g, sfa_g→fat_sat_g,
  µg→mcg, +iron_total_mg, +vit_a_total_mcg(RAE), BOM entfernt. Verifiziert: kein Datenverlust, Fremdschriften erhalten.
- [ ] Anreicherung: aliases[] (Romanisierung), eco{} (LCA/Open Food Facts) — spätere Pässe.
- [ ] Klein-Checks: lycopene mg↔mcg (6 Items), iron_mg bare (3), Kategorie-Namen (YOGURT/CHEESE/mammut_nutrition_power_matrix).
- [x] itemsNexusEngine: liest jetzt die 3 JSONs (FOOD) + volle val; MAINTENANCE weiter aus MD. calculate() rechnet energy+val. In Node getestet (1248 Items).
- [x] dailyplm-Gaps: omega3_total_mg→omega3_mg angeglichen. Alle Gaps-Keys (protein/vit_c/fiber/magnesium/iron_total/zinc/omega3) jetzt kanonisch. (Live-Check in Obsidian noch offen.)
- [ ] Nebencheck: 11 von 1259 Items ohne val{} (nicht geladen) — vermutlich unvollständige Einträge, später prüfen.
- [ ] Rezept-Nährwerte an Kanon (nur `recipe_*`, NICHT `qty_*` = Shopping-Variable). Rezept-Engine (sourcerecipe)
      liest schon JSON via itemsNexusEngine + zieht Keys dynamisch → Zutaten-Migration fließt durch. Offene Helfer:
      (a) [x] `getTotalIron` `iron_animal_mg`→`iron_heme_mg` — GEFIXT (Häm-Eisen zählt jetzt).
      (b) [x] `getTotalVitA` → RAE. GEFIXT: Vit-A-Daten normalisiert (vit_a_mcg[52]+vit_a_rae_mcg[2]→vit_a_total_mcg;
          beta_carotene_mcg[5]→vit_a_beta_carotin_mcg; 4× RAE berechnet; 0 Alt-Varianten, 0 Items ohne total; .bak2).
          Erkenntnis: vit_a_mcg WAR bereits µg RAE (Werte matchen USDA). Helfer liest jetzt vit_a_total_mcg. In Node getestet.
      (c) [x] Meal-Diagnostics metrics + Rezept baseMetrics auf Kanon (iron_heme_mg, iron_total_mg, vit_a_total_mcg,
          vit_d_mcg; vit_a_total/vit_d_iu/iron_animal_mg/vit_a_mcg raus). Synergy-Rule + Anzeige-Label mit. In beiden Meal-Dateien.
      (d) [x] Doppelung entzerrt: Helfer speichert jetzt recipe_iron_total_mg / recipe_vit_a_total_mcg (Kanon-Namen). Verifiziert: 0 alte Keys in der Kette.
- [ ] Datenfluss verstanden: Rezept → qty_* (Menge→Shopping) + recipe_* (Nährwerte→Meal-Diagnostics→dailyplm)
      + portions/prep_* (Reste→Shopping). Zwei Variablen-Familien pro Rezept.
- [ ] vendors.json-Registry (6 Strategien: cheap/value/pure/pure_cheap/market/best).
- [ ] Materialisieren-Button + Sync-Button (Frontmatter aus JSON, Körper unberührt).

## ⬜ Die 6 anderen Domänen (Taxonomie + Bases)
- 1_Stars · 2_Areas (+Pläne) · 3_Projects · 4_Tasks · 5_Notes · 6_Resources
- Geteilte Wertelisten EINMAL festziehen: status, persona, disc, sci, genre, mealtime/mealtype.

## 🐛 Querschnitt-Bugs (geparkt)
- dataviewjs Anzeige-Cross-Talk zwischen zwei Plan-Panes bei globalem Refresh (transient, heilt bei Reload).
- [x] Bases Bindestrich vs Unterstrich in Calendarbase (fitness/selfcare/journal-am/pm) — GEFIXT (→ Unterstrich).
- [ ] Tasksbase: tote Felder (recdays/progress/done/do/cost/…), Status-Case (status vs Status), "archive" vs "archived", canceled gibt "bin" statt Emoji.
- 4_Tasks Ordner-Dublette "0 Reccurring" / "0 Recurring"; Dashboard-Dubletten.

## 🚀 Danach
- Vault-Logik → Plugin spiegeln (TS). Dann: manifest, main.js frisch bauen, README, Community-Store-Anforderungen.
