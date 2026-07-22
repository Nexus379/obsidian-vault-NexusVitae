function fitnessEngine() {
    const EXERCISES = {
        
        // ==========================================
        // 🏃‍♀️ GENERAL ACTIVITIES & SPORTS
        // ==========================================
        walking: { label: "Walking", icon: "🚶‍♀️", muscles_region: ["cardio", "lower"], persona: "traveler", baseTime: 20, equipment: ["none"], muscles_target: ["calves", "quads", "glutes"], desc: "Brisk walk to elevate heart rate slightly." },
        hiking: { label: "Hiking", icon: "🥾", muscles_region: ["cardio", "lower"], persona: "traveler", baseTime: 30, equipment: ["hiking_boots", "backpack"], muscles_target: ["calves", "quads", "glutes", "hamstrings"], desc: "Outdoor trail walking with elevation changes." },
        running: { label: "Jogging / Running", icon: "🏃‍♀️", muscles_region: ["cardio", "lower"], persona: "warrior", baseTime: 10, equipment: ["running_shoes"], muscles_target: ["calves", "quads", "glutes", "hamstrings"], desc: "Steady pace running for cardiovascular endurance." },
        cycling: { label: "Cycling", icon: "🚴‍♀️", muscles_region: ["cardio", "lower"], persona: "traveler", baseTime: 20, equipment: ["bicycle", "helmet"], muscles_target: ["quads", "glutes", "calves"], desc: "Biking for lower body stamina." },
        swimming: { label: "Swimming", icon: "🏊‍♀️", muscles_region: ["cardio", "upper", "lower", "core"], persona: "warrior", baseTime: 15, equipment: ["swimwear", "goggles"], muscles_target: ["lats", "shoulders", "core", "glutes"], desc: "Full body aquatic resistance training." },
        dancing: { label: "Dancing", icon: "💃", muscles_region: ["cardio", "lower", "core", "mobility"], persona: "creator", baseTime: 15, equipment: ["none"], muscles_target: ["calves", "core", "glutes"], desc: "Rhythmic movement for coordination and cardio." },
        bouldering: { label: "Bouldering", icon: "🧗‍♀️", muscles_region: ["upper", "back", "core", "lower"], persona: "warrior", baseTime: 20, equipment: ["climbing_shoes", "chalk"], muscles_target: ["forearms", "lats", "biceps", "core"], desc: "Rock climbing without ropes. Focus on grip and pull." },
        
        soccer: { label: "Soccer / Football", icon: "⚽", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 45, equipment: ["soccer_ball", "cleats"], muscles_target: ["quads", "hamstrings", "calves", "core"], desc: "Casual soccer match or kicking ball around." },
        american_football: { label: "American Football", icon: "🏈", muscles_region: ["spontaneous", "sports"], persona: "warrior", baseTime: 45, equipment: ["football", "cleats", "pads"], muscles_target: ["quads", "glutes", "shoulders", "core"], desc: "Casual catch or recreational game." },
        rugby: { label: "Rugby", icon: "🏉", muscles_region: ["spontaneous", "sports"], persona: "warrior", baseTime: 45, equipment: ["rugby_ball", "cleats"], muscles_target: ["quads", "glutes", "shoulders", "core"], desc: "Recreational rugby play." },
        baseball: { label: "Baseball / Softball", icon: "⚾", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 60, equipment: ["baseball", "bat", "glove"], muscles_target: ["obliques", "shoulders", "forearms", "glutes"], desc: "Casual catch or batting practice." },
        basketball: { label: "Basketball", icon: "🏀", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 30, equipment: ["basketball", "court"], muscles_target: ["calves", "quads", "shoulders", "triceps"], desc: "Shooting hoops or streetball game." },
        volleyball: { label: "Volleyball", icon: "🏐", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 30, equipment: ["volleyball", "net"], muscles_target: ["calves", "quads", "shoulders", "core"], desc: "Casual beach or indoor volleyball." },
        handball: { label: "Handball", icon: "🤾", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 30, equipment: ["handball", "court"], muscles_target: ["shoulders", "triceps", "core", "calves"], desc: "Recreational handball play." },
        ice_hockey: { label: "Ice Hockey", icon: "🏒", muscles_region: ["spontaneous", "sports"], persona: "warrior", baseTime: 30, equipment: ["hockey_stick", "puck", "skates"], muscles_target: ["quads", "glutes", "core", "forearms"], desc: "Casual ice skating and hockey." },
        field_hockey: { label: "Field Hockey", icon: "🏑", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 45, equipment: ["hockey_stick", "ball", "cleats"], muscles_target: ["quads", "hamstrings", "lower_back", "forearms"], desc: "Recreational field hockey play." },
        ultimate_frisbee: { label: "Ultimate Frisbee", icon: "🥏", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 45, equipment: ["frisbee", "cleats"], muscles_target: ["calves", "quads", "shoulders", "core"], desc: "Throwing frisbee in park or casual match." },
        tennis: { label: "Tennis", icon: "🎾", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 45, equipment: ["tennis_racket", "tennis_ball", "court"], muscles_target: ["obliques", "shoulders", "forearms", "calves"], desc: "Casual tennis match." },
        badminton: { label: "Badminton", icon: "🏸", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 30, equipment: ["badminton_racket", "shuttlecock", "net"], muscles_target: ["calves", "shoulders", "triceps", "glutes"], desc: "Casual backyard or court badminton." },
        squash: { label: "Squash", icon: "🏸", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 30, equipment: ["squash_racket", "squash_ball", "court"], muscles_target: ["glutes", "quads", "shoulders", "forearms"], desc: "Casual squash game." },
        padel: { label: "Padel / Pickleball", icon: "🏓", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 45, equipment: ["paddle", "ball", "court"], muscles_target: ["calves", "shoulders", "forearms", "obliques"], desc: "Casual padel / pickleball match." },
        table_tennis: { label: "Table Tennis", icon: "🏓", muscles_region: ["spontaneous", "sports"], persona: "player", baseTime: 20, equipment: ["paddle", "table_tennis_ball", "table"], muscles_target: ["forearms", "shoulders", "calves", "obliques"], desc: "Casual ping pong match." },
        golf: { label: "Golf", icon: "⛳", muscles_region: ["spontaneous", "sports"], persona: "traveler", baseTime: 120, equipment: ["golf_clubs", "golf_ball"], muscles_target: ["obliques", "core", "shoulders", "glutes"], desc: "Recreational round of golf." },
        
        // ==========================================
        // 🧘‍♀️ YOGA & PILATES (Flow, Core & Mobility)
        // ==========================================
        pilates_hundred: { label: "Pilates Hundred", icon: "🌬️", muscles_region: ["core"], persona: "healer", fit_family: "pilates", fit_level: 1, equipment: ["mat"], muscles_target: ["abs"], desc: "Lie on back, legs at 90°. Pump arms 100x vigorously. Control breathing." },
        pilates_roll_up: { label: "Pilates Roll-Up", icon: "🥐", muscles_region: ["core", "mobility"], persona: "healer", fit_family: "pilates", fit_level: 2, equipment: ["mat"], muscles_target: ["abs", "lower_back"], desc: "Roll up vertebrae by vertebrae. Keep core tight, no momentum." },
        single_leg_stretch: { label: "Single Leg Stretch", icon: "🦵", muscles_region: ["core"], persona: "healer", fit_family: "pilates", fit_level: 2, equipment: ["mat"], muscles_target: ["abs", "hip_flexors"], desc: "Shoulders off mat, pull one knee to chest while extending the other." },
        pilates_criss_cross: { label: "Pilates Criss-Cross", icon: "❌", muscles_region: ["core"], persona: "trainer", fit_family: "pilates", fit_level: 3, equipment: ["mat"], muscles_target: ["obliques", "abs"], desc: "Twist torso, bringing opposite elbow to opposite knee." },
        pilates_teaser: { label: "Pilates Teaser", icon: "⛵", muscles_region: ["core", "mobility"], persona: "warrior", fit_family: "pilates", fit_level: 4, equipment: ["mat"], muscles_target: ["abs", "hip_flexors"], desc: "Balance on tailbone, legs and torso form a V." },
        pilates_swan: { label: "Pilates Swan", icon: "🦢", muscles_region: ["back", "mobility"], persona: "healer", fit_family: "pilates", fit_level: 2, equipment: ["mat"], muscles_target: ["lower_back", "glutes"], desc: "Lie on stomach, lift chest and extend spine using back muscles." },

        sun_salutation_a: { label: "Sun Salutation A", icon: "☀️", muscles_region: ["mobility", "core", "upper", "lower"], persona: "monk_nun", fit_family: "yoga_flow", fit_level: 1, equipment: ["mat"], muscles_target: ["shoulders", "chest", "hamstrings", "calves"], desc: "Classic flow: Fold -> Plank -> Chaturanga -> Upward Dog -> Downward Dog." },
        sun_salutation_b: { label: "Sun Salutation B", icon: "🌞", muscles_region: ["mobility", "core", "upper", "lower"], persona: "warrior", fit_family: "yoga_flow", fit_level: 2, equipment: ["mat"], muscles_target: ["quads", "shoulders", "glutes", "core"], desc: "Adds Chair Pose and Warrior I to the classic flow." },
        moon_salutation: { label: "Moon Salutation", icon: "🌙", muscles_region: ["mobility", "lower", "core"], persona: "healer", fit_family: "yoga_flow", fit_level: 1, equipment: ["mat"], muscles_target: ["adductors", "obliques", "glutes"], desc: "Lateral movements, wide squats, and side stretches to cool down." },
        warrior_sequence: { label: "Warrior Sequence", icon: "⚔️", muscles_region: ["mobility", "lower", "core"], persona: "warrior", fit_family: "yoga_flow", fit_level: 2, equipment: ["mat"], muscles_target: ["quads", "glutes", "shoulders", "core"], desc: "Flow between Warrior I, II, and Reverse Warrior." },

        chair_pose: { label: "Chair Pose", icon: "🪑", muscles_region: ["lower", "core"], persona: "trainer", fit_family: "yoga_static", fit_level: 2, equipment: ["mat"], muscles_target: ["quads", "glutes", "lower_back"], desc: "Sit back into an imaginary chair. Arms high, hold." },
        tree_pose: { label: "Tree Pose", icon: "🌳", muscles_region: ["mobility", "lower", "core"], persona: "monk_nun", fit_family: "yoga_static", fit_level: 1, equipment: ["none"], muscles_target: ["calves", "core"], desc: "Balance on one leg, foot on inner thigh." },
        warrior_three: { label: "Warrior III", icon: "✈️", muscles_region: ["lower", "core", "balance"], persona: "warrior", fit_family: "yoga_static", fit_level: 3, equipment: ["mat"], muscles_target: ["hamstrings", "glutes", "core", "stabilizers"], desc: "Balance on one leg, torso and back leg parallel to the floor." },
        crow_pose: { label: "Crow Pose", icon: "🐦", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "yoga_static", fit_level: 4, equipment: ["mat"], muscles_target: ["shoulders", "triceps", "core", "forearms"], desc: "Arm balance. Knees rest on triceps, feet lift off ground." },
        headstand_prep: { label: "Headstand Prep (Dolphin)", icon: "🐬", muscles_region: ["upper", "core", "mobility"], persona: "trainer", fit_family: "yoga_static", fit_level: 3, equipment: ["mat"], muscles_target: ["shoulders", "upper_back", "core"], desc: "Like downward dog but on forearms. Builds shoulder stability." },
        
        downward_dog: { label: "Downward-Facing Dog", icon: "🐕", muscles_region: ["mobility", "upper", "lower"], persona: "healer", fit_family: "stretching", fit_level: 1, equipment: ["mat"], muscles_target: ["hamstrings", "calves", "shoulders", "lats"], desc: "A-frame pose. Stretches posterior chain." },
        pigeon_pose: { label: "Pigeon Pose", icon: "🕊️", muscles_region: ["mobility", "lower"], persona: "healer", fit_family: "stretching", fit_level: 1, equipment: ["mat"], muscles_target: ["glutes", "hip_flexors"], desc: "Deep hip opener. Sink hips to floor." },
        happy_baby: { label: "Happy Baby", icon: "👶", muscles_region: ["mobility", "lower", "back"], persona: "healer", fit_family: "stretching", fit_level: 1, equipment: ["mat"], muscles_target: ["inner_thighs", "lower_back", "hips"], desc: "Lie on back, grab outsides of feet, pull knees towards armpits." },
        spinal_twist: { label: "Supine Spinal Twist", icon: "🌪️", muscles_region: ["mobility", "back", "core"], persona: "healer", fit_family: "stretching", fit_level: 1, equipment: ["mat"], muscles_target: ["lower_back", "obliques", "chest"], desc: "Lie on back, drop knees to one side. Opens lower back and chest." },
        childs_pose: { label: "Child's Pose", icon: "🙇‍♀️", muscles_region: ["mobility", "back"], persona: "healer", fit_family: "stretching", fit_level: 1, equipment: ["mat"], muscles_target: ["lower_back", "lats", "glutes"], desc: "Kneel, sit back on heels, stretch arms forward." },
        
        // ==========================================
        // 💪 UPPER BODY (Push)
        // ==========================================
        wall_pushup: { label: "Wall Push-ups", icon: "🧱", muscles_region: ["upper", "core"], persona: "healer", fit_family: "push_horizontal", fit_level: 1, equipment: ["wall"], muscles_target: ["chest", "front_delts", "triceps"], desc: "Push against a wall. Keep body straight." },
        incline_pushup: { label: "Incline Push-ups", icon: "🪑", muscles_region: ["upper", "core"], persona: "healer", fit_family: "push_horizontal", fit_level: 2, equipment: ["chair"], muscles_target: ["lower_chest", "triceps", "front_delts"], desc: "Hands on elevated surface. Control descent." },
        pushup: { label: "Standard Push-ups", icon: "💪", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_horizontal", fit_level: 3, equipment: ["none"], muscles_target: ["chest", "front_delts", "triceps", "core"], desc: "Chest to floor, lock out at top." },
        diamond_pushup: { label: "Diamond Push-ups", icon: "💎", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_horizontal", fit_level: 4, equipment: ["none"], muscles_target: ["triceps", "inner_chest", "front_delts"], desc: "Hands form a diamond. Extreme triceps focus." },
        archer_pushup: { label: "Archer Push-ups", icon: "🏹", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_horizontal", fit_level: 5, equipment: ["none"], muscles_target: ["chest", "triceps", "front_delts"], desc: "Shift weight to one side while pushing." },
        one_arm_pushup: { label: "One-Arm Push-up", icon: "🦾", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_horizontal", fit_level: 6, equipment: ["none"], muscles_target: ["chest", "triceps", "front_delts", "obliques"], desc: "Max tension. Keep core tight." },
        dumbbell_floor_press: { label: "Dumbbell Floor Press", icon: "🏋️", muscles_region: ["upper"], persona: "warrior", fit_family: "push_horizontal", fit_level: 3, equipment: ["dumbbell"], muscles_target: ["chest", "triceps", "front_delts"], desc: "Lie on floor, press dumbbells up." },

        lateral_raise_bottle: { label: "Lateral Raise (Bottles)", icon: "💧", muscles_region: ["upper"], persona: "healer", fit_family: "push_vertical", fit_level: 1, equipment: ["water_bottle"], muscles_target: ["side_delts"], desc: "Raise straight arms sideways to shoulder height." },
        lateral_raise_dumbbell: { label: "Lateral Raise (Dumbbells)", icon: "🏋️", muscles_region: ["upper"], persona: "warrior", fit_family: "push_vertical", fit_level: 3, equipment: ["dumbbell"], muscles_target: ["side_delts"], desc: "Strict lateral raise with dumbbells." },
        pike_hold: { label: "Pike Hold", icon: "⛺", muscles_region: ["upper", "core"], persona: "trainer", fit_family: "push_vertical", fit_level: 1, equipment: ["none"], muscles_target: ["front_delts", "triceps", "core"], desc: "Hips high in A-frame. Hold statically." },
        pike_pushup: { label: "Pike Push-ups", icon: "⛺", muscles_region: ["upper", "core"], persona: "trainer", fit_family: "push_vertical", fit_level: 2, equipment: ["none"], muscles_target: ["front_delts", "upper_chest", "triceps"], desc: "Hips high, lower top of head towards floor." },
        chair_dips: { label: "Chair Dips", icon: "🪑", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_vertical", fit_level: 3, equipment: ["chair"], muscles_target: ["triceps", "lower_chest", "front_delts"], desc: "Hands on chair edge, dip until elbows are 90°." },
        backpack_press: { label: "Backpack Overhead Press", icon: "🎒", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_vertical", fit_level: 3, equipment: ["backpack"], muscles_target: ["front_delts", "triceps", "upper_chest"], desc: "Push heavy backpack straight over head." },
        dumbbell_shoulder_press: { label: "Dumbbell Shoulder Press", icon: "🏋️", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_vertical", fit_level: 4, equipment: ["dumbbell"], muscles_target: ["front_delts", "side_delts", "triceps"], desc: "Overhead press with dumbbells." },
        parallel_dips: { label: "Parallel Dips", icon: "🤸", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_vertical", fit_level: 5, equipment: ["dip_station"], muscles_target: ["lower_chest", "triceps", "front_delts"], desc: "Full bodyweight dips." },
        wall_hspu: { label: "Wall Handstand Push-up", icon: "🤸‍♀️", muscles_region: ["upper", "core"], persona: "warrior", fit_family: "push_vertical", fit_level: 6, equipment: ["wall"], muscles_target: ["front_delts", "triceps", "upper_chest", "core"], desc: "Handstand against wall. Full press." },

        // ==========================================
        // 💪 UPPER BODY (Pull)
        // ==========================================
        reverse_fly_bottle: { label: "Reverse Flyes (Bottles)", icon: "💧", muscles_region: ["upper", "back"], persona: "healer", fit_family: "pull_horizontal", fit_level: 1, equipment: ["water_bottle"], muscles_target: ["rear_delts", "rhomboids"], desc: "Bend over, raise arms sideways with bottles." },
        door_towel_row: { label: "Door Towel Row", icon: "🚪", muscles_region: ["upper", "back", "core"], persona: "trainer", fit_family: "pull_horizontal", fit_level: 2, equipment: ["towel"], muscles_target: ["lats", "rhomboids", "biceps"], desc: "Towel around door handle. Lean back and pull." },
        table_row: { label: "Table Row", icon: "🪑", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_horizontal", fit_level: 3, equipment: ["table"], muscles_target: ["lats", "rhomboids", "biceps", "core"], desc: "Under stable table. Pull chest to underside." },
        backpack_row: { label: "Bent-over Backpack Row", icon: "🎒", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_horizontal", fit_level: 3, equipment: ["backpack"], muscles_target: ["lats", "rhomboids", "biceps", "lower_back"], desc: "Bent-over. Pull heavy backpack to hips." },
        dumbbell_row: { label: "Dumbbell Row", icon: "🏋️", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_horizontal", fit_level: 4, equipment: ["dumbbell"], muscles_target: ["lats", "rhomboids", "biceps"], desc: "One-arm row with dumbbell. Brace on knee/chair." },
        archer_table_row: { label: "Archer Table Row", icon: "🏹", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_horizontal", fit_level: 4, equipment: ["table"], muscles_target: ["lats", "biceps", "rhomboids"], desc: "Table row pulling mostly with one arm." },

        isometric_towel_pull: { label: "Isometric Towel Pull", icon: "🥋", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "iso_pull", fit_level: 1, equipment: ["towel"], muscles_target: ["lats", "rear_delts", "rhomboids"], desc: "Pull towel apart with max force for 10s." },
        negative_chinup: { label: "Negative Chin-ups", icon: "🐒", muscles_region: ["upper", "back"], persona: "trainer", fit_family: "pull_vertical", fit_level: 1, equipment: ["pull_up_bar"], muscles_target: ["lats", "biceps", "forearms"], desc: "Jump up, lower yourself slowly." },
        chinup: { label: "Chin-ups", icon: "🐒", muscles_region: ["upper", "back"], persona: "warrior", fit_family: "pull_vertical", fit_level: 2, equipment: ["pull_up_bar"], muscles_target: ["biceps", "lats", "forearms"], desc: "Underhand grip. Chin over bar." },
        pullup: { label: "Pull-ups", icon: "🦍", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_vertical", fit_level: 3, equipment: ["pull_up_bar"], muscles_target: ["lats", "rhomboids", "biceps", "core"], desc: "Overhand grip. Strict form." },
        l_sit_pullup: { label: "L-Sit Pull-ups", icon: "🪑", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_vertical", fit_level: 4, equipment: ["pull_up_bar"], muscles_target: ["lats", "abs", "hip_flexors", "biceps"], desc: "Legs straight at 90° while pulling." },
        muscle_up: { label: "Muscle-Ups", icon: "🦅", muscles_region: ["upper", "back", "core"], persona: "warrior", fit_family: "pull_vertical", fit_level: 5, equipment: ["pull_up_bar", "rings"], muscles_target: ["lats", "triceps", "chest", "core"], desc: "Explosive pull-up to straight bar dip." },
        
        // ==========================================
        // 🦵 LOWER BODY (Power, Speed, Stability)
        // ==========================================
        chair_squat: { label: "Assisted Squat", icon: "🪑", muscles_region: ["lower"], persona: "healer", fit_family: "squat_bilateral", fit_level: 1, equipment: ["chair"], muscles_target: ["quads", "glutes"], desc: "Sit down on a chair and stand back up." },
        air_squat: { label: "Air Squats", icon: "🦵", muscles_region: ["lower"], persona: "warrior", fit_family: "squat_bilateral", fit_level: 2, equipment: ["none"], muscles_target: ["quads", "glutes", "hamstrings"], desc: "Heels down, chest up. Knees track over toes." },
        backpack_squat: { label: "Backpack Squats", icon: "🎒", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_bilateral", fit_level: 3, equipment: ["backpack"], muscles_target: ["quads", "glutes", "core"], desc: "Hold loaded backpack. Chest tall." },
        dumbbell_goblet_squat: { label: "Dumbbell Goblet Squat", icon: "🏋️", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_bilateral", fit_level: 3, equipment: ["dumbbell"], muscles_target: ["quads", "glutes", "core"], desc: "Hold one dumbbell at chest level. Deep squat." },
        jump_squat: { label: "Jump Squats", icon: "🐸", muscles_region: ["lower", "cardio"], persona: "warrior", fit_family: "squat_bilateral", fit_level: 4, equipment: ["none"], muscles_target: ["quads", "glutes", "calves"], desc: "Explode upwards from the bottom of the squat." },
        box_jump: { label: "Box Jumps", icon: "📦", muscles_region: ["lower", "cardio"], persona: "warrior", fit_family: "squat_bilateral", fit_level: 5, equipment: ["box", "bench"], muscles_target: ["quads", "glutes", "calves", "core"], desc: "Jump onto a stable elevated surface. Step down." },

        assisted_lunge: { label: "Assisted Lunge", icon: "🧱", muscles_region: ["lower", "core"], persona: "healer", fit_family: "squat_unilateral", fit_level: 1, equipment: ["wall"], muscles_target: ["quads", "glutes"], desc: "Lunge while holding a wall for balance." },
        walking_lunge: { label: "Walking Lunges", icon: "🚶‍♂️", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_unilateral", fit_level: 2, equipment: ["none"], muscles_target: ["quads", "glutes", "hamstrings"], desc: "Step forward, drop back knee close to floor." },
        dumbbell_lunge: { label: "Dumbbell Lunges", icon: "🏋️", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_unilateral", fit_level: 3, equipment: ["dumbbell"], muscles_target: ["quads", "glutes", "hamstrings", "core"], desc: "Walking lunges while holding a dumbbell in each hand." },
        bulgarian_split_squat: { label: "Bulgarian Split Squats", icon: "🛋️", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_unilateral", fit_level: 4, equipment: ["chair", "bench"], muscles_target: ["quads", "glutes", "core"], desc: "Back foot elevated on a chair. Squat down." },
        shrimp_squat: { label: "Shrimp Squats", icon: "🦐", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "squat_unilateral", fit_level: 5, equipment: ["none"], muscles_target: ["quads", "glutes", "core"], desc: "Hold one foot behind you, touch that knee to floor." },
        pistol_squat: { label: "Pistol Squats", icon: "🔫", muscles_region: ["lower", "core", "mobility"], persona: "trainer", fit_family: "squat_unilateral", fit_level: 6, equipment: ["none"], muscles_target: ["quads", "glutes", "core", "calves"], desc: "Full one-legged squat. Keep opposite leg straight out." },

        glute_bridge: { label: "Glute Bridges", icon: "🌉", muscles_region: ["lower", "core"], persona: "healer", fit_family: "hinge", fit_level: 1, equipment: ["mat"], muscles_target: ["glutes", "hamstrings", "lower_back"], desc: "Lie on back, drive hips towards ceiling." },
        single_leg_bridge: { label: "Single-Leg Bridge", icon: "🌉", muscles_region: ["lower", "core"], persona: "trainer", fit_family: "hinge", fit_level: 2, equipment: ["mat"], muscles_target: ["glutes", "hamstrings", "core"], desc: "Glute bridge with one leg extended straight." },
        backpack_deadlift: { label: "Backpack Deadlift", icon: "🎒", muscles_region: ["lower", "core", "back"], persona: "warrior", fit_family: "hinge", fit_level: 2, equipment: ["backpack"], muscles_target: ["hamstrings", "glutes", "lower_back", "core"], desc: "Hinge at hips, keep back straight, lift heavy backpack." },
        dumbbell_rdl: { label: "Dumbbell RDL", icon: "🏋️", muscles_region: ["lower", "core", "back"], persona: "warrior", fit_family: "hinge", fit_level: 3, equipment: ["dumbbell"], muscles_target: ["hamstrings", "glutes", "lower_back"], desc: "Romanian Deadlift. Hinge at hips with slight knee bend." },
        towel_leg_curl: { label: "Towel Leg Curl", icon: "🧻", muscles_region: ["lower", "back"], persona: "warrior", fit_family: "hinge", fit_level: 3, equipment: ["towel"], muscles_target: ["hamstrings", "glutes"], desc: "Slide heels towards glutes on a smooth floor." },
        nordic_curl: { label: "Nordic Hamstring Curl", icon: "🛋️", muscles_region: ["lower", "core"], persona: "warrior", fit_family: "hinge", fit_level: 5, equipment: ["couch"], muscles_target: ["hamstrings", "calves", "glutes"], desc: "Feet secured under a sofa. Lower body slowly using hamstrings." },

        // ==========================================
        // 🪨 CORE & ABS (Stabilität, Rotation, Muskeldichte)
        // ==========================================
        knee_plank: { label: "Knee Plank", icon: "🧱", muscles_region: ["core"], persona: "healer", fit_family: "static_core", fit_level: 1, equipment: ["mat"], muscles_target: ["abs", "shoulders"], desc: "Plank on knees. Foundation for core tension." },
        plank: { label: "Plank Hold", icon: "🧱", muscles_region: ["core", "upper"], persona: "warrior", fit_family: "static_core", fit_level: 2, equipment: ["mat"], muscles_target: ["abs", "core", "shoulders"], desc: "Straight body, maximum tension throughout the core." },
        side_plank: { label: "Side Plank", icon: "📐", muscles_region: ["core"], persona: "warrior", fit_family: "static_core", fit_level: 2, equipment: ["mat"], muscles_target: ["obliques", "core"], desc: "Lateral support. Focus on the oblique abdominal muscles." },
        hollow_hold: { label: "Hollow Body Hold", icon: "🛶", muscles_region: ["core"], persona: "trainer", fit_family: "static_core", fit_level: 3, equipment: ["mat"], muscles_target: ["abs", "transverse_abdominis"], desc: "Lower back actively pressed into the floor, body in a banana shape." },
        hollow_body_rock: { label: "Hollow Body Rock", icon: "🛶", muscles_region: ["core"], persona: "warrior", fit_family: "static_core", fit_level: 4, equipment: ["mat"], muscles_target: ["abs", "core", "hip_flexors"], desc: "Dynamic rocking in the hollow position. Increases time under tension." },
        dragon_flag_tuck: { label: "Tucked Dragon Flag", icon: "🐉", muscles_region: ["core", "upper"], persona: "warrior", fit_family: "static_core", fit_level: 4, equipment: ["bench", "pole"], muscles_target: ["abs", "lats", "core"], desc: "Tucked Dragon Flag. Concentric and eccentric core control." },
        dragon_flag: { label: "Dragon Flag", icon: "🐉", muscles_region: ["core", "upper", "lower"], persona: "warrior", fit_family: "static_core", fit_level: 5, equipment: ["bench", "pole"], muscles_target: ["abs", "lats", "glutes", "lower_back"], desc: "Elite level of core tension. Full extension." },
		
        crunches: { label: "Crunches", icon: "💥", muscles_region: ["core"], persona: "healer", fit_family: "dynamic_core", fit_level: 1, equipment: ["mat"], muscles_target: ["abs"], desc: "Classic isolated upper body lift." },
        bicycle_crunch: { label: "Bicycle Crunches", icon: "🚲", muscles_region: ["core"], persona: "trainer", fit_family: "dynamic_core", fit_level: 2, equipment: ["mat"], muscles_target: ["obliques", "abs"], desc: "Rotation meets stability. Opposite elbow to knee." },
        russian_twist: { label: "Russian Twist", icon: "🌪️", muscles_region: ["core"], persona: "warrior", fit_family: "dynamic_core", fit_level: 2, equipment: ["none"], muscles_target: ["obliques", "core"], desc: "Seated rotation. Focus on oblique muscles." },
        lying_leg_raise: { label: "Lying Leg Raises", icon: "🦇", muscles_region: ["core"], persona: "warrior", fit_family: "dynamic_core", fit_level: 3, equipment: ["mat"], muscles_target: ["abs", "hip_flexors"], desc: "Legs raised straight. Focus on lower abdominals." },
        v_ups: { label: "V-Ups (Jackknives)", icon: "🔪", muscles_region: ["core"], persona: "warrior", fit_family: "dynamic_core", fit_level: 4, equipment: ["mat"], muscles_target: ["abs", "hip_flexors"], desc: "Simultaneous folding of torso and legs." },
        towel_ab_rollout: { label: "Towel Ab Rollout", icon: "🧻", muscles_region: ["core", "upper"], persona: "warrior", fit_family: "dynamic_core", fit_level: 5, equipment: ["towel"], muscles_target: ["abs", "lats", "shoulders"], desc: "Rollout with a towel on a smooth floor. Massive load for the entire core." },
        hanging_leg_raise: { label: "Hanging Leg Raises", icon: "🦇", muscles_region: ["core", "upper"], persona: "trainer", fit_family: "dynamic_core", fit_level: 6, equipment: ["pull_up_bar"], muscles_target: ["abs", "hip_flexors", "lats"], desc: "Hanging from the bar. Full range of motion for the core." },
		
        // ==========================================
        // 🐉 BRUCE LEE FLOW / MARTIAL ARTS & ISOMETRICS
        // ==========================================
        isometric_towel_pull: { label: "Isometric Towel Pull", icon: "🥋", muscles_region: ["upper"], persona: "warrior", fit_family: "bruce_lee", fit_level: 1, equipment: ["towel"], muscles_target: ["lats", "rear_delts", "rhomboids"], desc: "Pulling a towel apart. Build maximum tension." },
        wrist_roller: { label: "Wrist Roller", icon: "🪵", muscles_region: ["upper"], persona: "warrior", fit_family: "bruce_lee", fit_level: 2, equipment: ["stick", "weight"], muscles_target: ["forearms", "grip"], desc: "Winding a weight up with a stick. Ultimate forearm strength." },
        finger_pushup: { label: "Finger-Tip Push-ups", icon: "✋", muscles_region: ["upper"], persona: "warrior", fit_family: "bruce_lee", fit_level: 3, equipment: ["none"], muscles_target: ["forearms", "fingers", "chest", "triceps"], desc: "Push-ups on fingertips. Strengthens wrists and fingers." },
        neck_bridge_iso: { label: "Neck Bridge (Isometric)", icon: "🐢", muscles_region: ["upper"], persona: "warrior", fit_family: "bruce_lee", fit_level: 4, equipment: ["mat"], muscles_target: ["neck", "traps", "erector_spinae"], desc: "Hold neck bridge. Stability for the cervical spine." },
        horse_stance: { label: "Horse Stance (Ma Bu)", icon: "🐎", muscles_region: ["lower"], persona: "monk_nun", fit_family: "bruce_lee", fit_level: 3, equipment: ["none"], muscles_target: ["quads", "glutes", "core"], desc: "Deepest stance. Isometric endurance for the legs." },
        slow_motion_kick: { label: "Slow Motion Kick", icon: "🦵", muscles_region: ["lower", "mobility"], persona: "monk_nun", fit_family: "bruce_lee", fit_level: 1, equipment: ["none"], muscles_target: ["quads", "core", "calves"], desc: "Slow-motion kick. Forces absolute control and balance." },
        explosive_punch_burst: { label: "Explosive Punch Burst", icon: "💥", muscles_region: ["upper"], persona: "warrior", fit_family: "bruce_lee", fit_level: 4, equipment: ["none"], muscles_target: ["chest", "shoulders", "obliques"], desc: "Short, extremely explosive punch series. Snap & speed." },
		
        // ==========================================
        // 🔥 CARDIO & CONDITIONING
        // ==========================================
        rowing: { label: "Rowing", icon: "🚣", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_endurance", fit_level: 3, equipment: ["rowing_machine"], muscles_target: ["back", "hamstrings", "quads", "lats"], desc: "Full-body cardio unit. Maximum calorie burn." },
        jump_rope: { label: "Jump Rope", icon: "➰", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_endurance", fit_level: 2, equipment: ["jump_rope"], muscles_target: ["calves", "shoulders", "core"], desc: "Rhythmic jumping. Increases endurance and agility." },
        jumping_jacks: { label: "Jumping Jacks", icon: "🤸‍♀️", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_warmup", fit_level: 1, equipment: ["none"], muscles_target: ["calves", "shoulders", "quads"], desc: "Classic cardio warm-up." },
        high_knees: { label: "High Knees", icon: "🏃‍♀️", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_conditioning", fit_level: 2, equipment: ["none"], muscles_target: ["calves", "hip_flexors", "core"], desc: "High-knee running. Promotes heart rate and knee flexion." },
        mountain_climbers: { label: "Mountain Climbers", icon: "🏔️", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_conditioning", fit_level: 2, equipment: ["none"], muscles_target: ["core", "shoulders", "hip_flexors"], desc: "Dynamic movement in the support position." },
        burpee: { label: "Burpees", icon: "🔥", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_conditioning", fit_level: 3, equipment: ["none"], muscles_target: ["chest", "quads", "core", "calves"], desc: "Full-body burner. Explosivity paired with cardio." },
        sprints: { label: "High-Intensity Sprints", icon: "⚡", muscles_region: ["cardio"], persona: "warrior", fit_family: "cardio_conditioning", fit_level: 4, equipment: ["none"], muscles_target: ["quads", "hamstrings", "glutes", "calves"], desc: "Maximum effort over short distances." }
		
	};

    return {
        all: EXERCISES,
        
        getLabels: () => Object.keys(EXERCISES).sort().map(k => ({ key: k, ...EXERCISES[k] })),
        
        getByRegion: (targetRegion) => Object.keys(EXERCISES)
            .filter(k => EXERCISES[k].muscles_region.includes(targetRegion))
            .sort().map(k => ({ key: k, ...EXERCISES[k] })),
            
        getUpgrade: (currentKey) => {
            let currentEx = EXERCISES[currentKey];
            if (!currentEx || !currentEx.fit_family || !currentEx.fit_level) return null;
            
            let nextLevel = currentEx.fit_level + 1;
            let upgrades = Object.keys(EXERCISES).filter(k => 
                EXERCISES[k].fit_family === currentEx.fit_family && 
                EXERCISES[k].fit_level === nextLevel
            );
            
            if (upgrades.length > 0) {
                let randomHit = upgrades[Math.floor(Math.random() * upgrades.length)];
                return { key: randomHit, ...EXERCISES[randomHit] };
            }
            return null;
        }
    };
}
module.exports = fitnessEngine;