import { combineReducers, type Action } from "redux";
import { habitsReducer } from "./habits/habits.reducer";
import { inputsReducer } from "./inputs/inputs.reducer";

const appReducer = combineReducers({
    ...habitsReducer,
    ...inputsReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: Action) => {
    if (action.type === "RESET_STORE") {
        state = undefined;
    }
    return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
