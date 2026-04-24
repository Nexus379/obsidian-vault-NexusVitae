// zData/2scripts/cookEngine.js
function cookEngine() {
    const lifeData = {
        // --- 1. ERNÄHRUNG (Persona: Nurturer 🍲) ---
        mealTypes: {
            persona: "nurturer",
            items: [
                { id: "main", label: "🥘 Main Dish" },
                { id: "salad", label: "🥗 Salad" },
                { id: "soup", label: "🥣 Soup" },
                { id: "snack", label: "🍎 Snack" },
                { id: "dessert", label: "🍰 Dessert" },
                { id: "breakfast", label: "🍳 Breakfast Item" },
                { id: "drink", label: "🍹 Drink" },
                { id: "sauce", label: "🍯 Sauce/Dip" },
                { id: "bread", label: "🍞 Bread/Bakery" },
                { id: "side", label: "🍚 Side Dish" },
                { id: "preserve", label: "🥫 Preserve/Pickle" },
                { id: "bowl", label: "🥣 Nutrient Bowl" },
                { id: "shake", label: "🥤 Protein/Smoothie" }
            ]
        },
        mealTimes: {
            persona: "nurturer",
            items: [
                { id: "breakfast", label: "🌅 Breakfast (W+1)" },
                { id: "brunch", label: "🥂 Brunch" },
                { id: "lunch", label: "☀️ Lunch (W+5)" },
                { id: "tea", label: "☕ Tea Time" },
                { id: "dinner", label: "🌙 Dinner (S-3)" },
                { id: "bento", label: "🍱 Bento/To-Go" },
                { id: "midnight", label: "🌑 Night Snack" },
                { id: "workout_pre", label: "💪 Pre-Workout" },
                { id: "workout_post", label: "⚡ Post-Workout" },
                { id: "fasting_break", label: "🔓 Fasting Break" }
            ]
        },

        // --- 2. KÜCHEN-WERKZEUGE & METHODEN (Persona: Nurturer 🍲) ---
        cookTools: {
            persona: "nurturer",
            items: [
                { id: "airfryer", label: "🌬️ Airfryer" },
                { id: "oven", label: "🔥 Oven" },
                { id: "stove", label: "♨️ Stove Top" },
                { id: "grill", label: "🍢 Grill" },
                { id: "microwave", label: "📻 Microwave" },
                { id: "steamer", label: "💨 Steamer" },
                { id: "slowcooker", label: "⏳ Slow Cooker" },
                { id: "sousvide", label: "🌡️ Sous Vide Stick" },
                { id: "wafflemaker", label: "🧇 Waffle Maker" },
                { id: "ricecooker", label: "🍚 Rice Cooker" },
                { id: "mixer", label: "🌪️ Blender/Vitamix" },
                { id: "foodprocessor", label: "🤖 Food Processor" },
                { id: "grinder", label: "☕ Grinder" },
                { id: "shaker", label: "🥤 Shaker" },
                { id: "mandoline", label: "🔪 Mandoline Slicer" },
                { id: "juicer", label: "🧃 Juicer" },
                { id: "pan", label: "🍳 Pan" },
                { id: "pot", label: "🍲 Pot" },
                { id: "wok", label: "🥢 Wok" },
                { id: "pressurecooker", label: "💨 Pressure Cooker" },
                { id: "casserole", label: "🥘 Casserole Dish" },
                { id: "mortar", label: "🥣 Mortar & Pestle" }
            ]
        },
        cookMethods: {
            persona: "nurturer",
            items: [
                { id: "boiled", label: "🫧 Boiled" },
                { id: "simmered", label: "♨️ Simmered" },
                { id: "fried", label: "🔥 Pan Fried" },
                { id: "deepfried", label: "🛢️ Deep Fried" },
                { id: "baked", label: "🥖 Baked" },
                { id: "roasted", label: "🔥 Roasted" },
                { id: "steamed", label: "☁️ Steamed" },
                { id: "blanched", label: "🧊 Blanched" },
                { id: "braised", label: "🥘 Braised" },
                { id: "poached", label: "🥚 Poached" },
                { id: "raw", label: "🥗 Raw/Fresh" },
                { id: "fermented", label: "🧪 Fermented" },
                { id: "marinated", label: "🍋 Marinated" },
                { id: "cured", label: "🧂 Cured/Salted" },
                { id: "pickled", label: "🥒 Pickled" },
                { id: "dehydrated", label: "☀️ Dehydrated" },
                { id: "sprouted", label: "🌱 Sprouted" },
                { id: "infused", label: "💧 Infused" }
            ]
        },

        // --- 3. ⚗️ APOTHEKE & HEILMITTEL (Persona: Alchemist) ---
        pharmacy: {
            persona: "alchemist",
            items: [
                { id: "tincture", label: "🧪 Tinktur" },
                { id: "ointment", label: "🧴 Salbe/Balsam" },
                { id: "tea_blend", label: "🍵 Heiltee-Mischung" },
                { id: "syrup", label: "🍯 Hustensaft/Sirup" },
                { id: "capsule", label: "💊 Kapsel-Füllung" },
                { id: "oil_macerate", label: "🌿 Ölauszug" }
            ]
        },

        // --- 4. 🪴 PFLANZEN-REZEPTE (Persona: Alchemist) ---
        plantRecipes: {
            persona: "alchemist",
            items: [
                { id: "fertilizer", label: "🌿 Dünger-Mischung" },
                { id: "pest_spray", label: "🛡️ Bio-Insektenspray" },
                { id: "soil_mix", label: "🪴 Erd-Mischung" }
            ]
        },

        // --- 5. 🐈 TIER-REZEPTE (Persona: Guardian) ---
        petCare: {
            persona: "guardian",
            items: [
                { id: "catfood", label: "🐈 Katzenfutter" },
                { id: "catsnack", label: "🐟 Katzensnack" },
                { id: "dogfood", label: "🐕 Hundefutter" },
                { id: "dogsnack", label: "🦴 Hundesnack" }
            ]
        },

        // --- 6. 🧹 HAUSHALTS-REZEPTE (Persona: Organizer) ---
        household: {
            persona: "organizer",
            items: [
                { id: "cleaning", label: "🧹 Putzmittel (Allgemein)" },
                { id: "bathroom", label: "🛁 Badreiniger" },
                { id: "kitchencleaner", label: "✨ Küchenreiniger" },
                { id: "laundry", label: "🧺 Waschmittel" },
                { id: "dishwashing", label: "🍽️ Spülmittel" },
                { id: "airfreshener", label: "🌬️ Raumduft" }
            ]
        },

        // --- 7. 🧖‍♀️ SELFCARE-REZEPTE (Persona: Healer) ---
        selfcare: {
            persona: "healer", 
            items: [
                { id: "peeling", label: "🧼 Peeling" },
                { id: "mask", label: "🧖‍♀️ Gesichtsmaske" },
                { id: "lotion", label: "🧴 Creme/Lotion" },
                { id: "bath", label: "🛁 Badezusatz" },
                { id: "haircare", label: "💇‍♀️ Haarpflege" },
                { id: "lipbalm", label: "👄 Lippenpflege" }
            ]
        }
    };

    return {
        // Hilfsfunktion, um die Persona einer Kategorie abzufragen
        getPersona: (category) => lifeData[category]?.persona || "seeker",

        // Deine gewünschten Namen für die Abfrage der Daten
        getKitchenLabel: (category, id) => {
            const item = lifeData[category]?.items.find(i => i.id === id);
            return item ? item.label : id;
        },
        getAllKitchenIds: (category) => {
            return lifeData[category]?.items.map(i => i.id) || [];
        },
        getAllKitchenLabels: (category) => {
            return lifeData[category]?.items.map(i => i.label) || [];
        }
    };
}

module.exports = cookEngine;