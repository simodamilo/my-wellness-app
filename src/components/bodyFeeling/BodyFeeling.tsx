import { useEffect, useState } from "react";
import { Slider } from "antd";
import type { Input } from "../../store/inputs/types";
import { useTranslation } from "react-i18next";

interface BodyFeelingProps {
    selectedBodyFeeling?: number;
    setSelectedBodyFeeling?: (updatedFields: Partial<Input>) => void;
}

export const BodyFeeling = (props: BodyFeelingProps) => {
    const { t } = useTranslation();

    const [value, setValue] = useState<number>(5);

    useEffect(() => {
        setValue(props.selectedBodyFeeling ?? 5);
    }, [props.selectedBodyFeeling]);

    const handleChange = (val: number) => {
        setValue(val);
        props.setSelectedBodyFeeling?.({ bodyFeeling: val });
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t("INPUTS.BODY_FEELING.TITLE")}</h2>
            <div className="flex items-center w-full max-w-sm space-x-3">
                <span className="text-2xl">😞</span>
                <Slider min={1} max={10} value={value} onChange={handleChange} className="flex-1" tooltip={{ open: false }} />
                <span className="text-2xl">😄</span>
            </div>
        </div>
    );
};
