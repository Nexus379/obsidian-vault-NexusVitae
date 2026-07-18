function inpraEngine() {
    // 🎼 The 4 quality dimensions of instrumental practice (Posture/Rhythm/Melody/Feeling)
    const DIMENSIONS = {
        posture: { label: "Posture", icon: "🧍", desc: "Body/hand/finger position, technique" },
        rhythm:  { label: "Rhythm",  icon: "🥁", desc: "Timing, sense of beat, evenness" },
        melody:  { label: "Melody",  icon: "🎵", desc: "Correct notes, intonation" },
        feeling: { label: "Feeling", icon: "💗", desc: "Expression, dynamics, musicality" }
    };

    // 🎯 Mastery scale 1-5 (identical to the scale in weekplan_inpra)
    const MASTERY = {
        1: { label: "Beginner", desc: "Lots of pausing, fingers searching, unsteady rhythm" },
        2: { label: "Familiar", desc: "Slow, but full cognitive effort" },
        3: { label: "Solid",    desc: "Smooth at moderate tempo, few mistakes" },
        4: { label: "Flow",     desc: "Almost plays itself, dynamics come naturally" },
        5: { label: "Mastery",  desc: "Perfect — expression instead of notes" }
    };

    return {
        dimensions: DIMENSIONS,
        mastery: MASTERY,

        // Holt die geplanten Übungen/Stücke EINES Tages aus einem Plan (weekplan_inpra oder Master).
        // page = dv.page(...), dayPrefix = "mon".."sun". 3 Slots: inpra_<day>_ex_1..3 (Text) + _lvl_1..3 (Mastery).
        getPractice: (page, dayPrefix) => {
            const items = [];
            for (let i = 1; i <= 3; i++) {
                const ex = page[`inpra_${dayPrefix}_ex_${i}`];
                if (ex && String(ex).trim() !== "") {
                    items.push({
                        slot: i,
                        exercise: String(ex).trim(),
                        mastery: Number(page[`inpra_${dayPrefix}_lvl_${i}`]) || 0
                    });
                }
            }
            return items;
        },

        // Progression: Ø-Qualität (oder Mastery) >= 4 → reif fürs nächste Stück/Level.
        readyToAdvance: (value) => Number(value) >= 4,

        // Ø der 4 Dimensionen (für die Log-Auswertung)
        avgQuality: (posture, rhythm, melody, feeling) => {
            const vals = [posture, rhythm, melody, feeling].map(Number).filter(n => n > 0);
            return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        }
    };
}
module.exports = inpraEngine;
