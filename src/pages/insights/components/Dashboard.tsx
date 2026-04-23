import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { Input } from '../../../store/inputs/types.ts';
import { useAppDispatch, type RootState } from '../../../store';
import { habitsActions } from '../../../store/habits/habits.action.ts';
import { habitsSelectors } from '../../../store/habits/habits.selector.ts';

type PeriodKey = '7' | '30' | '90';

interface DashboardProps {
    inputs: Input[];
}

const getCutoff = (period: PeriodKey): number => {
    const days = parseInt(period, 10);
    return Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
};

export const Dashboard = (props: DashboardProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [period, setPeriod] = useState<PeriodKey>('7');

    const allHabits = useSelector((state: RootState) => habitsSelectors.getAllHabits(state));

    useEffect(() => {
        if (allHabits.length === 0) {
            dispatch(habitsActions.getHabits());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tiles = useMemo(() => {
        const cutoff = getCutoff(period);
        const windowInputs = props.inputs.filter(
            (i) => i.createdAt !== undefined && i.createdAt >= cutoff
        );

        const counts = new Map<string, number>();
        for (const input of windowInputs) {
            for (const habitId of input.habits ?? []) {
                counts.set(habitId, (counts.get(habitId) ?? 0) + 1);
            }
        }

        const habitsById = new Map(allHabits.map((h) => [h.id, h]));

        const activeTiles = allHabits
            .filter((h) => !h.deletedAt)
            .map((h) => ({
                id: h.id,
                emoji: h.emoji,
                label: h.name,
                count: counts.get(h.id) ?? 0,
            }));

        const deletedTiles = Array.from(counts.entries())
            .filter(([id]) => habitsById.get(id)?.deletedAt)
            .map(([id, count]) => {
                const h = habitsById.get(id)!;
                return {
                    id,
                    emoji: h.emoji,
                    label: `${h.name} (${t('INSIGHTS.REMOVED_LABEL')})`,
                    count,
                };
            });

        return [...activeTiles, ...deletedTiles].sort((a, b) => b.count - a.count);
    }, [props.inputs, period, allHabits, t]);

    const maxCount = Math.max(1, ...tiles.map((tile) => tile.count));

    const options: { key: PeriodKey; label: string }[] = [
        { key: '7', label: '7' },
        { key: '30', label: '30' },
        { key: '90', label: '90' },
    ];

    return (
        <>
            <div className="flex flex-col gap-4 p-3 bg-white shadow rounded-2xl">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                    {options.map((option) => {
                        const isActive = period === option.key;
                        return (
                            <button
                                key={option.key}
                                onClick={() => setPeriod(option.key)}
                                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                                    isActive
                                        ? 'bg-[#c2185b] text-white border-[#c2185b]'
                                        : 'bg-white text-gray-700 border-gray-300'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-2">
                    {tiles.map((tile) => {
                        const pct = (tile.count / maxCount) * 100;
                        return (
                            <div key={tile.id} className="grid grid-cols-[auto_6rem_1fr_auto] items-center gap-2">
                                <span className="text-xl">{tile.emoji}</span>
                                <span className="text-sm text-gray-700 truncate">{tile.label}</span>
                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-2 bg-[#c2185b] rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-[#c2185b] w-8 text-right">
                                    {tile.count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
