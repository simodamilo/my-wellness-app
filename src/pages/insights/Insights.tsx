import { useEffect, useState } from "react";
import type { Input } from "../../store/inputs/types.ts";
import { pearsonCorrelation } from "../../utils/correlation/correlation.ts";
import { type RootState, useAppDispatch } from "../../store";
import { inputsActions } from "../../store/inputs/inputs.action.ts";
import { useSelector } from "react-redux";
import { inputsSelectors } from "../../store/inputs/inputs.selector.ts";
import { insightRules, type CorrelationResult } from "../../utils/correlation/correlationPairs.ts";
import { Chart } from "./components/chart.tsx";

const data = [
    { x: 1, y: 7 },
    { x: 0, y: 4 },
    { x: 1, y: 8 },
    { x: 0, y: 5 },
    { x: 1, y: 6 },
];

export const Insights = () => {
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
            const x = logs.map(rule.x);
            const y = logs.map(rule.y);

            const r = pearsonCorrelation(x, y);
            const thresholdNegative = rule.thresholdNegative ?? -0.4;
            const thresholdPositive = rule.thresholdPositive ?? 0.4;

            let result: ChartProps = { data: [] };

            if (r < thresholdNegative) results.push({ name: rule.name, message: rule.negativeMessage ?? "", correlation: r });
            if (r >= thresholdNegative && r <= thresholdPositive && rule.averageMessage) results.push({ name: rule.name, message: rule.averageMessage, correlation: r });
            if (r > thresholdPositive) results.push({ name: rule.name, message: rule.positiveMessage, correlation: r });
        }

        setInsights(results);
    }, [inputs]);

    return (
        <div className="p-4 space-y-2 pt-[56px]">
            <h2 className="text-xl font-semibold">Insights</h2>
            <Chart data={data} />
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
