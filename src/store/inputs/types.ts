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
    bodyFeeling?: string;
    habits?: string[];
    periodInfo?: string;
    notes?: string;
    sleep?: string;
    nutritionQuality?: string;
    createdAt?: number;
}

export interface InputPayload {
    id: string;
    mood?: string;
    energy_level?: number;
    body_feeling?: string;
    habits?: string[];
    period_info?: string;
    notes?: string;
    sleep?: string;
    nutrition_quality?: string;
    created_at?: number;
}
