import { createReducer } from "@reduxjs/toolkit";
import type { Input, InputPayload, InputsState } from "./types";
import { inputsActions } from "./inputs.action";
import { InputMapper } from "./inputs.mapper";

const inputsState: InputsState = {
    inputs: [],
    isLoading: false,
    isError: false,
};

export const inputsReducer = {
    inputs: createReducer(inputsState, (builder) => {
        builder
            .addCase(inputsActions.getInputs.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(inputsActions.getInputs.fulfilled, (state, action) => {
                const { inputs } = action.payload;
                const mappedInputs: Input[] = [];
                inputs.forEach((input: InputPayload) => {
                    mappedInputs.push(InputMapper(input));
                });

                return {
                    ...state,
                    inputs: mappedInputs,
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(inputsActions.getInputs.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            })
            .addCase(inputsActions.getLastInput.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(inputsActions.getLastInput.fulfilled, (state, action) => {
                const { inputs } = action.payload;
                if (!inputs) {
                    return {
                        ...state,
                        isLoading: false,
                        isError: false,
                    };
                }
                const mappedInput: Input = InputMapper(inputs);

                const latestTimestamp = mappedInput.createdAt;
                const latestDate = new Date(latestTimestamp!);

                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

                const isToday = latestDate >= startOfToday && latestDate < endOfToday;

                return {
                    ...state,
                    lastInput: isToday ? mappedInput : undefined,
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(inputsActions.getLastInput.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            })
            .addCase(inputsActions.addInput.pending, (state) => {
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                };
            })
            .addCase(inputsActions.addInput.fulfilled, (state, action) => {
                const { inputs } = action.payload;
                console.log("Added input response:", inputs);
                const mappedInputs: Input[] = [];
                inputs.forEach((input: InputPayload) => {
                    mappedInputs.push(InputMapper(input));
                });

                return {
                    ...state,
                    inputs: mappedInputs,
                    isLoading: false,
                    isError: false,
                };
            })
            .addCase(inputsActions.addInput.rejected, (state) => {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            });
    }),
};
