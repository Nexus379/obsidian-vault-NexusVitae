// zData/2scripts/disciplineEngine.js
function disciplineEngine() {

    const DISCIPLINES = {
        // --- 🎒 PRIMARY & SCHOOL (Area 1, 2, 3, 5) ---
        general_studies:  { label: "General Studies", icon: "🎒", disc: "#disc/GeneralStudies", area: "#2area/1selfcare", sci: ["#sci/Education"], persona: "student" },
        nature_studies:   { label: "Nature Studies", icon: "🌿", disc: "#disc/NatureStudies", area: "#2area/1selfcare", sci: ["#sci/Education"], persona: "student" },
        arithmetic:       { label: "Arithmetic", icon: "🧮", disc: "#disc/Arithmetic", area: "#2area/3mind", sci: ["#sci/Education"], persona: "student" },
        writing_skills:   { label: "Writing Skills", icon: "✍️", disc: "#disc/Writing", area: "#2area/5creativity", sci: ["#sci/Education", "#sci/Linguistics"], persona: "student" },
        local_history:    { label: "Local History", icon: "🏡", disc: "#disc/LocalHistory", area: "#2area/2relationship", sci: ["#sci/Education", "#sci/SocialSci"], persona: "student" },
        art_class:        { label: "Art Class", icon: "🎨", disc: "#disc/ArtClass", area: "#2area/5creativity", sci: ["#sci/Education", "#sci/Arts"], persona: "student" },
        physical_ed:      { label: "Physical Education", icon: "⚽", disc: "#disc/PhysicalEducation", area: "#2area/1selfcare", sci: ["#sci/Education", "#sci/SportSci"], persona: "student" },
        german_language:  { label: "German Language", icon: "🇩🇪", disc: "#disc/GermanLanguage", area: "#2area/5creativity", sci: ["#sci/Education"], persona: "student" },
        english_language: { label: "English Language", icon: "🇬🇧", disc: "#disc/EnglishLanguage", area: "#2area/5creativity", sci: ["#sci/Education"], persona: "student" },

        // --- 🧪 NATURAL SCIENCES (Area 1, 6, 7) ---
        biology:          { label: "Biology", icon: "🧬", disc: "#disc/Biology", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },
        microbiology:     { label: "Microbiology", icon: "🫫", disc: "#disc/Microbiology", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },
        genetics:         { label: "Genetics", icon: "🧬", disc: "#disc/Genetics", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },
        chemistry:        { label: "Chemistry", icon: "🧪", disc: "#disc/Chemistry", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },
        biochemistry:     { label: "Biochemistry", icon: "⚗️", disc: "#disc/Biochemistry", area: "#2area/1selfcare", sci: ["#sci/NaturalSci", "#sci/Med-and-HealthSci"], persona: "researcher" },
        physics:          { label: "Physics", icon: "⚛️", disc: "#disc/Physics", area: "#2area/6activity", sci: ["#sci/NaturalSci"], persona: "researcher" },
        quantum_mech:     { label: "Quantum Mechanics", icon: "🌀", disc: "#disc/QuantumMechanics", area: "#2area/7entertain", sci: ["#sci/NaturalSci", "#sci/Philosophy"], persona: "researcher" },
        mathematics:      { label: "Mathematics", icon: "📐", disc: "#disc/Mathematics", area: "#2area/3mind", sci: ["#sci/NaturalSci"], persona: "analyst" },
        statistics:       { label: "Statistics", icon: "📊", disc: "#disc/Statistics", area: "#2area/3mind", sci: ["#sci/NaturalSci", "#sci/DataSci"], persona: "analyst" },
        astronomy:        { label: "Astronomy", icon: "🔭", disc: "#disc/Astronomy", area: "#2area/6activity", sci: ["#sci/NaturalSci"], persona: "explorer" },
        astrophysics:     { label: "Astrophysics", icon: "🌌", disc: "#disc/Astrophysics", area: "#2area/6activity", sci: ["#sci/NaturalSci"], persona: "explorer" },
        geology:          { label: "Geology", icon: "🌍", disc: "#disc/Geology", area: "#2area/1selfcare", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"], persona: "explorer" },
        ecology:          { label: "Ecology", icon: "🌱", disc: "#disc/Ecology", area: "#2area/1selfcare", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"], persona: "explorer" },
        meteorology:      { label: "Meteorology", icon: "⛈️", disc: "#disc/Meteorology", area: "#2area/6activity", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"], persona: "researcher" },
        immunology:       { label: "Immunology", icon: "🛡️", disc: "#disc/Immunology", area: "#2area/1selfcare", sci: ["#sci/Med-and-HealthSci"], persona: "researcher" },
        botany:           { label: "Botany", icon: "🌻", disc: "#disc/Botany", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },
        zoology:          { label: "Zoology", icon: "🦁", disc: "#disc/Zoology", area: "#2area/1selfcare", sci: ["#sci/NaturalSci"], persona: "researcher" },

        // --- 🧘 WISDOM TRADITIONS & METAPHYSICS (Area 1, 2, 3, 4, 5, 6, 7) ---
        chakra_studies:   { label: "Chakra Studies", icon: "💠", disc: "#disc/ChakraStudies", area: "#2area/4organize", sci: ["#sci/Spirituality", "#sci/Metaphysics"], persona: "mystic" },
        chakra_1:         { label: "1. Root (Muladhara)", icon: "♥️", disc: "#disc/Chakra/Root", area: "#2area/1selfcare", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_2:         { label: "2. Sacral (Svadhisthana)", icon: "🧡", disc: "#disc/Chakra/Sacral", area: "#2area/2relationship", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_3:         { label: "3. Solar Plexus (Manipura)", icon: "💛", disc: "#disc/Chakra/SolarPlexus", area: "#2area/3mind", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_4:         { label: "4. Heart (Anahata)", icon: "💚", disc: "#disc/Chakra/Heart", area: "#2area/4organize", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_5:         { label: "5. Throat (Vishuddha)", icon: "💙", disc: "#disc/Chakra/Throat", area: "#2area/5creativity", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_6:         { label: "6. Third Eye (Ajna)", icon: "💜", disc: "#disc/Chakra/ThirdEye", area: "#2area/6activity", sci: ["#sci/Spirituality"], persona: "mystic" },
        chakra_7:         { label: "7. Crown (Sahasrara)", icon: "🩷", disc: "#disc/Chakra/Crown", area: "#2area/7entertain", sci: ["#sci/Spirituality"], persona: "mystic" },
        ayurveda:         { label: "Ayurveda", icon: "🍵", disc: "#disc/Ayurveda", area: "#2area/1selfcare", sci: ["#sci/TraditionalMedicine"], persona: "alchemist" },
        tcm:              { label: "Traditional Chinese Med.", icon: "☯️", disc: "#disc/TCM", area: "#2area/1selfcare", sci: ["#sci/TraditionalMedicine"], persona: "alchemist" },
        yoga_phi:         { label: "Yoga Philosophy", icon: "🧘🏽‍♀️", disc: "#disc/YogaPhilosophy", area: "#2area/7entertain", sci: ["#sci/Spirituality", "#sci/Philosophy"], persona: "seeker" },
        hermetics:        { label: "Hermetics", icon: "✨", disc: "#disc/Hermetics", area: "#2area/7entertain", sci: ["#sci/Metaphysics"], persona: "alchemist" },
        alchemy:          { label: "Alchemy", icon: "⚗️", disc: "#disc/Alchemy", area: "#2area/7entertain", sci: ["#sci/Metaphysics"], persona: "alchemist" },
        astrology:        { label: "Astrology", icon: "🌌", disc: "#disc/Astrology", area: "#2area/6activity", sci: ["#sci/Metaphysics"], persona: "mystic" },
        kabbalah:         { label: "Kabbalah", icon: "🔯", disc: "#disc/Kabbalah", area: "#2area/7entertain", sci: ["#sci/Metaphysics", "#sci/Spirituality"], persona: "mystic" },
        theosophy:        { label: "Theosophy", icon: "🕯️", disc: "#disc/Theosophy", area: "#2area/7entertain", sci: ["#sci/Spirituality", "#sci/Metaphysics"], persona: "seeker" },
        meditation:       { label: "Meditation", icon: "🧘", disc: "#disc/Meditation", area: "#2area/7entertain", sci: ["#sci/Spirituality"], persona: "monk_nun" },
        reiki:            { label: "Reiki", icon: "👐", disc: "#disc/Reiki", area: "#2area/1selfcare", sci: ["#sci/Spirituality", "#sci/TraditionalMedicine"], persona: "healer" },
        shamanism:        { label: "Shamanism", icon: "🥁", disc: "#disc/Shamanism", area: "#2area/7entertain", sci: ["#sci/Spirituality", "#sci/Metaphysics"], persona: "seeker" },

        // --- 📚 HUMANITIES & ACADEMIC LANGUAGES (Area 4, 5, 7) ---
        german_studies:   { label: "German Studies", icon: "🇩🇪", disc: "#disc/GermanStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        english_studies:  { label: "English Studies", icon: "🇬🇧", disc: "#disc/EnglishStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        latin_studies:    { label: "Latin Studies", icon: "🏛️", disc: "#disc/LatinStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        romance_studies:  { label: "Romance Studies", icon: "🇫🇷", disc: "#disc/RomanceStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        sanskrit_studies: { label: "Sanskrit Studies", icon: "🕉️", disc: "#disc/SanskritStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        french_studies:   { label: "French Studies", icon: "🇫🇷", disc: "#disc/FrenchStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        spanish_studies:  { label: "Spanish Studies", icon: "🇪🇸", disc: "#disc/SpanishStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        italian_studies:  { label: "Italian Studies", icon: "🇮🇹", disc: "#disc/ItalianStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        greek_studies:    { label: "Greek Studies", icon: "🇬🇷", disc: "#disc/GreekStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        russian_studies:  { label: "Russian Studies", icon: "🇷🇺", disc: "#disc/RussianStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        arabic_studies:   { label: "Arabic Studies", icon: "🇸🇦", disc: "#disc/ArabicStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        persian_studies:  { label: "Persian / Dari Studies", icon: "🇮🇷", disc: "#disc/PersianStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        chinese_studies:  { label: "Chinese Studies (Mandarin)", icon: "🇨🇳", disc: "#disc/ChineseStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        japanese_studies: { label: "Japanese Studies", icon: "🇯🇵", disc: "#disc/JapaneseStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        hebrew_studies:   { label: "Hebrew Studies", icon: "✡️", disc: "#disc/HebrewStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        hindi_studies:    { label: "Hindi Studies", icon: "🇮🇳", disc: "#disc/HindiStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        portuguese_studies:{ label: "Portuguese Studies", icon: "🇵🇹", disc: "#disc/PortugueseStudies", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/Linguistics"], persona: "scholar" },
        history:          { label: "History", icon: "📜", disc: "#disc/History", area: "#2area/4organize", sci: ["#sci/Humanities"], persona: "scholar" },
        philosophy:       { label: "Philosophy", icon: "🧠", disc: "#disc/Philosophy", area: "#2area/7entertain", sci: ["#sci/Humanities", "#sci/Philosophy"], persona: "philosopher" },
        ethics:           { label: "Ethics", icon: "⚖️", disc: "#disc/Ethics", area: "#2area/4organize", sci: ["#sci/Humanities", "#sci/Law", "#sci/Philosophy"], persona: "philosopher" },
        theology:         { label: "Theology", icon: "🛐", disc: "#disc/Theology", area: "#2area/7entertain", sci: ["#sci/Humanities", "#sci/Spirituality"], persona: "scholar" },
        mythology:        { label: "Mythology", icon: "🐉", disc: "#disc/Mythology", area: "#2area/7entertain", sci: ["#sci/Humanities"], persona: "scholar" },
        archaeology:      { label: "Archaeology", icon: "🏺", disc: "#disc/Archaeology", area: "#2area/4organize", sci: ["#sci/Humanities"], persona: "explorer" },
        linguistics:      { label: "Linguistics", icon: "🗣️", disc: "#disc/Linguistics", area: "#2area/5creativity", sci: ["#sci/Humanities", "#sci/SocialSci", "#sci/Linguistics"], persona: "analyst" },
        logic:            { label: "Logic", icon: "🧩", disc: "#disc/Logic", area: "#2area/3mind", sci: ["#sci/Philosophy"], persona: "philosopher" },
        literature:       { label: "Literature", icon: "📖", disc: "#disc/Literature", area: "#2area/5creativity", sci: ["#sci/Humanities"], persona: "scholar" },

        // --- 🧠 SOCIAL & BEHAVIORAL (Area 2, 3, 4) ---
        psychology:       { label: "Psychology", icon: "🎭", disc: "#disc/Psychology", area: "#2area/2relationship", sci: ["#sci/SocialSci"], persona: "analyst" },
        sociology:        { label: "Sociology", icon: "👥", disc: "#disc/Sociology", area: "#2area/2relationship", sci: ["#sci/SocialSci"], persona: "analyst" },
        politics:         { label: "Political Science", icon: "🏛️", disc: "#disc/PoliticalScience", area: "#2area/4organize", sci: ["#sci/SocialSci", "#sci/Law"], persona: "advocate" },
        economics:        { label: "Economics", icon: "💰", disc: "#disc/Economics", area: "#2area/3mind", sci: ["#sci/BusinessAdmin"], persona: "analyst" },
        management:       { label: "Business Admin.", icon: "📈", disc: "#disc/BusinessAdmin", area: "#2area/3mind", sci: ["#sci/BusinessAdmin"], persona: "strategist" },
        law:              { label: "Law", icon: "⚖️", disc: "#disc/Law", area: "#2area/4organize", sci: ["#sci/Law"], persona: "advocate" },
        pedagogy:         { label: "Pedagogy", icon: "🎓", disc: "#disc/Pedagogy", area: "#2area/2relationship", sci: ["#sci/Education"], persona: "teacher" },
        criminology:      { label: "Criminology", icon: "🔍", disc: "#disc/Criminology", area: "#2area/2relationship", sci: ["#sci/SocialSci"], persona: "researcher" },
        anthropology:     { label: "Anthropology", icon: "💀", disc: "#disc/Anthropology", area: "#2area/2relationship", sci: ["#sci/SocialSci"], persona: "explorer" },

        // --- 🏥 MEDICINE & HEALTH (Area 1, 6) ---
        medicine:         { label: "Medicine", icon: "🏥", disc: "#disc/Medicine", area: "#2area/1selfcare", sci: ["#sci/HealthSci"], persona: "healer" },
        neuroscience:     { label: "Neuroscience", icon: "🧠", disc: "#disc/Neuroscience", area: "#2area/6activity", sci: ["#sci/HealthSci"], persona: "researcher" },
        anatomy:          { label: "Anatomy", icon: "🦴", disc: "#disc/Anatomy", area: "#2area/1selfcare", sci: ["#sci/HealthSci", "#sci/SportSci"], persona: "researcher" },
        nutrition:        { label: "Nutrition", icon: "🍎", disc: "#disc/Nutrition", area: "#2area/1selfcare", sci: ["#sci/HealthSci"], persona: "caretaker" },
        pharmacy:         { label: "Pharmacy", icon: "💊", disc: "#disc/Pharmacy", area: "#2area/1selfcare", sci: ["#sci/HealthSci"], persona: "alchemist" },
        sport_science:    { label: "Sports Science", icon: "🏃", disc: "#disc/SportsScience", area: "#2area/1selfcare", sci: ["#sci/SportSci"], persona: "trainer" },
        psychiatry:       { label: "Psychiatry", icon: "🛋️", disc: "#disc/Psychiatry", area: "#2area/2relationship", sci: ["#sci/HealthSci"], persona: "healer" },

        // --- 💾 TECHNOLOGY & ENGINEERING (Area 3, 6) ---
        computer_sci:     { label: "Computer Science", icon: "💾", disc: "#disc/ComputerScience", area: "#2area/3mind", sci: ["#sci/InformationSci", "#sci/DataSci"], persona: "engineer" },
        ai:               { label: "Artificial Intelligence", icon: "🤖", disc: "#disc/AI", area: "#2area/6activity", sci: ["#sci/InformationSci", "#sci/Engineering"], persona: "engineer" },
        cyber_sec:        { label: "Cyber Security", icon: "🌐", disc: "#disc/CyberSecurity", area: "#2area/3mind", sci: ["#sci/InformationSci", "#sci/Law"], persona: "engineer" },
        engineering:      { label: "Engineering", icon: "⚙️", disc: "#disc/Engineering", area: "#2area/6activity", sci: ["#sci/Engineering"], persona: "engineer" },
        robotics:         { label: "Robotics", icon: "🦾", disc: "#disc/Robotics", area: "#2area/6activity", sci: ["#sci/Engineering"], persona: "engineer" },
        architecture:     { label: "Architecture", icon: "🏗️", disc: "#disc/Architecture", area: "#2area/6activity", sci: ["#sci/Engineering", "#sci/Arts"], persona: "architect" },
        data_science:     { label: "Data Science", icon: "📊", disc: "#disc/DataScience", area: "#2area/3mind", sci: ["#sci/InformationSci", "#sci/DataSci"], persona: "analyst" },

        // --- 🛠️ APPLIED SKILLS (Area 1, 3, 4) ---
        craftsmanship:    { label: "Craftsmanship", icon: "🔨", disc: "#disc/Craftsmanship", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        tailoring:        { label: "Tailoring & Sewing", icon: "🧵", disc: "#disc/Tailoring", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        mechanics:        { label: "Mechanics", icon: "🔧", disc: "#disc/Mechanics", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        horticulture:     { label: "Horticulture", icon: "🪴", disc: "#disc/Horticulture", area: "#2area/1selfcare", sci: ["#sci/AppliedSci", "#sci/EnvironmentalSci"], persona: "caretaker" },
        culinary_arts:    { label: "Culinary Arts", icon: "🍳", disc: "#disc/CulinaryArts", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        nursing_care:     { label: "Nursing & Care", icon: "🩺", disc: "#disc/Nursing", area: "#2area/1selfcare", sci: ["#sci/HealthSci"], persona: "caretaker" },
        electrical_trade: { label: "Electrical Trade", icon: "🔌", disc: "#disc/ElectricalTrade", area: "#2area/6activity", sci: ["#sci/AppliedSci", "#sci/Engineering"], persona: "artisan" },
        carpentry:        { label: "Carpentry & Woodwork", icon: "🪚", disc: "#disc/Carpentry", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        plumbing:         { label: "Plumbing", icon: "🚰", disc: "#disc/Plumbing", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        automotive:       { label: "Automotive Mechanics", icon: "🚗", disc: "#disc/Automotive", area: "#2area/6activity", sci: ["#sci/AppliedSci", "#sci/Engineering"], persona: "artisan" },
        baking_pastry:    { label: "Baking & Pastry", icon: "🥖", disc: "#disc/BakingPastry", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        hairdressing:     { label: "Hairdressing & Beauty", icon: "💇", disc: "#disc/Hairdressing", area: "#2area/1selfcare", sci: ["#sci/AppliedSci"], persona: "artisan" },
        welding_metal:    { label: "Welding & Metalwork", icon: "🔥", disc: "#disc/Welding", area: "#2area/6activity", sci: ["#sci/AppliedSci", "#sci/Engineering"], persona: "artisan" },
        office_admin:     { label: "Office Administration", icon: "🗂️", disc: "#disc/OfficeAdmin", area: "#2area/4organize", sci: ["#sci/BusinessAdmin"], persona: "organizer" },
        retail_trade:     { label: "Retail & Sales", icon: "🛍️", disc: "#disc/Retail", area: "#2area/4organize", sci: ["#sci/BusinessAdmin"], persona: "worker" },
        logistics_trade:  { label: "Logistics & Warehousing", icon: "📦", disc: "#disc/Logistics", area: "#2area/4organize", sci: ["#sci/BusinessAdmin", "#sci/AppliedSci"], persona: "organizer" },
        agriculture:      { label: "Agriculture", icon: "🚜", disc: "#disc/Agriculture", area: "#2area/1selfcare", sci: ["#sci/AppliedSci", "#sci/EnvironmentalSci"], persona: "worker" },
        biohacking:       { label: "Biohacking", icon: "⚡", disc: "#disc/Biohacking", area: "#2area/1selfcare", sci: ["#sci/AppliedSci", "#sci/NaturalSci"], persona: "alchemist" },
        finance:          { label: "Finance", icon: "💵", disc: "#disc/Finance", area: "#2area/3mind", sci: ["#sci/BusinessAdmin", "#sci/AppliedSci"], persona: "strategist" },
        sustainability:   { label: "Sustainability", icon: "♻️", disc: "#disc/Sustainability", area: "#2area/4organize", sci: ["#sci/AppliedSci", "#sci/EnvironmentalSci"], persona: "organizer" },

        // --- 🎨 ARTS & CREATIVITY (Area 5, 7) ---
        art_history:      { label: "Art History", icon: "🎨", disc: "#disc/ArtHistory", area: "#2area/5creativity", sci: ["#sci/Arts", "#sci/Humanities"], persona: "scholar" },
        musicology:       { label: "Musicology", icon: "🎶", disc: "#disc/Musicology", area: "#2area/5creativity", sci: ["#sci/Arts"], persona: "creator" },
        design:           { label: "Design", icon: "🖌️", disc: "#disc/Design", area: "#2area/5creativity", sci: ["#sci/Arts"], persona: "creator" },
        photography:      { label: "Photography", icon: "📸", disc: "#disc/Photography", area: "#2area/5creativity", sci: ["#sci/Arts"], persona: "creator" },
        film_studies:     { label: "Film Studies", icon: "🎬", disc: "#disc/FilmStudies", area: "#2area/7entertain", sci: ["#sci/Arts"], persona: "creator" },
        media_studies:    { label: "Media Studies", icon: "📱", disc: "#disc/MediaStudies", area: "#2area/5creativity", sci: ["#sci/SocialSci"], persona: "analyst" }
    };

    // 🔱 AUTOMATISCHE GENERIERUNG: SCI_MAP als Single Source of Truth
    const SCI_MAP = {}; 
    for (const [key, data] of Object.entries(DISCIPLINES)) {
        if (data.sci) {
            data.sci.forEach(tag => {
                if (!SCI_MAP[tag]) SCI_MAP[tag] = [];
                SCI_MAP[tag].push(key);
            });
        }
    }

    return {
        all: DISCIPLINES,
        groups: SCI_MAP, // Exportieren unter "groups", damit deine Templates/Apps nichts anpassen müssen
        
        getDisciplineLabels: () => Object.keys(DISCIPLINES).sort().map(k => ({ key: k, ...DISCIPLINES[k] })),
        getSciTags: (discKey) => DISCIPLINES[discKey]?.sci || ["#sci/General"]
    };
}

module.exports = disciplineEngine;