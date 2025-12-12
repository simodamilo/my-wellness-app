import {useEffect, useState} from "react";
import type { Input } from "../../store/inputs/types.ts";
import { pearsonCorrelation } from "../../utils/correlation/correlation.ts";
import { type RootState, useAppDispatch } from "../../store";
import { inputsActions } from "../../store/inputs/inputs.action.ts";
import { useSelector } from "react-redux";
import { inputsSelectors } from "../../store/inputs/inputs.selector.ts";
import {insightRules, type CorrelationResult, fillMissingDates} from "../../utils/correlation/correlationPairs.ts";
import {Dashboard} from '../../pages/insights/components/Dashboard.tsx';
import {useTranslation} from 'react-i18next';

export const Insights = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [insights, setInsights] = useState<CorrelationResult[]>([]);

    const inputs = useSelector((state: RootState) => inputsSelectors.getInputs(state));

    useEffect(() => {
        dispatch(inputsActions.getInputs());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const logs: Input[] = inputs;
        const results: CorrelationResult[] = [];

        for (const rule of insightRules) {
            const filled = fillMissingDates(
                logs,
                rule.x,
                rule.y,
                rule.defaultX ?? 0,
                rule.defaultY ?? 5
            );
            const x = filled.map(d => d.x);
            const y = filled.map(d => d.y);

            const r = pearsonCorrelation(x, y);
            const thresholdNegative = rule.thresholdNegative ?? -0.4;
            const thresholdPositive = rule.thresholdPositive ?? 0.4;

            if (r < thresholdNegative) results.push({ name: rule.name, message: rule.negativeMessage ?? "", correlation: r, chart: filled });
            if (r >= thresholdNegative && r <= thresholdPositive && rule.averageMessage) results.push({ name: rule.name, message: rule.averageMessage, correlation: r, chart: filled });
            if (r > thresholdPositive) results.push({ name: rule.name, message: rule.positiveMessage, correlation: r, chart: filled });
        }

        setInsights(results);
    }, [inputs]);

    return (
        <div className="p-4 space-y-2 pt-[56px]">
            <Dashboard inputs={inputs}/>
            <h2 className="text-xl font-semibold">{t('INSIGHTS.INSIGHTS_TITLE')}</h2>
            {insights.length === 0 ? (
                <p className="text-gray-500">No patterns detected yet. Keep tracking!</p>
            ) : (
                insights.map((insight, i) => (
                    <div key={i} className="p-3 bg-white shadow rounded-2xl">
                        {insight.name} ({insight.correlation.toFixed(2)}):
                        <br />
                        {insight.message}
                    </div>
                ))
            )}
        </div>
    );
};
