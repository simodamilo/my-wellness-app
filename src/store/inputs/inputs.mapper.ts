import type { Input, InputPayload } from "./types";

// Some legacy rows store created_at in milliseconds instead of seconds.
// Normalize everything to seconds so downstream date math stays sane.
const toSeconds = (ts?: number): number | undefined => {
    if (ts === undefined || ts === null) return undefined;
    return ts > 1e11 ? Math.floor(ts / 1000) : ts;
};

// The DB still stores the legacy `flat_belly` boolean, while the UI now asks the
// inverse question ("bloated"). Flip it on the way in/out, keeping null/undefined
// as "not answered" instead of turning it into a value.
export const negate = (value?: boolean | null): boolean | undefined => {
    if (value === undefined || value === null) return undefined;
    return !value;
};

export const InputMapper = (inputResponse: InputPayload): Input => {
    return {
        id: inputResponse.id,
        mood: inputResponse.mood,
        moodNotes: inputResponse.mood_notes,
        energyLevel: inputResponse.energy_level,
        bloatedBelly: negate(inputResponse.flat_belly),
        bodyFeeling: inputResponse.body_feeling,
        bodyFeelingDiscomfort: inputResponse.body_feeling_discomfort,
        habits: inputResponse.habits,
        periodInfo: inputResponse.period_info,
        notes: inputResponse.notes,
        sleep: inputResponse.sleep,
        nutritionQuality: inputResponse.nutrition_quality,
        nutritionNotes: inputResponse.nutrition_notes,
        createdAt: toSeconds(inputResponse.created_at),
    };
};
