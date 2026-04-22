import type { Habit, HabitPayload } from "./types";

export const HabitMapper = (habitResponse: HabitPayload): Habit => {
    return {
        id: habitResponse.id,
        name: habitResponse.name,
        emoji: habitResponse.emoji,
        deletedAt: habitResponse.deleted_at ?? null,
    };
};
