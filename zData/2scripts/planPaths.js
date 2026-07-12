// zData/2scripts/planPaths.js
// 🔱 SINGLE SOURCE OF TRUTH for all Master-Plan locations + weekly snapshot behavior.
//
// Two distinct behaviors exist:
//
//   "fallback"    -> if no weekly snapshot exists for the current week, READ the
//                    Master-Plan in 2_Areas/.../Plans/ as the data source.
//                    (Instrument, Routine, Timetable, Meal)
//
//   "autocreate"  -> if no weekly snapshot exists, there is NOTHING to fall back to.
//                    Instead, a fresh empty weekly plan should be CREATED via its
//                    weekplan_*.md template. The 2_Areas/.../Plans/ file (if any)
//                    is a pure DASHBOARD/aggregator, never a data source for "today".
//                    (Fitness)
//
// Study is intentionally NOT modeled here as its own weekly-plan module — it has
// no weekplan template at all. It simply references the existing
// Spaced_Repitition.md dashboard directly wherever needed (e.g. dailypkm.md).
// Timetable IS its own module (behavior: "fallback") since it's a genuine
// recurring weekly plan (school/uni schedule). It additionally gets manually
// blocked into the Routine via the syncTimetable.md button — the user decides
// when to sync, this is never automatic.

function planPaths() {
    const PLANS = {
        ft: {
            key: "ft",
            label: "Fitness",
            icon: "🚵🏽",
            behavior: "autocreate",
            masterPath: "2_Areas/6_Activity/Plans/Fitness_Routine", // dashboard only, NOT a fallback data source
            weeklyPrefix: "ft",
            weekplanTemplate: "weekplan_fitness"
        },
        mi: {
            key: "mi",
            label: "Instrument",
            icon: "🎸",
            behavior: "fallback",
            masterPath: "2_Areas/5_Creativity/Plans/Instrument_Mastery",
            weeklyPrefix: "mi",
            weekplanTemplate: "weekplan_music" // filename of the existing template stays as-is
        },
        rt: {
            key: "rt",
            label: "Routine",
            icon: "🧩",
            behavior: "fallback",
            masterPath: "2_Areas/4_Organize/Plans/Routine_Timeblocking",
            weeklyPrefix: "rt",
            weekplanTemplate: "weekplan_routine"
        },
        tt: {
            key: "tt",
            label: "Timetable",
            icon: "🧠",
            behavior: "fallback",
            masterPath: "2_Areas/3_Mind/Plans/Timetable",
            weeklyPrefix: "tt",
            weekplanTemplate: "weekplan_timetable"
        },
        mp: {
            key: "mp",
            label: "Meal",
            icon: "🍱",
            behavior: "fallback",
            masterPath: "2_Areas/1_Selfcare/Plans/Meal_Plan",
            weeklyPrefix: "mp",
            weekplanTemplate: "weekplan_meal"
        }
    };

    // legacy aliases so old trigger words keep working during migration
    // NOTE: "music" (long form) is intentionally NOT aliased here — it stays
    // reserved for 6_Resources/Music (albums/tracks) in the normal promptMap.
    // The plan module for practicing an instrument uses "mi" / "instrument" only.
    const ALIASES = {
        fitness: "ft", fit: "ft",
        instrument: "mi", instr: "mi",
        routine: "rt",
        timetable: "tt",
        meal: "mp"
    };

    const resolveKey = (raw) => {
        if (PLANS[raw]) return raw;
        if (ALIASES[raw]) return ALIASES[raw];
        return null;
    };

    return {
        all: PLANS,
        aliases: ALIASES,

        getLabels: () => Object.values(PLANS).map(p => ({ key: p.key, icon: p.icon, label: p.label })),

        get: (rawKey) => {
            const k = resolveKey(rawKey);
            return k ? PLANS[k].masterPath : null;
        },

        weeklyPrefix: (rawKey) => {
            const k = resolveKey(rawKey);
            return k ? PLANS[k].weeklyPrefix : null;
        },

        weekplanTemplate: (rawKey) => {
            const k = resolveKey(rawKey);
            return k ? PLANS[k].weekplanTemplate : null;
        },

        behavior: (rawKey) => {
            const k = resolveKey(rawKey);
            return k ? PLANS[k].behavior : null;
        },

        weeklyPath: (moment, rawKey, dateStr) => {
            const k = resolveKey(rawKey);
            if (!k) return null;
            const cfg = PLANS[k];
            const weekStr = moment(dateStr, "YYYY-MM-DD").format("YYYY-[W]WW");
            return `0_Calendar/7_Plan/${weekStr}_${cfg.weeklyPrefix}`;
        },

        // Resolves the active plan page for "today".
        // Returns { page, source, path, behavior } or null.
        // source: "weekly" | "master" | "none"
        resolve: (dv, moment, rawKey, dateStr) => {
            const k = resolveKey(rawKey);
            if (!k || !dv) return null;
            const cfg = PLANS[k];

            const weekStr = moment(dateStr, "YYYY-MM-DD").format("YYYY-[W]WW");
            const weeklyPath = `0_Calendar/7_Plan/${weekStr}_${cfg.weeklyPrefix}`;

            let page = dv.page(weeklyPath);
            if (page) return { page, source: "weekly", path: weeklyPath, behavior: cfg.behavior };

            if (cfg.behavior === "fallback" && cfg.masterPath) {
                page = dv.page(cfg.masterPath);
                if (page) return { page, source: "master", path: cfg.masterPath, behavior: cfg.behavior };
            }

            // "autocreate" and "queue": nothing to read, caller must react accordingly
            return { page: null, source: "none", path: weeklyPath, behavior: cfg.behavior };
        }
    };
}

module.exports = planPaths;