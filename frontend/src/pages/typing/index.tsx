import { useEffect, type FC } from "react";
import { Container } from "../../components/container";
import { InputController } from "../../components/input-controller";
import { useLineBuilder } from "../../hooks/use-line-builder";
import { LineView } from "../../components/line-view";
import { Button } from "../../components/button";
import { ConfigDisplay } from "../../components/config-display";
import { Heading } from "../../components/heading";
import { useInputController } from "../../hooks/use-input-controller";
import { useGameLoop } from "../../hooks/use-game-loop";
import { useGameConfig } from "../../hooks/use-game-config";

export const TypingPage: FC = () => {
    const { config, words, getNewWords } = useGameConfig();
    const { lines, containerRef } = useLineBuilder(words);
    const { input, setInput, inputRef } = useInputController();
    const { remainingToFinish, start, restart, state } = useGameLoop(config.type);

    useEffect(() => {
        if (input.length !== 0 && state === "waiting") {
            start();
        }
    }, [input, state]);

    return (
        <Container>
            <Heading type="h1">
                {state === "waiting" &&
                    `${config.amount} ${config.type === "time" ? "seconds" : "words"}`}
                {state === "in-progress" && remainingToFinish}
                {state === "finished" && "wp wp"}
            </Heading>
            {state !== "finished" && (
                <>
                    <ConfigDisplay disabled={state === "in-progress"}></ConfigDisplay>
                    <InputController>
                        <LineView containerRef={containerRef} lines={lines}></LineView>
                    </InputController>
                </>
            )}
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
