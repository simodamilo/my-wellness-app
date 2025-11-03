import type { Input } from "../../store/inputs/types";
import {useTranslation} from 'react-i18next';
import {period} from '../../utils/constants.ts';
import {motion} from 'framer-motion';

interface PeriodInfoProps {
    selectedPeriod?: boolean;
    setSelectedPeriod?: (updatedFields: Partial<Input>) => void;
}

export const PeriodInfo = (props: PeriodInfoProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t("INPUTS.PERIOD.TITLE")}</h2>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {period.map((p) => {
                    const isActive = (p.id === 1 && props.selectedPeriod) || (p.id === 2 && !props.selectedPeriod);
                    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button
                            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            onClick={() => props.setSelectedPeriod?.({ periodInfo: p.id === 1 })}
                            whileTap={{ scale: 0.9 }}
                            key={p.id}
                        >
                            <span className="text-sm text-gray-700 mt-1">{t(p.label)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
