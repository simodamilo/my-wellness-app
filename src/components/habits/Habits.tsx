import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Input } from "../../store/inputs/types";
import { motion } from "framer-motion";
import { habits } from "../../utils/constants";

interface HabitsProps {
    selectedHabits: string[];
    setSelectedHabits: (updatedFields: Partial<Input>) => void;
}

export const Habits = (props: HabitsProps) => {
    const { t } = useTranslation();

    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        setSelected(props.selectedHabits || []);
    }, [props.selectedHabits]);

    const toggleSelect = (id: string) => {
        const updated = selected.includes(id) ? selected.filter((z) => z !== id) : [...selected, id];
        setSelected(updated);
        props.setSelectedHabits?.({ habits: updated });
    };

    return (
        <div className="flex flex-col items-center gap-2 px-4 pb-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">{t("INPUTS.HABITS.TITLE")}</h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {habits.map((habit) => {
                    const isActive = selected.includes(habit.id);
                    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} onClick={() => toggleSelect(habit.id)} whileTap={{ scale: 0.9 }} key={habit.id}>
                            <span className="text-3xl">{habit.emoji}</span>
                            <span className="text-sm text-gray-700 mt-1">{t(habit.label)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
