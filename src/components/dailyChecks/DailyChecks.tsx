import type { Input } from "../../store/inputs/types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface DailyChecksProps {
    drankWater?: boolean;
    ateVegetables?: boolean;
    bigBelly?: boolean;
    setSelectedChecks?: (updatedFields: Partial<Input>) => void;
}

export const DailyChecks = (props: DailyChecksProps) => {
    const { t } = useTranslation();

    const checks = [
        { emoji: "💧", label: t("INPUTS.DAILY_CHECKS.WATER"), active: props.drankWater === true, field: "drankWater" as const },
        { emoji: "🥦", label: t("INPUTS.DAILY_CHECKS.VEGETABLES"), active: props.ateVegetables === true, field: "ateVegetables" as const },
        { emoji: "🎈", label: t("INPUTS.DAILY_CHECKS.BIG_BELLY"), active: props.bigBelly === true, field: "bigBelly" as const },
    ];

    return (
        <div className="flex flex-col items-center w-full pb-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t("INPUTS.DAILY_CHECKS.TITLE")}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {checks.map((check) => (
                    <motion.button
                        key={check.field}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => props.setSelectedChecks?.({ [check.field]: !check.active })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                            check.active ? "bg-[#c2185b] border-[#c2185b] text-white shadow" : "bg-white/30 border-white/40 text-gray-700"
                        }`}
                    >
                        <span className="text-lg">{check.emoji}</span>
                        <span className="text-sm font-semibold">{check.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
