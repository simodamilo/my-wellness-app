import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Input } from '../../../store/inputs/types.ts';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EnergyTrendProps {
    inputs: Input[];
}

const DAY_SECONDS = 24 * 60 * 60;

// createdAt stored as ms since epoch (see inputs.mapper.ts#toSeconds).
const toSeconds = (ts?: number): number | undefined => {
    if (ts === undefined || ts === null) return undefined;
    return ts > 1e11 ? Math.floor(ts / 1000) : ts;
};

export const EnergyTrend = (props: EnergyTrendProps) => {
    const { t, i18n } = useTranslation();

    const data = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const todayStart = Math.floor(now.getTime() / 1000);
        const cutoff = todayStart - 29 * DAY_SECONDS;

        // Most recent energy value per day within the last 30 days.
        const byDay = new Map<number, { secs: number; value: number }>();
        for (const input of props.inputs) {
            if (input.energyLevel === undefined || input.energyLevel === null) continue;
            const secs = toSeconds(input.createdAt);
            if (secs === undefined || secs < cutoff) continue;
            const dayIndex = Math.floor((secs - cutoff) / DAY_SECONDS);
            if (dayIndex < 0 || dayIndex > 29) continue;
            const existing = byDay.get(dayIndex);
            if (!existing || existing.secs < secs) {
                byDay.set(dayIndex, { secs, value: input.energyLevel });
            }
        }

        const formatter = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' });
        return Array.from({ length: 30 }, (_, i) => i).map((dayIndex) => {
            const dateMs = (cutoff + dayIndex * DAY_SECONDS) * 1000;
            return {
                label: formatter.format(new Date(dateMs)),
                energy: byDay.get(dayIndex)?.value ?? null,
            };
        });
    }, [props.inputs, i18n.language]);

    return (
        <div className="flex flex-col gap-3 p-3 bg-white shadow rounded-2xl">
            <h2 className="text-sm font-semibold text-gray-700">{t('INSIGHTS.ENERGY_TREND.TITLE')}</h2>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} interval={6} tickLine={false} axisLine={false} />
                        <YAxis domain={[1, 10]} ticks={[1, 5, 10]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }}
                            formatter={(value: number) => [value, t('INSIGHTS.ENERGY_TREND.TITLE')]}
                        />
                        <Line type="monotone" dataKey="energy" stroke="#c2185b" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
