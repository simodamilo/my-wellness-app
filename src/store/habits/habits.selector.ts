import type { RootState } from "../reducer.config";
import type { Habit } from "./types";

const getHabits = (state: RootState): Habit[] => {
    return state.habits.habits;
};

export const exercisesSelectors = {
    getHabits,
};
