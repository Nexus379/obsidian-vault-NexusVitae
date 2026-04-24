// zData/2scripts/personaEngine.js
function personaEngine() {
    const PERSONA = {
        // --- 🧬 PLM: Physical & Life Management ---
        guardian:    { icon: "👪", label: "Guardian"},
        warrior:     { icon: "🏃", label: "Warrior"},
        nurturer:    { icon: "🍲", label: "Nurturer"},
        parent:      { icon: "🤱", label: "Mum/Dad"},
        child:       { icon: "👧", label: "Daughter/Son"},
        sibling:     { icon: "👫", label: "Sis/Bro"},
        partner:     { icon: "🦄", label: "Partner"},
        friend:      { icon: "🤝", label: "Friend"},
        lover:       { icon: "🕯️", label: "Lover"},
        host:        { icon: "🍷", label: "Host"},
        traveler:    { icon: "🚵🏽", label: "Traveler"},

        // --- 🧠 PKM: Personal Knowledge Management ---
        worker:      { icon: "💼", label: "Worker"},
        student:     { icon: "🎓", label: "Student"},
        trainer:     { icon: "🏋️", label: "Trainer"},
        analyst:     { icon: "🧪", label: "Analyst"},
        strategist:  { icon: "♟️", label: "Strategist"},
        researcher:  { icon: "🔬", label: "Researcher"},
        archivist:   { icon: "🗄️", label: "Archivist"},
        technician:  { icon: "🛠️", label: "Technician"},
        player:      { icon: "🕹️", label: "Player"},
        alchemist:   { icon: "⚗️", label: "Alchemist"},
        seeker:      { icon: "✨", label: "Seeker"},
        mystic:      { icon: "🌌", label: "Mystic"},
        monk_nun:    { icon: "🧘", label: "Monk/Nun"},

        // --- ⚙️ PPM: Project & Productivity Management ---
        organizer:   { icon: "☯️", label: "Organizer"},
        healer:      { icon: "🩹", label: "Healer"},
        queen_king:  { icon: "👑", label: "Queen/King"}, // Dein Klassiker!
        diplomat:    { icon: "🕊️", label: "Diplomat"},
        creator:     { icon: "🎨", label: "Creator"},
        teacher:     { icon: "🗣️", label: "Teacher"},
        author:      { icon: "✍️", label: "Author"},
        speaker:     { icon: "🎤", label: "Speaker",},
        visionary:   { icon: "👁️", label: "Visionary"},
        explorer:    { icon: "🧭", label: "Explorer",},
        architect:   { icon: "🏗️", label: "Architect"},
        entrepreneur:{ icon: "🚀", label: "Entrepreneur"},
        mentor:      { icon: "🦉", label: "Mentor"},
        critic:      { icon: "🧐", label: "Critic/Reviewer"}
    };

const AXIS_GROUPS = {
    "PLM": ["guardian", "warrior", "nurturer", "parent", "child", "sibling", "partner", "friend", "lover", "traveler", "player", "monk_nun"],
    "PPM": ["worker", "trainer", "strategist", "organizer", "queen_king", "diplomat", "visionary", "architect"],
    "PKM": ["student", "analyst", "creator", "teacher", "author", "speaker", "explorer", "alchemist", "seeker", "mystic"]
    };
	
    // 🔱 DNA-Mapping: Berechnung findet nur beim Laden statt
    const personaToAxisMap = {};
    for (const [axisName, pList] of Object.entries(AXIS_GROUPS)) {
        pList.forEach(pKey => {
            // Hier speichern wir die Axis direkt im Mapping, damit der Zugriff später instant ist
            personaToAxisMap[pKey] = axisName;
        });
    }
    return {
        all: PERSONA,
        groups: AXIS_GROUPS,
        
        // Label-Helper für Suggester
        getPersonaLabels: () => Object.keys(PERSONA).sort().map(k => ({ key: k, ...PERSONA[k] })),
        
        // DNA-Helper: Gibt die Achse für eine Persona zurück
        getAxis: (pKey) => personaToAxisMap[pKey] || "Unknown"
    };
}
module.exports = personaEngine;
