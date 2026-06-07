import { useCallback, useMemo, type FC, type RefObject } from "react";
import type { Line } from "../hooks/use-line-builder";
import { Caret } from "./caret";
import { useInputController } from "../hooks/use-input-controller";

type LineViewProps = {
    lines: Line[];
    containerRef: RefObject<HTMLDivElement | null>;
};

type ViewWindow = {
    low: number;
    high: number;
};

const LINE_AMOUNT = 5 as const;

export const LineView: FC<LineViewProps> = ({ lines, containerRef }) => {
    const { input, hasFocus } = useInputController();
    const inputWords: string[] = useMemo(() => input.split(" "), [input]);
    const window: ViewWindow = useMemo(() => {
        const currentWord = input.split(" ").length;
        let currentLine = 0;

        for (let i = 0; i < lines.length; i++) {
            if (
                currentWord >= lines[i].lowestIndex &&
                currentWord <= lines[i].highestIndex + 1
            ) {
                currentLine = i + 1;
                break;
            }
        }

        const middle = Math.ceil(LINE_AMOUNT / 2);
        if (currentLine <= middle || lines.length < LINE_AMOUNT) {
            return {
                low: 0,
                high: LINE_AMOUNT,
            };
        }

        if (currentLine + middle >= lines.length) {
            return {
                low: lines.length - LINE_AMOUNT,
                high: lines.length,
            };
        }

        return {
            low: currentLine - middle,
            high: currentLine + (LINE_AMOUNT % 2 === 0 ? middle : middle - 1),
        };
    }, [input]);

    const renderWord = useCallback(
        (placeholder: string, currentWordIdx: number) => {
            let currentWord = inputWords[currentWordIdx];
            if (currentWord === undefined) {
                return (
                    <span className="word">
                        {currentWordIdx === inputWords.length - 1 && hasFocus && (
                            <Caret></Caret>
                        )}
                        <span className="text-text-disabled">{placeholder}</span>
                        <span> </span>
                    </span>
                );
            }

            return (
                <span className="word">
                    <span
                        className={`${(currentWordIdx !== inputWords.length - 1 && currentWord !== placeholder) || currentWord.length > placeholder.length ? "underline decoration-error" : ""}`}
                    >
                        {currentWord.split("").map((letter, index) => (
                            <span
                                className={
                                    letter === placeholder[index] ? "text-text" : "text-error"
                                }
                            >
                                {placeholder[index] || letter}
                            </span>
                        ))}
                        {currentWordIdx === inputWords.length - 1 && hasFocus && (
                            <Caret></Caret>
                        )}
                        <span className="text-text-disabled">
                            {placeholder.slice(currentWord.length, placeholder.length)}
                        </span>
                    </span>
                    <span className="no-underline"> </span>
                </span>
            );
        },
        [inputWords, hasFocus],
    );

    return (
        <div ref={containerRef} className="text-center w-full">
            {lines.slice(window.low, window.high).map((line) => (
                <div className="text-5xl h-fit mb-1">
                    {line.words.map((word) => renderWord(word.word, word.index))}
                </div>
            ))}
        </div>
    );
};
