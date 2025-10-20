export type HabitsState = {
    habits: Habit[];
    isLoading: boolean;
    isError: boolean;
};

export interface Habit {
    id: string;
    name: string;
}

export interface HabitPayload {
    id: string;
    name: string;
}
