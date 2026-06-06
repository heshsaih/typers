import { useEffect, type FC } from "react";
import { Container } from "../../components/container";
import { InputController } from "../../components/input-controller";
import { useLineBuilder } from "../../hooks/use-line-builder";
import { LineView } from "../../components/line-view";
import { Button } from "../../components/button";
import { ConfigDisplay } from "../../components/config-display";
import { Heading } from "../../components/heading";
import { useInputController } from "../../hooks/use-input-controller";
import { useTimeGameLoop, useWordGameLoop } from "../../hooks/use-game-loop";
import { useGameConfig } from "../../hooks/use-game-config";

export const TypingPage: FC = () => {
    const { config, words, getNewWords } = useGameConfig();
    const { lines, containerRef } = useLineBuilder(words);
    const { input, setInput, inputRef, hasFocus } = useInputController();
    const timeGameLoop = useTimeGameLoop();
    const wordGameLoop = useWordGameLoop();
    const { remainingToFinish, start, restart, state } =
        config.type === "time" ? timeGameLoop : wordGameLoop;

    useEffect(() => {
        if (input.length !== 0 && state !== "in-progress") {
            start();
        }
    }, [input, state]);

    const label = config.type === "time" ? "seconds" : "words";

    return (
        <Container>
            <Heading type="h1">
                {remainingToFinish} {state === "waiting" && label}
            </Heading>
            <ConfigDisplay disabled={state === "in-progress"}></ConfigDisplay>
            <InputController>
                <LineView
                    containerRef={containerRef}
                    lines={lines}
                    input={input}
                    hasFocus={hasFocus}
                ></LineView>
            </InputController>
            <Button
                className="text-2xl px-6 py-3 mt-15"
                onClick={() => {
                    getNewWords();
                    setInput("");
                    restart();
                    inputRef?.current?.focus();
                }}
            >
                reset
            </Button>
        </Container>
    );
};
