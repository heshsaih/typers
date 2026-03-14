import { type FC } from "react";
import { Heading } from "../../components/heading";

type WordCounterProps = {
    initialAmount: number;
    currentWord: number;
    isPlaying: boolean;
};

export const WordCounter: FC<WordCounterProps> = ({
    initialAmount,
    currentWord,
    isPlaying,
}) => {
    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {initialAmount - currentWord} {!isPlaying && "words"}
            </Heading>
        </div>
    );
};
