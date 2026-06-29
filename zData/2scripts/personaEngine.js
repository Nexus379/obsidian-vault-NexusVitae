// zData/2scripts/personaEngine.js
function personaEngine() {
    const PERSONA = {
        // --- 🧬 PLM: Physical & Life Management ---
        guardian:    { icon: "👪", label: "Guardian"},
        warrior:     { icon: "🏃", label: "Warrior"},
        nurturer:    { icon: "🍲", label: "Nurturer"},
        caretaker:   { icon: "🤲", label: "Caretaker"},
        parent:      { icon: "🤱", label: "Mum/Dad"},
        child:       { icon: "👧", label: "Daughter/Son"},
        sibling:     { icon: "👫", label: "Sis/Bro"},
        partner:     { icon: "🦄", label: "Partner"},
        friend:      { icon: "🤝", label: "Friend"},
        lover:       { icon: "🕯️", label: "Lover"},
        host:        { icon: "🍷", label: "Host"},
        traveler:    { icon: "🚵🏽", label: "Traveler"},
        player:      { icon: "🕹️", label: "Player"},
        monk_nun:    { icon: "🧘", label: "Monk/Nun"},

        // --- ⚙️ PPM: Project & Productivity Management ---
        worker:      { icon: "💼", label: "Worker"},
        trainer:     { icon: "🏋️", label: "Trainer"},
        strategist:  { icon: "♟️", label: "Strategist"},
        organizer:   { icon: "☯️", label: "Organizer"},
        healer:      { icon: "🩹", label: "Healer"},
        queen_king:  { icon: "👑", label: "Queen/King"},
        diplomat:    { icon: "🕊️", label: "Diplomat"},
        advocate:    { icon: "⚖️", label: "Advocate"},
        visionary:   { icon: "👁️", label: "Visionary"},
        architect:   { icon: "🏗️", label: "Architect"},
        engineer:    { icon: "⚙️", label: "Engineer"},
        entrepreneur:{ icon: "🚀", label: "Entrepreneur"},
        mentor:      { icon: "🦉", label: "Mentor"},
        critic:      { icon: "🧐", label: "Critic/Reviewer"},
        artisan:     { icon: "✂️", label: "Artisan"},

        // --- 🧠 PKM: Personal Knowledge Management ---
        student:     { icon: "🎓", label: "Student"},
        scholar:     { icon: "📜", label: "Scholar"},
        philosopher: { icon: "🦉", label: "Philosopher"},
        analyst:     { icon: "🧪", label: "Analyst"},
        researcher:  { icon: "🔬", label: "Researcher"},
        archivist:   { icon: "🗄️", label: "Archivist"},
        technician:  { icon: "🛠️", label: "Technician"},
        creator:     { icon: "🎨", label: "Creator"},
        teacher:     { icon: "🗣️", label: "Teacher"},
        author:      { icon: "✍️", label: "Author"},
        speaker:     { icon: "🎤", label: "Speaker"},
        explorer:    { icon: "🧭", label: "Explorer"},
        alchemist:   { icon: "⚗️", label: "Alchemist"},
        seeker:      { icon: "✨", label: "Seeker"},
        mystic:      { icon: "🌌", label: "Mystic"}
    };

const AXIS_GROUPS = {
    "PLM": [
        "guardian", "warrior", "nurturer", "caretaker", "parent", "child", 
        "sibling", "partner", "friend", "lover", "host", "traveler", 
        "player", "monk_nun"
    ],
    "PPM": [
        "worker", "trainer", "strategist", "organizer", "healer", "queen_king", 
        "diplomat", "advocate", "visionary", "architect", "engineer", "entrepreneur", 
        "mentor", "critic", "artisan"
    ],
    "PKM": [
        "student", "scholar", "philosopher", "analyst", "researcher", "archivist", 
        "technician", "creator", "teacher", "author", "speaker", "explorer", 
        "alchemist", "seeker", "mystic"
    ]
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
