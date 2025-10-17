import type { RootState } from "../reducer.config";

const isModalOpen = (state: RootState): boolean => {
    return state.exercises.showCreationModal;
};

export const exercisesSelectors = {
    isModalOpen,
};
