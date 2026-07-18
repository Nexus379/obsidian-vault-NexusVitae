/**
 * 🌐 NEXUS i18n — central language layer.
 *
 * HOW MULTI-LANGUAGE WORKS HERE:
 *   The vault content (frontmatter keys, folders, logic) stays language-neutral.
 *   Only user-VISIBLE labels live here. To switch language: change LANG below.
 *   To add a language: copy the "en" block, translate the VALUES (keep the KEYS),
 *   add it under its code (e.g. "fr"), done. Nothing else in the vault changes.
 *
 * Used from dataviewjs / templates:
 *   const i18n = require(app.vault.adapter.basePath + "/zData/2scripts/i18n.js")();
 *   i18n.t("chakra_title")
 */

const LANG = "en";   // "en" | "de"  — single source of truth for display language

const STR = {
  en: {
    // Chakra Balance module
    chakra_title:   "🌈 Chakra Balance (Plan vs Actual)",
    chakra_weekly:  "🌈 Weekly Chakra Balance (Plan vs Actual)",
    chakra_actual:  "Actual minutes (overrides auto):",
    chakra_plan:    "Plan",
    chakra_act:     "Actual",
    chakra_legend:  "light bar = planned, solid = actual",
    ck_root:        "Root",
    ck_sacral:      "Sacral",
    ck_solar:       "Solar Plexus",
    ck_heart:       "Heart",
    ck_throat:      "Throat",
    ck_thirdeye:    "Third Eye",
    ck_crown:       "Crown",
  },
  de: {
    chakra_title:   "🌈 Chakra-Balance (Plan vs Ist)",
    chakra_weekly:  "🌈 Wochen-Chakra-Balance (Plan vs Ist)",
    chakra_actual:  "Ist-Minuten (uberschreibt auto):",
    chakra_plan:    "Plan",
    chakra_act:     "Ist",
    chakra_legend:  "heller Balken = geplant, voll = tatsachlich",
    ck_root:        "Wurzel",
    ck_sacral:      "Sakral",
    ck_solar:       "Solarplexus",
    ck_heart:       "Herz",
    ck_throat:      "Kehle",
    ck_thirdeye:    "Drittes Auge",
    ck_crown:       "Krone",
  }
};

// t(key): current language, falls back to English, then to the key itself (never crashes).
function t(key) {
  return (STR[LANG] && STR[LANG][key] != null) ? STR[LANG][key]
       : (STR.en[key] != null) ? STR.en[key]
       : key;
}

module.exports = () => ({ LANG, t, STR });
