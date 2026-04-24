// zData/2scripts/disciplineEngine.js
function disciplineEngine() {

    const DISCIPLINES = {
        // --- 🎒 PRIMARY & SCHOOL (Area 1, 2, 3, 5) ---
        general_studies:  { label: "General Studies", icon: "🎒", disc: "#disc/GeneralStudies", area: "1_Selfcare", sci: ["#sci/Education"] },
        nature_studies:   { label: "Nature Studies", icon: "🌿", disc: "#disc/NatureStudies", area: "1_Selfcare", sci: ["#sci/Education"] },
        arithmetic:       { label: "Arithmetic", icon: "🧮", disc: "#disc/Arithmetic", area: "3_Mind", sci: ["#sci/Education"] },
        writing_skills:   { label: "Writing Skills", icon: "✍️", disc: "#disc/Writing", area: "5_Creativity", sci: ["#sci/Education", "#sci/Linguistics"] },
        local_history:    { label: "Local History", icon: "🏡", disc: "#disc/LocalHistory", area: "2_Relationship", sci: ["#sci/Education", "#sci/SocialSci"] },
        art_class:        { label: "Art Class", icon: "🎨", disc: "#disc/ArtClass", area: "5_Creativity", sci: ["#sci/Education", "#sci/Arts"] },
        physical_ed:      { label: "Physical Education", icon: "⚽", disc: "#disc/PhysicalEducation", area: "1_Selfcare", sci: ["#sci/Education", "#sci/SportSci"] },
        german_language:  { label: "German Language", icon: "🇩🇪", disc: "#disc/GermanLanguage", area: "5_Creativity", sci: ["#sci/Education"] },
        english_language: { label: "English Language", icon: "🇬🇧", disc: "#disc/EnglishLanguage", area: "5_Creativity", sci: ["#sci/Education"] },

        // --- 🧪 NATURAL SCIENCES (Area 1, 6, 7) ---
        biology:          { label: "Biology", icon: "🧬", disc: "#disc/Biology", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },
        microbiology:     { label: "Microbiology", icon: "🫫", disc: "#disc/Microbiology", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },
        genetics:         { label: "Genetics", icon: "🧬", disc: "#disc/Genetics", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },
        chemistry:        { label: "Chemistry", icon: "🧪", disc: "#disc/Chemistry", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },
        biochemistry:     { label: "Biochemistry", icon: "⚗️", disc: "#disc/Biochemistry", area: "1_Selfcare", sci: ["#sci/NaturalSci", "#sci/Med-and-HealthSci"] },
        physics:          { label: "Physics", icon: "⚛️", disc: "#disc/Physics", area: "6_Activity", sci: ["#sci/NaturalSci"] },
        quantum_mech:     { label: "Quantum Mechanics", icon: "🌀", disc: "#disc/QuantumMechanics", area: "7_Entertainment", sci: ["#sci/NaturalSci", "#sci/Philosophy"] },
        mathematics:      { label: "Mathematics", icon: "📐", disc: "#disc/Mathematics", area: "3_Mind", sci: ["#sci/NaturalSci"] },
        statistics:       { label: "Statistics", icon: "📊", disc: "#disc/Statistics", area: "3_Mind", sci: ["#sci/NaturalSci", "#sci/DataSci"] },
        astronomy:        { label: "Astronomy", icon: "🔭", disc: "#disc/Astronomy", area: "6_Activity", sci: ["#sci/NaturalSci"] },
        astrophysics:     { label: "Astrophysics", icon: "🌌", disc: "#disc/Astrophysics", area: "6_Activity", sci: ["#sci/NaturalSci"] },
        geology:          { label: "Geology", icon: "🌍", disc: "#disc/Geology", area: "1_Selfcare", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"] },
        ecology:          { label: "Ecology", icon: "🌱", disc: "#disc/Ecology", area: "1_Selfcare", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"] },
        meteorology:      { label: "Meteorology", icon: "⛈️", disc: "#disc/Meteorology", area: "6_Activity", sci: ["#sci/NaturalSci", "#sci/EnvironmentalSci"] },
        immunology:       { label: "Immunology", icon: "🛡️", disc: "#disc/Immunology", area: "1_Selfcare", sci: ["#sci/Med-and-HealthSci"] },
        botany:           { label: "Botany", icon: "🌻", disc: "#disc/Botany", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },
        zoology:          { label: "Zoology", icon: "🦁", disc: "#disc/Zoology", area: "1_Selfcare", sci: ["#sci/NaturalSci"] },

        // --- 🧘 WISDOM TRADITIONS & METAPHYSICS (Area 1, 2, 3, 4, 5, 6, 7) ---
        chakra_studies:   { label: "Chakra Studies", icon: "💠", disc: "#disc/ChakraStudies", area: "4_Organize", sci: ["#sci/Spirituality", "#sci/Metaphysics"] },
        chakra_1:         { label: "1. Root (Muladhara)", icon: "♥️", disc: "#disc/Chakra/Root", area: "1_Selfcare", sci: ["#sci/Spirituality"] },
        chakra_2:         { label: "2. Sacral (Svadhisthana)", icon: "🧡", disc: "#disc/Chakra/Sacral", area: "2_Relationship", sci: ["#sci/Spirituality"] },
        chakra_3:         { label: "3. Solar Plexus (Manipura)", icon: "💛", disc: "#disc/Chakra/SolarPlexus", area: "3_Mind", sci: ["#sci/Spirituality"] },
        chakra_4:         { label: "4. Heart (Anahata)", icon: "💚", disc: "#disc/Chakra/Heart", area: "4_Organize", sci: ["#sci/Spirituality"] },
        chakra_5:         { label: "5. Throat (Vishuddha)", icon: "💙", disc: "#disc/Chakra/Throat", area: "5_Creativity", sci: ["#sci/Spirituality"] },
        chakra_6:         { label: "6. Third Eye (Ajna)", icon: "💜", disc: "#disc/Chakra/ThirdEye", area: "6_Activity", sci: ["#sci/Spirituality"] },
        chakra_7:         { label: "7. Crown (Sahasrara)", icon: "🩷", disc: "#disc/Chakra/Crown", area: "7_Entertainment", sci: ["#sci/Spirituality"] },
        ayurveda:         { label: "Ayurveda", icon: "🍵", disc: "#disc/Ayurveda", area: "1_Selfcare", sci: ["#sci/TraditionalMedicine"] },
        tcm:              { label: "Traditional Chinese Med.", icon: "☯️", disc: "#disc/TCM", area: "1_Selfcare", sci: ["#sci/TraditionalMedicine"] },
        yoga_phi:         { label: "Yoga Philosophy", icon: "🧘🏽‍♀️", disc: "#disc/YogaPhilosophy", area: "7_Entertainment", sci: ["#sci/Spirituality", "#sci/Philosophy"] },
        hermetics:        { label: "Hermetics", icon: "✨", disc: "#disc/Hermetics", area: "7_Entertainment", sci: ["#sci/Metaphysics"] },
        alchemy:          { label: "Alchemy", icon: "⚗️", disc: "#disc/Alchemy", area: "7_Entertainment", sci: ["#sci/Metaphysics"] },
        astrology:        { label: "Astrology", icon: "🌌", disc: "#disc/Astrology", area: "6_Activity", sci: ["#sci/Metaphysics"] },
        kabbalah:         { label: "Kabbalah", icon: "🔯", disc: "#disc/Kabbalah", area: "7_Entertainment", sci: ["#sci/Metaphysics", "#sci/Spirituality"] },
        theosophy:        { label: "Theosophy", icon: "🕯️", disc: "#disc/Theosophy", area: "7_Entertainment", sci: ["#sci/Spirituality", "#sci/Metaphysics"] },
        meditation:       { label: "Meditation", icon: "🧘", disc: "#disc/Meditation", area: "7_Entertainment", sci: ["#sci/Spirituality"] },
        reiki:            { label: "Reiki", icon: "👐", disc: "#disc/Reiki", area: "1_Selfcare", sci: ["#sci/Spirituality", "#sci/TraditionalMedicine"] },
        shamanism:        { label: "Shamanism", icon: "🥁", disc: "#disc/Shamanism", area: "7_Entertainment", sci: ["#sci/Spirituality", "#sci/Metaphysics"] },

        // --- 📚 HUMANITIES & ACADEMIC LANGUAGES (Area 4, 5, 7) ---
        german_studies:   { label: "German Studies", icon: "🇩🇪", disc: "#disc/GermanStudies", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/Linguistics"] },
        english_studies:  { label: "English Studies", icon: "🇬🇧", disc: "#disc/EnglishStudies", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/Linguistics"] },
        latin_studies:    { label: "Latin Studies", icon: "🏛️", disc: "#disc/LatinStudies", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/Linguistics"] },
        romance_studies:  { label: "Romance Studies", icon: "🇫🇷", disc: "#disc/RomanceStudies", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/Linguistics"] },
        sanskrit_studies: { label: "Sanskrit Studies", icon: "🕉️", disc: "#disc/SanskritStudies", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/Linguistics"] },
        history:          { label: "History", icon: "📜", disc: "#disc/History", area: "4_Organize", sci: ["#sci/Humanities"] },
        philosophy:       { label: "Philosophy", icon: "🧠", disc: "#disc/Philosophy", area: "7_Entertainment", sci: ["#sci/Humanities", "#sci/Philosophy"] },
        ethics:           { label: "Ethics", icon: "⚖️", disc: "#disc/Ethics", area: "4_Organize", sci: ["#sci/Humanities", "#sci/Law", "#sci/Philosophy"] },
        theology:         { label: "Theology", icon: "🛐", disc: "#disc/Theology", area: "7_Entertainment", sci: ["#sci/Humanities", "#sci/Spirituality"] },
        mythology:        { label: "Mythology", icon: "🐉", disc: "#disc/Mythology", area: "7_Entertainment", sci: ["#sci/Humanities"] },
        archaeology:      { label: "Archaeology", icon: "🏺", disc: "#disc/Archaeology", area: "4_Organize", sci: ["#sci/Humanities"] },
        linguistics:      { label: "Linguistics", icon: "🗣️", disc: "#disc/Linguistics", area: "5_Creativity", sci: ["#sci/Humanities", "#sci/SocialSci", "#sci/Linguistics"] },
        logic:            { label: "Logic", icon: "🧩", disc: "#disc/Logic", area: "3_Mind", sci: ["#sci/Philosophy"] },
        literature:       { label: "Literature", icon: "📖", disc: "#disc/Literature", area: "5_Creativity", sci: ["#sci/Humanities"] },

        // --- 🧠 SOCIAL & BEHAVIORAL (Area 2, 3, 4) ---
        psychology:       { label: "Psychology", icon: "🎭", disc: "#disc/Psychology", area: "2_Relationship", sci: ["#sci/SocialSci"] },
        sociology:        { label: "Sociology", icon: "👥", disc: "#disc/Sociology", area: "2_Relationship", sci: ["#sci/SocialSci"] },
        politics:         { label: "Political Science", icon: "🏛️", disc: "#disc/PoliticalScience", area: "4_Organize", sci: ["#sci/SocialSci", "#sci/Law"] },
        economics:        { label: "Economics", icon: "💰", disc: "#disc/Economics", area: "3_Mind", sci: ["#sci/BusinessAdmin"] },
        management:       { label: "Business Admin.", icon: "📈", disc: "#disc/BusinessAdmin", area: "3_Mind", sci: ["#sci/BusinessAdmin"] },
        law:              { label: "Law", icon: "⚖️", disc: "#disc/Law", area: "4_Organize", sci: ["#sci/Law"] },
        pedagogy:         { label: "Pedagogy", icon: "🎓", disc: "#disc/Pedagogy", area: "2_Relationship", sci: ["#sci/Education"] },
        criminology:      { label: "Criminology", icon: "🔍", disc: "#disc/Criminology", area: "2_Relationship", sci: ["#sci/SocialSci"] },
        anthropology:     { label: "Anthropology", icon: "💀", disc: "#disc/Anthropology", area: "2_Relationship", sci: ["#sci/SocialSci"] },

        // --- 🏥 MEDICINE & HEALTH (Area 1, 6) ---
        medicine:         { label: "Medicine", icon: "🏥", disc: "#disc/Medicine", area: "1_Selfcare", sci: ["#sci/HealthSci"] },
        neuroscience:     { label: "Neuroscience", icon: "🧠", disc: "#disc/Neuroscience", area: "6_Activity", sci: ["#sci/HealthSci"] },
        anatomy:          { label: "Anatomy", icon: "🦴", disc: "#disc/Anatomy", area: "1_Selfcare", sci: ["#sci/HealthSci", "#sci/SportSci"] },
        nutrition:        { label: "Nutrition", icon: "🍎", disc: "#disc/Nutrition", area: "1_Selfcare", sci: ["#sci/HealthSci"] },
        pharmacy:         { label: "Pharmacy", icon: "💊", disc: "#disc/Pharmacy", area: "1_Selfcare", sci: ["#sci/HealthSci"] },
        sport_science:    { label: "Sports Science", icon: "🏃", disc: "#disc/SportsScience", area: "1_Selfcare", sci: ["#sci/SportSci"] },
        psychiatry:       { label: "Psychiatry", icon: "🛋️", disc: "#disc/Psychiatry", area: "2_Relationship", sci: ["#sci/HealthSci"] },

        // --- 💾 TECHNOLOGY & ENGINEERING (Area 3, 6) ---
        computer_sci:     { label: "Computer Science", icon: "💾", disc: "#disc/ComputerScience", area: "3_Mind", sci: ["#sci/InformationSci", "#sci/DataSci"] },
        ai:               { label: "Artificial Intelligence", icon: "🤖", disc: "#disc/AI", area: "6_Activity", sci: ["#sci/InformationSci", "#sci/Engineering"] },
        cyber_sec:        { label: "Cyber Security", icon: "🌐", disc: "#disc/CyberSecurity", area: "3_Mind", sci: ["#sci/InformationSci", "#sci/Law"] },
        engineering:      { label: "Engineering", icon: "⚙️", disc: "#disc/Engineering", area: "6_Activity", sci: ["#sci/Engineering"] },
        robotics:         { label: "Robotics", icon: "🦾", disc: "#disc/Robotics", area: "6_Activity", sci: ["#sci/Engineering"] },
        architecture:     { label: "Architecture", icon: "🏗️", disc: "#disc/Architecture", area: "6_Activity", sci: ["#sci/Engineering", "#sci/Arts"] },
        data_science:     { label: "Data Science", icon: "📊", disc: "#disc/DataScience", area: "3_Mind", sci: ["#sci/InformationSci", "#sci/DataSci"] },

        // --- 🛠️ APPLIED SKILLS (Area 1, 3, 4) ---
        craftsmanship:    { label: "Craftsmanship", icon: "🔨", disc: "#disc/Craftsmanship", area: "1_Selfcare", sci: ["#sci/AppliedSci"] },
        culinary_arts:    { label: "Culinary Arts", icon: "🍳", disc: "#disc/CulinaryArts", area: "1_Selfcare", sci: ["#sci/AppliedSci"] },
        agriculture:      { label: "Agriculture", icon: "🚜", disc: "#disc/Agriculture", area: "1_Selfcare", sci: ["#sci/AppliedSci", "#sci/EnvironmentalSci"] },
        biohacking:       { label: "Biohacking", icon: "⚡", disc: "#disc/Biohacking", area: "1_Selfcare", sci: ["#sci/AppliedSci", "#sci/NaturalSci"] },
        finance:          { label: "Finance", icon: "💵", disc: "#disc/Finance", area: "3_Mind", sci: ["#sci/BusinessAdmin", "#sci/AppliedSci"] },
        sustainability:   { label: "Sustainability", icon: "♻️", disc: "#disc/Sustainability", area: "4_Organize", sci: ["#sci/AppliedSci", "#sci/EnvironmentalSci"] },

        // --- 🎨 ARTS & CREATIVITY (Area 5, 7) ---
        art_history:      { label: "Art History", icon: "🎨", disc: "#disc/ArtHistory", area: "5_Creativity", sci: ["#sci/Arts", "#sci/Humanities"] },
        musicology:       { label: "Musicology", icon: "🎶", disc: "#disc/Musicology", area: "5_Creativity", sci: ["#sci/Arts"] },
        design:           { label: "Design", icon: "🖌️", disc: "#disc/Design", area: "5_Creativity", sci: ["#sci/Arts"] },
        photography:      { label: "Photography", icon: "📸", disc: "#disc/Photography", area: "5_Creativity", sci: ["#sci/Arts"] },
        film_studies:     { label: "Film Studies", icon: "🎬", disc: "#disc/FilmStudies", area: "7_Entertainment", sci: ["#sci/Arts"] },
        media_studies:    { label: "Media Studies", icon: "📱", disc: "#disc/MediaStudies", area: "5_Creativity", sci: ["#sci/SocialSci"] }
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