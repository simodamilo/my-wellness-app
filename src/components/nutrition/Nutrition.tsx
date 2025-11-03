import {Slider} from 'antd';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import type { Input } from "../../store/inputs/types";

interface NutritionProps {
    selectedNutrition?: number;
    setSelectedNutrition?: (updatedFields: Partial<Input>) => void;
}

export const Nutrition = (props: NutritionProps) => {
    const { t } = useTranslation();

    const [value, setValue] = useState<number>(5);

    useEffect(() => {
        setValue(props.selectedNutrition ?? 5);
    }, [props.selectedNutrition]);

    const handleChange = (val: number) => {
        setValue(val);
        props.setSelectedNutrition?.({ nutritionQuality: val.toString() });
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t("INPUTS.BODY_FEELING.TITLE")}</h2>
            <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl m-0">😞</span>
                <Slider min={1} max={10} value={value} onChange={handleChange} className="body-feeling-slider flex-1" tooltip={{ open: false }} />
                <span className="text-2xl">😄</span>
            </div>
        </div>
    );
};
