import type { FC, TextareaHTMLAttributes } from "react";
import { Paragraph } from "./paragraph";
import type { LetterStatus } from "../types";

type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    words?: Array<Array<{ letter: string; status: LetterStatus }>>;
};

export const TextField: FC<TextFieldProps> = ({
    words,
    className,
    style,
    ...rest
}) => {
    return (
        <p className="text-3xl text-center w-full whitespace-normal break-words">
            {words?.map((word) => (
                <span>
                    {word.map((letter) => {
                        const color = (() => {
                            switch (letter.status) {
                                case "NOT-TYPED":
                                    return "text-text-disabled";
                                case "CORRECT":
                                    return "text-text";
                                case "INCORRECT":
                                    return "text-error";
                            }
                        })();
                        return <span className={color}>{letter.letter}</span>;
                    })}
                    <span> </span>
                </span>
            ))}
        </p>
    );
};
