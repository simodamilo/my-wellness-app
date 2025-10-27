import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Input } from "../../store/inputs/types";

const bodyZones = [
    { id: "head", label: "INPUTS.BODY_FEELING.HEAD", emoji: "🧠" },
    { id: "cramps", label: "INPUTS.BODY_FEELING.CRAMPS", emoji: "🤰" },
    { id: "stomach", label: "INPUTS.BODY_FEELING.STOMACH", emoji: "🍽️" },
    { id: "arms", label: "INPUTS.BODY_FEELING.ARMS", emoji: "💪" },
    { id: "legs", label: "INPUTS.BODY_FEELING.LEGS", emoji: "🦵" },
    { id: "tired", label: "INPUTS.BODY_FEELING.TIRED", emoji: "😴" },
];

interface BodyFeelingDiscomfortProps {
    selectedDiscomfort?: string[];
    setSelectedDiscomfort?: (updatedFields: Partial<Input>) => void;
}

export const BodyFeelingDiscomfort = (props: BodyFeelingDiscomfortProps) => {
    const { t } = useTranslation();

    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        setSelected(props.selectedDiscomfort || []);
    }, [props.selectedDiscomfort]);

    const toggleSelect = (id: string) => {
        const updated = selected.includes(id) ? selected.filter((z) => z !== id) : [...selected, id];
        setSelected(updated);
        props.setSelectedDiscomfort?.({ bodyFeelingDiscomfort: updated });
    };

    return (
        <div className="flex flex-col items-start p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">{t("INPUTS.BODY_FEELING.DISCOMFORT_TITLE")}</h2>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {bodyZones.map((zone) => {
                    const isActive = selected.includes(zone.id);
                    const baseClasses = "flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button key={zone.id} whileTap={{ scale: 0.9 }} onClick={() => toggleSelect(zone.id)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                            <span className="text-3xl">{zone.emoji}</span>
                            <span className="text-sm text-gray-700 mt-1">{t(`${zone.label}`)}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
