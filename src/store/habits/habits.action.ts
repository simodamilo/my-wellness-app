import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Habit, HabitPayload } from "./types";

const getHabits = createAsyncThunk("data/getHabits", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("habits").select();
        if (error) {
            throw Error("Error in get habits");
        }

        return { habits: data as HabitPayload[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addHabit = createAsyncThunk("data/addHabit", async (habit: HabitPayload, thunkAPI) => {
    try {
        const { data } = await supabase.from("habits").insert([habit]).select();
        return data as Habit[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteHabit = createAsyncThunk("data/deleteHabit", async (id: string, thunkAPI) => {
    try {
        await supabase.from("habits").delete().eq("id", id);
        return id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const habitsActions = {
    getHabits,
    addHabit,
    deleteHabit,
};

export { habitsActions };
