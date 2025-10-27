import { useTranslation } from "react-i18next";
import type { Input } from "../../store/inputs/types";
import { motion } from "framer-motion";
import { sleeps } from "../../utils/constants";

interface SleepProps {
    selectedSleep?: number;
    setSelectedSleep: (updatedFields: Partial<Input>) => void;
}

export const Sleep = (props: SleepProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-2 px-4 pb-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">{t("INPUTS.SLEEP.TITLE")}</h2>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {sleeps.map((sleep) => {
                    const isActive = props.selectedSleep === sleep.id;
                    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button
                            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            onClick={() => props.setSelectedSleep({ sleep: sleep.id })}
                            whileTap={{ scale: 0.9 }}
                            key={sleep.id}
                        >
                            <span className="text-3xl">{sleep.emoji}</span>
                            <span className="text-sm text-gray-700 mt-1">{t(sleep.label)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
