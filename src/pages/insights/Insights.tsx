import { useEffect } from "react";
import { type RootState, useAppDispatch } from "../../store";
import { inputsActions } from "../../store/inputs/inputs.action.ts";
import { useSelector } from "react-redux";
import { inputsSelectors } from "../../store/inputs/inputs.selector.ts";
import { Dashboard } from '../../pages/insights/components/Dashboard.tsx';
import { WeeklyRecap } from '../../pages/insights/components/WeeklyRecap.tsx';
import { useTranslation } from "react-i18next";

export const Insights = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const inputs = useSelector((state: RootState) => inputsSelectors.getInputs(state));

    useEffect(() => {
        dispatch(inputsActions.getInputs());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-4 space-y-4 pb-24">
            <h1 className="text-2xl font-semibold text-gray-700 text-center">{t("INSIGHTS.TITLE")} 🎯</h1>
            <WeeklyRecap inputs={inputs}/>
            <Dashboard inputs={inputs}/>
        </div>
    );
};
