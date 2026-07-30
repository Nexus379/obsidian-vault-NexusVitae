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

        // Reads the planned exercises/pieces of ONE day from a plan (weekplan_inpra or master).
        // page = dv.page(...), dayPrefix = "mon".."sun". 3 planned slots: inpra_<day>_ex_1..3 + _min_1..3.
        getPractice: (page, dayPrefix) => {
            const items = [];
            for (let i = 1; i <= 3; i++) {
                const ex = page[`inpra_${dayPrefix}_ex_${i}`];
                if (ex && String(ex).trim() !== "") {
                    items.push({
                        slot: i,
                        exercise: String(ex).trim(),
                        minutes: Number(page[`inpra_${dayPrefix}_min_${i}`]) || 0
                    });
                }
            }
            return items;
        },

        // Progression: average quality (or mastery) >= 4 → ready for the next piece/level.
        readyToAdvance: (value) => Number(value) >= 4,

        // Average of the four dimensions (for the log evaluation)
        avgQuality: (posture, rhythm, melody, feeling) => {
            const vals = [posture, rhythm, melody, feeling].map(Number).filter(n => n > 0);
            return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        },

        // Single source of truth for "minutes practiced today": sum of the per-piece fields
        // inpra_min_1..N from an Inpra log page. dailyplm / reviews / chakra-time only MIRROR this
        // total live (like fitnessEngine.parseWorkoutCompletion) — nothing is stored on the day note.
        parseInpraMinutes: (page) => {
            if (!page) return 0;
            let total = 0;
            for (const key of Object.keys(page)) {
                if (/^inpra_min_\d+$/.test(key)) total += Number(page[key]) || 0;
            }
            return total;
        }
    };
}
module.exports = inpraEngine;
