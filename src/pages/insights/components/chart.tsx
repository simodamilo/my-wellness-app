import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from "recharts";

export interface ChartProps {
    data: { x: number; y: number }[];
    xAxisLabel?: string;
    yAxisLabel?: string;
}

export const Chart = ({ data, xAxisLabel, yAxisLabel }: ChartProps) => {
    return (
        <ScatterChart width={300} height={240}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name={xAxisLabel} ticks={[0, 1]} domain={[0, 1]} tickFormatter={(v) => (v === 1 ? "Yes" : "No")} />
            <YAxis type="number" dataKey="y" name={yAxisLabel} domain={[0, 10]} />
            <Tooltip />
            <Scatter data={data} />
        </ScatterChart>
    );
};
