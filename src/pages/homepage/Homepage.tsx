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
import { Notes } from "../../components/notes/Notes";
import { PeriodInfo } from "../../components/periodInfo/PeriodInfo";
import { Sleep } from "../../components/sleep/Sleep";
import { Nutrition } from "../../components/nutrition/Nutrition";
import { BodyFeelingDiscomfort } from "../../components/bodyFeeling/BodyFeelingDiscomfort";

export const Homepage = () => {
    const dispatch = useAppDispatch();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (!isInputUpdated) return;

        // Clear previous timer if user types again
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Start a new 5s timer
        saveTimeoutRef.current = setTimeout(() => {
            saveInput();
        }, 3000);

        // Cleanup on unmount or when dependency changes
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, isInputUpdated]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-[56px] p-4">
            <CardContainer>
                <Habits selectedHabits={input?.habits || []} setSelectedHabits={updateInput} />
            </CardContainer>

            <CardContainer>
                <Mood selectedMood={input?.mood} setSelectedMood={updateInput} />
            </CardContainer>

            <CardContainer>
                <BodyFeeling selectedBodyFeeling={input?.bodyFeeling} setSelectedBodyFeeling={updateInput} />
                {input?.bodyFeeling && input.bodyFeeling < 4 && <BodyFeelingDiscomfort selectedDiscomfort={input.bodyFeelingDiscomfort} setSelectedDiscomfort={updateInput} />}
            </CardContainer>

            <CardContainer>
                <PeriodInfo />
            </CardContainer>

            <CardContainer>
                <Sleep selectedSleep={input?.sleep} setSelectedSleep={updateInput} />
            </CardContainer>

            <CardContainer>
                <Nutrition />
            </CardContainer>

            <CardContainer customClassName="md:col-span-2 lg:col-span-3">
                <Notes notes={input?.notes} setNotes={updateInput} />
            </CardContainer>
        </div>
    );
};
