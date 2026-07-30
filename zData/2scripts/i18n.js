/**
 * 🌐 NEXUS i18n — central language layer.
 *
 * HOW MULTI-LANGUAGE WORKS HERE:
 *   The vault content (frontmatter keys, folders, logic) stays language-neutral.
 *   Only user-VISIBLE labels live here. The language follows Obsidian by itself —
 *   see below. To add a language: copy the "en" block, translate the VALUES (keep
 *   the KEYS), add it under its code (e.g. "fr"). Nothing else in the vault changes.
 *
 * Used from dataviewjs / templates:
 *   const i18n = require(app.vault.adapter.basePath + "/zData/2scripts/i18n.js")();
 *   i18n.t("chakra_title")
 */

/**
 * 🌐 Which language, decided in this order:
 *   1. an override — "language": "de" in NexusVitae_SystemConfig.json, handed in
 *      via applyConfig(), or set directly with setLang()
 *   2. Obsidian's own interface language (Settings → About → Language)
 *   3. English
 *
 * So by default you change nothing: switch Obsidian to German and the vault follows.
 * The override exists for the case where the two should differ — e.g. a vault shared
 * across machines that must read the same everywhere.
 *
 * Only languages this file actually knows are accepted; anything else stays English,
 * because a half-translated interface is worse than a consistent foreign one.
 */
const SUPPORTED = ["en", "de"];

function detectObsidianLang() {
    try {
        // Obsidian keeps the interface language here; absent/empty means English.
        const raw = (typeof window !== "undefined" && window.localStorage
                     && window.localStorage.getItem("language"))
                 || (typeof window !== "undefined" && window.moment && window.moment.locale())
                 || "";
        return String(raw).toLowerCase().split("-")[0];   // "de-DE" -> "de"
    } catch (e) { return ""; }
}

let LANG_OVERRIDE = "";
function resolveLang() {
    const wanted = LANG_OVERRIDE || detectObsidianLang();
    return SUPPORTED.includes(wanted) ? wanted : "en";
}
let LANG = resolveLang();

// applyConfig(cfg): pass a loaded NexusVitae_SystemConfig.json. An empty or missing
// "language" hands control back to Obsidian. Returns the language now in effect.
function applyConfig(cfg) {
    LANG_OVERRIDE = (cfg && cfg.language) ? String(cfg.language).toLowerCase() : "";
    LANG = resolveLang();
    return LANG;
}

// setLang(code): same thing without the config file. "" restores the Obsidian setting.
function setLang(code) {
    LANG_OVERRIDE = String(code || "").toLowerCase();
    LANG = resolveLang();
    return LANG;
}

function getLang() { return LANG; }

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

/**
 * 🔤 Language-specific letter expansion for search/sorting.
 *
 * Only letters a language WRITES OUT differently belong here — German "ü" becomes
 * "ue", Danish "ø" becomes "oe". Anything not listed keeps the neutral path: the
 * accent is simply dropped (é → e), which is right for most languages.
 * Adding a language means adding its block; nothing else changes.
 */
const TRANSLIT = {
  de: { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" },
  da: { "æ": "ae", "ø": "oe", "å": "aa" },
  no: { "æ": "ae", "ø": "oe", "å": "aa" },
  sv: { "å": "aa" }
};

/**
 * norm(str): comparable form of a word — lowercase, letters expanded per language,
 * remaining accents dropped, separators removed. "Frühsport", "fruehsport" and
 * "fruh sport" all end up the same under LANG "de".
 */
function norm(s) {
  let out = String(s || "").normalize("NFC").toLowerCase();
  const map = TRANSLIT[LANG];
  if (map) for (const ch in map) out = out.split(ch).join(map[ch]);
  return out.normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]/g, "");
}

/**
 * 🔎 FUZZY MATCHING — shared by every search in the vault (routines, ingredients, …).
 *
 * You should not have to hit the exact word: typos, missing accents, word stems and
 * loose letter order all still find the thing. Feed these NORMALISED strings (norm()
 * above) — callers normalise their candidates once instead of per comparison.
 */

// Edit distance, aborted as soon as it exceeds max — we never need the exact number,
// only "close enough or not".
function editDist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        let rowMin = i;
        for (let j = 1; j <= b.length; j++) {
            cur[j] = a[i - 1] === b[j - 1]
                ? prev[j - 1]
                : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
            if (cur[j] < rowMin) rowMin = cur[j];
        }
        if (rowMin > max) return max + 1;
        prev = cur;
    }
    return prev[b.length];
}

// Do the letters of `t` appear in `c` in order? Catches "grcry" → "groceries".
function isSubseq(t, c) {
    let i = 0;
    for (const ch of c) if (ch === t[i] && ++i === t.length) return true;
    return i === t.length;
}

