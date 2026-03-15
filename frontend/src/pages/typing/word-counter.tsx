import { useEffect, type FC } from "react";
import { Heading } from "../../components/heading";

type WordCounterProps = {
    initialAmount: number;
    currentWord: number;
    isPlaying: boolean;
    finishLoop: () => void;
};

export const WordCounter: FC<WordCounterProps> = ({
    initialAmount,
    currentWord,
    isPlaying,
    finishLoop,
}) => {
    useEffect(() => {
        if (initialAmount - currentWord === 0) {
            finishLoop();
        }
    }, [currentWord]);

    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {initialAmount - currentWord} {!isPlaying && "words"}
            </Heading>
        </div>
    );
};
