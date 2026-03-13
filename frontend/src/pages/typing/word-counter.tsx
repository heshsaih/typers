import { type FC } from "react";
import { Heading } from "../../components/heading";

type WordCounterProps = {
    initialAmount:  number;
    currentWord: number;
};

export const WordCounter: FC<WordCounterProps> = ({
    initialAmount,
    currentWord,
}) => {
    return (
        <div>
            <Heading className="text-text-disabled" type="h1">
                {initialAmount - currentWord}
            </Heading>
        </div>
    );
};
