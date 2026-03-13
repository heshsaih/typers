import { useEffect, useState, type FC } from "react";
import { Container } from "../../components/container";
import { type GetWordsParams, useWords } from "../../hooks/use-words";
import { Spinner } from "../../components/spinner";
import { TextContainer } from "./text-container";
import { ConfigurationBar, type ConfigParams } from "./configuration-bar";
import { TimeCounter } from "./time-counter";
import { WordCounter } from "./word-counter";
import { Button } from "../../components/button";

export const TypingPage: FC = () => {
    const { getWords, words } = useWords();
    const [config, setConfig] = useState<ConfigParams>({
        gameType: "time",
        amount: 30,
    });
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [params, setParams] = useState<GetWordsParams>({
        amount: 30,
    });

    useEffect(() => {
        getWords(params);
    }, []);

    return (
        <Container className="">
            {words ? (
                <>
                    {config.gameType === "words" ? (
                        <WordCounter
                            initialAmount={config.amount}
                            currentWord={0}
                        ></WordCounter>
                    ) : (
                        <TimeCounter
                            initialTime={config.amount}
                            isPlaying={isPlaying}
                        ></TimeCounter>
                    )}
                    <ConfigurationBar
                        isPlaying={isPlaying}
                        config={config}
                        setConfig={setConfig}
                    ></ConfigurationBar>
                    <TextContainer words={words}></TextContainer>
                    <Button onClick={() => getWords(params)}>Restart</Button>
                </>
            ) : (
                <Spinner></Spinner>
            )}
        </Container>
    );
};
