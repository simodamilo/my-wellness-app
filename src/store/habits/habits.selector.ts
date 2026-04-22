import type { RootState } from "../reducer.config";
import type { Habit } from "./types";

// All habits including soft-deleted — needed to resolve labels for
// historical daily_entries that reference a removed habit.
const getAllHabits = (state: RootState): Habit[] => {
    return state.habits.habits;
};

// Active habits only — used by Settings catalog and the daily-entry selector.
const getHabits = (state: RootState): Habit[] => {
    return state.habits.habits.filter((h) => !h.deletedAt);
};

const isLoading = (state: RootState): boolean => {
    return state.habits.isLoading;
};

export const habitsSelectors = {
    getHabits,
    getAllHabits,
    isLoading,
};
