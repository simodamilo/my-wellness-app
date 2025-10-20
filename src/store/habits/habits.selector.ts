import type { RootState } from "../reducer.config";
import type { Habit } from "./types";

const getHabits = (state: RootState): Habit[] => {
    return state.habits.habits;
};

const isLoading = (state: RootState): boolean => {
    return state.habits.isLoading;
};

export const habitsSelectors = {
    getHabits,
    isLoading,
};
