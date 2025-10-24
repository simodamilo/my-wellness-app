import { Checkbox, type CheckboxOptionType, type GetProp } from "antd";
import { useTranslation } from "react-i18next";
import type { Input } from "../../store/inputs/types";

interface HabitsProps {
    selectedHabits: string[];
    setSelectedHabits: (updatedFields: Partial<Input>) => void;
}

export const Habits = (props: HabitsProps) => {
    const { t } = useTranslation();

    const options: CheckboxOptionType<string>[] = [
        { label: t("INPUTS.HABITS.GYM"), value: "gym" },
        { label: t("INPUTS.HABITS.MEDITATION"), value: "meditation" },
        { label: t("INPUTS.HABITS.JOURNALING"), value: "journaling" },
        { label: t("INPUTS.HABITS.READING"), value: "reading" },
        { label: t("INPUTS.HABITS.CREATINA"), value: "creatina" },
    ];

    const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (checkedValues) => {
        props.setSelectedHabits({ habits: checkedValues as string[] });
    };

    return (
        <div className="flex flex-col items-center gap-2 font-bold">
            <p>{t("INPUTS.HABITS.TITLE")}</p>
            <Checkbox.Group className="w-full flex flex-col items-start gap-2" onChange={onChange} value={props.selectedHabits}>
                {options.map((option) => (
                    <Checkbox key={option.value} value={option.value} className="font-semibold">
                        {option.label}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    );
};
