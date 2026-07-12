function routineEngine() {
    const ROUTINES = {
        // === 🌷 SELFCARE & PLM ===
        morning_routine: { label: "Morning Setup / Awakening", icon: "☀️", group: "Selfcare & PLM", persona: "healer" },
        evening_routine: { label: "Nightfall / Shutdown", icon: "🛌", group: "Selfcare & PLM", persona: "healer" },
        journal_am:      { label: "AM Journal & Coding", icon: "🌅", group: "Selfcare & PLM", persona: "healer" },
        journal_pm:      { label: "PM Journal & Reflection", icon: "🌙", group: "Selfcare & PLM", persona: "healer" },
        meditation:      { label: "Mindfulness & Breath", icon: "🎐", group: "Selfcare & PLM", persona: "healer" },
        skincare:        { label: "Skincare & Hygiene", icon: "🧴", group: "Selfcare & PLM", persona: "nurturer" },
        workout_strength:{ label: "Strength Training / Gym", icon: "💪", group: "Selfcare & PLM", persona: "warrior" },
        workout_cardio:  { label: "Cardio / Endurance", icon: "🔥", group: "Selfcare & PLM", persona: "warrior" },
        mobility:        { label: "Mobility & Stretching", icon: "🧬", group: "Selfcare & PLM", persona: "warrior" },
        
        // === 🌿 LIFE & HOME ===
        clean_general:   { label: "Cleaning & Tidy Up", icon: "🧹", group: "Life & Home", persona: "caretaker" },
        laundry:         { label: "Laundry & Ironing", icon: "🧺", group: "Life & Home", persona: "caretaker" },
        groceries:       { label: "Grocery Shopping", icon: "🛍️", group: "Life & Home", persona: "traveler" },
        cooking:         { label: "Cooking / Meal Prep", icon: "🍳", group: "Life & Home", persona: "nurturer" },
        plants:          { label: "Plant Care & Garden", icon: "🌱", group: "Life & Home", persona: "healer" },
        finances:        { label: "Wealth & Budget Check", icon: "📊", group: "Life & Home", persona: "organizer" },
        life_admin:      { label: "Life Admin & Mail", icon: "🗂️", group: "Life & Home", persona: "organizer" },
        social:          { label: "Social & Family Time", icon: "💬", group: "Life & Home", persona: "friend" },
        rest:            { label: "Entropy / Relaxation", icon: "📺", group: "Life & Home", persona: "player" },
        commute:         { label: "Transit & Travel", icon: "🚗", group: "Life & Home", persona: "traveler" },

        // === 🌻 WORK & PROJECTS (PPM) ===
        deep_work:       { label: "Deep Work / Core Mission", icon: "🔱", group: "Work & Projects", persona: "architect" },
        admin_work:      { label: "Work Admin & Sorting", icon: "💼", group: "Work & Projects", persona: "organizer" },
        inbox_zero:      { label: "Inbox Zero / Messages", icon: "📬", group: "Work & Projects", persona: "diplomat" },
        meetings:        { label: "Syncs, Calls & Scrums", icon: "🤝", group: "Work & Projects", persona: "diplomat" },
        project_plan:    { label: "Project Planning / Architecture", icon: "📐", group: "Work & Projects", persona: "architect" },
        review_pdm:      { label: "Daily/Weekly Review", icon: "🗺️", group: "Work & Projects", persona: "architect" },
        networking:      { label: "Career & Growth Strategy", icon: "🚀", group: "Work & Projects", persona: "explorer" },
        
        // === 🌼 KNOWLEDGE (PKM) ===
        lecture_class:   { label: "Lecture / Class Session", icon: "🏛️", group: "Knowledge & PKM", persona: "student" },
        study_review:    { label: "Active Recall & Study", icon: "📖", group: "Knowledge & PKM", persona: "student" },
        anki_cards:      { label: "Anki / Spaced Repetition", icon: "⚡", group: "Knowledge & PKM", persona: "student" },
        read_research:   { label: "Reading & Lit-Research", icon: "📜", group: "Knowledge & PKM", persona: "scholar" },
        distill_notes:   { label: "Zettelkasten Distillation", icon: "⚗️", group: "Knowledge & PKM", persona: "scholar" },
        writing_thesis:  { label: "Paper & Thesis Writing", icon: "✒️", group: "Knowledge & PKM", persona: "scholar" }
    };

    return {
        all: ROUTINES,
        getRoutineLabels: () => Object.keys(ROUTINES).sort().map(k => ({ key: k, ...ROUTINES[k] }))
    };
}
module.exports = routineEngine;
