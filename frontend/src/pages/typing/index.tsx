import { useEffect, useState, type FC } from "react";
import { Container } from "../../components/container";
import { useWords } from "../../hooks/use-words";
import { Spinner } from "../../components/spinner";
import { TextContainer } from "./text-container";
import { ConfigurationBar, type ConfigParams } from "./configuration-bar";
import { TimeCounter } from "./time-counter";
import { WordCounter } from "./word-counter";
import { Button } from "../../components/button";
import { useTypingLogic } from "../../hooks/use-typing-logic";

export const TypingPage: FC = () => {
    const { getWords, words } = useWords();
    const [config, setConfig] = useState<ConfigParams>({
        gameType: "time",
        amount: 30,
    });

    const { mappedWords, handleKeyboardClick, cursorPos } = useTypingLogic(words);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const startLoop = () => {
        setIsPlaying(true);
    };

    const finish = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        getWords({
            amount:
                config.gameType === "words"
                    ? config.amount
                    : 400 * (config.amount / 60),
        });
    }, [config]);

    return (
        <Container className="">
            {words ? (
                <>
                    {config.gameType === "words" ? (
                        <WordCounter
                            finishLoop={finish}
                            isPlaying={isPlaying}
                            initialAmount={config.amount}
                            currentWord={cursorPos.w}
                        ></WordCounter>
                    ) : (
                        <TimeCounter
                            finishLoop={finish}
                            initialTime={config.amount}
                            isPlaying={isPlaying}
                        ></TimeCounter>
                    )}
                    <ConfigurationBar
                        isPlaying={isPlaying}
                        config={config}
                        setConfig={setConfig}
                    ></ConfigurationBar>
                    <TextContainer
                        startLoop={startLoop}
                        mappedWords={mappedWords}
                        cursorPos={cursorPos}
                        handleKeyboardClick={handleKeyboardClick}
                    ></TextContainer>
                    <Button
                        onClick={() => {
                            getWords({
                                amount:
                                    config.gameType === "words"
                                        ? config.amount
                                        : 400 * (config.amount / 60),
                            });
                            setIsPlaying(false);
                        }}
                    >
                        Restart
                    </Button>
                </>
            ) : (
                <Spinner></Spinner>
            )}
        </Container>
    );
};
