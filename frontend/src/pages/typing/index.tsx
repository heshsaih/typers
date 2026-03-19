import { useEffect, useState, type FC } from "react";
import { Container } from "../../components/container";
import { useWords } from "../../hooks/use-words";
import { Spinner } from "../../components/spinner";
import { TextContainer } from "./text-container";
import { ConfigurationBar, type ConfigParams } from "./configuration-bar";
import { Button } from "../../components/button";
import { useTypingLogic } from "../../hooks/use-typing-logic";
import { ProgressCounter } from "./progress-counter";

export const TypingPage: FC = () => {
    const { getWords, words } = useWords();
    const [config, setConfig] = useState<ConfigParams>({
        gameType: "time",
        amount: 30,
    });
    const [startTime, setStartTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const { mappedWords, handleKeyboardClick, cursorPos } = useTypingLogic(words);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);

    const startLoop = () => {
        setIsPlaying(true);
        setStartTime(new Date().getTime() + config.amount * 1000);
        setCurrentTime(new Date().getTime());
        setFinished(false);
    };

    const finish = () => {
        setIsPlaying(false);
        setFinished(true);
    };

    useEffect(() => {
        if (!isPlaying) return;
        if (config.gameType === "time") {
            const interval = setInterval(() => {
                if (isPlaying) {
                    const newCurrentTime = new Date().getTime();

                    if (startTime - newCurrentTime <= 0) {
                        finish();
                    }
                    setCurrentTime(new Date().getTime());
                }
            }, 100);

            return () => clearInterval(interval);
        }
        if (
            config.amount - cursorPos.w === 1 &&
            cursorPos.l === mappedWords[cursorPos.w].letters.length
        ) {
            finish();
        }
    }, [isPlaying, config, cursorPos]);

    const progress = () => {
        if (!isPlaying && !finished) {
            return `${config.amount} ${config.gameType === "words" ? "words" : "seconds"}`;
        } else {
            return config.gameType === "words"
                ? config.amount - cursorPos.w - 1
                : Math.ceil((startTime - currentTime) / 1000);
        }
    };

    const callGetWords = () =>
        getWords({
            amount:
                config.gameType === "words"
                    ? config.amount
                    : 400 * (config.amount / 60),
        });

    const handleRestart = () => {
        setIsPlaying(false);
        setFinished(false);
        callGetWords();
    };

    useEffect(() => {
        callGetWords();
    }, [config]);

    return (
        <Container className="">
            {words ? (
                <>
                    <ProgressCounter>{progress()}</ProgressCounter>
                    <ConfigurationBar
                        isPlaying={isPlaying || finished}
                        config={config}
                        setConfig={setConfig}
                    ></ConfigurationBar>
                    {finished ? (
                        <>wp wp</>
                    ) : (
                        <TextContainer
                            isWordsMode={config.gameType === "words"}
                            startLoop={startLoop}
                            mappedWords={mappedWords}
                            cursorPos={cursorPos}
                            handleKeyboardClick={handleKeyboardClick}
                            isPlaying={isPlaying}
                        ></TextContainer>
                    )}
                    <Button onClick={handleRestart}>Restart</Button>
                </>
            ) : (
                <Spinner></Spinner>
            )}
        </Container>
    );
};
