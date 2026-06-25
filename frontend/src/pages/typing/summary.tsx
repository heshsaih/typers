import { type FC } from "react";
import type { GameResult } from "../../hooks/use-game-loop";
import { SummaryChart } from "../../components/summary-chart";
import { Container } from "../../components/container";

type SummaryProps = {
    result?: GameResult;
};

export const Summary: FC<SummaryProps> = ({ result }) => {
    return (
        <Container>
            <span>{JSON.stringify(result)}</span>
            <SummaryChart></SummaryChart>
        </Container>
    );
};