// fuzzyScore(term, candidate): 0–100, higher is better, both already normalised.
// Cheap tests first; edit distance only as a last resort.
function fuzzyScore(t, c) {
    if (!t || !c) return 0;
    if (t === c) return 100;
    if (c.startsWith(t)) return 90;
    if (t.startsWith(c) && c.length >= 4) return 80;   // typed more than the word
    if (c.includes(t) && t.length >= 3) return 70;
    if (t.includes(c) && c.length >= 4) return 60;
    // Typo tolerance grows with length: short words must sit closer, or "tea" hits everything.
    const tol = t.length <= 4 ? 1 : (t.length <= 8 ? 2 : 3);
    const d = editDist(t, c, tol);
    if (d <= tol) return 55 - d * 8;
    if (t.length >= 4 && isSubseq(t, c)) return 35;
    return 0;
}

/**
 * 🧩 ROUTINE SEARCH WORDS — the words you may reach a routine by.
 *
 * The routine KEYS (shop_groceries, …) stay language-neutral in routineEngine.js;
 * only the words a human types live here. "en" is the base and is always searched,
 * so nothing becomes unreachable when a translation is incomplete. To add a
 * language: copy the "de" block, translate the VALUES, keep the KEYS.
 */
const ROUTINE_ALIASES = {
  en: {
    am_trigger: ["am", "morning-macro"],
    pm_trigger: ["pm", "evening-macro"],
    sleep_rest: ["sleep", "nap", "rest", "insomnia", "sleeping", "snooze"],
    hygiene_basic: ["shower", "teeth", "wash", "bath", "grooming", "brush", "dental", "hygiene", "toothbrush"],
    selfcare_routine: ["selfcare", "skincare", "wellness", "beauty", "grooming"],
    health_medical: ["doctor", "hospital", "pharmacy", "dentist", "sick", "health", "medical", "checkup"],
    chore_cleaning: ["clean", "tidy", "trash", "dishes", "vacuum", "cleaning", "mop", "sweep"],
    chore_deep: ["purge", "declutter", "springclean", "organize"],
    chore_laundry: ["laundry", "ironing", "washing machine", "clothes", "washing"],
    shop_groceries: ["groceries", "supermarket", "shopping", "grocery"],
    gear_repair: ["repair", "fix", "tools", "maintenance", "build"],
    meal_eating: ["breakfast", "lunch", "dinner", "snack", "eat", "eating", "food", "meal"],
    meal_prep: ["cook", "bake", "meal prep", "mealprep", "gluten-free", "kitchen", "cooking", "prep", "baking"],
    admin_finance: ["taxes", "budget", "finance", "bills", "mail", "admin"],
    transit_local: ["commute", "bus", "train", "car", "drive", "transport", "driving"],
    culture_event: ["museum", "cinema", "theater", "gallery", "concert"],
    art_visual: ["draw", "paint", "sketch", "photography", "illustration"],
    craft_manual: ["diy", "build", "sew", "knit", "woodwork", "crafting"],
    dance_pure: ["dance", "ballet", "hiphop"],
    music_practice: ["instrument", "sing", "piano", "guitar", "audio"],
    hobby_misc: ["collecting", "leisure"],
    dining_out: ["restaurant", "date", "bar", "cafe"],
    gaming_digital: ["gaming", "pc", "console", "play"],
    gaming_tabletop: ["mtg", "board game", "chess", "cards"],
    rest_passive: ["series", "movie", "star trek", "netflix", "watch"],
    intimacy_sex: ["sex", "partner", "romance", "sensuality"],
    workout_str: ["gym", "weights", "strength", "lifting", "resistance"],
    workout_cardio: ["run", "jog", "swim", "cardio", "running", "biking", "endurance"],
    workout_stretch: ["stretch", "mobility", "yoga", "stretching", "flexibility", "warmup"],
    sport_active: ["tennis", "bouldering", "climbing", "team sport", "sport", "sports"],
    cold_exposure: ["cold shower", "ice bath", "icebath", "coldshower"],
    work_deep: ["focus", "project", "programming", "coding", "c++", "python", "work", "deepwork"],
    work_admin: ["emails", "email", "admin", "organizing"],
    skill_acquire: ["drilling", "practice", "skill"],
    habit_tracking: ["tracker", "goals", "setup", "review", "habits"],
    social_family: ["family", "kids", "parents", "partner", "relatives"],
    social_friends: ["friends", "meetup", "social", "party", "hangout"],
    event_ceremony: ["wedding", "birthday", "anniversary"],
    pet_care: ["dog", "cat", "vet", "walk", "pet"],
    nature_outdoors: ["forest", "hike", "park", "nature", "hiking", "outdoors", "walk"],
    acts_of_service: ["helping", "charity", "volunteer"],
    journal_log: ["diary", "writing", "reflection", "journal", "journaling"],
    work_sync: ["meeting", "call", "zoom", "sync"],
    difficult_convo: ["conflict", "resolution"],
    language_learn: ["vocabulary", "phonetics", "duolingo", "language"],
    output_create: ["writing", "blog", "video", "publish"],
    teaching: ["mentoring", "tutor", "teaching", "tutoring"],
    social_cafe: ["coffee", "chat", "networking"],
    weekly_review: ["weekly review", "review", "planning"],
    travel_long: ["vacation", "journey", "backpacking"],
    travel_short: ["trip", "daytrip", "weekend"],
    edu_class: ["school", "learning"],
    input_read: ["read", "book", "study", "research", "reading", "learning"],
    pkm_process: ["obsidian", "notes", "pkm", "vault", "knowledge"],
    pkm_memorize: ["flashcards", "srs", "vocabcards", "memorize", "recall"],
    strategy_plan: ["goals", "vision", "strategy", "planning"],
    dream_journal: ["dream", "subconscious"],
    mindfulness: ["meditate", "breathe", "silence", "mindfulness", "meditation", "calm"],
    breathwork: ["prana", "breathing", "breathwork"],
    stoic_study: ["stoicism", "philosophy", "faith"],
    gratitude_log: ["thankful", "humble", "gratitude"],
    fasting: ["fasting", "detox", "cleanse"],
    retreat_solo: ["solitude", "alone", "retreat"],
    space_walk: ["space", "universe"],
    void_thinking: ["nothingness", "meta", "void"],
    quantum_leap: ["breakthrough", "paradigm shift"],
    lucid_dreaming: ["lucid dream", "astral"],
    flow_mastery: ["time-distortion", "hyperfocus", "mastery"],
    sensory_deprive: ["floating", "weightless"],
    energy_clear: ["aura", "frequency", "reset"],
    universal_sync: ["astrology", "alignment", "manifesting"]
  },
  de: {
    sleep_rest: ["schlafen", "nickerchen", "ausruhen", "ruhen"],
    hygiene_basic: ["zähneputzen", "duschen", "waschen", "körperpflege", "baden"],
    selfcare_routine: ["pflege", "hautpflege"],
    health_medical: ["arzt", "apotheke", "zahnarzt", "krank", "gesundheit"],
    chore_cleaning: ["putzen", "aufräumen", "müll", "geschirr", "staubsaugen"],
    chore_deep: ["ausmisten", "entrümpeln", "grundreinigung", "großputz"],
    chore_laundry: ["wäsche", "bügeln", "waschmaschine"],
    shop_groceries: ["einkaufen", "lebensmittel", "supermarkt"],
    gear_repair: ["bauen", "werkzeug", "reparieren", "basteln"],
    meal_eating: ["essen", "frühstück", "mittagessen", "abendessen", "mahlzeit"],
    meal_prep: ["kochen", "backen", "zubereiten"],
    admin_finance: ["steuern", "finanzen", "rechnungen", "papierkram"],
    transit_local: ["pendeln", "bahn", "auto", "fahren"],
    craft_manual: ["töpfern"],
    dance_pure: ["tanzen"],
    hobby_misc: ["freizeit", "basteln"],
    workout_str: ["krafttraining", "gewichte", "muskeln", "kraft"],
    workout_cardio: ["laufen", "joggen", "ausdauer", "schwimmen"],
    workout_stretch: ["dehnen", "beweglichkeit", "mobilität"],
    sport_active: ["klettern", "bouldern"],
    cold_exposure: ["eisbad", "kälte", "kaltdusche"],
    work_deep: ["arbeit", "fokus", "programmieren", "konzentration"],
    work_admin: ["verwaltung", "organisieren"],
    skill_acquire: ["lernen", "üben", "fähigkeit", "drillen"],
    habit_tracking: ["gewohnheiten", "ziele"],
    social_family: ["familie", "kinder", "eltern", "verwandte"],
    social_friends: ["freunde", "treffen"],
    pet_care: ["haustier", "hund", "katze", "gassi", "tierarzt"],
    nature_outdoors: ["natur", "wald", "wandern", "spaziergang", "draußen"],
    acts_of_service: ["helfen"],
    journal_log: ["tagebuch", "schreiben", "reflektieren"],
    difficult_convo: ["aussprache"],
    language_learn: ["sprachen", "vokabeln"],
    teaching: ["lehren", "unterrichten"],
    weekly_review: ["planung"],
    edu_class: ["abitur", "erwachsenenbildung"],
    input_read: ["lesen", "buch", "studieren"],
    pkm_process: ["notizen", "wissen"],
    pkm_memorize: ["karteikarten", "auswendig", "wiederholen"],
    strategy_plan: ["planung", "strategie"],
    mindfulness: ["meditieren", "achtsamkeit", "stille"],
    breathwork: ["atmen", "atemübung", "atmung"],
    stoic_study: ["philosophie", "stoizismus"],
    gratitude_log: ["dankbarkeit", "dankbar"],
    fasting: ["fasten"]
  }
};

// routineAliases(key): English base + current language, duplicates removed.
// English always rides along, so an untranslated routine stays findable.
function routineAliases(key) {
  const base = (ROUTINE_ALIASES.en && ROUTINE_ALIASES.en[key]) || [];
  if (LANG === "en") return base.slice();
  const loc = (ROUTINE_ALIASES[LANG] && ROUTINE_ALIASES[LANG][key]) || [];
  return Array.from(new Set(base.concat(loc)));
}

module.exports = () => ({
    // A getter, not a copy: callers that hold on to this object still see the current
    // language after a later applyConfig()/setLang().
    get LANG() { return LANG; },
    getLang, setLang, applyConfig,
    t, STR, norm, TRANSLIT, ROUTINE_ALIASES, routineAliases,
    fuzzyScore, editDist, isSubseq
});
