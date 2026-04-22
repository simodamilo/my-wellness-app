import { Input as AntInput } from "antd";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Input } from "../../store/inputs/types";
import { nutritions } from "../../utils/constants";

const { TextArea } = AntInput;

interface NutritionProps {
    selectedNutrition?: number;
    nutritionNotes?: string;
    setNutrition: (updatedFields: Partial<Input>) => void;
}

export const Nutrition = (props: NutritionProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-2 px-4 pb-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">{t("INPUTS.NUTRITION.TITLE")}</h2>
            <div className="grid grid-cols-4 gap-2 w-full">
                {nutritions.map((nutrition) => {
                    const isActive = props.selectedNutrition === nutrition.id;
                    const baseClasses = "flex flex-col items-center justify-center p-2 rounded-2xl backdrop-blur-md border transition-all";
                    const activeClasses = "bg-[#c2185b]/30 border-[#c2185b]/40 shadow-md";
                    const inactiveClasses = "bg-white/20 border-white/30";

                    return (
                        <motion.button
                            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            onClick={() => props.setNutrition({ nutritionQuality: nutrition.id })}
                            whileTap={{ scale: 0.9 }}
                            key={nutrition.id}
                        >
                            <span className="text-2xl">{nutrition.emoji}</span>
                        </motion.button>
                    );
                })}
            </div>
            <div className="w-full pt-2">
                <TextArea
                    rows={3}
                    value={props.nutritionNotes}
                    placeholder={t("INPUTS.NUTRITION.PLACEHOLDER")}
                    onChange={(e) => props.setNutrition({ nutritionNotes: e.target.value })}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                />
            </div>
        </div>
    );
};
