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
        sleep_rest:      { label: "Sleep & Recovery", icon: "🛌", group: "1. Root", aliases: ["sleep", "nap", "rest", "insomnia"] },
        hygiene_basic:   { label: "Hygiene", icon: "🚿", group: "1. Root", aliases: ["shower", "teeth", "wash", "bath", "grooming"] },
        selfcare_routine:{ label: "Selfcare", icon: "🛁", group: "1. Root", aliases: ["selfcare", "skincare", "wellness", "pflege"] },
        health_medical:  { label: "Health", icon: "⚕️", group: "1. Root", aliases: ["doctor", "hospital", "pharmacy", "dentist", "sick"] },
        chore_cleaning:  { label: "Cleaning", icon: "🧹", group: "1. Root", aliases: ["clean", "tidy", "trash", "dishes", "vacuum"] },
        chore_deep:      { label: "Deep Clean", icon: "🧽", group: "1. Root", aliases: ["purge", "declutter", "ausmisten"] },
        chore_laundry:   { label: "Laundry", icon: "🧺", group: "1. Root", aliases: ["laundry", "ironing", "washing machine", "clothes"] },
        shop_groceries:  { label: "Groceries", icon: "🛒", group: "1. Root", aliases: ["groceries", "supermarket", "shopping"] },
        gear_repair:     { label: "Maintenance", icon: "⚙️", group: "1. Root", aliases: ["repair", "fix", "tools", "bauen", "werkzeug"] },
        meal_eating:     { label: "Meals", icon: "🍽️", group: "1. Root", aliases: ["breakfast", "lunch", "dinner", "snack", "eat"] },
        meal_prep:       { label: "Meal Prep", icon: "🍱", group: "1. Root", aliases: ["cook", "bake", "meal prep", "gluten-free", "kitchen"] },
        admin_finance:   { label: "Life Admin", icon: "📊", group: "1. Root", aliases: ["taxes", "budget", "finance", "bills", "mail", "admin"] },
        transit_local:   { label: "Transit", icon: "🚆", group: "1. Root", aliases: ["commute", "bus", "train", "car", "drive"] },

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
        workout_str:     { label: "Strength", icon: "💪", group: "3. Solar Plexus", aliases: ["gym", "weights", "strength"] },
        workout_cardio:  { label: "Cardio", icon: "🏃‍♀️", group: "3. Solar Plexus", aliases: ["run", "jog", "swim", "cardio"] },
        workout_stretch: { label: "Stretching", icon: "🧘", group: "3. Solar Plexus", aliases: ["stretch", "mobility", "yoga", "dehnen"] },
        sport_active:    { label: "Sports", icon: "🎾", group: "3. Solar Plexus", aliases: ["tennis", "bouldering", "climbing", "team sport"] },
        cold_exposure:   { label: "Cold Exposure", icon: "🧊", group: "3. Solar Plexus", aliases: ["cold shower", "ice bath"] },
        work_deep:       { label: "Deep Work", icon: "🧠", group: "3. Solar Plexus", aliases: ["focus", "project", "programming", "coding", "c++", "python"] },
        work_admin:      { label: "Shallow Work", icon: "💼", group: "3. Solar Plexus", aliases: ["emails", "admin", "organizing"] },
        skill_acquire:   { label: "Hard Skills", icon: "🎯", group: "3. Solar Plexus", aliases: ["drilling", "practice", "lernen"] },
        habit_tracking:  { label: "Habits", icon: "📈", group: "3. Solar Plexus", aliases: ["tracker", "goals", "setup", "review"] },

        // ==========================================
        // 🟢 4. HEART (Anahata) - Connection, Nature, Life Cycles
        // ==========================================
        social_family:   { label: "Family", icon: "👪", group: "4. Heart", aliases: ["family", "kids", "parents", "partner", "relatives"] },
        social_friends:  { label: "Friends", icon: "🥂", group: "4. Heart", aliases: ["friends", "meetup", "social", "party"] },
        event_ceremony:  { label: "Ceremony", icon: "🕊️", group: "4. Heart", aliases: ["wedding", "birthday", "anniversary"] },
        pet_care:        { label: "Pet Care", icon: "🐾", group: "4. Heart", aliases: ["dog", "cat", "vet", "walk"] },
        nature_outdoors: { label: "Nature", icon: "🌲", group: "4. Heart", aliases: ["forest", "hike", "park", "nature"] },
        acts_of_service: { label: "Service", icon: "🤲", group: "4. Heart", aliases: ["helping", "charity", "volunteer", "helfen"] },

        // ==========================================
        // 🔵 5. THROAT (Vishuddha) - Expression, Communication
        // ==========================================
        journal_log:     { label: "Journal", icon: "✍️", group: "5. Throat", aliases: ["diary", "writing", "reflection"] },
        work_sync:       { label: "Meetings", icon: "🤝", group: "5. Throat", aliases: ["meeting", "call", "zoom", "sync"] },
        difficult_convo: { label: "Deep Talk", icon: "⚖️", group: "5. Throat", aliases: ["conflict", "resolution", "aussprache"] },
        language_learn:  { label: "Languages", icon: "🗣️", group: "5. Throat", aliases: ["vocabulary", "sprachen", "phonetics", "duolingo"] },
        output_create:   { label: "Content", icon: "📝", group: "5. Throat", aliases: ["writing", "blog", "video", "publish"] },
        teaching:        { label: "Teaching", icon: "🎓", group: "5. Throat", aliases: ["mentoring", "lehren", "tutor"] },
        social_cafe:     { label: "Café", icon: "☕", group: "5. Throat", aliases: ["coffee", "chat", "networking"] },

        // ==========================================
        // 🟣 6. THIRD EYE (Ajna) - Knowledge, Vision, Travel
        // ==========================================
        weekly_review:   { label: "Weekly Review", icon: "🗺️", group: "6. Third Eye", aliases: ["weekly review", "review", "planung", "planning"] },
        travel_long:     { label: "Travel", icon: "✈️", group: "6. Third Eye", aliases: ["vacation", "journey", "backpacking"] },
        travel_short:    { label: "Day Trip", icon: "🎒", group: "6. Third Eye", aliases: ["trip", "daytrip", "weekend"] },
        edu_class:       { label: "Classes", icon: "🏫", group: "6. Third Eye", aliases: ["school", "abitur", "erwachsenenbildung", "learning"] },
        input_read:      { label: "Reading", icon: "📚", group: "6. Third Eye", aliases: ["read", "book", "study", "research"] },
        pkm_process:     { label: "Vault", icon: "⚗️", group: "6. Third Eye", aliases: ["obsidian", "notes", "pkm", "vault"] },
        pkm_memorize:    { label: "Recall", icon: "⚡", group: "6. Third Eye", aliases: ["anki", "flashcards", "memorize"] },
        strategy_plan:   { label: "Strategy", icon: "📐", group: "6. Third Eye", aliases: ["goals", "vision", "strategy"] },
        dream_journal:   { label: "Dreams", icon: "👁️", group: "6. Third Eye", aliases: ["dream", "subconscious"] },

        // ==========================================
        // ⚪ 7. CROWN (Sahasrara) - Spirit, Stillness
        // ==========================================
        mindfulness:     { label: "Meditation", icon: "🧘‍♀️", group: "7. Crown", aliases: ["meditate", "breathe", "silence", "mindfulness"] },
        breathwork:      { label: "Breathwork", icon: "🎐", group: "7. Crown", aliases: ["prana", "breathing", "atmen"] },
        stoic_study:     { label: "Philosophy", icon: "⚖️", group: "7. Crown", aliases: ["stoicism", "philosophy", "faith"] },
        gratitude_log:   { label: "Gratitude", icon: "🙏", group: "7. Crown", aliases: ["thankful", "dankbarkeit", "humble"] },
        fasting:         { label: "Fasting", icon: "⏳", group: "7. Crown", aliases: ["fasting", "detox", "cleanse"] },
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

    for (let key in ROUTINES) {
        ROUTINES[key].color = CHAKRA_COLORS[ROUTINES[key].group] || "transparent";
    }

    return {
        all: ROUTINES,
        getRoutineLabels: () => Object.keys(ROUTINES).map(k => ({ key: k, ...ROUTINES[k] })),
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