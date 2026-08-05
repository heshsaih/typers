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
} from 'recharts';
import { JsonDisplay } from "../../components/json-display";

type SummaryProps = {
    result?: GameResult;
};

export const Summary: FC<SummaryProps> = ({ result }) => {
    const data = result?.timeMeasurements.map(a => ({
        time: a.time,
        wpm: Math.round(((a.words / (a.time) * 60) + Number.EPSILON) * 100) / 100
    }))

    return (
        <Container>
            <ResponsiveContainer width={"100%"} height={400}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="#353138" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#9e9d9d', fontSize: 16 }}
                        axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                        dataKey={"wpm"}
                        tick={{ fill: '#9e9d9d', fontSize: 16 }}
                        axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#353138',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#d47024"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#d47024', strokeWidth: 0, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <JsonDisplay data={result}></JsonDisplay>
        </Container>
    );
};
