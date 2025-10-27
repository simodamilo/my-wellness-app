import type { Input, InputPayload } from "./types";

export const InputMapper = (inputResponse: InputPayload): Input => {
    console.log("TEST inputResponse.habits", inputResponse.habits);
    return {
        id: inputResponse.id,
        mood: inputResponse.mood,
        energyLevel: inputResponse.energy_level,
        bodyFeeling: inputResponse.body_feeling,
        bodyFeelingDiscomfort: inputResponse.body_feeling_discomfort,
        habits: inputResponse.habits,
        periodInfo: inputResponse.period_info,
        notes: inputResponse.notes,
        sleep: inputResponse.sleep,
        nutritionQuality: inputResponse.nutrition_quality,
        createdAt: inputResponse.created_at,
    };
};
