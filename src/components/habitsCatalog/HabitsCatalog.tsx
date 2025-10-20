import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { habitsActions } from "../../store/habits/habits.action";
import { Button, Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import type { Habit } from "../../store/habits/types";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const HabitsCatalog = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [newHabit, setNewHabit] = useState<string>("");

    const habits = useSelector((state: RootState) => state.habits.habits);

    useEffect(() => {
        dispatch(habitsActions.getHabits());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAddHabit = () => {
        if (newHabit.trim() !== "") {
            dispatch(
                habitsActions.addHabit({
                    id: uuidv4(),
                    name: newHabit,
                })
            );
            setNewHabit("");
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <Input placeholder={t("SETTINGS.HABITS.PLACEHOLDER")} value={newHabit} onChange={(e) => setNewHabit(e.target.value)} />
                <Button type="primary" onClick={onAddHabit}>
                    {t("SETTINGS.HABITS.ADD_BUTTON")}
                </Button>
            </div>
            {habits.length > 0 && (
                <div className="flex flex-col gap-0 mt-4">
                    {habits.map((habit: Habit) => {
                        return (
                            <div key={habit.id} className="flex justify-between items-center border-[#f087b0] border-t border-l border-r first:rounded-t-xl last:border-b last:rounded-b-xl">
                                <p className="py-1 px-4 font-semibold text-sm">{habit.name}</p>
                                <div className="py-1 px-4">
                                    <MdDeleteOutline onClick={() => dispatch(habitsActions.deleteHabit(habit.id))} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
