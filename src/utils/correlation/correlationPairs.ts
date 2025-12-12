import type { Input } from "../../store/inputs/types";

interface InsightRule {
    name: string; // description of the insight
    x: (log: Input) => number; // how to extract variable X from a log
    y: (log: Input) => number; // how to extract variable Y from a log
    defaultX: number;
    defaultY: number;
    positiveMessage: string;
    averageMessage?: string;
    negativeMessage?: string;
    thresholdNegative?: number;
    thresholdPositive?: number;
}

export interface CorrelationResult {
    name: string;
    message: string;
    correlation: number;
    chart: any;
}

export const insightRules: InsightRule[] = [
    {
        name: "Gym → Body Feeling",
        x: (log) => (log.habits?.includes("gym") ? 1 : 0),
        y: (log) => log.bodyFeeling ?? 0,
        defaultX: 0,
        defaultY: 5,
        positiveMessage: "You tend to feel better on days you go to the gym",
        averageMessage: "It seems gym does not have impact on your body",
        negativeMessage: "Gym days seem to make you fell worse — maybe you push too hard",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
    {
        name: "Meditation → Body Feeling",
        x: (log) => (log.habits?.includes("meditation") ? 1 : 0),
        y: (log) => log.bodyFeeling ?? 0,
        defaultX: 0,
        defaultY: 5,
        positiveMessage: "You tend to feel better on days you do meditation",
        averageMessage: "It seems meditation does not have impact on your body",
        negativeMessage: "Meditation days seem to make you fell worse — maybe try a different technique",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
    {
        name: "Creatina → Body Feeling",
        x: (log) => (log.habits?.includes("creatina") ? 1 : 0),
        y: (log) => log.bodyFeeling ?? 0,
        defaultX: 0,
        defaultY: 5,
        positiveMessage: "You tend to feel better on days you take creatina",
        averageMessage: "It seems creatina does not have impact on your body",
        negativeMessage: "Creatina days seem to make you fell worse — maybe try a different technique",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
    {
        name: "Gym → Sleep Quality",
        x: (log) => (log.habits?.includes("gym") ? 1 : 0),
        y: (log) => log.sleep ?? 0,
        defaultX: 0,
        defaultY: 5,
        positiveMessage: "You tend to sleep better on days you go to the gym",
        averageMessage: "It seems gym does not have impact on your sleep",
        negativeMessage: "Gym days seem to make you sleep worse — maybe you push too hard",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
];

const generateDateRange = (start: number, end: number) => {
    const oneDay = 24 * 60 * 60;
    const days = [];

    for (let d = start; d <= end; d += oneDay) {
        days.push(d);
    }

    return days;
};

export const fillMissingDates = (
    logs: Input[],
    getX: (i: Input) => number,
    getY: (i: Input) => number,
    defaultX: number,
    defaultY: number
) => {
    if (logs.length === 0) return [];

    // Sort logs (important!)
    const sorted = [...logs].sort((a, b) => a.createdAt! - b.createdAt!);

    // Helper: normalize timestamp → midnight (00:00:00) of that day
    const normalizeToMidnight = (ts: number) => {
        const d = new Date(ts * 1000);
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000); // convert back to seconds
    };

    // Build map keyed by "day timestamp at midnight"
    const logsByDay = new Map(
        sorted.map(l => [normalizeToMidnight(l.createdAt!), l])
    );

    const start = normalizeToMidnight(sorted[0].createdAt!);
    const end = normalizeToMidnight(sorted[sorted.length - 1].createdAt!);

    // generateDateRange must return MIDNIGHT timestamps
    const dates = generateDateRange(start, end); // <-- now matches keys

    return dates.map(date => {
        const log = logsByDay.get(date);

        return {
            date,                  // numeric timestamp at midnight
            x: log ? getX(log) : defaultX,
            y: log ? getY(log) : defaultY
        };
    });
};


