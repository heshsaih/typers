import { type FC } from "react";
import type { GameResult } from "../../hooks/use-game-loop";

type SummaryProps = {
    result?: GameResult;
};

export const Summary: FC<SummaryProps> = ({ result }) => {
    return (
        <div>
            niezle byniu
            <span>{JSON.stringify(result)}</span>
        </div>
    );
};
