function mealEngine() {
    // Slot definitions shared by Meal_Plan / weekplan_meal / daily meal log / dailyplm.
    const SLOTS = { brk: "🌅 Breakfast", ben: "🍱 Bento", lun: "🥗 Lunch", snk: "🍎 Snack", eve: "🌙 Dinner" };

    // Leftovers stay edible this many days (freshness window for the shopping logic).
    const LEFTOVER_DAYS = 4;

    // "[[path|Title]]" / "[[path]]" / plain string -> { path, title }
    const parseLink = (raw) => {
        const s = String(raw).replace(/[\[\]"]/g, "");
        const path = s.split("|")[0].trim();
        const title = s.includes("|") ? s.split("|")[1].trim() : path.split("/").pop().replace(".md", "");
        return { path, title };
    };

    return {
        SLOTS,
        LEFTOVER_DAYS,
        parseLink,

        // Planned meals of one day from a (weekly or master) meal plan page.
        // -> [{ slot, slotLabel, raw, path, title }]
        getPlannedMeals: (planPage, dayPrefix) => {
            const out = [];
            if (!planPage) return out;
            for (const [slot, slotLabel] of Object.entries(SLOTS)) {
                const val = planPage[`${dayPrefix}_${slot}`];
                if (!val) continue;
                const arr = Array.isArray(val) ? val : [val];
                for (const m of arr) {
                    if (!m) continue;
                    const { path, title } = parseLink(m);
                    out.push({ slot, slotLabel, raw: String(m), path, title });
                }
            }
            return out;
        },

        // Single source of truth for "what did I actually eat / cook today".
        // Reads the per-meal fields ml_<i>_link / ml_<i>_cooked / ml_<i>_me / ml_<i>_others
        // from a Meal log page and computes:
        //   totals    – my actual nutrients (recipe_* / recipe portions × my portions)
        //   meals     – per-meal rows incl. leftover = cooked − me − others (min 0)
        //   leftovers – only the rows with leftover > 0 (fridge stock for the shopping logic)
        // dv is needed to resolve the recipe pages.
        parseMealActuals: (logPage, dv) => {
            const res = { totals: {}, meals: [], leftovers: [], anyCooked: false };
            if (!logPage) return res;
            for (let i = 1; i <= 30; i++) {
                const link = logPage[`ml_${i}_link`];
                if (!link) continue;
                const { path, title } = parseLink(link);
                const cooked = Number(logPage[`ml_${i}_cooked`]) || 0;
                const me     = Number(logPage[`ml_${i}_me`]) || 0;
                const others = Number(logPage[`ml_${i}_others`]) || 0;
                const leftover = Math.max(0, cooked - me - others);
                const row = { idx: i, path, title, slot: String(logPage[`ml_${i}_slot`] || ""), cooked, me, others, leftover };
                res.meals.push(row);
                if (cooked > 0) res.anyCooked = true;
                if (leftover > 0) res.leftovers.push(row);

                // My nutrients: recipe_* are per whole recipe (recipe "portions" servings).
                if (me > 0 && dv) {
                    const p = dv.page(path);
                    if (p) {
                        const per = Number(p.portions) || 1;
                        for (const k in p) {
                            if (String(k).startsWith("recipe_")) {
                                const metric = k.replace("recipe_", "");
                                res.totals[metric] = (res.totals[metric] || 0) + (Number(p[k]) / per) * me;
                            }
                        }
                    }
                }
            }
            return res;
        }
    };
}
module.exports = mealEngine;
