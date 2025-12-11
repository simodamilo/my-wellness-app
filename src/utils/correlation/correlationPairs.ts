import type { ChartProps } from "../../pages/insights/components/chart";
import type { Input } from "../../store/inputs/types";

interface InsightRule {
    name: string; // description of the insight
    x: (log: Input) => number; // how to extract variable X from a log
    y: (log: Input) => number; // how to extract variable Y from a log
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
    chart: ChartProps;
}

export const insightRules: InsightRule[] = [
    {
        name: "Gym → Body Feeling",
        x: (log) => (log.habits?.includes("gym") ? 1 : 0),
        y: (log) => log.bodyFeeling ?? 0,
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
        positiveMessage: "You tend to feel better on days you take creatina",
        averageMessage: "It seems creatina does not have impact on your body",
        negativeMessage: "Creatina days seem to make you fell worse — maybe try a different technique",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
    {
        name: "Gym → sleep quality",
        x: (log) => (log.habits?.includes("gym") ? 1 : 0),
        y: (log) => log.sleep ?? 0,
        positiveMessage: "You tend to sleep better on days you go to the gym",
        averageMessage: "It seems gym does not have impact on your sleep",
        negativeMessage: "Gym days seem to make you sleep worse — maybe you push too hard",
        thresholdNegative: -0.1,
        thresholdPositive: 0.1,
    },
];
