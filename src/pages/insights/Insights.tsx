import { useEffect, useState } from "react";
import type {Input} from '../../store/inputs/types.ts';
import {pearsonCorrelation} from '../../utils/correlation/correlation.ts';
import {type RootState, useAppDispatch} from '../../store';
import {inputsActions} from '../../store/inputs/inputs.action.ts';
import {useSelector} from 'react-redux';
import { inputsSelectors } from "../../store/inputs/inputs.selector.ts";

export const Insights = () => {
    const dispatch = useAppDispatch();
    const [insights, setInsights] = useState<string[]>([]);

    const inputs = useSelector((state: RootState) => inputsSelectors.getInputs(state));

    useEffect(() => {
        dispatch(inputsActions.getInputs());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const logs: Input[] = inputs;

        // prepare arrays
        const mood = logs.map((d) => d.mood!);
        const yoga = logs.map((d) => (d.habits?.includes('yoga') ? 1 : 0));

        const results: string[] = [];

        // check mood vs yoga
        const moodYoga = pearsonCorrelation(mood, yoga);
        if (moodYoga > 0.4) {
            results.push("You tend to feel happier on days you go to yoga 💪");
        } else if (moodYoga > 0.1) {
            results.push("You tend to feel a bit happier on days you go to yoga 💪");
        } else if (moodYoga < -0.4) {
            results.push("Yoga days seem to lower your mood — maybe rest more 🧘‍♀️");
        } else if (moodYoga < -0.1) {
            results.push("Yoga days seem to lower a bit your mood — maybe rest more 🧘‍♀️");
        }

        setInsights(results);
    }, [inputs]);

    return (
        <div className="p-4 space-y-2 pt-20">
            <h2 className="text-xl font-semibold">Insights</h2>
            {insights.length === 0 ? (
                <p className="text-gray-500">No patterns detected yet. Keep tracking!</p>
            ) : (
                insights.map((insight, i) => (
                    <div key={i} className="p-3 bg-white shadow rounded-2xl">
                        {insight}
                    </div>
                ))
            )}
        </div>
    );
}
