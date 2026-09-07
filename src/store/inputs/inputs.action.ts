import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Input, InputPayload } from "./types";
import { getNotificationApi } from "../../utils/notificationService";
import { showSaveToast } from "../../components/saveToast/SaveToast";
import { negate } from "./inputs.mapper";

const getInputs = createAsyncThunk("data/getInputs", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("daily_entries").select("*").order("created_at", { ascending: true });
        if (error) {
            throw Error("Error in get inputs");
        }

        return { inputs: data as InputPayload[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Today's date in Europe/Rome, formatted as YYYY-MM-DD to match the `log_date` column.
const getTodayLogDate = (): string => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());

const getLastInput = createAsyncThunk("data/getLastInput", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("daily_entries").select().eq("log_date", getTodayLogDate()).maybeSingle();
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
        const { data, error } = await supabase
            .from("daily_entries")
            .upsert(
                [
                    {
                        id: input.id,
                        mood: input.mood,
                        mood_notes: input.moodNotes,
                        energy_level: input.energyLevel,
                        flat_belly: negate(input.bloatedBelly),
                        body_feeling: input.bodyFeeling,
                        body_feeling_discomfort: input.bodyFeelingDiscomfort,
                        habits: input.habits,
                        period_info: input.periodInfo,
                        notes: input.notes,
                        sleep: input.sleep,
                        nutrition_quality: input.nutritionQuality,
                        nutrition_notes: input.nutritionNotes,
                    },
                ],
                { onConflict: "user_id,log_date" }
            )
            .select();

        if (error) {
            throw Error(error.message);
        }

        showSaveToast();

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

type BulkUpsertRow = {
    id: string;
    habits: string[];
    created_at?: number;
};

const bulkUpsertInputs = createAsyncThunk("data/bulkUpsertInputs", async (rows: BulkUpsertRow[], thunkAPI) => {
    try {
        const { error } = await supabase.from("daily_entries").upsert(rows, { onConflict: "user_id,log_date" });
        if (error) {
            throw Error("Error in bulk upsert inputs");
        }

        showSaveToast();

        await thunkAPI.dispatch(getInputs());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in bulk upsert inputs", error.message);
        getNotificationApi().error({
            message: "Error in saving changes",
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
    bulkUpsertInputs,
};

export { inputsActions };
