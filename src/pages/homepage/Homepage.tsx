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

export const Homepage = () => {
    const dispatch = useAppDispatch();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [input, setInput] = useState<Input>();
    const [isInputUpdated, setIsInputUpdated] = useState<boolean>(false);

    const lastInput = useSelector((state: RootState) => inputsSelectors.getLastInput(state));
    const isLoading = useSelector((state: RootState) => inputsSelectors.getIsLoading(state));

    console.log("lastInput", lastInput);

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
        }, 5000);

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
        <div className="flex flex-col gap-4 pt-[56px] p-4">
            <CardContainer>
                <Habits selectedHabits={input?.habits || []} setSelectedHabits={updateInput} />
            </CardContainer>

            <CardContainer>
                <Mood selectedMood={input?.mood} setSelectedMood={updateInput} />
            </CardContainer>

            <CardContainer>
                <BodyFeeling />
            </CardContainer>
        </div>
    );
};
