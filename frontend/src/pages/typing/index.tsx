import { useEffect, useRef, useState, type FC } from "react";
import { Container } from "../../components/container";
import { InputController } from "../../components/input-controller";
import { useWords } from "../../hooks/use-words";

export function createTextMeasurer(font: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx === null) {
        throw new Error("woopsies");
    }
    ctx.font = font;

    return {
        measureWord(word: string) {
            return ctx.measureText(word).width;
        },

        measureWords(words: string[]) {
            return words.map((word, index) => ({
                index,
                word,
                width: ctx.measureText(word).width,
            }));
        },
    };
}

type MeasuredWord = {
    index: number;
    word: string;
    width: number;
};

type Line = MeasuredWord[];

export function buildLines(
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
            currentLine = [];
            currentLineWidth = 0;
        }
    }

    return result;
}

export const TypingPage: FC = () => {
    const { data } = useWords();
    const measurer = createTextMeasurer("500 30px JetBrains Mono");
    const containerRef = useRef<HTMLDivElement>(null);
    const [lines, setLines] = useState<Line[]>();
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [containerRef]);

    useEffect(() => {
        if (data && containerWidth !== 0) {
            const measured = measurer.measureWords(data.words);
            const lines = buildLines(
                measured,
                containerWidth,
                measurer.measureWord(" "),
            );
            setLines(lines);
        }
    }, [data, containerWidth]);

    return (
        <Container>
            <InputController>
                <div ref={containerRef} className="break-words text-3xl">
                    {lines?.map((line) => (
                        <div className="text-center">
                            {line.map((word) => (
                                <>
                                    <span>{word.word}</span>
                                    <span> </span>
                                </>
                            ))}
                        </div>
                    ))}
                </div>
            </InputController>
        </Container>
    );
};
