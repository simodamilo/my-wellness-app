import {habits, moods} from '../../../utils/constants.ts';
import {Cell, Pie, PieChart} from 'recharts';
import {type ReactNode, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {Input} from '../../../store/inputs/types.ts';
import {Select, Tooltip as AntdTooltip} from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#f083ae'];

interface DashboardProps {
    inputs: Input[];
}

const fillMissingDates = (logs: Input[]): Input[] => {
    if (logs.length === 0) return [];

    // Sort logs
    const sorted = [...logs].sort((a, b) => a.createdAt! - b.createdAt!);

    // Helper: convert timestamp → YYYY-MM-DD key
    const dayKey = (ts: number) => {
        const d = new Date(ts * 1000);
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        return `${y}-${m}-${day}`;
    };

    // Map day -> log for quick lookup
    const dayMap = new Map<string, Input>();
    sorted.forEach(log => {
        const key = dayKey(log.createdAt!);
        if (!dayMap.has(key)) dayMap.set(key, log); // keep first log of that day
    });

    // Determine first and last day
    const first = new Date(sorted[0].createdAt! * 1000);
    first.setUTCHours(0, 0, 0, 0);
    const last = new Date(sorted[sorted.length - 1].createdAt! * 1000);
    last.setUTCHours(0, 0, 0, 0);

    // Iterate calendar days
    const result: Input[] = [];
    let missingId = 1;

    for (
        let d = new Date(first);
        d <= last;
        d.setUTCDate(d.getUTCDate() + 1)
    ) {
        const key = dayKey(Math.floor(d.getTime() / 1000));

        if (dayMap.has(key)) {
            result.push(dayMap.get(key)!);
        } else {
            result.push({
                id: (missingId++).toString(),
                createdAt: Math.floor(d.getTime() / 1000),
                mood: undefined,
                energyLevel: undefined,
                bodyFeeling: undefined,
                bodyFeelingDiscomfort: [],
                habits: [],
                periodInfo: undefined,
                notes: undefined,
                sleep: undefined,
                nutritionQuality: undefined
            });
        }
    }

    return result;
};

export const Dashboard = (props: DashboardProps) => {
    const { t } = useTranslation();

    const [period, setPeriod] = useState<number>(30);

    const { habitData, moodData } = useMemo(() => {
        // Take the top 'period' inputs sorted by createdAt
        const topInputs = fillMissingDates(props.inputs)
            .sort((a, b) => (b.createdAt! - a.createdAt!))
            .slice(0, period);

        // Calculate habits
        const habitData = habits.map(habit => {
            const count = topInputs.reduce((acc, input) => {
                if (input.habits && input.habits.includes(habit.id)) {
                    return acc + 1;
                }
                return acc;
            }, 0);

            return {
                name: habit.label,
                id: habit.id,
                value: count,
                emoji: habit.emoji,
            };
        });

        // Calculate moods
        const moodData = moods.map(mood => {
            const count = topInputs.reduce((acc, input) => {
                if (input.mood === mood.id) {
                    return acc + 1;
                }
                return acc;
            }, 0);

            return {
                name: mood.label,
                id: mood.id,
                value: count,
                emoji: mood.emoji,
            };
        });

        return { habitData, moodData };
    }, [props.inputs, period]);

    // Used for last x days calculation
    const printLast30Days = useCallback((): ReactNode => {
        return (
            <div className="flex gap-2 w-full justify-between text-xl">
                {
                    habitData.map((habit) => (
                        <AntdTooltip key={habit.id} title={t(habit.name)}>
                            <div>
                                {habit.emoji} {habit.value}
                            </div>
                        </AntdTooltip>
                    ))
                }
            </div>
        );
    }, [habitData, t]);

    // Used for pie chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        index: number;
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (!moodData[index].value) {
            return;
        }

        return (
            <text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
                {t(moodData[index].name)}: {moodData[index].value}
            </text>
        );
    };

    const handleChange = (value: string) => {
        setPeriod(parseInt(value));
    };

    return (
        <>
            <h2 className="text-xl font-semibold">{t('INSIGHTS.DASHBOARD_TITLE')}</h2>
            <div className="flex flex-col gap-4 p-3 bg-white shadow rounded-2xl">
                <div className="flex gap-2 items-center">
                    {t('INSIGHTS.LAST_LABEL')}
                    <Select
                        value={period.toString()}
                        style={{ width: 80 }}
                        onChange={handleChange}
                        options={[
                            { value: '7', label: '7' },
                            { value: '30', label: '30' },
                            { value: '90', label: '90' },
                        ]}
                    />
                    {t('INSIGHTS.DAYS_LABEL')}
                </div>
                <div>
                    {printLast30Days()}
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full text-left">{t('INSIGHTS.MOOD_TITLE')}</div>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={moodData}
                            dataKey="value"
                            nameKey="name"
                            fill="#8884d8"
                            labelLine={false}
                            // @ts-expect-error not an error
                            label={renderCustomLabel}
                        >
                            {
                                // @ts-expect-error not an error
                                moodData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} width={20} height={20}/>
                                ))
                            }
                        </Pie>
                    </PieChart>
                </div>
            </div>
        </>
    );
}
