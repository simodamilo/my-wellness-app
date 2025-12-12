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

export const Dashboard = (props: DashboardProps) => {
    const { t } = useTranslation();

    const [period, setPeriod] = useState<number>(30);

    const { habitData, moodData } = useMemo(() => {
        // Take the top 'period' inputs sorted by createdAt
        const topInputs = [...props.inputs]
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
                            label={renderCustomLabel}
                        >
                            {moodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} width={20} height={20}/>
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>
        </>
    );
}
