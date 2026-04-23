import { useEffect, useRef, useState } from "react";
import { BodyFeeling } from "../../components/bodyFeeling/BodyFeeling";
import { CardContainer } from "../../components/cardContainer/CardContainer";
import { Habits } from "../../components/habits/Habits";
import { Mood } from "../../components/mood/Mood";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../store";
import { inputsSelectors } from "../../store/inputs/inputs.selector";
import type { Input } from "../../store/inputs/types";
import { v4 as uuidv4 } from "uuid";
import { inputsActions } from "../../store/inputs/inputs.action";
import { Spin } from "antd";
import { PeriodInfo } from "../../components/periodInfo/PeriodInfo";
import { Sleep } from "../../components/sleep/Sleep";
import { BodyFeelingDiscomfort } from "../../components/bodyFeeling/BodyFeelingDiscomfort";
import { Nutrition } from "../../components/nutrition/Nutrition";
import { useTranslation } from "react-i18next";

export const Homepage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latestInputRef = useRef<Input | undefined>(undefined);
    const hasPendingSaveRef = useRef<boolean>(false);

    const [input, setInput] = useState<Input>();
    const [isInputUpdated, setIsInputUpdated] = useState<boolean>(false);

    const lastInput = useSelector((state: RootState) => inputsSelectors.getLastInput(state));
    const isLoading = useSelector((state: RootState) => inputsSelectors.getIsLoading(state));

    useEffect(() => {
        dispatch(inputsActions.getLastInput());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lastInput) {
            setInput(lastInput);
        } else {
            setInput({
                id: uuidv4(),
            });
        }
    }, [lastInput]);

    useEffect(() => {
        latestInputRef.current = input;
        hasPendingSaveRef.current = isInputUpdated;
    }, [input, isInputUpdated]);

    useEffect(() => {
        if (!isInputUpdated) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveInput();
        }, 3000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, isInputUpdated]);

    // On unmount: flush any pending debounced save so navigation doesn't drop it.
    useEffect(() => {
        return () => {
            if (hasPendingSaveRef.current && latestInputRef.current) {
                dispatch(inputsActions.addInput(latestInputRef.current));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateInput = (updatedFields: Partial<Input>) => {
        setInput((prevInput) => {
            return {
                id: prevInput?.id || uuidv4(),
                ...prevInput,
                ...updatedFields,
            };
        });
        setIsInputUpdated(true);
    };

    const saveInput = () => {
        dispatch(inputsActions.addInput(input as Input));
        setIsInputUpdated(false);
    };

    if (isLoading && !input) {
        return <Spin />;
    }

    return (
        <div className="p-4 pb-24">
            <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">{t("JOURNAL.TITLE")} ☀️</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardContainer>
                <Habits selectedHabits={input?.habits || []} setSelectedHabits={updateInput} />
            </CardContainer>

            <CardContainer>
                <Mood selectedMood={input?.mood} moodNotes={input?.moodNotes} setSelectedMood={updateInput} />
            </CardContainer>

            <CardContainer>
                <BodyFeeling selectedBodyFeeling={input?.bodyFeeling} setSelectedBodyFeeling={updateInput} />
                <BodyFeelingDiscomfort selectedDiscomfort={input?.bodyFeelingDiscomfort} setSelectedDiscomfort={updateInput} />
            </CardContainer>

            <CardContainer>
                <Nutrition selectedNutrition={input?.nutritionQuality} nutritionNotes={input?.nutritionNotes} setNutrition={updateInput} />
            </CardContainer>

            <CardContainer>
                <Sleep selectedSleep={input?.sleep} setSelectedSleep={updateInput} />
            </CardContainer>

            <CardContainer>
                <PeriodInfo selectedPeriod={input?.periodInfo} setSelectedPeriod={updateInput} />
            </CardContainer>
            </div>
        </div>
    );
};
