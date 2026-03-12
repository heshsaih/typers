import { useEffect, useState, type FC } from "react";
import { Container } from "../../components/container";
import { type GetWordsParams, useWords } from "../../hooks/use-words";
import { Spinner } from "../../components/spinner";
import { TextContainer } from "./text-container";

export const TypingPage: FC = () => {
    const { getWords, words } = useWords();

    const [params, setParams] = useState<GetWordsParams>({
        amount: 30,
    });

    useEffect(() => {
        getWords(params);
    }, []);

    console.log(words);

    return (
        <Container className="">
            {words ? (
                <TextContainer words={words}></TextContainer>
            ) : (
                <Spinner></Spinner>
            )}
        </Container>
    );
};
