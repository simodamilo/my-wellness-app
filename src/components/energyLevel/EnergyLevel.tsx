import { useEffect, useState } from "react";
import { Slider } from "antd";
import type { Input } from "../../store/inputs/types";
import { useTranslation } from "react-i18next";

interface EnergyLevelProps {
    selectedEnergyLevel?: number;
    setSelectedEnergyLevel?: (updatedFields: Partial<Input>) => void;
}

export const EnergyLevel = (props: EnergyLevelProps) => {
    const { t } = useTranslation();

    const [value, setValue] = useState<number>(5);

    useEffect(() => {
        setValue(props.selectedEnergyLevel ?? 5);
    }, [props.selectedEnergyLevel]);

    const handleChange = (val: number) => {
        setValue(val);
        props.setSelectedEnergyLevel?.({ energyLevel: val });
    };

    return (
        <div className="flex flex-col items-center w-full pb-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t("INPUTS.ENERGY_LEVEL.TITLE")}</h2>
            <div className="flex items-center w-full justify-between gap-2">
                <span className="text-2xl m-0">🪫</span>
                <Slider min={1} max={10} value={value} onChange={handleChange} className="body-feeling-slider flex-1" tooltip={{ open: false }} />
                <span className="text-2xl">🔋</span>
            </div>
        </div>
    );
};
