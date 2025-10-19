import { Checkbox, type CheckboxOptionType } from "antd";
import { useTranslation } from "react-i18next";

export const Habits = () => {
    const { t } = useTranslation();

    const options: CheckboxOptionType<string>[] = [
        // TODO make it dynamic
        { label: t("INPUTS.HABITS.GYM"), value: "gym" },
        { label: t("INPUTS.HABITS.MEDITATION"), value: "meditation" },
        { label: t("INPUTS.HABITS.JOURNALING"), value: "journaling" },
    ];

    const onChange = (checkedValues: Array<string>) => {
        console.log("checked = ", checkedValues);
    };

    return (
        <div>
            <Checkbox.Group className="flex flex-col gap-2" onChange={onChange}>
                {options.map((option) => (
                    <Checkbox key={option.value} value={option} className="font-semibold">
                        {option.label}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    );
};
