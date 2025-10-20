import type { Input, InputPayload } from "./types";

export const InputMapper = (inputResponse: InputPayload): Input => {
    return {
        id: inputResponse.id,
        mood: inputResponse.mood,
        energyLevel: inputResponse.energy_level,
        bodyFeeling: inputResponse.body_feeling,
        habits: inputResponse.habits,
        periodInfo: inputResponse.period_info,
        notes: inputResponse.notes,
        sleep: inputResponse.sleep,
        nutritionQuality: inputResponse.nutrition_quality,
        createdAt: inputResponse.created_at,
    };
};
