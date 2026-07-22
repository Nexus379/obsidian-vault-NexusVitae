function routineEngine() {
    const ROUTINES = {
        
        // ==========================================
        // 🌌 0. MACRO PROTOCOLS (Triggers)
        // ==========================================
        am_trigger:      { label: "AM Macro", icon: "🌅", group: "0. Macro", aliases: ["am", "morning-macro"] },
        pm_trigger:      { label: "PM Macro", icon: "🌙", group: "0. Macro", aliases: ["pm", "evening-macro"] },

        // ==========================================
        // 🔴 1. ROOT (Muladhara) - Survival, Body, Foundation
        // ==========================================
        sleep_rest:      { label: "Sleep & Recovery", icon: "🛌", group: "1. Root", aliases: ["sleep", "nap", "rest", "insomnia", "schlafen", "nickerchen", "ausruhen", "ruhen", "sleeping", "snooze"] },
        hygiene_basic:   { label: "Hygiene", icon: "🚿", group: "1. Root", aliases: ["shower", "teeth", "wash", "bath", "grooming", "zähneputzen", "duschen", "waschen", "körperpflege", "baden", "brush", "dental", "hygiene", "toothbrush"] },
        selfcare_routine:{ label: "Selfcare", icon: "🛁", group: "1. Root", aliases: ["selfcare", "skincare", "wellness", "pflege", "hautpflege", "beauty", "grooming"] },
        health_medical:  { label: "Health", icon: "⚕️", group: "1. Root", aliases: ["doctor", "hospital", "pharmacy", "dentist", "sick", "arzt", "apotheke", "zahnarzt", "krank", "gesundheit", "health", "medical", "checkup"] },
        chore_cleaning:  { label: "Cleaning", icon: "🧹", group: "1. Root", aliases: ["clean", "tidy", "trash", "dishes", "vacuum", "putzen", "aufräumen", "müll", "geschirr", "staubsaugen", "cleaning", "mop", "sweep"] },
        chore_deep:      { label: "Deep Clean", icon: "🧽", group: "1. Root", aliases: ["purge", "declutter", "ausmisten", "entrümpeln", "grundreinigung", "großputz", "springclean", "organize"] },
        chore_laundry:   { label: "Laundry", icon: "🧺", group: "1. Root", aliases: ["laundry", "ironing", "washing machine", "clothes", "wäsche", "bügeln", "waschmaschine", "washing"] },
        shop_groceries:  { label: "Groceries", icon: "🛒", group: "1. Root", aliases: ["groceries", "supermarket", "shopping", "einkaufen", "lebensmittel", "supermarkt", "grocery"] },
        gear_repair:     { label: "Maintenance", icon: "⚙️", group: "1. Root", aliases: ["repair", "fix", "tools", "bauen", "werkzeug", "reparieren", "basteln", "maintenance", "build"] },
        meal_eating:     { label: "Meals", icon: "🍽️", group: "1. Root", aliases: ["breakfast", "lunch", "dinner", "snack", "eat", "essen", "frühstück", "mittagessen", "abendessen", "mahlzeit", "eating", "food", "meal"] },
        meal_prep:       { label: "Meal Prep", icon: "🍱", group: "1. Root", aliases: ["cook", "bake", "meal prep", "gluten-free", "kitchen", "kochen", "backen", "mealprep", "zubereiten", "cooking", "prep", "baking"] },
        admin_finance:   { label: "Life Admin", icon: "📊", group: "1. Root", aliases: ["taxes", "budget", "finance", "bills", "mail", "admin", "steuern", "finanzen", "rechnungen", "papierkram"] },
        transit_local:   { label: "Transit", icon: "🚆", group: "1. Root", aliases: ["commute", "bus", "train", "car", "drive", "pendeln", "bahn", "auto", "fahren", "transport", "driving"] },

        // ==========================================
        // 🟠 2. SACRAL (Svadhisthana) - Experience, Art, Pleasure
        // ==========================================
        culture_event:   { label: "Culture", icon: "🏛️", group: "2. Sacral", aliases: ["museum", "cinema", "theater", "gallery", "concert"] },
        art_visual:      { label: "Visual Art", icon: "🎨", group: "2. Sacral", aliases: ["draw", "paint", "sketch", "photography", "illustration"] },
        craft_manual:    { label: "Handcraft", icon: "✂️", group: "2. Sacral", aliases: ["diy", "build", "sew", "knit", "woodwork", "crafting", "töpfern"] },
        dance_pure:      { label: "Dancing", icon: "💃", group: "2. Sacral", aliases: ["dance", "ballet", "hiphop", "tanzen"] },
        music_practice:  { label: "Music", icon: "🎸", group: "2. Sacral", aliases: ["instrument", "sing", "piano", "guitar", "audio"] },
        hobby_misc:      { label: "Misc Hobby", icon: "🧩", group: "2. Sacral", aliases: ["collecting", "leisure", "freizeit", "basteln"] },
        dining_out:      { label: "Dining Out", icon: "🍷", group: "2. Sacral", aliases: ["restaurant", "date", "bar", "cafe"] },
        gaming_digital:  { label: "Video Games", icon: "🎮", group: "2. Sacral", aliases: ["gaming", "pc", "console", "play"] },
        gaming_tabletop: { label: "Tabletop", icon: "🃏", group: "2. Sacral", aliases: ["mtg", "board game", "chess", "cards"] },
        rest_passive:    { label: "Screen Time", icon: "🍿", group: "2. Sacral", aliases: ["series", "movie", "star trek", "netflix", "watch"] },
        intimacy_sex:    { label: "Intimacy", icon: "🔥", group: "2. Sacral", aliases: ["sex", "partner", "romance", "sensuality"] },

        // ==========================================
        // 🟡 3. SOLAR PLEXUS (Manipura) - Power, Work, Will
        // ==========================================
        workout_str:     { label: "Strength", icon: "💪", group: "3. Solar Plexus", aliases: ["gym", "weights", "strength", "krafttraining", "gewichte", "muskeln", "kraft", "lifting", "resistance"] },
        workout_cardio:  { label: "Cardio", icon: "🏃‍♀️", group: "3. Solar Plexus", aliases: ["run", "jog", "swim", "cardio", "laufen", "joggen", "ausdauer", "schwimmen", "running", "biking", "endurance"] },
        workout_stretch: { label: "Stretching", icon: "🧘", group: "3. Solar Plexus", aliases: ["stretch", "mobility", "yoga", "dehnen", "stretching", "beweglichkeit", "mobilität", "flexibility", "warmup"] },
        sport_active:    { label: "Sports", icon: "🎾", group: "3. Solar Plexus", aliases: ["tennis", "bouldering", "climbing", "team sport", "sport", "klettern", "bouldern", "sports"] },
        cold_exposure:   { label: "Cold Exposure", icon: "🧊", group: "3. Solar Plexus", aliases: ["cold shower", "ice bath", "eisbad", "kälte", "kaltdusche", "icebath", "coldshower"] },
        work_deep:       { label: "Deep Work", icon: "🧠", group: "3. Solar Plexus", aliases: ["focus", "project", "programming", "coding", "c++", "python", "arbeit", "fokus", "programmieren", "konzentration", "work", "deepwork"] },
        work_admin:      { label: "Shallow Work", icon: "💼", group: "3. Solar Plexus", aliases: ["emails", "admin", "organizing", "verwaltung", "organisieren", "email"] },
        skill_acquire:   { label: "Hard Skills", icon: "🎯", group: "3. Solar Plexus", aliases: ["drilling", "practice", "lernen", "üben", "fähigkeit", "drillen", "skill"] },
        habit_tracking:  { label: "Habits", icon: "📈", group: "3. Solar Plexus", aliases: ["tracker", "goals", "setup", "review", "gewohnheiten", "ziele", "habits"] },

        // ==========================================
        // 🟢 4. HEART (Anahata) - Connection, Nature, Life Cycles
        // ==========================================
        social_family:   { label: "Family", icon: "👪", group: "4. Heart", aliases: ["family", "kids", "parents", "partner", "relatives", "familie", "kinder", "eltern", "verwandte"] },
        social_friends:  { label: "Friends", icon: "🥂", group: "4. Heart", aliases: ["friends", "meetup", "social", "party", "freunde", "treffen", "hangout"] },
        event_ceremony:  { label: "Ceremony", icon: "🕊️", group: "4. Heart", aliases: ["wedding", "birthday", "anniversary"] },
        pet_care:        { label: "Pet Care", icon: "🐾", group: "4. Heart", aliases: ["dog", "cat", "vet", "walk", "haustier", "hund", "katze", "gassi", "tierarzt", "pet"] },
        nature_outdoors: { label: "Nature", icon: "🌲", group: "4. Heart", aliases: ["forest", "hike", "park", "nature", "natur", "wald", "wandern", "spaziergang", "draußen", "hiking", "outdoors", "walk"] },
        acts_of_service: { label: "Service", icon: "🤲", group: "4. Heart", aliases: ["helping", "charity", "volunteer", "helfen"] },

        // ==========================================
        // 🔵 5. THROAT (Vishuddha) - Expression, Communication
        // ==========================================
        journal_log:     { label: "Journal", icon: "✍️", group: "5. Throat", aliases: ["diary", "writing", "reflection", "tagebuch", "schreiben", "reflektieren", "journal", "journaling"] },
        work_sync:       { label: "Meetings", icon: "🤝", group: "5. Throat", aliases: ["meeting", "call", "zoom", "sync"] },
        difficult_convo: { label: "Deep Talk", icon: "⚖️", group: "5. Throat", aliases: ["conflict", "resolution", "aussprache"] },
        language_learn:  { label: "Languages", icon: "🗣️", group: "5. Throat", aliases: ["vocabulary", "sprachen", "phonetics", "duolingo", "vokabeln", "language"] },
        output_create:   { label: "Content", icon: "📝", group: "5. Throat", aliases: ["writing", "blog", "video", "publish"] },
        teaching:        { label: "Teaching", icon: "🎓", group: "5. Throat", aliases: ["mentoring", "lehren", "tutor", "unterrichten", "teaching", "tutoring"] },
        social_cafe:     { label: "Café", icon: "☕", group: "5. Throat", aliases: ["coffee", "chat", "networking"] },

        // ==========================================
        // 🟣 6. THIRD EYE (Ajna) - Knowledge, Vision, Travel
        // ==========================================
        weekly_review:   { label: "Weekly Review", icon: "🗺️", group: "6. Third Eye", aliases: ["weekly review", "review", "planung", "planning"] },
        travel_long:     { label: "Travel", icon: "✈️", group: "6. Third Eye", aliases: ["vacation", "journey", "backpacking"] },
        travel_short:    { label: "Day Trip", icon: "🎒", group: "6. Third Eye", aliases: ["trip", "daytrip", "weekend"] },
        edu_class:       { label: "Classes", icon: "🏫", group: "6. Third Eye", aliases: ["school", "abitur", "erwachsenenbildung", "learning"] },
        input_read:      { label: "Reading", icon: "📚", group: "6. Third Eye", aliases: ["read", "book", "study", "research", "lesen", "buch", "studieren", "reading", "learning"] },
        pkm_process:     { label: "Vault", icon: "⚗️", group: "6. Third Eye", aliases: ["obsidian", "notes", "pkm", "vault", "notizen", "wissen", "knowledge"] },
        pkm_memorize:    { label: "Recall", icon: "⚡", group: "6. Third Eye", aliases: ["flashcards", "srs", "vocabcards", "memorize", "karteikarten", "auswendig", "wiederholen", "recall"] },
        strategy_plan:   { label: "Strategy", icon: "📐", group: "6. Third Eye", aliases: ["goals", "vision", "strategy", "planung", "strategie", "planning"] },
        dream_journal:   { label: "Dreams", icon: "👁️", group: "6. Third Eye", aliases: ["dream", "subconscious"] },

        // ==========================================
        // ⚪ 7. CROWN (Sahasrara) - Spirit, Stillness
        // ==========================================
        mindfulness:     { label: "Meditation", icon: "🧘‍♀️", group: "7. Crown", aliases: ["meditate", "breathe", "silence", "mindfulness", "meditieren", "achtsamkeit", "stille", "meditation", "calm"] },
        breathwork:      { label: "Breathwork", icon: "🎐", group: "7. Crown", aliases: ["prana", "breathing", "atmen", "atemübung", "atmung", "breathwork"] },
        stoic_study:     { label: "Philosophy", icon: "⚖️", group: "7. Crown", aliases: ["stoicism", "philosophy", "faith", "philosophie", "stoizismus"] },
        gratitude_log:   { label: "Gratitude", icon: "🙏", group: "7. Crown", aliases: ["thankful", "dankbarkeit", "humble", "dankbar", "gratitude"] },
        fasting:         { label: "Fasting", icon: "⏳", group: "7. Crown", aliases: ["fasting", "detox", "cleanse", "fasten"] },
        retreat_solo:    { label: "Retreat", icon: "🏕️", group: "7. Crown", aliases: ["solitude", "alone", "retreat"] },

        // ==========================================
        // 🌌 8. AURA / SOUL STAR (Bindu) - Beyond Boundaries
        // ==========================================
        space_walk:      { label: "Spacewalk", icon: "👨‍🚀", group: "8. Aura", aliases: ["space", "universe"] },
        void_thinking:   { label: "Void Mind", icon: "🌌", group: "8. Aura", aliases: ["nothingness", "meta", "void"] },
        quantum_leap:    { label: "Quantum Leap", icon: "⚛️", group: "8. Aura", aliases: ["breakthrough", "paradigm shift"] },
        lucid_dreaming:  { label: "Lucid Dreams", icon: "🌠", group: "8. Aura", aliases: ["lucid dream", "astral"] },
        flow_mastery:    { label: "Flow State", icon: "🌀", group: "8. Aura", aliases: ["time-distortion", "hyperfocus", "mastery"] },
        sensory_deprive: { label: "Sensory Depriv.", icon: "🕳️", group: "8. Aura", aliases: ["floating", "weightless"] },
        energy_clear:    { label: "Energy Clear", icon: "✨", group: "8. Aura", aliases: ["aura", "frequency", "reset"] },
        universal_sync:  { label: "Cosmic Sync", icon: "📡", group: "8. Aura", aliases: ["astrology", "alignment", "manifesting"] }
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

    for (let key in ROUTINES) {
        ROUTINES[key].color = CHAKRA_COLORS[ROUTINES[key].group] || "transparent";
        ROUTINES[key].persona = ROUTINE_PERSONA[key] || null;
    }

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
        // rows: [{icon, col:"r,g,b", ist:minutes}]. For a small live overview (dailyplm).
        renderChakraColumns: (rows) => {
            const maxV = Math.max(30, ...rows.map(r => r.ist || 0));
            let h = `<div style="display:flex; gap:6px; align-items:flex-end; height:52px; font-family:var(--font-interface);">`;
            rows.forEach(r => {
                const px = Math.max(3, Math.round(((r.ist || 0) / maxV) * 36));
                h += `<div style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end; flex:1;">`;
                h += `<div style="font-size:0.6em; opacity:0.5;">${r.ist ? r.ist + "′" : ""}</div>`;
                h += `<div style="width:55%; height:${px}px; background:rgba(${r.col},0.8); border-radius:3px 3px 0 0;"></div>`;
                h += `<div style="font-size:0.85em; margin-top:3px;">${r.icon}</div>`;
                h += `</div>`;
            });
            h += `</div>`;
            return h;
        },
        // 🌈 Chakra-Zeit: GEPLANTE Minuten pro Chakra-Gruppe für einen Tag (aus dem Timeblock).
        // page = Routine-Plan (dv.page), dayPrefix = "mon".."sun". Jeder belegte Block = rt_duration min
        // für das Chakra seiner (ersten) Routine.
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
                inpra_min:     "music_practice",   // instrument practice
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
        // rows: [{icon, label, col:"r,g,b", p:planMin, ist:actualMin}]
        // opt:  {plan, act, legend}  (labels; come from i18n.t on the caller side)
        renderChakraBars: (rows, opt) => {
            opt = opt || {};
            const planL = opt.plan || "Plan", actL = opt.act || "Actual";
            const legend = opt.legend || "light bar = planned, solid = actual";
            const maxV = Math.max(60, ...rows.map(r => Math.max(r.p, r.ist)));
            let bars = `<div style="font-family: var(--font-interface); font-size:0.85em; line-height:1.5;">`;
            rows.forEach(r => {
                const pw = Math.round((r.p / maxV) * 100);
                const lw = Math.round((r.ist / maxV) * 100);
                bars += `<div style="margin-bottom:5px;">`;
                bars += `<span style="display:inline-block; width:135px;">${r.icon} ${r.label}</span>`;
                bars += `<span style="opacity:0.55;">${planL} ${r.p}′ · ${actL} ${r.ist}′</span>`;
                bars += `<div style="background:var(--background-modifier-border); border-radius:4px; height:12px; position:relative; margin-top:2px;">`;
                bars += `<div style="width:${pw}%; background:rgba(${r.col},0.35); height:100%; border-radius:4px; position:absolute;"></div>`;
                bars += `<div style="width:${lw}%; background:rgba(${r.col},0.95); height:100%; border-radius:4px; position:absolute;"></div>`;
                bars += `</div></div>`;
            });
            bars += `</div>`;
            const totalP = rows.reduce((a, r) => a + r.p, 0);
            const totalI = rows.reduce((a, r) => a + r.ist, 0);
            const sigma = `<small style="opacity:0.6;">Σ ${planL} ${totalP}′ · ${actL} ${totalI}′  —  ${legend}</small>`;
            return { bars, sigma };
        },
        getByChakra: (targetChakra) => Object.keys(ROUTINES)
            .filter(k => ROUTINES[k].group === targetChakra)
            .map(k => ({ key: k, ...ROUTINES[k] })),
        searchRoutines: (searchTerm) => {
            const lowerTerm = searchTerm.toLowerCase();
            return Object.keys(ROUTINES)
                .filter(k => {
                    const r = ROUTINES[k];
                    if (k.toLowerCase().includes(lowerTerm)) return true;
                    if (r.label.toLowerCase().includes(lowerTerm)) return true;
                    if (r.aliases && r.aliases.some(alias => alias.toLowerCase().includes(lowerTerm))) return true;
                    return false;
                })
                .map(k => ({ key: k, ...ROUTINES[k] }));
        }
    };
}
module.exports = routineEngine;
