import { useCallback, useMemo, type FC, type RefObject } from "react";
import type { Line } from "../hooks/use-line-builder";
import { Caret } from "./caret";

type LineViewProps = {
    lines: Line[];
    input: string;
    containerRef: RefObject<HTMLDivElement | null>;
};

type ViewWindow = {
    low: number;
    high: number;
};

export const LineView: FC<LineViewProps> = ({ lines, input, containerRef }) => {
    const inputWords: string[] = useMemo(() => input.split(" "), [input]);
    const window: ViewWindow = useMemo(() => {
        const currentWord = input.split(" ").length;
        let counter = 0;
        let currentLine = 1;

        for (let i = 0; i < lines.length; i++) {
            if (counter >= currentWord) {
                currentLine = i;
                break;
            }

            counter = lines[i].highestIndex;
        }

        if (currentLine <= 3) {
            return {
                low: 0,
                high: 5,
            };
        }

        return {
            low: currentLine - 3,
            high: currentLine + 2,
        };
    }, [input]);

    const renderWord = useCallback(
        (placeholder: string, currentWordIdx: number) => {
            const a = inputWords[currentWordIdx];
            if (a === undefined) {
                return (
                    <span className="word">
                        {currentWordIdx === inputWords.length - 1 && <Caret></Caret>}
                        <span className="text-text-disabled">{placeholder}</span>
                        <span> </span>
                    </span>
                );
            }

            const b = placeholder.slice(a.length, placeholder.length);
            return (
                <span className="word">
                    <span
                        className={`${currentWordIdx !== inputWords.length - 1 && a !== placeholder ? "underline decoration-error" : ""}`}
                    >
                        {a.split("").map((letter, index) => (
                            <span
                                className={
                                    letter === placeholder[index] ? "text-text" : "text-error"
                                }
                            >
                                {letter}
                            </span>
                        ))}
                        {currentWordIdx === inputWords.length - 1 && <Caret></Caret>}
                        <span className="text-text-disabled">{b}</span>
                    </span>
                    <span className="no-underline"> </span>
                </span>
            );
        },
        [inputWords],
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
