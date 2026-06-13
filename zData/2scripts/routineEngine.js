function routineEngine() {
    const ROUTINES = {
        // --- 🌷 Selfcare & PLM ---
        journal_am: { label: "☀️ AM Journal", icon: "🌅", group: "Selfcare & PLM", persona: "healer" },
        journal_pm: { label: "🌙 PM Journal", icon: "🌙", group: "Selfcare & PLM", persona: "healer" },
        selfcare_am: { label: "🧘‍♀️ AM Selfcare", icon: "🧖‍♀️", group: "Selfcare & PLM", persona: "nurturer" },
        selfcare_pm: { label: "🛀 PM Selfcare", icon: "🛁", group: "Selfcare & PLM", persona: "nurturer" },
        fitness: { label: "🏃🏽‍♀️ Fitness & Body", icon: "💪", group: "Selfcare & PLM", persona: "warrior" },
        
        // --- 🌿 Life & Home ---
        household: { label: "🧹 Household & Chores", icon: "🧺", group: "Life & Home", persona: "technician" },
        meal_prep: { label: "🍱 Meal Prep / Cooking", icon: "🍎", group: "Life & Home", persona: "nurturer" },
        social: { label: "👨‍👩‍👧 Social & Family", icon: "💬", group: "Life & Home", persona: "friend" },
        rest: { label: "🔋 Entropy / Enjoyment", icon: "📺", group: "Life & Home", persona: "player" },
        commute: { label: "🚗 Transit / Travel", icon: "🗺️", group: "Life & Home", persona: "explorer" },

        // --- 🌻 Work & Projects (PPM) ---
        focus_block: { label: "🔱 Main Task / Deep Work", icon: "🧠", group: "Work & Projects", persona: "architect" },
        admin: { label: "🗂️ Admin & Orga", icon: "💼", group: "Work & Projects", persona: "organizer" },
        meetings: { label: "🤝 Syncs & Calls", icon: "📞", group: "Work & Projects", persona: "communicator" },
        review: { label: "🎯 Planning & Review", icon: "🧭", group: "Work & Projects", persona: "architect" },
        
        // --- 🌼 Knowledge (PKM) ---
        study: { label: "📚 Study / Learning", icon: "🎓", group: "Knowledge & PKM", persona: "student" },
        read: { label: "📖 Reading / Research", icon: "🔍", group: "Knowledge & PKM", persona: "scholar" }
    };

    // --- 🧹 Default Household Baseline ---
    const CHORES_SCHEDULE = {
        "Monday":    ["Weekly Grocery Run 🛒", "Daily Laundry & Iron 🧺"],
        "Tuesday":   ["Kitchen & Fridge Check 🍳", "Daily Laundry & Iron 🧺"],
        "Wednesday": ["Floor (Vacuum & Mop) 🧽", "Daily Laundry & Iron 🧺"],
        "Thursday":  ["Dusting & Fresh Supply 🛒", "Daily Laundry & Iron 🧺"],
        "Friday":    ["Complete Bathroom Clean 🛁", "Daily Laundry & Iron 🧺"],
        "Saturday":  ["OFF - System Idle 💠", "Rest & Recharge"],
        "Sunday":    ["Bed Sheets & Plants 🌱", "Selfcare Sanctuary 🧘"]
    };

    return {
        all: ROUTINES,
        getRoutineLabels: () => Object.keys(ROUTINES).sort().map(k => ({ key: k, ...ROUTINES[k] })),
        getDailyChores: (dayName) => CHORES_SCHEDULE[dayName] || ["Maintenance", "Idle"]
    };
}
module.exports = routineEngine;