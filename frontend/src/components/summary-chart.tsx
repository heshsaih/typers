import { type FC } from "react";
import { Line, LineChart } from "recharts";

export const SummaryChart: FC = () => {
    const data = [];
    return (
        <div>
            <LineChart
                style={{ width: "100%", aspectRatio: 1.618, maxWidth: 600 }}
                responsive
                data={data}
            >
                <Line dataKey="uv" />
            </LineChart>
        </div>
    );
};
