export type HabitsState = {
    habits: Habit[];
    isLoading: boolean;
    isError: boolean;
};

export interface Habit {
    id: string;
    name: string;
    emoji: string;
    deletedAt?: string | null;
}

export interface HabitPayload {
    id: string;
    name: string;
    emoji: string;
    deleted_at?: string | null;
}
