import { type FC } from "react";
import { Container } from "../../components/container";
import { InputController } from "../../components/input-controller";
import { useGameConfig } from "../../hooks/use-game";
import { useLineBuilder } from "../../hooks/use-line-builder";
import { LineView } from "../../components/line-view";
import { Button } from "../../components/button";
import { ConfigDisplay } from "../../components/config-display";
import { Heading } from "../../components/heading";
import { useInputController } from "../../hooks/use-input-controller";

export const TypingPage: FC = () => {
    const { config, words, getNewWords } = useGameConfig();
    const { lines, containerRef } = useLineBuilder(words);
    const { input, setInput, inputRef } = useInputController();

    return (
        <Container>
            <Heading type="h1">
                {config.amount} {config.type === "words" ? "words" : "seconds"}
            </Heading>
            <ConfigDisplay></ConfigDisplay>
            <InputController>
                <LineView
                    containerRef={containerRef}
                    lines={lines}
                    input={input}
                ></LineView>
            </InputController>
            <Button
                onClick={() => {
                    getNewWords();
                    setInput("");
                    inputRef?.current?.focus();
                }}
            >
                reset
            </Button>
        </Container>
    );
};
