import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useTextMeasure, type MeasuredWord } from "./useTextMeasure";

type Line = MeasuredWord[];

function buildLines(
    words: MeasuredWord[],
    containerWidth: number,
    spaceWidth: number,
): Line[] {
    const result: Line[] = [];
    let currentLine: Line = [];
    let currentLineWidth = 0;

    for (let i = 0; i < words.length; i++) {
        const newWidth = currentLineWidth + words[i].width;
        if (newWidth < containerWidth) {
            currentLine.push(words[i]);
            currentLineWidth = newWidth + spaceWidth;
        } else {
            result.push(currentLine);
            currentLine = [words[i]];
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
