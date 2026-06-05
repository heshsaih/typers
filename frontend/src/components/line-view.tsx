import { useCallback, useMemo, type FC, type RefObject } from "react";
import type { Line } from "../hooks/use-line-builder";

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
        const currentWord = input.split(" ").length - 1;
        let counter = 0;
        let currentLine = 1;

        for (let i = 0; i < lines.length; i++) {
            if (counter >= currentWord) {
                currentLine = i;
                break;
            }

            counter = lines[i].highestIndex;
        }

        if (currentLine <= 4) {
            return {
                low: 0,
                high: 8,
            };
        }

        return {
            low: currentLine - 4,
            high: currentLine + 4,
        };
    }, [input]);

    const renderWord = useCallback(
        (placeholder: string, currentWordIdx: number) => {
            const a = inputWords[currentWordIdx];
            if (!a) {
                return (
                    <span className="word">
                        <span className="text-text-disabled">{placeholder}</span>
                        <span> </span>
                    </span>
                );
            }

            const b = placeholder.slice(a.length, placeholder.length);
            return (
                <span className={`word `}>
                    <span>
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
                            <span className="text-text-disabled">{b}</span>
                        </span>
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
                <div className="text-4xl">
                    {line.words.map((word) => renderWord(word.word, word.index))}
                </div>
            ))}
        </div>
    );
};
