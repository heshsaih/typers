import { type FC } from "react";
import { Container } from "../../components/container";
import {
    InputController,
    useInputStore,
} from "../../components/input-controller";
import { useGameConfig } from "../../hooks/use-game";
import { useLineBuilder } from "../../hooks/use-line-builder";
import { LineView } from "../../components/line-view";
import { Button } from "../../components/button";

export const TypingPage: FC = () => {
    const { config, words, getNewWords } = useGameConfig();
    const { lines, containerRef } = useLineBuilder(words);
    const { input, setInput } = useInputStore();

    return (
        <Container>
            <h1>config</h1>
            <span>{JSON.stringify(config, null, 2)}</span>
            <InputController>
                <LineView
                    containerRef={containerRef}
                    lines={lines}
                    input={input}
                ></LineView>
            </InputController>
            <Button onClick={() => {
                getNewWords();
                setInput("");
            }}>reset</Button>
        </Container>
    );
};
