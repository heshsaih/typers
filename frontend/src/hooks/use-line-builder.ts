import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useTextMeasure, type MeasuredWord } from "./use-text-measure";

export type Line = {
    words: MeasuredWord[];
    highestIndex: number;
};

function buildLines(
    words: MeasuredWord[],
    containerWidth: number,
    spaceWidth: number,
): Line[] {
    const result: Line[] = [];
    let currentLineWords: MeasuredWord[] = [];
    let currentLineWidth = 0;

    for (let i = 0; i < words.length; i++) {
        const newWidth = currentLineWidth + words[i].width;
        if (newWidth < containerWidth) {
            currentLineWords.push(words[i]);
            currentLineWidth = newWidth + spaceWidth;
        } else {
            result.push({
                words: currentLineWords,
                highestIndex: i - 1,
            });
            currentLineWords = [words[i]];
            currentLineWidth = words[i].width + spaceWidth;
        }
    }

    return result;
}

type UseLineBuilder = {
    lines: Line[];
    containerRef: RefObject<HTMLDivElement | null>;
};

export const useLineBuilder = (words: string[]): UseLineBuilder => {
    const { spaceWidth, measureWords } = useTextMeasure(
        "500 30px JetBrains Mono",
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const lines: Line[] = useMemo(
        () => buildLines(measureWords(words), containerWidth, spaceWidth),
        [words, containerWidth, spaceWidth],
    );

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [containerRef]);

    return {
        lines,
        containerRef,
    };
};
