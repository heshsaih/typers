import type { FC } from "react";
import { Container } from "../../components/container";
import { TextField } from "../../components/textfield";
import { useTypingLogic } from "../../hooks/use-typing-logic";

export const TypingPage: FC = () => {
    const { mappedWords, wordIdx, letterIdx } = useTypingLogic();

    return (
        <Container className="mt-24">
            <TextField wordIdx={wordIdx} letterIdx={letterIdx} words={mappedWords}></TextField>
        </Container>
    );
};
