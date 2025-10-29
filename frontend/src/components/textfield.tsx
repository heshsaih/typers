import { type FC, type TextareaHTMLAttributes } from "react";
import { Cursor } from "./cursor";
import type { Letter, LetterStatus } from "../hooks/use-typing-logic";

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
    return (
        <div className="relative text-3xl w-full text-center">
            {words?.map((word, wIdx) => (
                <div className="inline">
                    <span> </span>
                    {word.map((letter, lIdx) => (
                        <>
                            {wIdx === wordIdx && lIdx === letterIdx && <Cursor></Cursor>}
                            <span className={`${colors[letter.status]}`}>
                                {letter.letter}
                            </span>
                        </>
                    ))}
                    {wIdx === wordIdx && letterIdx === word.length && <Cursor></Cursor>}
                </div>
            ))}
        </div>
    );
};
