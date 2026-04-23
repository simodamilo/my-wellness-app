import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { Input } from '../../../store/inputs/types.ts';
import { useAppDispatch, type RootState } from '../../../store';
import { habitsActions } from '../../../store/habits/habits.action.ts';
import { habitsSelectors } from '../../../store/habits/habits.selector.ts';
import { inputsActions } from '../../../store/inputs/inputs.action.ts';
import { IoPencilOutline, IoCheckmark, IoClose } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

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

// createdAt stored as ms since epoch (see inputs.mapper.ts#toSeconds).
const toSeconds = (ts?: number): number | undefined => {
    if (ts === undefined || ts === null) return undefined;
    return ts > 1e11 ? Math.floor(ts / 1000) : ts;
};

export const WeeklyRecap = (props: WeeklyRecapProps) => {
    const dispatch = useAppDispatch();

    const allHabits = useSelector((state: RootState) => habitsSelectors.getAllHabits(state));

    const [isEditing, setIsEditing] = useState(false);
    // Per-day habit sets while editing. Seeded from current data on edit enter.
    const [draft, setDraft] = useState<Map<number, Set<string>>>(new Map());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (allHabits.length === 0) {
            dispatch(habitsActions.getHabits());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mondayTs = useMemo(() => getMondayStart(), []);
    const todayIndex = useMemo(() => {
        const nowSecs = Math.floor(Date.now() / 1000);
        return Math.floor((nowSecs - mondayTs) / DAY_SECONDS);
    }, [mondayTs]);

    // Pick the most recent entry whose createdAt falls in a given day window.
    // Preserves the full habits[] (including soft-deleted habit ids) so saves
    // don't accidentally drop habits that aren't rendered in the grid.
    const entryByDay = useMemo(() => {
        const map = new Map<number, Input>();
        for (const input of props.inputs) {
            const secs = toSeconds(input.createdAt);
            if (secs === undefined || secs < mondayTs) continue;
            const dayIndex = Math.floor((secs - mondayTs) / DAY_SECONDS);
            if (dayIndex < 0 || dayIndex > 6) continue;
            const existing = map.get(dayIndex);
            if (!existing || toSeconds(existing.createdAt)! < secs) {
                map.set(dayIndex, input);
            }
        }
        return map;
    }, [props.inputs, mondayTs]);

    // Original habit set per day, union across entries (matches read-only render).
    const originalByDay = useMemo(() => {
        const map = new Map<number, Set<string>>();
        for (const input of props.inputs) {
            const secs = toSeconds(input.createdAt);
            if (secs === undefined || secs < mondayTs) continue;
            const dayIndex = Math.floor((secs - mondayTs) / DAY_SECONDS);
            if (dayIndex < 0 || dayIndex > 6) continue;
            if (!map.has(dayIndex)) map.set(dayIndex, new Set());
            for (const h of input.habits ?? []) map.get(dayIndex)!.add(h);
        }
        return map;
    }, [props.inputs, mondayTs]);

    const visibleHabits = useMemo(() => allHabits.filter((h) => !h.deletedAt), [allHabits]);

    const getDoneSet = (dayIndex: number): Set<string> => {
        if (isEditing) return draft.get(dayIndex) ?? new Set();
        return originalByDay.get(dayIndex) ?? new Set();
    };

    const isDirty = (dayIndex: number, habitId: string): boolean => {
        if (!isEditing) return false;
        const now = draft.get(dayIndex)?.has(habitId) ?? false;
        const was = originalByDay.get(dayIndex)?.has(habitId) ?? false;
        return now !== was;
    };

    const dirtyDays = useMemo(() => {
        if (!isEditing) return new Set<number>();
        const days = new Set<number>();
        for (let d = 0; d < 7; d++) {
            const draftSet = draft.get(d) ?? new Set<string>();
            const origSet = originalByDay.get(d) ?? new Set<string>();
            // Only check habits visible in the grid — soft-deleted ones can't be toggled.
            for (const habit of visibleHabits) {
                if (draftSet.has(habit.id) !== origSet.has(habit.id)) {
                    days.add(d);
                    break;
                }
            }
        }
        return days;
    }, [isEditing, draft, originalByDay, visibleHabits]);

    const hasChanges = dirtyDays.size > 0;

    const enterEdit = () => {
        // Seed draft with the union-per-day current state.
        const seed = new Map<number, Set<string>>();
        for (let d = 0; d < 7; d++) {
            seed.set(d, new Set(originalByDay.get(d) ?? []));
        }
        setDraft(seed);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setDraft(new Map());
        setIsEditing(false);
    };

    const toggleDot = (dayIndex: number, habitId: string) => {
        setDraft((prev) => {
            const next = new Map(prev);
            const set = new Set(next.get(dayIndex) ?? []);
            if (set.has(habitId)) set.delete(habitId);
            else set.add(habitId);
            next.set(dayIndex, set);
            return next;
        });
    };

    const save = async () => {
        if (!hasChanges || isSaving) return;
        setIsSaving(true);

        const rows = Array.from(dirtyDays).map((dayIndex) => {
            const existing = entryByDay.get(dayIndex);
            const draftSet = draft.get(dayIndex) ?? new Set<string>();

            if (existing) {
                // Merge: start from existing habits (so soft-deleted habit ids survive),
                // then apply add/remove for visible habits based on draft.
                const merged = new Set(existing.habits ?? []);
                for (const habit of visibleHabits) {
                    if (draftSet.has(habit.id)) merged.add(habit.id);
                    else merged.delete(habit.id);
                }
                // Always include created_at so PostgREST doesn't null it out
                // via EXCLUDED.created_at when the bulk upsert mixes new/existing rows.
                // createdAt on the mapped Input is in seconds; DB stores ms.
                const existingMs = existing.createdAt !== undefined ? existing.createdAt * 1000 : undefined;
                return { id: existing.id, habits: Array.from(merged), created_at: existingMs };
            }

            // Noon of that day in ms (timezone-safe vs. day boundaries).
            const noonMs = (mondayTs + dayIndex * DAY_SECONDS + DAY_SECONDS / 2) * 1000;
            return {
                id: uuidv4(),
                habits: Array.from(draftSet),
                created_at: noonMs,
            };
        });

        const result = await dispatch(inputsActions.bulkUpsertInputs(rows));
        setIsSaving(false);
        if (inputsActions.bulkUpsertInputs.fulfilled.match(result)) {
            setDraft(new Map());
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col gap-1 p-3 bg-white shadow rounded-2xl">
            <div className="flex items-center justify-end gap-2 mb-1">
                {!isEditing ? (
                    <button
                        onClick={enterEdit}
                        className="p-1.5 rounded-full text-gray-500 hover:text-[#c2185b] hover:bg-gray-100 transition-colors"
                        aria-label="Edit"
                    >
                        <IoPencilOutline size={18} />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            aria-label="Cancel"
                        >
                            <IoClose size={20} />
                        </button>
                        <button
                            onClick={save}
                            disabled={!hasChanges || isSaving}
                            className="p-1.5 rounded-full text-white bg-[#c2185b] hover:bg-[#a31650] transition-colors disabled:opacity-40"
                            aria-label="Save"
                        >
                            <IoCheckmark size={20} />
                        </button>
                    </>
                )}
            </div>
            <div className="grid grid-cols-[2rem_6rem_1fr] items-center gap-2">
                <span />
                <span />
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
                    {DAY_LABELS.map((day, index) => (
                        <span key={index}>{day}</span>
                    ))}
                </div>
            </div>
            {visibleHabits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-[2rem_6rem_1fr] items-center gap-2">
                    <span className="text-xl">{habit.emoji}</span>
                    <span className="text-sm text-gray-700 truncate">{habit.name}</span>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 }, (_, i) => i).map((dayIndex) => {
                            const done = getDoneSet(dayIndex).has(habit.id);
                            const dirty = isDirty(dayIndex, habit.id);
                            const base = 'h-3 w-3 rounded-full mx-auto';
                            const color = done ? 'bg-[#c2185b]' : 'bg-gray-200';
                            const ring = dirty ? 'ring-2 ring-offset-1 ring-[#c2185b]' : '';
                            if (isEditing && dayIndex <= todayIndex) {
                                return (
                                    <button
                                        key={dayIndex}
                                        onClick={() => toggleDot(dayIndex, habit.id)}
                                        className={`${base} ${color} ${ring} cursor-pointer`}
                                        aria-label={`Toggle ${habit.name} day ${dayIndex + 1}`}
                                    />
                                );
                            }
                            const future = isEditing && dayIndex > todayIndex ? 'opacity-40' : '';
                            return <div key={dayIndex} className={`${base} ${color} ${future}`} />;
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
