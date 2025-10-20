import { createReducer } from "@reduxjs/toolkit";
import type { HabitPayload, HabitsState } from "./types";
import { habitsActions } from "./habits.action";
import { HabitMapper } from "./habits.mapper";

const habitsState: HabitsState = {
    habits: [],
    isLoading: false,
    isError: false,
};

export const habitsReducer = {
    habits: createReducer(habitsState, (builder) => {
        builder
            .addCase(habitsActions.getHabits.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(habitsActions.getHabits.fulfilled, (state, action) => {
                const { habits } = action.payload;
                habits.map((habit: HabitPayload) => {
                    return HabitMapper(habit);
                });

                return {
                    ...state,
                    habits,
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(habitsActions.getHabits.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            })
            .addCase(habitsActions.addHabit.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(habitsActions.addHabit.fulfilled, (state, action) => {
                return {
                    ...state,
                    habits: [...state.habits, ...action.payload],
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(habitsActions.addHabit.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            })
            .addCase(habitsActions.deleteHabit.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(habitsActions.deleteHabit.fulfilled, (state, action) => {
                return {
                    ...state,
                    habits: [...state.habits.filter((habit) => habit.id !== action.payload)],
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(habitsActions.deleteHabit.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            });
    }),
};
