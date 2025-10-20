import type { RootState } from "../reducer.config";
import type { Input } from "./types";

const getLastInput = (state: RootState): Input | undefined => {
    return state.inputs.lastInput;
};

const getIsLoading = (state: RootState): boolean => {
    return state.inputs.isLoading;
};

export const inputsSelectors = {
    getLastInput,
    getIsLoading,
};
