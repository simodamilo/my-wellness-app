import type { Input } from "../../store/inputs/types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface PeriodInfoProps {
    selectedPeriod?: boolean;
    setSelectedPeriod?: (updatedFields: Partial<Input>) => void;
}

export const PeriodInfo = (props: PeriodInfoProps) => {
    const { t } = useTranslation();
    const isActive = props.selectedPeriod === true;

    return (
        <div className="flex justify-center px-2 py-2">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => props.setSelectedPeriod?.({ periodInfo: !isActive })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    isActive
                        ? "bg-[#c2185b] border-[#c2185b] text-white shadow"
                        : "bg-white/30 border-white/40 text-gray-700"
                }`}
            >
                <span className="text-lg">🩸</span>
                <span className="text-sm font-semibold">{t("INPUTS.PERIOD.CHIP_LABEL")}</span>
            </motion.button>
        </div>
    );
};
