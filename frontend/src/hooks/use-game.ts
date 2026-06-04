import { useEffect } from "react";
import { create } from "zustand";
import { useWords } from "./use-words";

const WORD_PRESETS = [15, 30, 60, 120] as const;
const TIME_PRESETS = [15, 30, 60, 120] as const;

type GameConfig =
    | {
        type: "time";
        amount: (typeof TIME_PRESETS)[number];
    }
    | {
        type: "words";
        amount: (typeof WORD_PRESETS)[number];
    };

type GameStore = {
    config: GameConfig;
    setConfig: (config: GameConfig) => void;
    words: string[];
    setWords: (words: string[]) => void;
    resetConfig: () => void;
};

const gameStore = create<GameStore>((set) => ({
    config: {
        type: "time",
        amount: 30,
    },
    setConfig: (config) =>
        set({
            config,
        }),
    words: [],
    setWords: (words) =>
        set({
            words,
        }),
    resetConfig: () =>
        set({
            config: {
                type: "time",
                amount: 30,
            },
        }),
}));

export const useGameConfig = () => {
    const { resetConfig, words, setWords, config, setConfig } = gameStore();
    const { data } = useWords();

    const getNewWords = () => {
        if (data) {
            const newWords: string[] = [];
            const cap =
                config.type === "words" ? config.amount : (config.amount / 60) * 500;
            for (let i = 0; i < cap; i++) {
                newWords.push(
                    data.words[Math.floor(Math.random() * data.words.length)],
                );
            }
            setWords(newWords);
        }
    };

    useEffect(() => {
        resetConfig();
        getNewWords();
    }, [data]);

    useEffect(() => {
        getNewWords();
    }, [config, data]);

    return {
        words,
        setWords,
        config,
        setConfig,
        getNewWords,
    };
};
