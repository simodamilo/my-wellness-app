import { createReducer } from "@reduxjs/toolkit";
import type { ExercisesState } from "./types";
import { exercisesCatalogActions } from "./exercisesCatalog.action";

const exercisesState: ExercisesState = {
    exercises: [],
    showCreationModal: false,
    isLoading: false,
    isError: false,
};

export const exercisesReducer = {
    exercises: createReducer(exercisesState, (builder) => {
        builder.addCase(exercisesCatalogActions.manageCreateModal, (state, action) => {
            state.showCreationModal = action.payload;
        });
    }),
};
