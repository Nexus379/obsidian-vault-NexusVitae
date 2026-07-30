function routineEngine() {
    const ROUTINES = {
        
        // ==========================================
        // 🌌 0. MACRO PROTOCOLS (Triggers)
        // ==========================================
        am_trigger:      { label: "AM Macro", icon: "🌅", group: "0. Macro" },
        pm_trigger:      { label: "PM Macro", icon: "🌙", group: "0. Macro" },

        // ==========================================
        // 🔴 1. ROOT (Muladhara) - Survival, Body, Foundation
        // ==========================================
        sleep_rest:      { label: "Sleep & Recovery", icon: "🛌", group: "1. Root" },
        hygiene_basic:   { label: "Hygiene", icon: "🚿", group: "1. Root" },
        selfcare_routine:{ label: "Selfcare", icon: "🛁", group: "1. Root" },
        health_medical:  { label: "Health", icon: "⚕️", group: "1. Root" },
        chore_cleaning:  { label: "Cleaning", icon: "🧹", group: "1. Root" },
        chore_deep:      { label: "Deep Clean", icon: "🧽", group: "1. Root" },
        chore_laundry:   { label: "Laundry", icon: "🧺", group: "1. Root" },
        shop_groceries:  { label: "Groceries", icon: "🛒", group: "1. Root" },
        gear_repair:     { label: "Maintenance", icon: "⚙️", group: "1. Root" },
        meal_eating:     { label: "Meals", icon: "🍽️", group: "1. Root" },
        meal_prep:       { label: "Meal Prep", icon: "🍱", group: "1. Root" },
        admin_finance:   { label: "Life Admin", icon: "📊", group: "1. Root" },
        transit_local:   { label: "Transit", icon: "🚆", group: "1. Root" },

        // ==========================================
        // 🟠 2. SACRAL (Svadhisthana) - Experience, Art, Pleasure
        // ==========================================
        culture_event:   { label: "Culture", icon: "🏛️", group: "2. Sacral" },
        art_visual:      { label: "Visual Art", icon: "🎨", group: "2. Sacral" },
        craft_manual:    { label: "Handcraft", icon: "✂️", group: "2. Sacral" },
        dance_pure:      { label: "Dancing", icon: "💃", group: "2. Sacral" },
        music_practice:  { label: "Music", icon: "🎸", group: "2. Sacral" },
        hobby_misc:      { label: "Misc Hobby", icon: "🧩", group: "2. Sacral" },
        dining_out:      { label: "Dining Out", icon: "🍷", group: "2. Sacral" },
        gaming_digital:  { label: "Video Games", icon: "🎮", group: "2. Sacral" },
        gaming_tabletop: { label: "Tabletop", icon: "🃏", group: "2. Sacral" },
        rest_passive:    { label: "Screen Time", icon: "🍿", group: "2. Sacral" },
        intimacy_sex:    { label: "Intimacy", icon: "🔥", group: "2. Sacral" },

        // ==========================================
        // 🟡 3. SOLAR PLEXUS (Manipura) - Power, Work, Will
        // ==========================================
        workout_str:     { label: "Strength", icon: "💪", group: "3. Solar Plexus" },
        workout_cardio:  { label: "Cardio", icon: "🏃‍♀️", group: "3. Solar Plexus" },
        workout_stretch: { label: "Stretching", icon: "🧘", group: "3. Solar Plexus" },
        sport_active:    { label: "Sports", icon: "🎾", group: "3. Solar Plexus" },
        cold_exposure:   { label: "Cold Exposure", icon: "🧊", group: "3. Solar Plexus" },
        work_deep:       { label: "Deep Work", icon: "🧠", group: "3. Solar Plexus" },
        work_admin:      { label: "Shallow Work", icon: "💼", group: "3. Solar Plexus" },
        skill_acquire:   { label: "Hard Skills", icon: "🎯", group: "3. Solar Plexus" },
        habit_tracking:  { label: "Habits", icon: "📈", group: "3. Solar Plexus" },

        // ==========================================
        // 🟢 4. HEART (Anahata) - Connection, Nature, Life Cycles
        // ==========================================
        social_family:   { label: "Family", icon: "👪", group: "4. Heart" },
        social_friends:  { label: "Friends", icon: "🥂", group: "4. Heart" },
        event_ceremony:  { label: "Ceremony", icon: "🕊️", group: "4. Heart" },
        pet_care:        { label: "Pet Care", icon: "🐾", group: "4. Heart" },
        nature_outdoors: { label: "Nature", icon: "🌲", group: "4. Heart" },
        acts_of_service: { label: "Service", icon: "🤲", group: "4. Heart" },

        // ==========================================
        // 🔵 5. THROAT (Vishuddha) - Expression, Communication
        // ==========================================
        journal_log:     { label: "Journal", icon: "✍️", group: "5. Throat" },
        work_sync:       { label: "Meetings", icon: "🤝", group: "5. Throat" },
        difficult_convo: { label: "Deep Talk", icon: "⚖️", group: "5. Throat" },
        language_learn:  { label: "Languages", icon: "🗣️", group: "5. Throat" },
        output_create:   { label: "Content", icon: "📝", group: "5. Throat" },
        teaching:        { label: "Teaching", icon: "🎓", group: "5. Throat" },
        social_cafe:     { label: "Café", icon: "☕", group: "5. Throat" },

        // ==========================================
        // 🟣 6. THIRD EYE (Ajna) - Knowledge, Vision, Travel
        // ==========================================
        weekly_review:   { label: "Weekly Review", icon: "🗺️", group: "6. Third Eye" },
        travel_long:     { label: "Travel", icon: "✈️", group: "6. Third Eye" },
        travel_short:    { label: "Day Trip", icon: "🎒", group: "6. Third Eye" },
        edu_class:       { label: "Classes", icon: "🏫", group: "6. Third Eye" },
        input_read:      { label: "Reading", icon: "📚", group: "6. Third Eye" },
        pkm_process:     { label: "Vault", icon: "⚗️", group: "6. Third Eye" },
        pkm_memorize:    { label: "Recall", icon: "⚡", group: "6. Third Eye" },
        strategy_plan:   { label: "Strategy", icon: "📐", group: "6. Third Eye" },
        dream_journal:   { label: "Dreams", icon: "👁️", group: "6. Third Eye" },

        // ==========================================
        // ⚪ 7. CROWN (Sahasrara) - Spirit, Stillness
        // ==========================================
        mindfulness:     { label: "Meditation", icon: "🧘‍♀️", group: "7. Crown" },
        breathwork:      { label: "Breathwork", icon: "🎐", group: "7. Crown" },
        stoic_study:     { label: "Philosophy", icon: "⚖️", group: "7. Crown" },
        gratitude_log:   { label: "Gratitude", icon: "🙏", group: "7. Crown" },
        fasting:         { label: "Fasting", icon: "⏳", group: "7. Crown" },
        retreat_solo:    { label: "Retreat", icon: "🏕️", group: "7. Crown" },

        // ==========================================
        // 🌌 8. AURA / SOUL STAR (Bindu) - Beyond Boundaries
        // ==========================================
        space_walk:      { label: "Spacewalk", icon: "👨‍🚀", group: "8. Aura" },
        void_thinking:   { label: "Void Mind", icon: "🌌", group: "8. Aura" },
        quantum_leap:    { label: "Quantum Leap", icon: "⚛️", group: "8. Aura" },
        lucid_dreaming:  { label: "Lucid Dreams", icon: "🌠", group: "8. Aura" },
        flow_mastery:    { label: "Flow State", icon: "🌀", group: "8. Aura" },
        sensory_deprive: { label: "Sensory Depriv.", icon: "🕳️", group: "8. Aura" },
        energy_clear:    { label: "Energy Clear", icon: "✨", group: "8. Aura" },
        universal_sync:  { label: "Cosmic Sync", icon: "📡", group: "8. Aura" }
    };

    const CHAKRA_COLORS = {
        "0. Macro": "rgba(128, 128, 128, 0.15)",
        "1. Root": "rgba(255, 82, 82, 0.15)",
        "2. Sacral": "rgba(255, 152, 0, 0.15)",
        "3. Solar Plexus": "rgba(255, 215, 0, 0.15)",
        "4. Heart": "rgba(76, 175, 80, 0.15)",
        "5. Throat": "rgba(3, 169, 244, 0.15)",
        "6. Third Eye": "rgba(156, 39, 176, 0.15)",
        "7. Crown": "rgba(233, 30, 99, 0.15)",
        "8. Aura": "rgba(0, 230, 118, 0.15)"
    };

    // 🎭 Persona per routine — the bridge to the 3 axes (persona -> axis via personaEngine).
    // Each routine ties to a CHAKRA (group) AND, through its persona, to an AXIS (PLM/PPM/PKM).
    const ROUTINE_PERSONA = {
        // 1. Root
        sleep_rest:"caretaker", hygiene_basic:"caretaker", selfcare_routine:"caretaker",
        health_medical:"caretaker", chore_cleaning:"caretaker", chore_deep:"organizer",
        chore_laundry:"caretaker", shop_groceries:"nurturer", gear_repair:"artisan",
        meal_eating:"nurturer", meal_prep:"nurturer", admin_finance:"organizer", transit_local:"traveler",
        // 2. Sacral
        culture_event:"explorer", art_visual:"creator", craft_manual:"artisan", dance_pure:"player",
        music_practice:"artisan", hobby_misc:"player", dining_out:"host", gaming_digital:"player",
        gaming_tabletop:"player", rest_passive:"player", intimacy_sex:"lover",
        // 3. Solar Plexus
        workout_str:"warrior", workout_cardio:"warrior", workout_stretch:"warrior", sport_active:"warrior",
        cold_exposure:"warrior", work_deep:"worker", work_admin:"worker", skill_acquire:"student",
        habit_tracking:"organizer",
        // 4. Heart
        social_family:"guardian", social_friends:"friend", event_ceremony:"host", pet_care:"caretaker",
        nature_outdoors:"traveler", acts_of_service:"caretaker",
        // 5. Throat
        journal_log:"author", work_sync:"worker", difficult_convo:"diplomat", language_learn:"student",
        output_create:"creator", teaching:"teacher", social_cafe:"friend",
        // 6. Third Eye
        weekly_review:"strategist", travel_long:"traveler", travel_short:"traveler", edu_class:"student",
        input_read:"scholar", pkm_process:"archivist", pkm_memorize:"scholar", strategy_plan:"strategist",
        dream_journal:"mystic",
        // 7. Crown
        mindfulness:"monk_nun", breathwork:"monk_nun", stoic_study:"philosopher", gratitude_log:"monk_nun",
        fasting:"monk_nun", retreat_solo:"monk_nun",
        // 8. Aura
        space_walk:"mystic", void_thinking:"mystic", quantum_leap:"mystic", lucid_dreaming:"mystic",
        flow_mastery:"seeker", sensory_deprive:"mystic", energy_clear:"mystic", universal_sync:"mystic"
    };

    // ─── 🌐 LANGUAGE LAYER ────────────────────────────────────────────────
    // The routine KEYS stay language-neutral; the words you may reach them by, and the
    // way a word is folded for comparison, both live in i18n.js and follow LANG.
    let i18n = null;
    try { i18n = require("./i18n.js")(); } catch (e) { /* fall back below */ }

    for (let key in ROUTINES) {
        ROUTINES[key].color = CHAKRA_COLORS[ROUTINES[key].group] || "transparent";
        ROUTINES[key].persona = ROUTINE_PERSONA[key] || null;
        // Search words for the current language (English always rides along).
        ROUTINES[key].aliases = (i18n && i18n.routineAliases) ? i18n.routineAliases(key) : [];
    }

    // ─── 🔎 SEARCH HELPERS ────────────────────────────────────────────────
    // Folding and scoring live in i18n.js, shared with the ingredient search. Without
    // i18n we degrade gracefully: neutral folding and exact matching only.
    const norm = (i18n && typeof i18n.norm === "function")
        ? i18n.norm
        : (s) => String(s || "").normalize("NFC").toLowerCase()
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]/g, "");

    const scoreOne = (i18n && typeof i18n.fuzzyScore === "function")
        ? i18n.fuzzyScore
        : (t, c) => (t && c && t === c) ? 100 : 0;

    return {
        all: ROUTINES,
        getRoutineLabels: () => Object.keys(ROUTINES).map(k => ({ key: k, ...ROUTINES[k] })),
        getPersona: (key) => (ROUTINES[key] && ROUTINES[key].persona) || null,
        // 🧬 Which of the 3 axes (PLM/PPM/PKM) does a day's PLANNED routine touch?
        // persEngine = a loaded personaEngine (passed in to avoid a hard require dependency).
        getAxisCoverage: (page, dayPrefix, persEngine) => {
            const axes = { PLM: false, PPM: false, PKM: false };
            if (!page || !persEngine) return axes;
            const total = Number(page.rt_periods) || 14;
            for (let i = 1; i <= total; i++) {
                let val = page[`rt_${dayPrefix}_${i}`];
                if (!val || val === "free" || val === "break") continue;
                let baseKey = String(Array.isArray(val) ? val[0] : val).split("|")[0];
                let r = ROUTINES[baseKey];
                if (r && r.persona) {
                    let ax = persEngine.getAxis(r.persona);
                    if (axes[ax] !== undefined) axes[ax] = true;
                }
            }
            return axes;
        },
        // 🌈 Compact chakra column chart (Säulendiagramm) — just actual minutes, decent/subtle.
        // rows: [{icon, col:"r,g,b", actual:minutes}]. For a small live overview (dailyplm).
        renderChakraColumns: (rows) => {
            const maxV = Math.max(30, ...rows.map(r => r.actual || 0));
            let h = `<div style="display:flex; gap:6px; align-items:flex-end; height:52px; font-family:var(--font-interface);">`;
            rows.forEach(r => {
                const px = Math.max(3, Math.round(((r.actual || 0) / maxV) * 36));
                h += `<div style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; flex:1;">`;
                h += `<div style="font-size:0.6em; opacity:0.5;">${r.actual ? r.actual + "′" : ""}</div>`;
                h += `<div style="width:55%; height:${px}px; background:rgba(${r.col},0.8); border-radius:3px 3px 0 0;"></div>`;
                h += `<div style="font-size:0.85em; margin-top:3px;">${r.icon}</div>`;
                h += `</div>`;
            });
            h += `</div>`;
            return h;
        },
        // 🌈 Chakra time: PLANNED minutes per chakra group for one day (from the timeblock).
        // page = routine plan (dv.page), dayPrefix = "mon".."sun". Every filled block = rt_duration min
        // counted for the chakra of its (first) routine.
        getChakraMinutes: (page, dayPrefix) => {
            const dur = Number(page.rt_duration) || 60;
            const total = Number(page.rt_periods) || 14;
            const mins = {};
            for (let i = 1; i <= total; i++) {
                let val = page[`rt_${dayPrefix}_${i}`];
                if (!val || val === "free" || val === "break") continue;
                let first = Array.isArray(val) ? val[0] : val;
                let baseKey = String(first).split("|")[0];
                let r = ROUTINES[baseKey];
                if (r && r.group) mins[r.group] = (mins[r.group] || 0) + dur;
            }
            return mins;
        },
        // 🌈 ACTUAL chakra minutes: map the day's tracked time fields to chakra groups via each
        // activity's routine GROUP — the engine is the single source of truth. Time spent in an
        // activity counts on its chakra: music -> Sacral, mobility/sport -> Solar Plexus, etc.
        // Change a routine's group in ROUTINES and both dailyplm and the weekly review follow.
        // data = a page / frontmatter-like object holding the tracked minute fields.
        getActualChakraMinutes: (data) => {
            const ACTUAL_FIELDS = {
                inpra_min_total: "music_practice", // instrument practice (mirrored from the Inpra log)
                mobility_am:   "workout_stretch",  // morning mobility
                mobility_pm:   "workout_stretch",  // evening mobility
                activity_time: "sport_active",     // spontaneous activity / sport
            };
            const mins = {};
            for (const [field, routineKey] of Object.entries(ACTUAL_FIELDS)) {
                const v = Number(data && data[field]) || 0;
                if (v <= 0) continue;
                const r = ROUTINES[routineKey];
                if (r && r.group) mins[r.group] = (mins[r.group] || 0) + v;
            }
            return mins;
        },
        // 🌈 Shared chakra-bar renderer. ONE place that draws the Plan/Actual bars,
        // used by dailyplm (single day) AND revw (week rollup). The callers still
        // build their own `rows` (day-values vs summed-week differ) — only the HTML
        // lives here, so a design tweak touches one function, not every template.
        // rows: [{icon, label, col:"r,g,b", plan:planMin, actual:actualMin}]
        // opt:  {plan, act, legend}  (labels; come from i18n.t on the caller side)
        renderChakraBars: (rows, opt) => {
            opt = opt || {};
            const planL = opt.plan || "Plan", actL = opt.act || "Actual";
            const legend = opt.legend || "light bar = planned, solid = actual";
            const maxV = Math.max(60, ...rows.map(r => Math.max(r.plan, r.actual)));
            let bars = `<div style="font-family: var(--font-interface); font-size:0.85em; line-height:1.5;">`;
            rows.forEach(r => {
                const pw = Math.round((r.plan / maxV) * 100);
                const lw = Math.round((r.actual / maxV) * 100);
                bars += `<div style="margin-bottom:5px;">`;
                bars += `<span style="display:inline-block; width:135px;">${r.icon} ${r.label}</span>`;
                bars += `<span style="opacity:0.55;">${planL} ${r.plan}′ · ${actL} ${r.actual}′</span>`;
                bars += `<div style="background:var(--background-modifier-border); border-radius:4px; height:12px; position:relative; margin-top:2px;">`;
                bars += `<div style="width:${pw}%; background:rgba(${r.col},0.35); height:100%; border-radius:4px; position:absolute;"></div>`;
                bars += `<div style="width:${lw}%; background:rgba(${r.col},0.95); height:100%; border-radius:4px; position:absolute;"></div>`;
                bars += `</div></div>`;
            });
            bars += `</div>`;
            const totalP = rows.reduce((a, r) => a + r.plan, 0);
            const totalI = rows.reduce((a, r) => a + r.actual, 0);
            const sigma = `<small style="opacity:0.6;">Σ ${planL} ${totalP}′ · ${actL} ${totalI}′  —  ${legend}</small>`;
            return { bars, sigma };
        },
        getByChakra: (targetChakra) => Object.keys(ROUTINES)
            .filter(k => ROUTINES[k].group === targetChakra)
            .map(k => ({ key: k, ...ROUTINES[k] })),
        // 🔎 Brain-friendly search: you should not have to hit the system's word.
        // Tolerates umlauts, typos, word stems and loose letter order, and returns the
        // hits sorted by how well they match (best first) with a `score` on each.
        searchRoutines: (searchTerm, opt) => {
            const term = norm(searchTerm);
            if (!term) return [];
            const minScore = (opt && opt.minScore) || 30;
            const limit = (opt && opt.limit) || 12;

            return Object.keys(ROUTINES)
                .map(k => {
                    const r = ROUTINES[k];
                    // Every word this routine can be reached by.
                    const cands = [k, r.label].concat(r.aliases || []).map(norm).filter(Boolean);
                    let best = 0;
                    for (const c of cands) best = Math.max(best, scoreOne(term, c));
                    return { key: k, ...r, score: best };
                })
                .filter(r => r.score >= minScore)
                .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
                .slice(0, limit);
        }
    };
}
module.exports = routineEngine;
