import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { Input } from '../../../store/inputs/types.ts';
import { useAppDispatch, type RootState } from '../../../store';
import { habitsActions } from '../../../store/habits/habits.action.ts';
import { habitsSelectors } from '../../../store/habits/habits.selector.ts';

interface WeeklyRecapProps {
    inputs: Input[];
}

// Monday 00:00 of current week as a unix timestamp in seconds.
const getMondayStart = (): number => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    d.setDate(d.getDate() - daysSinceMonday);
    return Math.floor(d.getTime() / 1000);
};

const DAY_SECONDS = 24 * 60 * 60;
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const WeeklyRecap = (props: WeeklyRecapProps) => {
    const dispatch = useAppDispatch();

    const allHabits = useSelector((state: RootState) => habitsSelectors.getAllHabits(state));

    useEffect(() => {
        if (allHabits.length === 0) {
            dispatch(habitsActions.getHabits());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rows = useMemo(() => {
        const mondayTs = getMondayStart();

        // Map habitId -> Set<dayIndex 0..6>
        const doneByHabit = new Map<string, Set<number>>();
        for (const input of props.inputs) {
            if (input.createdAt === undefined || input.createdAt < mondayTs) continue;
            const dayIndex = Math.floor((input.createdAt - mondayTs) / DAY_SECONDS);
            if (dayIndex < 0 || dayIndex > 6) continue;
            for (const habitId of input.habits ?? []) {
                if (!doneByHabit.has(habitId)) doneByHabit.set(habitId, new Set());
                doneByHabit.get(habitId)!.add(dayIndex);
            }
        }

        return allHabits
            .filter((h) => !h.deletedAt)
            .map((h) => ({
                id: h.id,
                emoji: h.emoji,
                label: h.name,
                doneDays: doneByHabit.get(h.id) ?? new Set<number>(),
            }));
    }, [props.inputs, allHabits]);

    return (
        <div className="flex flex-col gap-1 p-3 bg-white shadow rounded-2xl">
            <div className="grid grid-cols-[2rem_6rem_1fr] items-center gap-2">
                <span />
                <span />
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
                    {DAY_LABELS.map((day, index) => (
                        <span key={index}>{day}</span>
                    ))}
                </div>
            </div>
            {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-[2rem_6rem_1fr] items-center gap-2">
                    <span className="text-xl">{row.emoji}</span>
                    <span className="text-sm text-gray-700 truncate">{row.label}</span>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 }, (_, i) => i).map((dayIndex) => {
                            const done = row.doneDays.has(dayIndex);
                            return (
                                <div
                                    key={dayIndex}
                                    className={`h-3 w-3 rounded-full mx-auto ${
                                        done ? 'bg-[#c2185b]' : 'bg-gray-200'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
