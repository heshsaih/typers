import type { FC } from "react";
import { Container } from "../../components/container";
import { TextField } from "../../components/textfield";
import { useWords } from "../../hooks/use-words";
import { useTypingLogic } from "../../hooks/use-typing-logic";

export const TypingPage: FC = () => {
    const { wordsArray, setWordsArray } = useWords();
    const { wordIdx, letterIdx } = useTypingLogic(wordsArray, setWordsArray);

    return (
        <Container className="">
            <TextField wordIdx={wordIdx} letterIdx={letterIdx} words={wordsArray}></TextField>
        </Container>
    );
};
