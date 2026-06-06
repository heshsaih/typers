import { useEffect, useMemo, useState } from "react";
import { useInputController } from "./use-input-controller";
import { useGameConfig } from "./use-game-config";

type GameState = "waiting" | "in-progress" | "finished";

export interface GameLoop {
    start: () => void;
    update: () => void;
    finish: () => void;
    restart: () => void;
    state: GameState;
    remainingToFinish: number;
}

export const useTimeGameLoop = (): GameLoop => {
    const [state, setState] = useState<GameState>("waiting");
    const { config } = useGameConfig();
    const [timeRemaining, setTimeRemaining] = useState<number>(config.amount);
    const { hasFocus, input } = useInputController();

    useEffect(() => {
        setTimeRemaining(config.amount);
    }, [config.amount]);

    const start = () => {
        if (hasFocus) {
            setState("in-progress");
        }
    };

    const finish = () => {
        setState("finished");
        alert(`${(input.split(" ").length / config.amount) * 60} wpm 🫃`);
    };

    const update = () => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);

        if (newTime === 0) {
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
    };
};

export const useWordGameLoop = (): GameLoop => {
    const [state, setState] = useState<GameState>("waiting");
    const { config } = useGameConfig();
    const [wordsRemaining, setWordsRemaining] = useState<number>(config.amount);
    const { input } = useInputController();
    const wordsAmount = useMemo(() => input.split(" ").length, [input]);
    const [startTime, setStartTime] = useState<number>();

    useEffect(() => {
        setWordsRemaining(config.amount);
    }, [config.amount]);

    const start = () => {
        setStartTime(Date.now());
        setState("in-progress");
    };

    const finish = () => {
        alert(
            `${input.split(" ").length * (60000 / (Date.now() - startTime!))} wpm 🫃`,
        );
        setState("finished");
    };

    const update = () => {
        const newWordsRemaining = config.amount - wordsAmount;
        setWordsRemaining(newWordsRemaining);

        if (newWordsRemaining === -1) {
            finish();
        }
    };

    const restart = () => {
        setState("waiting");
        setWordsRemaining(config.amount);
    };

    useEffect(() => {
        if (state === "in-progress") update();
    }, [wordsAmount, state]);

    return {
        start,
        update,
        finish,
        restart,
        state,
        remainingToFinish: wordsRemaining,
    };
};
