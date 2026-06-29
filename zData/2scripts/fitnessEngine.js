function fitnessEngine() {
    const EXERCISES = {
        // ==========================================
        // 🏃‍♀️ GENERAL ACTIVITIES & SPORTS
        // ==========================================
        walking: { label: "Walking", icon: "🚶‍♀️", regions: ["cardio", "lower"], persona: "traveler", baseTime: 20 },
        hiking: { label: "Hiking", icon: "🥾", regions: ["cardio", "lower"], persona: "traveler", baseTime: 30 },
        running: { label: "Jogging / Running", icon: "🏃‍♀️", regions: ["cardio", "lower"], persona: "warrior", baseTime: 10 },
        cycling: { label: "Cycling", icon: "🚴‍♀️", regions: ["cardio", "lower"], persona: "traveler", baseTime: 20 },
        swimming: { label: "Swimming", icon: "🏊‍♀️", regions: ["cardio", "upper", "lower", "core"], persona: "warrior", baseTime: 15 },
        dancing: { label: "Dancing", icon: "💃", regions: ["cardio", "lower", "core", "mobility"], persona: "creator", baseTime: 15 },
        yoga_practice: { label: "Yoga Practice", icon: "🧘‍♀️", regions: ["mobility", "core", "upper", "lower"], persona: "monk_nun", baseTime: 15 },
        bouldering: { label: "Bouldering", icon: "🧗‍♀️", regions: ["upper", "back", "core", "lower"], persona: "warrior", baseTime: 20 },
        team_sports: { label: "Team Sports (Soccer, etc.)", icon: "⚽", regions: ["cardio", "lower", "core"], persona: "player", baseTime: 30 },

        // ==========================================
        // 💪 UPPER BODY (Pull / Push / Functional)
        // ==========================================
        
        // --- Bodyweight (Foundation) ---
        pushup: { label: "Push-ups", icon: "💪", regions: ["upper", "core"], persona: "warrior" },
        diamond_pushup: { label: "Diamond Push-ups", icon: "💎", regions: ["upper", "core"], persona: "warrior" },
        dips: { label: "Triceps Dips", icon: "🪑", regions: ["upper", "core"], persona: "warrior" },
        pullup: { label: "Pull-ups", icon: "🦍", regions: ["upper", "back", "core"], persona: "warrior" },
        chinup: { label: "Chin-ups", icon: "🐒", regions: ["upper", "back"], persona: "warrior" },
        pike_pushup: { label: "Pike Push-ups", icon: "⛺", regions: ["upper", "core"], persona: "trainer" },
        muscle_up: { label: "Muscle-Ups", icon: "🦅", regions: ["upper", "back", "core"], persona: "warrior" },
        
        // --- Weighted / Hybrid (Overload) ---
        overhead_press: { label: "Standing Overhead Press", icon: "🏋️‍♂️", regions: ["upper", "core"], persona: "warrior" },
        weighted_pullup: { label: "Weighted Pull-ups", icon: "⛓️", regions: ["upper", "back"], persona: "warrior" },
        sandbag_press: { label: "Sandbag / Heavy Press", icon: "🎒", regions: ["upper", "core"], persona: "warrior" },
        renegade_row: { label: "Renegade Rows", icon: "🦾", regions: ["upper", "back", "core"], persona: "warrior" },

        // ==========================================
        // 🦵 LOWER BODY (Power, Speed, Stability)
        // ==========================================
        
        // --- Bodyweight & Plyometrics ---
        squat: { label: "Air Squats", icon: "🦵", regions: ["lower"], persona: "warrior" },
        lunge: { label: "Walking Lunges", icon: "🚶‍♂️", regions: ["lower", "core"], persona: "warrior" },
        pistol_squat: { label: "Pistol Squats", icon: "🔫", regions: ["lower", "core", "mobility"], persona: "trainer" },
        box_jump: { label: "Explosive Box Jumps", icon: "📦", regions: ["lower", "cardio"], persona: "warrior" },
        broad_jump: { label: "Broad Jumps", icon: "🐸", regions: ["lower", "cardio"], persona: "warrior" },
        calf_raises: { label: "Calf Raises", icon: "🩰", regions: ["lower"], persona: "healer" },
        
        // --- Weighted / Heavy ---
        barbell_squat: { label: "Heavy Squats (Front/Back)", icon: "🏋️", regions: ["lower", "core"], persona: "warrior" },
        deadlift: { label: "Deadlifts", icon: "💀", regions: ["lower", "core", "back"], persona: "warrior" },
        bulgarian_split: { label: "Bulgarian Split Squats", icon: "⚔️", regions: ["lower", "core"], persona: "warrior" },
        sandbag_squat: { label: "Sandbag Squats", icon: "🎒", regions: ["lower", "core"], persona: "warrior" },

        // ==========================================
        // 🪨 CORE & ABS (Functional Stability)
        // ==========================================
        
        // --- Isometric Holds & Gymnastics ---
        plank: { label: "Plank Hold", icon: "🧱", regions: ["core", "upper"], persona: "warrior" },
        side_plank: { label: "Side Plank", icon: "📐", regions: ["core", "upper"], persona: "warrior" },
        hollow_hold: { label: "Hollow Body Hold", icon: "🛶", regions: ["core"], persona: "trainer" },
        l_sit: { label: "L-Sit Hold", icon: "🪑", regions: ["core", "upper"], persona: "trainer" },
        glute_bridge: { label: "Glute Bridges", icon: "🌉", regions: ["core", "lower"], persona: "healer" },
        
        // --- Dynamic Core ---
        crunches: { label: "Crunches / Sit-ups", icon: "💥", regions: ["core"], persona: "warrior" },
        leg_raises: { label: "Hanging Leg Raises", icon: "🦇", regions: ["core", "upper"], persona: "trainer" },
        ab_wheel: { label: "Ab Wheel Rollouts", icon: "🎡", regions: ["core", "upper"], persona: "warrior" },
        woodchopper: { label: "Functional Woodchoppers", icon: "🪓", regions: ["core", "upper"], persona: "warrior" },

        // ==========================================
        // 🐉 ASIAN MARTIAL ARTS & BRUCE LEE FLOW
        // ==========================================
        
        dragon_flag: { label: "Dragon Flag", icon: "🐉", regions: ["core", "upper", "lower"], persona: "warrior" },
        isometric_punch: { label: "Isometric Punch Holds", icon: "👊", regions: ["upper", "core"], persona: "warrior" },
        horse_stance: { label: "Horse Stance (Ma Bu)", icon: "🐎", regions: ["lower", "core", "mobility"], persona: "monk_nun" },
        front_kick: { label: "Martial Arts Front Kicks", icon: "🥋", regions: ["lower", "core", "cardio"], persona: "warrior" },
        side_kick: { label: "Martial Arts Side Kicks", icon: "🌪️", regions: ["lower", "core", "mobility"], persona: "warrior" },
        shadow_boxing: { label: "Shadow Boxing", icon: "🥊", regions: ["cardio", "upper", "core", "lower"], persona: "warrior", baseTime: 10 },
        tai_chi_flow: { label: "Tai Chi / Qi Gong Flow", icon: "☯️", regions: ["mobility", "lower", "core"], persona: "monk_nun", baseTime: 15 },

        // ==========================================
        // 🔥 CARDIO & ENDURANCE (Conditioning)
        // ==========================================
        jumping_jacks: { label: "Jumping Jacks", icon: "🤸‍♀️", regions: ["cardio", "upper", "lower"], persona: "warrior", baseTime: 5 },
        mountain_climbers: { label: "Mountain Climbers", icon: "🏔️", regions: ["cardio", "core", "upper"], persona: "warrior", baseTime: 5 },
        jump_rope: { label: "Jump Rope", icon: "🪢", regions: ["cardio", "lower", "core"], persona: "warrior", baseTime: 10 },
        burpee: { label: "Burpees", icon: "🔥", regions: ["cardio", "upper", "lower", "core"], persona: "warrior", baseTime: 5 },
        sprints: { label: "High-Intensity Sprints", icon: "⚡", regions: ["cardio", "lower"], persona: "warrior", baseTime: 10 },
        kettlebell_swing: { label: "Kettlebell Swings", icon: "🪨", regions: ["cardio", "lower", "core", "back"], persona: "warrior", baseTime: 10 },
        farmers_walk: { label: "Farmer's Walk (Heavy Carry)", icon: "🚶‍♂️", regions: ["cardio", "core", "upper", "lower"], persona: "warrior", baseTime: 10 },

        // ==========================================
        // 🤸 WARMUP & MOBILITY (Dynamic Stretching)
        // ==========================================
        dynamic_lunge: { label: "Dynamic Lunges", icon: "🩰", regions: ["mobility", "lower"], persona: "healer", baseTime: 5 },
        arm_swings: { label: "Arm Swings & Rotations", icon: "🚁", regions: ["mobility", "upper"], persona: "healer", baseTime: 5 },
        cat_cow: { label: "Cat-Cow Stretch", icon: "🐈", regions: ["mobility", "core", "back"], persona: "healer", baseTime: 5 },
        worlds_greatest: { label: "World's Greatest Stretch", icon: "🌍", regions: ["mobility", "lower", "upper", "core"], persona: "healer", baseTime: 5 },
        foam_rolling: { label: "Foam Rolling / Tissue Prep", icon: "🧻", regions: ["mobility", "lower", "upper", "back"], persona: "healer", baseTime: 5 }
    };

    return {
        all: EXERCISES,
        getLabels: () => Object.keys(EXERCISES).sort().map(k => ({ key: k, ...EXERCISES[k] })),
        getByRegion: (targetRegion) => Object.keys(EXERCISES)
            .filter(k => EXERCISES[k].regions.includes(targetRegion))
            .sort().map(k => ({ key: k, ...EXERCISES[k] }))
    };
}
module.exports = fitnessEngine;