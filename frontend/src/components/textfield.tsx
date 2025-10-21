import { type FC, type TextareaHTMLAttributes } from "react";
import type { Letter, LetterStatus } from "../hooks/use-words";
import { Cursor } from "./cursor";

type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    words?: Array<Array<Letter>>;
    wordIdx: number;
    letterIdx: number;
};

const colors: Record<LetterStatus, string> = {
    "NOT-TYPED": "text-text-disabled",
    CORRECT: "text-text",
    INCORRECT: "text-error",
};

export const TextField: FC<TextFieldProps> = ({
    words,
    wordIdx,
    letterIdx,
}) => {
    console.log(wordIdx, letterIdx);
    return (
        <div className="relative text-3xl w-full text-center">
            {words?.map((word, wIdx) => (
                <div className="inline">
                    {word.map((letter, lIdx) => (
                        <>
                            {wIdx === wordIdx && lIdx === letterIdx && <Cursor></Cursor>}
                            <span className={`${colors[letter.status]}`}>
                                {letter.letter}
                            </span>
                        </>
                    ))}
                    <span> </span>
                </div>
            ))}
        </div>
    );
};
