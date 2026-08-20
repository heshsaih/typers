import { useEffect, useMemo, useState } from "react";
import { useInputController } from "./use-input-controller";
import { useGameConfig, type GameType } from "./use-game-config";

type GameState = "waiting" | "in-progress" | "finished";

type TimeMeasurement = {
    time: number;
    words: number;
};

type LetterStatistics = {
    correct: number;
    incorrect: number;
    extra: number;
    missing: number;
};

export type GameResult = {
    wpm: number;
    accuracy: number;
    timeMeasurements: TimeMeasurement[];
    letterStatistics: LetterStatistics;
};

export interface GameLoop {
    start: () => void;
    update: () => void;
    finish: () => void;
    restart: () => void;
    state: GameState;
    remainingToFinish: number;
    result?: GameResult;
}

const calculateResult = (
    input: string,
    placeholders: string[],
    timeMeasurements: TimeMeasurement[],
): GameResult => {
    if (timeMeasurements.length === 0) {
        return {
            timeMeasurements: [],
            letterStatistics: {
                incorrect: 67,
                correct: 67,
                missing: 67,
                extra: 67
            },
            wpm: 67,
            accuracy: 0.67
        }
    }
    const startTime = timeMeasurements[0].time;
    const inputWords = input.split(" ");

    const wpm = inputWords.length / timeMeasurements.length * 60;
    timeMeasurements = timeMeasurements.map((measurement) => ({
        words: measurement.words,
        time: Math.floor((measurement.time - startTime) / 1000) + 1,
    }));
    let accurateWords = 0;
    const letterStatistics: LetterStatistics = {
        correct: 0,
        incorrect: 0,
        extra: 0,
        missing: 0,
    };
    const amount = Math.min(inputWords.length, placeholders.length);

    for (let i = 0; i < amount; i++) {
        const inputWord = inputWords[i];
        const placeholder = placeholders[i];

        if (inputWord === placeholder) {
            accurateWords++;
        }

        if (inputWord.length > placeholder.length) {
            letterStatistics.extra += inputWord.length - placeholder.length;
        } else if (inputWord.length < placeholder.length) {
            letterStatistics.missing += placeholder.length - inputWord.length;
        }

        let length = Math.min(inputWord.length, placeholder.length);

        for (let j = 0; j < length; j++) {
            if (inputWord[j] === placeholder[j]) {
                letterStatistics.correct += 1;
            } else {
                letterStatistics.incorrect += 1;
            }
        }
    }

    return {
        wpm,
        accuracy: letterStatistics.correct / (letterStatistics.correct + letterStatistics.extra + letterStatistics.missing + letterStatistics.incorrect),
        timeMeasurements,
        letterStatistics,
    };
};

export const useTimeGameLoop = (): GameLoop => {
    const [state, setState] = useState<GameState>("waiting");
    const { config, words } = useGameConfig();
    const [timeRemaining, setTimeRemaining] = useState<number>(config.amount);
    const { hasFocus, input } = useInputController();
    const [timeMeasurements, setTimeMeasurements] = useState<TimeMeasurement[]>(
        [],
    );
    const [result, setResult] = useState<GameResult>();

    useEffect(() => {
        setTimeRemaining(config.amount);
    }, [config.amount]);

    const start = () => {
        if (hasFocus) {
            setTimeMeasurements([]);
            setState("in-progress");
        }
    };

    const finish = () => {
        setState("finished");
    };

    const update = () => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);
        const newTimeMeasurements = [
            ...timeMeasurements,
            {
                time: Date.now(),
                words: input.split(" ").length,
            },
        ];
        setTimeMeasurements(newTimeMeasurements);

        if (newTime === 0) {
            setResult(calculateResult(input, words, newTimeMeasurements));
            finish();
        }
    };

    useEffect(() => {
        let timeout: number;
        if (config.type === "time" && state === "in-progress") {
            timeout = setTimeout(() => update(), 1000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [timeRemaining, state, config]);

    const restart = () => {
        setState("waiting");
        setTimeRemaining(config.amount);
    };

    return {
        start,
        update,
        finish,
        restart,
        state,
        remainingToFinish: timeRemaining,
        result,
    };
};

export const useWordGameLoop = (): GameLoop => {
    const [state, setState] = useState<GameState>("waiting");
    const { config, words } = useGameConfig();
    const [wordsRemaining, setWordsRemaining] = useState<number>(config.amount);
    const { input } = useInputController();
    const wordsFromInput = useMemo(() => input.split(" "), [input]);
    const [timeMeasurements, setTimeMeasurements] = useState<TimeMeasurement[]>(
        [],
    );
    const [result, setResult] = useState<GameResult>();

    useEffect(() => {
        setWordsRemaining(config.amount);
    }, [config.amount]);

    useEffect(() => {
        let timeout: number;
        if (config.type === "words" && state === "in-progress") {
            timeout = setTimeout(() => {
                setTimeMeasurements([
                    ...timeMeasurements,
                    {
                        time: Date.now(),
                        words: input.split(" ").length,
                    },
                ]);
            }, 1000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [config, state, timeMeasurements, setTimeMeasurements]);

    const start = () => {
        setTimeMeasurements([]);
        setState("in-progress");
    };

    const finish = () => {
        setState("finished");
    };

    const update = () => {
        const newWordsRemaining = config.amount - wordsFromInput.length;
        setWordsRemaining(newWordsRemaining);

        if ((newWordsRemaining === 0 && wordsFromInput[words.length - 1].length === words[words.length - 1].length) || newWordsRemaining < 0) {
            finish();
            setResult(calculateResult(input, words, timeMeasurements));
        }
    };

    const restart = () => {
        setState("waiting");
        setWordsRemaining(config.amount);
    };

    useEffect(() => {
        if (config.type === "words" && state === "in-progress") update();
    }, [wordsFromInput, state, config]);

    return {
        start,
        update,
        finish,
        restart,
        state,
        remainingToFinish: wordsRemaining,
        result,
    };
};

export const useGameLoop: (type: GameType) => GameLoop = (type) => {
    const timeLoop = useTimeGameLoop();
    const wordLoop = useWordGameLoop();

    switch (type) {
        case "time":
            return timeLoop;
        case "words":
            return wordLoop;
    }
};
