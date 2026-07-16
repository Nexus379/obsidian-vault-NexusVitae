---
frozen: true
type: canon
status: work-in-progress
---
# 🧬 Nexus Item-Schema (Single Source of Truth für 6items)

> Grundlage: die echten JSONs aus `Copy(2)/zData/6items`, Kollisionen aufgelöst.
> Prinzipien: **logisch statt kreativ · systemunabhängig (nur ASCII, `mcg` nie `µg`, kein BOM) · effizient · sprachunabhängig · syncbar.**

---

## 🔄 Workflow: JSON-Quelle + Materialisierung auf Abruf

Kernmuster, das JSON-Effizienz UND Notiz-Natur vereint:

1. **JSON (6items) = Quelle der Wahrheit.** Alle Items, immer aktuell, effizient, AI-pflegbar.
2. **Materialisieren-Button:** Item bei Bedarf aus JSON wählen (z.B. erdbeere) → erzeugt MD-Datei
   über `sourceentities_*`-Template, Frontmatter aus JSON gefüllt. Nur was gebraucht wird.
3. **Sync-Button:** bei JSON-Änderung (Inflation→Preise, Vendor zieht um) materialisierte Dateien
   nachziehen.

**Zwei Robustheits-Regeln:**
- **A) Herkunft merken:** jede materialisierte Datei trägt `source_id` + `source_file`, damit
  Sync weiß, welchen JSON-Eintrag er nachzieht.
