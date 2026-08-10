import { type FC } from "react";
import type { GameResult } from "../../hooks/use-game-loop";
import { Container } from "../../components/container";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { JsonDisplay } from "../../components/json-display";
import { useGameConfig } from "../../hooks/use-game-config";
import { round } from "../../util";

type SummaryProps = {
    result: GameResult;
};

export const Summary: FC<SummaryProps> = ({ result }) => {
    const data = result.timeMeasurements.map((a) => ({
        time: a.time,
        wpm: round(a.words / a.time * 60, 2),
    }));
    const {config} = useGameConfig();

    return (
        <Container>
            <JsonDisplay label="config" inline data={config}></JsonDisplay>
            <ResponsiveContainer width={"100%"} height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid stroke="#353138" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: "#9e9d9d", fontSize: 16 }}
                        axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                        dataKey={"wpm"}
                        tick={{ fill: "#9e9d9d", fontSize: 16 }}
                        axisLine={{ stroke: "#d1d5db" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#353138",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#d47024"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#d47024", strokeWidth: 0, stroke: "#fff" }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center w-full">
                <JsonDisplay
                    label="test stats"
                    data={{
                        wpm: round(result.wpm, 2),
                        accuracy: `${round(result.accuracy * 100, 2)}%`,
                    }}
                ></JsonDisplay>
                <JsonDisplay label="letter stats" data={result.letterStatistics}></JsonDisplay>
            </div>
        </Container>
    );
};
