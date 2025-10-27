export type InputsState = {
    inputs: Input[];
    lastInput?: Input;
    isLoading: boolean;
    isError: boolean;
};

export interface Input {
    id: string;
    mood?: string;
    energyLevel?: number;
    bodyFeeling?: number;
    bodyFeelingDiscomfort?: string[];
    habits?: string[];
    periodInfo?: string;
    notes?: string;
    sleep?: number;
    nutritionQuality?: string;
    createdAt?: number;
}

export interface InputPayload {
    id: string;
    mood?: string;
    energy_level?: number;
    body_feeling?: number;
    body_feeling_discomfort?: string[];
    habits?: string[];
    period_info?: string;
    notes?: string;
    sleep?: number;
    nutrition_quality?: string;
    created_at?: number;
}