- **B) GOLDENE REGEL — Sync fasst nie den Text an:** Frontmatter (Preise/eco/val) wird aus JSON
  überschrieben; der Notiz-KÖRPER (Vergleiche, eigene Notizen, „tv 27 zoll"-Tabelle) bleibt IMMER
  unberührt. Daten fließen nach, Denken bleibt heilig.

Lebt im Plugin: **Item & AI Settings** (AI-Sync ist dort schon angelegt).
`sourceentities_*`-Templates = die Form, in die die JSON-Daten fließen (nicht verschwendet).

Konzept-Trennung: **Wissen = Zettelkasten (Bücher/Papers, verlinkte Ideen) · Dinge = Datenbank
(Entities als Base-Einträge + on-demand-Notiz).** Zutaten bleiben rein JSON (gerechnet).

---

## 📁 Datei-Aufteilung (bleibt, ist logisch)

Aufteilung nach **Haltbarkeit / Kaufverhalten** (deckt sich mit `prep_shelf_life`):

| Datei | Inhalt |
|---|---|
| `6items/ingre_fresh.json` | Verderblich: Grünzeug, Gemüse, Obst, Fleisch, Fisch, Milch/Ei |
| `6items/ingre_pantry.json` | Trocken/lange haltbar: Hülsenfrüchte, Getreide, Nüsse, Gewürze, Öle |
| `6items/ingre_consumables.json` | Verarbeitet/TK/Snacks: Getränke, Süßes, Chips, Tiefkühl |
| `6items/item_household.json` … | Non-Food (Haushalt, Tech, Pflege, Freizeit) |

**Aufbau je Datei:** `{ kategorie: { item_key: {…} } }`
Kategorie-Namen = **logisch snake_case** (kein `the_pizza_empire_archives`, kein ALL-CAPS, kein `_2`).

---

## 🧩 Aufbau eines Item-Eintrags (Basis + 4 logische Säulen)

Zwei Zwecke: **mirdienlich** (Gesundheit) + **weltdienlich** (Ökologie).

```
BASIS:   label · icon · latin · sci[] · unit_type ("100g") · meta{}
── mirdienlich ──
SÄULE 1: energy{} + val{}      → wird VERRECHNET (Nährwerte)
SÄULE 2: lang{} + aliases[]    → Fuzzy-/Alias-Suche (romanisiert!)
SÄULE 3: interactions{}        → berechenbare Regeln (statt Fließtext)
── weltdienlich ──
SÄULE 4: eco{}                 → Öko-Fußabdruck (LCA), wird ebenfalls VERRECHNET
── beschaffung ──
VENDOR:  prices{} + pref_vendor → Preis-Wahrheit (Läden getaggt in vendor-registry)
```

### Säule 1 — Nährwerte

**Energie:** immer beide → `energy: { kcal, kj }`  (`kj = round(kcal * 4.184)`)

**`val` CORE (~25, nur logisch, Einheit IMMER am Ende):**
```
Makros(g):   water_g protein_g fat_total_g fat_sat_g carbs_total_g sugar_g fiber_g
Mineralien:  sodium_mg calcium_mg magnesium_mg potassium_mg phosphorus_mg
             zinc_mg copper_mg manganese_mg  iodine_mcg selenium_mcg
Eisen:       iron_plant_mg  iron_heme_mg  → iron_total_mg (Summe)
Vitamine:    vit_c_mg vit_e_mg vit_k_mcg vit_d_mcg
             vit_b1_mg vit_b2_mg vit_b3_mg vit_b6_mg vit_b12_mcg vit_b9_mcg
Vit A:       vit_a_retinol_mcg  vit_a_beta_carotin_mcg  → vit_a_total_mcg (RAE)
```

**Wissenschaftliche Äquivalente (nicht naiv summieren!):**
- `vit_a_total_mcg` (RAE) = `retinol + beta_carotin/12`
- `vit_b9_mcg` als DFE, `vit_b3_mg` als NE (Niacin-Äquivalent)
- `iron_total_mg` = simple Summe; Bioverfügbarkeit über plant/heme-Split (Häm ~25%, Nicht-Häm ~5–10%)

**`bioactive{}` (optional, nur ernährungsrelevant):**
`lutein_mg lycopene_mg beta_glucan_g allicin_mg …` — kuratiert, kein Exoten-Schwanz.
Einheiten konsistent (Kollision `lycopene_mg` vs `lycopene_mcg` → immer `mg`).

### Säule 2 — Suche

- `lang{}`: Nativ-Schrift (de/en/es/fr/ru/ja/zh/fa/hi/ar…) — zum Anzeigen.
- `aliases[]`: **romanisierte** Formen ALLER Sprachen, damit Latein-Buchstaben-Eingabe
  auch `Шпинат`→"shpinat", `ほうれん草`→"hourensou" findet. DAS macht die Fuzzy-Suche.

### Säule 3 — Interaktionen (berechenbar)

Statt Fließtext `anti_nutrients: "High in oxalates"`:
```
interactions: { contains: ["oxalates"] }
```
+ zentrale Regel-Tabelle (einmal, in eigener Datei):
```
oxalates → inhibits_absorption: [calcium, iron_plant]   // "Spinat + Kalzium = weniger Aufnahme"
```
→ Engine kann selbst warnen. Erweiterbar pro Zutat.

### Säule 4 — Öko / weltdienlich (LCA, berechenbar)

Wissenschaftlicher Standard = **Life-Cycle Assessment** (Poore & Nemecek / Open Food Facts Eco-Score).
Basis: **pro kg** Lebensmittel (Fußabdrücke sind konventionell pro kg; Nährwerte pro 100 g).
```
eco: {
  co2_kg:   0.7,     // kg CO2-Äquivalent pro kg (Treibhausgase)
  water_l:  290,     // Liter Wasser pro kg
  land_m2:  0.4,     // m² Landverbrauch pro kg
  origin:   "regional"   // regional | eu | import  → Foodmiles
}
```
→ Engine summiert den Öko-Fußabdruck einer Mahlzeit (wie Protein) und kann
„bevorzuge saisonal/regional" entscheiden. `season[]` + `vegan` (in meta) ergänzen das.
Werte kommen bei der Migration aus der LCA-Quelle; Zahlen hier sind Platzhalter.

---

## 🏪 Vendor-Modell (Weg 1: Läden einmal taggen)

**Pro Item** bleibt die Preis-Wahrheit:
```
prices: { dm: 1.80, rewe: 2.00, denns: 2.40 }
pref_vendor: "dm"
```

**Zentrale Vendor-Registry** (einmal, `6items/vendors.json`) taggt jeden Laden:
```
dm:            { tiers: [pure_cheap] }
lidl / aldi:   { tiers: [cheap] }
kaufland:      { tiers: [cheap, value] }
rewe / edeka:  { tiers: [value] }
denns:         { tiers: [pure, best] }
alnatura:      { tiers: [pure] }
reformhaus:    { tiers: [pure, best] }
weekly_market: { tiers: [market] }
butcher / gourmet_market: { tiers: [best] }
```

**Die 6 Strategien** (abgeleitet, Vendor-Name kommt automatisch aus prices+tag):
| Strategie | Bedeutung | Ableitung |
|---|---|---|
| `cheap` | das günstigste | min(prices) über alle |
| `value` | Preis-Leistung | min(prices) unter `value`-Läden |
| `pure` | das bio | min(prices) unter `pure`-Läden |
| `pure_cheap` | bio + günstig | min(prices) unter `pure_cheap`+`pure` |
| `market` | Wochenmarkt/frisch | Preis beim `market`-Laden |
| `best` | das beste | Preis beim `best`-Laden |

---

## ✅ Referenz-Item: Spinat (voll normalisiert)

```json
"spinach": {
  "label": "Spinach",
  "icon": "🥬",
  "latin": "Spinacia oleracea",
  "sci": ["#sci/Botany", "#sci/Nutrition"],
  "unit_type": "100g",
  "energy": { "kcal": 23, "kj": 96 },
  "val": {
    "water_g": 91.1, "protein_g": 2.9, "fat_total_g": 0.6,
    "carbs_total_g": 1.3, "sugar_g": 0.4, "fiber_g": 1.9,
    "calcium_mg": 100, "magnesium_mg": 79, "potassium_mg": 590,
    "iron_plant_mg": 2.7, "iron_heme_mg": 0, "iron_total_mg": 2.7,
    "vit_c_mg": 51, "vit_k_mcg": 483,
    "vit_a_beta_carotin_mcg": 3304, "vit_a_retinol_mcg": 0, "vit_a_total_mcg": 275
  },
  "bioactive": { "lutein_mg": 12.2 },
  "interactions": { "contains": ["oxalates"] },
  "eco": { "co2_kg": 0.7, "water_l": 290, "land_m2": 0.4, "origin": "regional" },
  "lang": {
    "de": "Spinat", "en": "Spinach", "es": "Espinaca", "fr": "Épinard",
    "ru": "Шпинат", "ja": "ほうれん草", "zh": "菠菜", "fa": "اسفناج",
    "hi": "पालक", "ar": "سبانخ"
  },
  "aliases": ["spinat","spinach","espinaca","epinard","shpinat","hourensou","bocai","esfenaj","palak","sabanikh"],
  "meta": { "vegan": true, "season": ["spring","autumn","winter"], "storage": "fresh" },
  "prices": { "lidl": 1.0, "kaufland": 1.0, "rewe": 1.0, "denns": 1.0, "alnatura": 1.0 },
  "pref_vendor": "lidl"
}
```

**Was hier passiert (Beweis dass alles rechnet):**
- `energy`: kcal 23 → kj 96 (23 × 4,184).
- `vit_a_total_mcg` = 275 = 3304 (Beta-Carotin) ÷ 12 — **RAE, nicht naive Summe.**
- `iron_total_mg` 2.7 = plant 2.7 + heme 0 → dailyplm-Gaps liest jetzt korrekt.
- `aliases` enthält `shpinat`, `hourensou`, `bocai` → Latein-Buchstaben finden Russisch/Japanisch/Chinesisch.
- `interactions.contains: [oxalates]` → Regel-Tabelle warnt bei Kalzium/Eisen-Kombi.
- `prices` bleiben; welcher Laden „cheap/pure/best" ist, sagt die Vendor-Registry.
