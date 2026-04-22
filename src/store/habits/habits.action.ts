import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Habit, HabitPayload } from "./types";
import { HabitMapper } from "./habits.mapper";

// Fetches all habits including soft-deleted ones. Active habits are
// those with deleted_at = null; deleted ones are kept so history
// (WeeklyRecap, Dashboard) can still resolve their name + emoji.
const getHabits = createAsyncThunk("data/getHabits", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("habits").select();
        if (error) {
            throw Error("Error in get habits");
        }

        const habits = (data as HabitPayload[]).map(HabitMapper);
        return { habits };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addHabit = createAsyncThunk(
    "data/addHabit",
    async (habit: { id: string; name: string; emoji: string }, thunkAPI) => {
        try {
            const { data } = await supabase.from("habits").insert([habit]).select();
            return (data as HabitPayload[]).map(HabitMapper) as Habit[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const updateHabit = createAsyncThunk(
    "data/updateHabit",
    async (habit: { id: string; name: string; emoji: string }, thunkAPI) => {
        try {
            const { data } = await supabase
                .from("habits")
                .update({ name: habit.name, emoji: habit.emoji })
                .eq("id", habit.id)
                .select();
            const mapped = (data as HabitPayload[]).map(HabitMapper);
            return mapped[0] as Habit;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Soft delete: set deleted_at instead of removing the row, so past
// daily_entries that reference this habit can still resolve its label.
const deleteHabit = createAsyncThunk("data/deleteHabit", async (id: string, thunkAPI) => {
    try {
        const deletedAt = new Date().toISOString();
        await supabase.from("habits").update({ deleted_at: deletedAt }).eq("id", id);
        return { id, deletedAt };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const habitsActions = {
    getHabits,
    addHabit,
    updateHabit,
    deleteHabit,
};

export { habitsActions };
