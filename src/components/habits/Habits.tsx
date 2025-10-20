import { Checkbox } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useTranslation } from "react-i18next";

export const Habits = () => {
    const { t } = useTranslation();

    const habits = useSelector((state: RootState) => state.habits.habits);

    const onChange = (checkedValues: Array<string>) => {
        console.log("checked = ", checkedValues); // TODO
    };

    if (!habits || habits.length === 0) {
        return <p>{t("INPUTS.HABITS.NO_HABITS")}</p>;
    }

    return (
        <div className="flex flex-col items-center gap-2 font-bold">
            <p>{t("INPUTS.HABITS.TITLE")}</p>
            <Checkbox.Group className="w-full flex flex-col items-start gap-2" onChange={onChange}>
                {habits.map((habit) => (
                    <Checkbox key={habit.id} value={habit.name} className="font-semibold">
                        {habit.name}
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    );
};
