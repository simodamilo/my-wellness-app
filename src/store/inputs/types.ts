export type InputsState = {
    inputs: Input[];
    lastInput?: Input;
    isLoading: boolean;
    isError: boolean;
};

export interface Input {
    id: string;
    mood?: number;
    energyLevel?: number;
    bodyFeeling?: number;
    bodyFeelingDiscomfort?: string[];
    habits?: string[];
    periodInfo?: boolean;
    notes?: string;
    sleep?: number;
    nutritionQuality?: string;
    createdAt?: number;
}

export interface InputPayload {
    id: string;
    mood?: number;
    energy_level?: number;
    body_feeling?: number;
    body_feeling_discomfort?: string[];
    habits?: string[];
    period_info?: boolean;
    notes?: string;
    sleep?: number;
    nutrition_quality?: string;
    created_at?: number;
}
