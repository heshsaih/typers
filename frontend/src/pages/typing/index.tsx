import { type FC } from "react";
import { Container } from "../../components/container";
import { InputController } from "../../components/input-controller";
import { useGameConfig } from "../../hooks/use-game";
import { useLineBuilder } from "../../hooks/use-line-builder";

export const TypingPage: FC = () => {
    const { config, words } = useGameConfig();
    const { lines, containerRef } = useLineBuilder(words);

    return (
        <Container>
            <h1>config</h1>
            <span>{JSON.stringify(config, null, 2)}</span>
            <span>{JSON.stringify(words, null, 2)}</span>
            <InputController>
                <div ref={containerRef} className="text-3xl">
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
