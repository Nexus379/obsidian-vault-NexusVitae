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

## 🧭 Prioritäts-Reihenfolge (vom User): dailyplm → dailyppm → dailypkm (srs lebt in pkm). Erst die 3 Tagesblätter fertig.

**Plan-Verbindungen (Bauplan):**
- Jeder Plan/Aktivität hat in dailyplm einen LINK + einen CHECK (Toggle/Minuten "gemacht?") → füttert die BALKEN (L-E-B-E-N, Chakra).
- inpra ≈ funktioniert wie fitness (Regionen/Tabelle/Engine) → beim Bauen an fitness anlehnen.
- timetable funktioniert + ist mit routine verlinkt (sync-timetable). Selektiv.
- wardrobe → Shopping-Hub → Grocery-List (wenn Kleidung fehlt). Snapshot interessant für "Plan für andere Person".
- shopping + srs = GENERIERT (nicht Master→Snapshot): shopping aus Meal-Plan, srs aus Wiederhol-Algo. srs kommt mit dailypkm.
- Snapshot-Rollout DONE: routine/fitness/meal. Rest (timetable/wardrobe) nur bei Bedarf; music/inpra-Doppelung klären.

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
  - [x] **Inpra-Modul gebaut** (nach Fitness-Muster, aber schlanker — kein Auto-Generator, man folgt einem Buch):
        - inpraEngine.js: 4 Qualitäts-Dimensionen (Haltung/Rhythmus/Melodie/Gefühl) + Mastery-Skala 1-5 + getPractice + readyToAdvance + avgQuality. Node-getestet.
        - generateInpraLog.js + generate-inpra-log.md: Tages-Übungs-Log mit Bewertungs-Tabelle → 0_Calendar/4_Projectlogs/Routine/YYYY/MM/Inpra_DATE.md. Button registriert (metabind) + auf weekplan_inpra gesetzt.
        - Existierende weekplan_inpra (instr_active/instr_book, inpra_<day>_ex_1..3 + _lvl_1..3, Mastery-Skala) bleibt der Plan.
        - OFFEN: dailyplm-Inpra-Sync um Log-Link erweitern; ggf. Snapshot (Master Instrument_Mastery ist noch leer).
  - [x] Generierte Logs → einheitlicher Pfad `0_Calendar/4_Projectlogs/Routine/YYYY/MM/`: Workout_DATE, Grocerie_DATE, Inpra_DATE. (Workout+Grocery+Inpra umgestellt, Overload-Read mit.)
  - [x] Fitness act_-Lücke: dailyplm "trainiert?" liest jetzt das Workout-LOG (ausgefüllte Set-Zelle) statt leerer act_-Felder. Node-getestet (leer→false, gefüllt→true).
  - [x] **Meal** gebaut: `snapshot-week-meal.md` + `_snapshot_shape_meal.md`. Copy-Regel alle `${day}_*` (Slots+add/rem); Nährwerte rechnet Diagnostics-Block neu. Shape getestet. (µg→mcg im Molecular-Profile-Label mitgefixt.)
  - [x] Alle 3 Snapshot-Buttons in metabind data.json registriert (buttonTemplates, +.bak-Sicherung) + `BUTTON[snapshot-week-*]` auf die Master (Routine/Fitness/Meal) gesetzt. In Obsidian testen (Reload nötig).
  - [x] Live-Test-Fixes (Routine): (1) Snapshot-Shape nutzte einfache getD → reiche getD vom Master übernommen (Chakra-Farben/Glow/Courier-Labels/AM-PM-Links). (2) Default springt jetzt auf erste FREIE Woche (überspringt geplante) — alle 3 Buttons. (3) Uhrzeiten+Tage in Courier (Master + Snapshot identisch).
  - [x] Fuzzy-Suche für Routinen — GEBAUT + GETESTET: add-routine-slot hat Such-Schritt (nutzt searchRoutines über
        key+label+aliases; Enter=alle). 38 Routinen mit deutschen Aliasen erweitert (.bak). In Node getestet:
        zähneputzen→Hygiene, ausmisten→Deep Clean, joggen→Cardio, gassi→Pet Care etc. Live-Test in Obsidian offen.
  - [x] Fuzzy zweisprachig: +englische Aliase (34 Routinen). teeth+zähneputzen→Hygiene, coding+programmieren→Deep Work.
  - [x] add-routine-slot: getipptes Suchwort wird als Default im Detail-/Custom-Prompt vorgeschlagen (→ bold Detail).
  - FEATURE Chakra-Zeit (Balance Plan vs Ist):
    - [x] routineEngine.getChakraMinutes(page, day) — geplante Min/Chakra aus Timeblock. Node-getestet.
    - [x] Ist-Logik: auto (mobility_am/pm+activity→Solar Plexus, inpra_min→Sacral) + manuell (ct_root..ct_crown überschreibt). Node-getestet.
    - [x] dailyplm: 7 ct_-Felder im Frontmatter + Anzeige-Block (2 Leisten Plan/Ist pro Chakra + Σ) + INPUT-Zeile. LIVE-Ort.
    - [x] revW read-only Wochen-Rollup gebaut (PLM-Sektion): Plan = 7× getChakraMinutes, Ist = Σ über dailyplm-Notizen (ct_/auto). Reviews nur lesen, wie vom User korrigiert.
    - [ ] Live-Test in Obsidian (dailyplm-Block + revW-Rollup). revD optional (revW deckt Wochen-Sicht).
- [ ] HIGH-END später (atlas/dashboard): Gesamtansicht Monat×Tag, Slots editierbar/dynamisch.
- [x] **dailyplm Konsistenz-Sweep**: 0 stale Keys, alle INPUT-Felder kanonisch+definiert, Lesezugriffe kanonisch,
      Balken-Fütterung korrekt. Gefixt: shopping_extras ins Frontmatter; Shopping-Hub-Links (dailyplm + generateShoppingList)
      auf `2_Areas/4_Organize/Plan/Shopping_Hub` (waren tot: Household/ bzw. 4_Organize/).
- ⬜ Energy-Slider · Mantra · restliche ~15 Buttons · VitaminTracker (Feinschliff, sekundär).

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

### ⚙️ Nötige Plugin-Settings (für README/Setup — sonst rendert's bei anderen kaputt)
- [x] **banners-reloaded**: „Show banners in embeds" → **AUS**. Sonst rendert das banner_icon+Dateiname in jede
      dataviewjs-Tabellen-Zelle (Zellen zählen als Embeds) → „🍱 Meal_Plan" überall. Muss in die README.
- [ ] weitere Plugin-Settings sammeln, während wir testen (supercharged-links, meta-bind, dataview, callouts…).
