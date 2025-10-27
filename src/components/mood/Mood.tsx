import { useTranslation } from "react-i18next";
import type { Input } from "../../store/inputs/types";
import { motion } from "framer-motion";

const moods = [
    { id: "happy", label: "INPUTS.MOODS.HAPPY", emoji: "😄" },
    { id: "calm", label: "INPUTS.MOODS.CALM", emoji: "😌" },
    { id: "neutral", label: "INPUTS.MOODS.NEUTRAL", emoji: "😐" },
    { id: "thoughtful", label: "INPUTS.MOODS.THOUGHTFUL", emoji: "🤔" },
    { id: "sad", label: "INPUTS.MOODS.SAD", emoji: "😟" },
    { id: "sensitive", label: "INPUTS.MOODS.SENSITIVE", emoji: "😢" },
];

interface MoodProps {
    selectedMood?: string;
    setSelectedMood: (updatedFields: Partial<Input>) => void;
}

export const Mood = (props: MoodProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-2 px-4 pb-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">{t("INPUTS.MOODS.TITLE")}</h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {moods.map((mood) => {
                    const isActive = props.selectedMood === mood.id;
                    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button
                            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            onClick={() => props.setSelectedMood({ mood: mood.id })}
                            whileTap={{ scale: 0.9 }}
                            key={mood.id}
                        >
                            <span className="text-3xl">{mood.emoji}</span>
                            <span className="text-sm text-gray-700 mt-1">{t(mood.label)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
