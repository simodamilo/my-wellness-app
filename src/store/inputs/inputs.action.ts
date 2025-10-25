import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Input, InputPayload } from "./types";
import { getNotificationApi } from "../../utils/notificationService";

const getInputs = createAsyncThunk("data/getInputs", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("daily_entries").select();
        if (error) {
            throw Error("Error in get inputs");
        }

        return { inputs: data as InputPayload[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const getLastInput = createAsyncThunk("data/getLastInput", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("daily_entries").select().order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (error) {
            throw Error("Error in get inputs");
        }

        return { inputs: data as InputPayload };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addInput = createAsyncThunk("data/addInput", async (input: Input, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("daily_entries")
            .upsert([
                {
                    id: input.id,
                    mood: input.mood,
                    energy_level: input.energyLevel,
                    body_feeling: input.bodyFeeling,
                    body_feeling_discomfort: input.bodyFeelingDiscomfort,
                    habits: input.habits,
                    period_info: input.periodInfo,
                    notes: input.notes,
                    sleep: input.sleep,
                    nutrition_quality: input.nutritionQuality,
                },
            ])
            .select();

        getNotificationApi().success({
            message: "Data saved successfully",
            placement: "bottom",
            className: "custom-success-notification",
        });

        return { inputs: data as InputPayload[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in adding new input", error.message);
        getNotificationApi().error({
            message: "Error in adding new input",
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const inputsActions = {
    getInputs,
    getLastInput,
    addInput,
};

export { inputsActions };
