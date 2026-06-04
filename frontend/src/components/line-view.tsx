import { useMemo, type FC, type RefObject } from "react";
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

    return (
        <div ref={containerRef} className="text-text-disabled text-center">
            {lines.slice(window.low, window.high).map((line) => (
                <div className="text-3xl">
                    {line.words.map((word) => (
                        <>
                            <span>{word.word}</span>
                            <span> </span>
                        </>
                    ))}
                </div>
            ))}
        </div>
    );
};
