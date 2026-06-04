import { useCallback, useMemo } from "react";

export type MeasuredWord = {
    index: number;
    word: string;
    width: number;
};

export const useTextMeasure = (font: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx === null) {
        throw new Error("woopsies");
    }
    ctx.font = font;

    const measureWord: (word: string) => number = useCallback(
        (word) => ctx.measureText(word).width,
        [ctx],
    );

    const measureWords: (words: string[]) => MeasuredWord[] = useCallback(
        (words: string[]) =>
            words.map((word, index) => ({
                index,
                word,
                width: ctx.measureText(word).width,
            })),
        [ctx],
    );

    const spaceWidth = useMemo(() => ctx.measureText(" ").width, [ctx]);

    return {
        measureWord,
        measureWords,
        spaceWidth,
    };
};
